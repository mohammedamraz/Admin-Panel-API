import { HttpService } from '@nestjs/axios';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, concatMap, from, lastValueFrom, map, switchMap, throwError } from 'rxjs';
import { AWS_COGNITO_USER_CREATION_URL_SIT, AWS_COGNITO_USER_CREATION_URL_SIT_ADMIN_PANEL, FEDO_USER_ADMIN_PANEL_POOL_NAME, PRIVATE_KEY, PUBLIC_KEY } from 'src/constants';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { v4 as uuidv4 } from 'uuid';
import { PasswordResetDTO } from '../admin/dto/create-admin.dto';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO } from '../admin/dto/login.dto';
import { OrgProductJunctionService } from '../org-product-junction/org-product-junction.service';
import { ProductService } from '../product/product.service';
import { SendEmailService } from '../send-email/send-email.service';
import { CreateUserProductJunctionDto } from '../user-product-junction/dto/create-user-product-junction.dto';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { CONVERTINACTIVE, CONVERTINNUMBER, CONVERTPILOTSTATUS, CreateOrganizationDto, LoginUserDTO, LoginUserPasswordCheckDTO, ProductDto, QueryParamsDto, RegisterUserDTO, UpdateUserDTO, UserDTO, UserProfileDTO, format_user, format_user_update } from './dto/create-video-to-vital.dto';
import { StatusDTO, VitalsDTO } from './dto/vitals-dto';
import { OrganizationService } from './organization.service';
import { UsersService } from './users.service';

const APP = 'VideoToVitalsService'

@Injectable()
export class VideoToVitalsService {
  bucket: any;
  res = [];
  constructor(
    @DatabaseTable('organization')
    private readonly organizationDb: DatabaseService<CreateOrganizationDto>,
    @DatabaseTable('organization_product_junction')
    private readonly organizationProductJunctionDb: DatabaseService<CreateOrganizationDto>,
    @DatabaseTable('user_product_junction')
    private readonly userProductJunctionDb: DatabaseService<CreateUserProductJunctionDto>,
    @DatabaseTable('users')
    private readonly userDb: DatabaseService<UserDTO>,
    @DatabaseTable('user_profile_info')
    private readonly userProfileDb: DatabaseService<UserProfileDTO>,
    // @DatabaseTable('product')
    private readonly userProductJunctionService: UserProductJunctionService,
    private readonly sendEmailService: SendEmailService,
    private readonly organizationService: OrganizationService,
    private readonly usersService: UsersService,
    private http: HttpService,
    private readonly productService: ProductService,
    private readonly orgProductJunctionService: OrgProductJunctionService,
    @DatabaseTable('product_tests')
    private readonly productTestsService: DatabaseService<VitalsDTO>,
    @DatabaseTable('test_status')
    private readonly testStatusService: DatabaseService<StatusDTO>

  ) { }

  fetchAllVitalsPilot(id: number, queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchAllVitalsPilot() product_id:${id} queryParamsDto:${JSON.stringify(queryParamsDto)}`, APP);

    if (queryParamsDto.type == "latest") {
      return this.organizationProductJunctionDb.fetchLatestFiveByProductId(id).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(doc => this.fetchotherDetails(doc, queryParamsDto)),
        switchMap(doc => this.organizationService.updateStatus(doc))
      );
    }
    else if (queryParamsDto.type == "active" || queryParamsDto.type == "expired") {
      return this.organizationProductJunctionDb.find({ product_id: id, status: CONVERTPILOTSTATUS[queryParamsDto.type] }).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(doc => {
          if (doc.length == 0) {
            throw new NotFoundException('No Data available')
          }
          else {

            return this.fetchotherDetails(doc, queryParamsDto)
          }
        }),
        switchMap(doc => this.organizationService.updateStatus(doc))
      );
    }
    else {
      return this.organizationProductJunctionDb.find({ product_id: id }).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(doc => {
          if (doc.length == 0) {
            throw new NotFoundException('No Data available')
          }
          else {
            return this.fetchotherDetails(doc, queryParamsDto)
          }
        }),
        switchMap(doc => this.organizationService.updateStatus(doc))
      );
    }
  }

  fetchotherDetails(createOrganizationDto: CreateOrganizationDto[], queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchotherDetails() createOrganizationDto: ${JSON.stringify(createOrganizationDto)} queryParamsDto:${JSON.stringify(queryParamsDto)}`, APP);

    let userProfileData: CreateOrganizationDto[] = [];
    return lastValueFrom(from(createOrganizationDto).pipe(
      concatMap(orgData => {
        return lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByOrgId(Number(orgData.org_id)))
          .then(doc => {
            orgData['total_users'] = new Set(doc.map((item) => item.user_id)).size;;
            orgData['total_tests'] = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
            userProfileData.push(orgData);
            return orgData
          })
      }),
    )).then(_doc => this.fetchotherMoreDetails(userProfileData, queryParamsDto)).catch(err => { throw new UnprocessableEntityException(err.message) })
  }

  fetchotherMoreDetails(createOrganizationDto: CreateOrganizationDto[], queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchotherMoreDetails() createOrganizationDto: ${JSON.stringify(createOrganizationDto)} queryParamsDto:${JSON.stringify(queryParamsDto)}`, APP);

    let orgData: CreateOrganizationDto[] = [];
    return lastValueFrom(from(createOrganizationDto).pipe(
      concatMap(orgJunData => {
        return lastValueFrom(this.organizationDb.find({ id: orgJunData.org_id }))
          .then(doc => {
            orgJunData['progress'] = this.fetchDate(orgJunData);
            orgJunData['organization_name'] = doc[0].organization_name
            // orgJunData['org_details'] = doc[0];
            orgData.push(orgJunData);
            orgData.sort((a: { id?: number; }, b: { id?: number; }) => b.id - a.id);

            return orgJunData

          })
      }),
    ))
      .then(_doc => this.organizationService.Paginator(orgData, queryParamsDto.page, queryParamsDto.per_page)).catch(err => { throw new UnprocessableEntityException(err.message) })
  }

  fetchDate(createOrganizationDto: CreateOrganizationDto) {

    let countDownDate = new Date(createOrganizationDto.end_date).getTime();
    let startDate = new Date(createOrganizationDto.start_date).getTime();
    // Update the count down every 1 second
    // Get todays date and time
    let now = new Date().getTime();

    // Find the distance between now and the count down date
    let distanceWhole = countDownDate - startDate;
    let distanceLeft = countDownDate - now;

    // Time calculations for minutes and percentage progressed
    let minutesLeft = Math.floor(distanceLeft / (1000 * 60));
    let minutesTotal = Math.floor(distanceWhole / (1000 * 60));
    return Math.floor(((minutesTotal - minutesLeft) / minutesTotal) * 100);
  }

  // fetchFiveLatestVitalsPilot() {
  //   Logger.debug(`fetchFiveLatestVitalsPilot()`, APP);

  //   return this.organizationDb.fetchLatestFiveByProductId(2).pipe(
  //     catchError(err => {
  //       throw new UnprocessableEntityException(err.message)
  //     }),
  //     map(doc => this.fetchotherDetails(doc))
  //   );
  // }

  fetchPilotCount(productDto: ProductDto) {
    Logger.debug(`fetchPilotCount() product:${JSON.stringify(productDto)}`, APP);
    if (productDto.status) {
      return this.organizationProductJunctionDb.find({ product_id: CONVERTINNUMBER[productDto.product], status: CONVERTINACTIVE[productDto.status] }).pipe(
        map(doc => ({ ['total_' + `${productDto.product}` + '_pilot_count']: `${doc.length}` })),
        catchError(err => { throw new UnprocessableEntityException(err.message) })
      )
    }
    else {
      return this.organizationProductJunctionDb.find({ product_id: CONVERTINNUMBER[productDto.product] }).pipe(
        map(doc => ({ ['total_' + `${productDto.product}` + '_pilot_count']: `${doc.length}` }))
      )
    }

  }

  // fetchActiveVitalsPilotCount() {
  //   return this.organizationDb.find({ product_id: 2, status: 'Active', is_deleted: false }).pipe(
  //     map(doc => { return { "Active_Vitals_pilot_count": doc.length } })
  //   )
  // }


  fetchOrgByNameForUserCreation(organization_name: string) {
    Logger.debug(`fetchOrgByNameForUserCreation() orgDTO:${organization_name} `, APP);
    return this.organizationDb.find({ organization_name: organization_name }).pipe(
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException(`organization not found`)
        }
        else { return doc }
      }),
    )
  }

  // fetchotherDetails(createOrganizationDto: CreateOrganizationDto[]) {

  //   let temp: CreateOrganizationDto[] = [];
  //   return lastValueFrom(from(createOrganizationDto).pipe(
  //     concatMap(orgData => {
  //       return lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByOrgId(orgData.id))
  //         .then(doc => {
  //           orgData['total_users'] = doc.length;
  //           orgData['total_tests'] = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
  //           orgData['progress'] = this.fetchDate(orgData);
  //           temp.push(orgData);
  //           return orgData
  //         })
  //     }),
  //   )).then(_doc => temp)
  // }





  // fetchVitalsPilotById(org_id: number) {
  //   Logger.debug(`fetchVitalsPilotById() id:${org_id} `, APP);

  //   return this.organizationProductJunctionDb.find({ org_id: org_id, product_id: 2 }).pipe(
  //     catchError(err => { throw new UnprocessableEntityException(err.message) }),
  //     map(doc => {
  //       if (doc.length == 0) {
  //         throw new NotFoundException('vitals pilot not found')
  //       }
  //       else {
  //         return this.fetchotherDetails(doc)
  //       }
  //     }),
  //     switchMap(doc => this.organizationService.updateStatus(doc))
  //   )
  // }



  changeRegisterStatusOnceConfirmed(id: number, queryParamsDto: QueryParamsDto) {
    Logger.debug(`changeRegisterStatusOnceConfirmed() id:${id} `, APP);

    if (Boolean(queryParamsDto.is_web) == true) {
      return this.organizationDb.find({ id: id }).pipe(
        map(doc => {
          if (doc.length == 0) {
            throw new NotFoundException('organization not found')
          }
          else {
            return this.organizationDb.findByIdandUpdate({ id: id.toString(), quries: { is_read: true } })
          }
        }),

      )
    }
    else {
      return this.organizationDb.find({ id: id, is_deleted: false }).pipe(
        map(doc => {
          if (doc.length == 0) {
            throw new NotFoundException('organization not found')
          }
          else {
            return this.organizationDb.findByIdandUpdate({ id: id.toString(), quries: { is_register: true } })
          }
        }),

      )
    }
  }

  fetchAllVitalsTestCount(id: number) {
    Logger.debug(`fetchAllVitalsTestCount() product_id:${id} `, APP);

    return this.userProductJunctionService.fetchUserProductJunctionDataByProductId(id).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        if (doc.length == 0) throw new NotFoundException(`product not available with product id ${id}`)
        const total_tests = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
        return { "total_tests": total_tests }
      })
    )
  }

  addUser(userDTO: UserDTO) {
    Logger.debug(`addUser() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    return this.usersService.fetchUserByCondition(userDTO).pipe(
      map(user_doc => user_doc),
      switchMap(user_doc => {
        return this.organizationService.fetchOrganizationByIdDetails(userDTO.org_id).pipe(
          map(org_doc => { return org_doc }),
          switchMap(org_doc => {
            userDTO.application_id = userDTO.mobile.slice(3, 14);
            userDTO.organization_name = org_doc[0].organization_name;
            return this.userDb.save(format_user(userDTO)).pipe(
              map(userdoc => {
                return [userdoc, org_doc]
              }),
              switchMap(doc => {
                var encryption = { user_id: doc[0][0]['id'] };
                this.sendEmailService.sendEmailOnCreateOrgUser(

                  {
                    "email": userDTO.email,
                    "organisation_name": doc[1][0]['organization_name'],
                    "fedo_app": "Fedo Vitals",
                    "url": "https://fedo.ai/admin/vital/" + doc[1][0]['url'] + "?" + encodeURIComponent(this.encryptPassword(encryption)),
                    "name": userDTO.user_name.split(' ')[0],
                    "organisation_admin_email": doc[1][0]['organization_email'],
                    "application_id": userDTO.application_id
                  }
                )
                return doc[0]
              }))
          }),
          map(async doc => {
            userDTO.product_id.map(async (res1, index) => {

              await lastValueFrom(this.organizationProductJunctionDb.find({ org_id: userDTO["org_id"], product_id: Number(userDTO.product_id[index]) }).pipe(map(async orgprod => {

                await lastValueFrom(this.userProductJunctionService.createUserProductJunction({
                  user_id: doc["id"], org_id: userDTO["org_id"], product_id: Number(userDTO.product_id[index]), total_tests: 0, role: userDTO?.role[index], attempts: orgprod[0].attempts, is_pilot_duration: orgprod[0].is_pilot_duration, is_dashboard: false
                }))
              })))
            });
            // doc["id"]
            await lastValueFrom(this.userProfileDb.save({ application_id: doc['application_id'], user_id: doc['id'], org_id: doc['org_id'], name: userDTO.user_name, mobile: userDTO.mobile.slice(3, 14), is_editable: true, country_code: '+91' }))
            return doc;
          }))
      }))
  }

  addUserAndDirectRegister(userDTO: UserDTO) {
    Logger.debug(`addUserAndDirectRegister() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    return this.usersService.fetchUserByCondition(userDTO).pipe(
      map(user_doc => user_doc),
      switchMap(user_doc => {
        return this.organizationService.fetchOrganizationByIdDetails(userDTO.org_id).pipe(
          map(org_doc => { return org_doc }),
          switchMap(org_doc => {
            userDTO.application_id = userDTO.mobile.slice(3, 14);
            userDTO.organization_name = org_doc[0].organization_name;
            userDTO.is_register = true;
            return this.userDb.save(format_user(userDTO)).pipe(
              map(userdoc => {
                return [userdoc, org_doc]
              }),
              switchMap(async doc => {
                await lastValueFrom(this.registerUserbyEmail(
                  {
                    "email": userDTO.email,
                    "username": userDTO.email,
                    "password": userDTO.password
                  }
                ))
                return doc[0][0]
              }))
          }),
          map(async doc => {
            userDTO.product_id.map(async (res1, index) => {
              await lastValueFrom(this.organizationProductJunctionDb.find({ org_id: userDTO["org_id"], product_id: Number(userDTO.product_id[index]) }).pipe(map(async orgprod => {

                await lastValueFrom(this.userProductJunctionService.createUserProductJunction({
                  user_id: doc["id"], org_id: userDTO["org_id"], product_id: Number(userDTO.product_id[index]), total_tests: 0, role: userDTO?.role[index], attempts: orgprod[0].attempts, is_pilot_duration: orgprod[0].is_pilot_duration, is_dashboard: false
                }))
              })))
            });
            await lastValueFrom(this.userProfileDb.save({ application_id: doc['application_id'], user_id: doc['id'], org_id: doc['org_id'], name: userDTO.user_name, mobile: userDTO.mobile.slice(3, 14), is_editable: true, country_code: '+91' }))
            return doc;
          }))
      }))
  }




  fetchUsersCountByOrgId(org_id: number) {
    Logger.debug(`fetchUsersCountByOrgId() org_id:${org_id}} `, APP);

    return this.userDb.find({ org_id: org_id }).pipe(
      map(doc => { return { "total user for a particular organization": doc.length } })
    )
  }

  fetchUserById(id: number) {
    Logger.debug(`fetchUserById() id:${id}} `, APP);

    return this.userDb.find({ id: id }).pipe(
      map(doc => doc)
    )
  }

  fetchUserDetailsById(id: number) {
    Logger.debug(`fetchUserDetailsById() id:${id}} `, APP);

    return this.userDb.find({ id: id }).pipe(
      switchMap((userData: UserDTO[]) => {
        let user_data = userData[0]
        console.log("new")
        return this.userProductJunctionService.fetchUserProductJunctionDataByUserId(userData[0].id)
          .pipe(switchMap(async doc => {
            console.log("new")
            for (let index = 0; index <= doc.length - 1; index++) {
              await lastValueFrom(this.productService.fetchProductById(doc[index].product_id).pipe(
                map(productDoc => {
                  doc[index]['product'] = productDoc
                  user_data['tests'] = doc
                  user_data['total_test'] = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
                }
                )))
            }
            console.log("new")
            return [user_data]
          }))
        // .catch(err => { throw new UnprocessableEntityException(err.message) })
      })
    )
  }

  fetchUserProductDetailsById(id: number) {
    Logger.debug(`fetchUserById() id:${id}} `, APP);

    return this.userDb.find({ id: id }).pipe(
      concatMap((userData: any) => {
        return lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByUserId(userData[0].id))
      }),
      switchMap(async doc => {
        for (let index = 0; index <= doc.length - 1; index++) {
          await lastValueFrom(this.productService.fetchProductById(doc[index].product_id)).then(
            (productDoc: any) => {
              Object.keys(productDoc).map((doc1, indexn) => {
                doc[index][doc1] = productDoc[doc1]
              })
            })
        }
        return doc
      }))

  }


  deleteUserByID(id: number) {
    Logger.debug(`deleteUserByID() id:${id}} `, APP);

    return this.userDb.find({ id: id }).pipe(
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('user not found')
        }
        else {
          return this.userDb.findByIdandUpdate({ id: id.toString(), quries: { is_deleted: true } }).pipe(
            map(doc => { return { status: "deleted" } })
          )
        }
      }),
      switchMap(res => res)

    )

  }

  updateUser(id: string, updateUserDTO: UpdateUserDTO) {
    Logger.debug(`updateUser() id:${id} updateUserDTO:${JSON.stringify(updateUserDTO)} `, APP);

    updateUserDTO.role = ''
    return this.userDb.find({ id: id }).pipe(
      map(res => {
        if (res.length == 0) throw new NotFoundException('User not found')
        lastValueFrom(this.userDb.findByIdandUpdate({ id: id.toString(), quries: format_user_update(updateUserDTO, res[0]) }))
        lastValueFrom(this.userProfileDb.findandUpdate({ columnName: 'application_id', columnvalue: res[0].application_id, quries: { name: updateUserDTO.user_name ? updateUserDTO.user_name : res[0].user_name, mobile: updateUserDTO.mobile ? updateUserDTO.mobile.slice(3, 14) : res[0].mobile.slice(3, 14) } }))
        return res
      }),
      switchMap(async res => {
        if (updateUserDTO.product_id != undefined) {
          for (let index = 0; index < updateUserDTO.product_id.length; index++) {
            await lastValueFrom(this.userProductJunctionDb.find({ id: updateUserDTO.product_junction_id[index] }).pipe(
              map(async doc => {
                if (doc.length != 0) await lastValueFrom(this.userProductJunctionDb.findByIdandUpdate({ id: updateUserDTO.product_junction_id[index], quries: { role: updateUserDTO.role[index], attempts: updateUserDTO.attempts[index], is_dashboard: updateUserDTO.is_dashboard[index] } }))
                else {
                  await lastValueFrom(this.organizationProductJunctionDb.find({ org_id: res[0].org_id, product_id: Number(updateUserDTO.product_id[index]) }).pipe(map(async orgprod => {
                    await lastValueFrom(this.userProductJunctionDb.save({ user_id: id, product_id: updateUserDTO.product_id[index], org_id: res[0].org_id, total_tests: 0, attempts: orgprod[0].attempts, is_pilot_duration: orgprod[0].is_pilot_duration, is_dashboard: false }))
                  })))
                }
              })
            )
            )
          }
        }
        else return []
      })
    )
  }

  updateUserByApplicationId(user_id: string, product_id: number) {
    Logger.debug(`updateUserByApplicationId() id:${user_id} product_id:${product_id} updateUserDTO:)} `, APP);

    return this.userDb.find({ id: user_id }).pipe(
      switchMap(res => {
        if (res.length == 0) throw new NotFoundException('user not found')
        else {
          return this.userProductJunctionDb.find({ user_id: user_id }).pipe(map(doc => {
            for (let i = 0; i <= doc.length; i++) {
              if (doc[i].product_id == product_id) {
                return this.userProductJunctionDb.findandUpdate({ columnName: 'id', columnvalue: doc[i].id.toString(), quries: { total_tests: doc[i].total_tests + 1 } })
              }
            }
          }))
        }
      }))

  }

  checkEmailIsPresentInUsersOrOrganisation(loginUserPasswordCheckDTO: LoginUserDTO) {
    Logger.debug(`checkEmailIsPresentInUsersOrOrganisation() loginUserDTO:${JSON.stringify(LoginUserDTO)} `, APP);

    return this.organizationDb.find({ organization_email: loginUserPasswordCheckDTO.username }).pipe(
      switchMap(doc => {
        if (doc.length == 0) {
          return this.userDb.find({ email: loginUserPasswordCheckDTO.username }).pipe(
            map(doc => {
              if (doc.length == 0) throw new NotFoundException('user with this email is not found')
              else return doc

            })
          )
        }
        else return this.usersService.fetchAllUsersByApplicationId(doc[0].application_id, doc)
      }),
    )
  }




  user_data: any;
  org_data: any

  loginUserByEmail(loginUserDTO: LoginUserDTO) {
    Logger.debug(`loginUserByEmail() loginUserDTO:${JSON.stringify(loginUserDTO)} `, APP);


    loginUserDTO.fedoApp = FEDO_USER_ADMIN_PANEL_POOL_NAME;
    return this.checkEmailIsPresentInUsersOrOrganisation(loginUserDTO).pipe((map(doc => { this.user_data = doc })),
      switchMap(doc => {
        return this.http
          .post(
            `${AWS_COGNITO_USER_CREATION_URL_SIT}/token`,
            { passcode: this.encryptPassword(loginUserDTO) },
          )
          .pipe(
            catchError((err) => {
              return this.onAWSErrorResponse(err);
            }),
            map((res: AxiosResponse) => {
              if (!res.data) throw new UnauthorizedException();

              else if (this.user_data[0].user_name) {
                return {
                  jwtToken: res.data.idToken.jwtToken,
                  refreshToken: res.data.refreshToken,
                  accessToken: res.data.accessToken.jwtToken,
                  user_data: this.user_data
                };
              }
              else {
                return {
                  jwtToken: res.data.idToken.jwtToken,
                  refreshToken: res.data.refreshToken,
                  accessToken: res.data.accessToken.jwtToken,
                  org_data: this.user_data
                };
              }
            }),
          );
      })
    )

  }


  private readonly onAWSErrorResponse = async (err) => {
    Logger.debug('onAWSErrorResponse(), ' + err, APP);

    if (err.response.status === 400)
      throw new BadRequestException(err.response.data);
    if (err.response.status === 401)
      throw new UnauthorizedException(err.response.data);
    if (err.response.status === 422)
      throw new UnprocessableEntityException(err.response.data);
    if (err.response.status === 404)
      throw new NotFoundException(err.response.data);
    if (err.response.status === 409)
      throw new ConflictException(err.response.data);

    return throwError(() => err);
  };

  private readonly onHTTPErrorResponse = async (err) => {
    Logger.debug('onHTTPErrorResponse(), ' + err, APP);

    if (err.response.status === 400)
      throw new BadRequestException(err.response.data);
    if (err.response.status === 401)
      throw new UnauthorizedException(err.response.data.message);
    if (err.response.status === 422)
      throw new UnprocessableEntityException(err.response.data.message);
    if (err.response.status === 404)
      throw new NotFoundException(err.response.data.message);
    if (err.response.status === 409)
      throw new ConflictException(err.response.data.message);

    return throwError(() => err);
  };

  getOrganisationDetailsByEmail(loginUserPasswordCheckDTO: LoginUserDTO) {
    Logger.debug(`getOrganisationDetailsByEmail() loginUserDTO:${JSON.stringify(LoginUserDTO)} `, APP);

    return this.organizationDb.find({ organization_email: loginUserPasswordCheckDTO.username }).pipe(
      map(doc => {
        if (doc.length == 0) throw new NotFoundException('organization with this email is not found')
        else return doc

      })
    )
  }


  getOrganisationDetailsOfUserByEmail(loginUserPasswordCheckDTO: LoginUserPasswordCheckDTO) {
    Logger.debug(`getOrganisationDetailsOfUserByEmail() loginUserDTO:${JSON.stringify(LoginUserDTO)} `, APP);

    return this.userDb.find({ email: loginUserPasswordCheckDTO.email }).pipe(
      map(doc => {
        if (doc.length == 0) throw new NotFoundException('user not found')
        else return doc
      }),
      switchMap(doc => {
        if (doc[0].org_id != null) {
          return this.organizationService.fetchOrganizationById(doc[0].org_id)
        }
        else return doc
      })
    )
  }

  forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
    Logger.debug(
      `admin-console forgotPassword() forgotPasswordDTO:[${JSON.stringify(
        forgotPasswordDTO,
      )}]`,
    );

    forgotPasswordDTO.fedoApp = FEDO_USER_ADMIN_PANEL_POOL_NAME;
    const passcode = this.encryptPassword(forgotPasswordDTO);
    return this.http
      .post(`${AWS_COGNITO_USER_CREATION_URL_SIT}/password/otp/`, { passcode: passcode })
      .pipe(
        catchError((err) => {
          return this.onAWSErrorResponse(err);
        }),
        map((res: AxiosResponse) => res.data),
      );
  }

  confirmForgotPassword(confirmForgotPasswordDTO: ConfirmForgotPasswordDTO) {
    Logger.debug(
      `admin-console confirmForgotPassword() confirmForgotPasswordDTO:[${JSON.stringify(
        confirmForgotPasswordDTO,
      )}]`,
    );

    confirmForgotPasswordDTO.fedoApp = FEDO_USER_ADMIN_PANEL_POOL_NAME;
    const passcode = this.encryptPassword(confirmForgotPasswordDTO);
    return this.http
      .patch(
        `${AWS_COGNITO_USER_CREATION_URL_SIT}/password/otp/${confirmForgotPasswordDTO.ConfirmationCode}`,
        { passcode: passcode },
      )
      .pipe(
        catchError((err) => {
          return this.onHTTPErrorResponse(err);
        }),
        map((_res) => []),
      );
  }



  checkUserPasswordExistByEmail(loginUserPasswordCheckDTO: LoginUserPasswordCheckDTO) {
    Logger.debug(`checkUserPasswordExistByEmail() loginUserPasswordCheckDTO:${JSON.stringify(loginUserPasswordCheckDTO)} `, APP);

    return this.userDb.find({ email: loginUserPasswordCheckDTO.email }).pipe(
      map(doc => {
        if (doc.length == 0) throw new NotFoundException('user not found')
        else return doc
      })
    )
  }



  sendEmailToChangeUserPasswordExistByEmail(passwordResetDTO: PasswordResetDTO) {
    Logger.debug(`sendEmailToChangeUserPasswordExistByEmail() passwordResetDTO:${JSON.stringify(passwordResetDTO)} `, APP);

    return this.userDb.find({ email: passwordResetDTO.email }).pipe(
      map(doc => {
        if (doc.length == 0) throw new NotFoundException('user not found')
        else return doc
      }),
      switchMap(doc => {
        return this.sendEmailService.sendEmailToResetUsersPassword({ user_name: doc[0].user_name, email: passwordResetDTO.email, url: "https://sample_web_site?query=" + passwordResetDTO.email })
      })
    )
  }


  registerUserbyEmail(RegisterUserdto: RegisterUserDTO) {
    Logger.debug(`registerUserbyEmail(), RegisterUserdto:[${JSON.stringify(RegisterUserdto,)}] `);

    RegisterUserdto.fedoApp = FEDO_USER_ADMIN_PANEL_POOL_NAME
    return this.http.post(`${AWS_COGNITO_USER_CREATION_URL_SIT_ADMIN_PANEL}/`, { passcode: this.encryptPassword(RegisterUserdto) }).pipe(
      map(doc => {
        console.log('doc', doc)
      }),
      catchError(err => { console.log('err', err); return this.onAWSErrorResponse(err) }))

  }


  registerWebSiteUserbyEmail(RegisterUserdto: RegisterUserDTO) {
    Logger.debug(`registerUserbyEmail(), RegisterUserdto:[${JSON.stringify(RegisterUserdto,)}] `);

    RegisterUserdto.fedoApp = FEDO_USER_ADMIN_PANEL_POOL_NAME
    return this.http.post(`${AWS_COGNITO_USER_CREATION_URL_SIT}/`, { passcode: this.encryptPassword(JSON.stringify(RegisterUserdto)) }).pipe(
      map(doc => {
        console.log('doc', doc)
      }),
      catchError(err => { console.log('err', err); return this.onAWSErrorResponse(err) }))

  }

  confirmSignupUserByEmail(RegisterUserdto: RegisterUserDTO) {
    Logger.debug(`confirmSignupUserByEmail(), RegisterUserdto: keys ${[JSON.stringify(Object.keys(RegisterUserdto))]} values ${JSON.stringify(Object.values(RegisterUserdto).length)} `, APP);

    RegisterUserdto.fedoApp = FEDO_USER_ADMIN_PANEL_POOL_NAME
    return this.http.post(`${AWS_COGNITO_USER_CREATION_URL_SIT}/signupcode`, { passcode: this.encryptPassword(JSON.stringify(RegisterUserdto)) }).pipe(map(res => []), catchError(err => {
      console.log("err", err);
      return this.onAWSErrorResponse(err)
    }))
  }





  // confirmEmail(confirmEmailDTO: EmailConfirmationDTO) {
  //   Logger.debug(`confirmEmail() confirmEmailDTO:[${JSON.stringify(confirmEmailDTO,)}]`);

  //   confirmEmailDTO.fedoApp = FEDO_APP;
  //   return this.http.post(`${AWS_COGNITO_USER_CREATION_URL_SIT}/email/otp/`, {passcode:this.encryptPassword(confirmEmailDTO)},).pipe(catchError(err =>{
  //    return this.onAWSErrorResponse(err)}), map(_res => []));
  // }

  // confirmEmailOtp(confirmEmailOtpDTO: EmailConfirmationDTO, otp: string) {
  //   Logger.debug(`confirmEmailOtp() confirmEmailOtpDTO:[${JSON.stringify(confirmEmailOtpDTO,)}]`);

  //   confirmEmailOtpDTO.fedoApp = FEDO_APP;
  //   return this.http.patch(`${AWS_COGNITO_USER_CREATION_URL_SIT}/email/otp/${otp}`, {passcode:this.encryptPassword(confirmEmailOtpDTO)},).pipe(catchError(err => this.onAWSErrorResponse(err)), map(_res => []));
  // }

  encryptPassword(password) {
    const NodeRSA = require('node-rsa');

    let key_public = new NodeRSA(PUBLIC_KEY)
    var encryptedString = key_public.encrypt(password, 'base64')
    return encryptedString

  }



  // CHANGE: The path to your service account






  async uploadFile(filename) {



    const metadata = {
      metadata: {
        // This line is very important. It's to create a download token.
        firebaseStorageDownloadTokens: uuidv4()
      },
      contentType: 'image/png',
      cacheControl: 'public, max-age=31536000',
    };



    // Uploads a local file to the bucket
    await this.bucket.upload(filename, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      metadata: metadata,
    });

    console.log(`${filename} uploaded.`);

  }



  findStatusDetails(org_id: StatusDTO) {
    Logger.debug(`findStatusDetails() org_id:${org_id}}`, APP);
    return this.testStatusService.find({ org_id: org_id })
      .pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(doc => {
          if (doc.length == 0) { throw new NotFoundException(); }
          return doc;
        }))
  }

  saveToStatusDb(statusDto: StatusDTO) {
    Logger.debug(`fetchCustomerIdAndScanId() cust_id:${statusDto.customer_id},scan_id:${statusDto.scan_id} }`, APP);
    const date = new Date();

    const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    statusDto['test_time'] = date.toLocaleString('en-IN').replace("/", "-").replace("/", "-");
    statusDto['test_date'] = date.toLocaleString('en-IN').replace("/", "-").replace("/", "-");
    statusDto['test_date'] = (date.toLocaleString('en-IN').replace("/", "-").replace("/", "-"))
    let newDate = statusDto.test_date.split(",")[0];
    statusDto['test_date'] = newDate;

    console.log("date...." + statusDto.test_date, newDate);

    return this.testStatusService.find({ customer_id: statusDto.customer_id, scan_id: statusDto.scan_id }).pipe(
      map(doc => {
        if (doc.length != 0) {
          this.testStatusService.findByIdandUpdate({ id: doc[doc.length - 1].id.toString(), quries: statusDto }).pipe(
            catchError(err => { throw new NotFoundException() })
          )
        }
        return doc;
      }),
      switchMap((doc: any) => {
        return this.testStatusService.save(statusDto).pipe(
          map(doc => {
            return doc[0]
          })
        )
      })
      // switchMap((doc: any) => {
      //   return this.testStatusService.find({ id: doc[doc.length - 1].id }).pipe(map(doc => { return doc[0] }))
      // })
    )
  }
  //patch
  //    return this.testStatusService.findByCustomerIdAndScanId({ columnName: 'customer_id', columnvalue: , quries: UpdateCustomerInsightsDTO }).pipe(
  //     map(doc => {
  //       // doc will be the row, a unique id will bw there
  //       console.log(doc)
  //       return doc
  //     }),
  //     catchError(err => { throw new NotFoundException() })
  //   )
  // }
  // else {
  //   //save
  //   return this.testStatusService.save(statusDto).pipe(
  //     map(doc =>{
  //       return doc[0]
  //     })
  //   )
  // }

  // statusDTO['test_time'] = date.toLocaleString('en-IN', options);
  // return this.productTestsService.save(statusDTO).pipe(
  //   catchError(err => { throw new UnprocessableEntityException(err.message) }),
  //   map(doc => { if (doc.length == 0) throw new NotFoundException('user not found')
  //     else { return this.testStatusService.find({ policy_number: customer_id,vitals_id:scan_id}).pipe(
  //       map(doc => {
  //         console.log(doc)
  //         return doc[0]
  //       }))}

  //   }),
  // );;



  calculatePilotDuration(doc) {
    let now = new Date().getTime();
    var date1 = new Date();
    var date2 = new Date(doc[0].end_date);
    var difference_In_Time = date2.getTime() - date1.getTime();
    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
    console.log(difference_In_Days);
    return difference_In_Days
  }

  fetchCustomerIdAndScanId(customer_id: StatusDTO, scan_id: StatusDTO, apiKey) {
    Logger.debug(`fetchCustomerIdAndScanId() cust_id:${customer_id},scan_id:${scan_id} }`, APP);
    var decryptedId: any = this.decryptXAPIKey(apiKey)


    return this.orgProductJunctionService.fetchOrgProductJunctionDataByOrgId(decryptedId.orgId)
      .pipe(catchError(err => { throw new NotFoundException() }),
        map(doc => {
          let difference_In_Days = this.calculatePilotDuration(doc);
          if (difference_In_Days < 0) {
            throw new UnprocessableEntityException({ 'error': 'Contact Fedo' })
          }
          return doc;
        }),
        switchMap(doc => {
          return this.testStatusService.find({ customer_id: customer_id, scan_id: scan_id }).pipe(
            map((doc) => {
              if (doc.length == 0) { throw new NotFoundException(); }
              else {
                let data: any = {};
                delete data.tenant_id;
                data.customer_id = doc[0].customer_id;
                data.scan_id = doc[0].scan_id;
                data.message = doc[0].message;
                data.status = doc[0].status;
                data.client_id = doc[0].client_id;

                this.res.push(data);
                Logger.debug(`data : ${data}, doc:${doc[0]} }`, APP);
                return data;
              }
            }))
        })
      )
  }

  deleteKeys(doc) {
    delete doc[0].app_name
    delete doc[0].city
    delete doc[0].ecg_url
    delete doc[0].event_mode
    delete doc[0].facial_precision
    delete doc[0].fedo_score_id
    delete doc[0].for_whom
    delete doc[0].media_name
    delete doc[0].mobile
    delete doc[0].name
    delete doc[0].org_id
    delete doc[0].pdf_location
    delete doc[0].product_id
    delete doc[0].test_time
    delete doc[0].version_id
    delete doc[0].username
    delete doc[0].video_location
    delete doc[0].viu_user
    delete doc[0].tests
    delete doc[0].id;
    doc[0]['scan_id'] = doc[0]['vitals_id'];
    delete doc[0]['vitals_id'];
    doc[0]['customer_id'] = doc[0]['policy_number'];
    delete doc[0]['policy_number'];
    return doc
  }

  fetchRowDetails(customer_id: VitalsDTO, scan_id: VitalsDTO, apiKey) {
    Logger.debug(`fetchRowDetails() cust_id:${customer_id},scan_id:${scan_id} }`, APP);

    var decryptedString: any = this.decryptXAPIKey(apiKey);

    return this.orgProductJunctionService.fetchOrgProductJunctionDataByOrgId(decryptedString.orgId)
      .pipe(
        catchError(err => {
          throw new NotFoundException();
        }),
        map(doc => {
          let difference_In_Days = this.calculatePilotDuration(doc);

          if (difference_In_Days < 0) {
            throw new UnprocessableEntityException({ 'error': 'Contact Fedo' });
          }

          return doc;
        }),
        map(doc => {
          return this.productTestsService.find({ policy_number: customer_id, vitals_id: scan_id }).pipe(
            switchMap(doc => {
              if (doc.length == 0) {
                throw new NotFoundException();
              }

              if (doc[0].status_code == 404) {
                let result: any = {};
                result.status_code = doc[0].status_code;
                result.client_id = doc[0].client_id;
                result.scan_id = doc[0].vitals_id;
                result.customer_id = doc[0].policy_number;

                this.res.push(result);
                return result;
              }

              let result = this.deleteKeys(doc);
              return result[0];
            })
          );
        }
        ),
        switchMap(doc => {
          return this.productTestsService.find({ policy_number: customer_id, vitals_id: scan_id }).pipe(
            map(docs => {
              if (docs.length != 0) {
                let is_payment_successfull = true
                this.productTestsService.findByIdandUpdate({ id: docs[0].id.toString(), quries: { is_payment_successfull: true } }).pipe(
                  catchError(err => { throw new NotFoundException() }),
                  map((doc) => { return docs[0] })
                )
              }
              
                let data: any = {};
                delete data.id;
                delete data.org_id;
                delete data.user_id;
                delete data.event_mode;
                delete data.tests;
                delete data.test_date;
                delete data.name;
                delete data.city;
                delete data.username;
                delete data.for_whom;
                delete data.bp_status;
                delete data.ecg_url;
                delete data.app_name;
                delete data.media_name;
                delete data.viu_user;
                delete data.pdf_location;
                delete data.fedo_score_id;
                delete data.facial_precision;
                delete data.mobile;
                delete data.test_time;
                delete data.version_id;
                delete data.video_location;
                delete data.tenant_id;
                delete data.is_payment_successfull;
                
                data.product_id = docs[0].product_id;
                data.age = docs[0].age;
                data.gender = docs[0].gender;
                data.heart_rate = docs[0].heart_rate;
                data.systolic = docs[0].systolic;
                data.diastolic = docs[0].diastolic;
                data.stress= docs[0].stress;
                data.haemoglobin = docs[0].haemoglobin;
                data.respiration = docs[0].respiration;
                data.spo2 = docs[0].spo2;
                data.hrv = docs[0].hrv;
                data.bmi = docs[0].bmi;
                data.smoker_accuracy = docs[0].smoker_accuracy;
                data.vitals_id = docs[0].vitals_id;
                data.policy_number = docs[0].policy_number;
                data.rbs = docs[0].rbs; 
                data.status_code = docs[0].status_code;  
                data.client_id=docs[0].client_id;
              
                this.res.push(data);
                Logger.debug(`data : ${data}, doc:${docs[0]} }`, APP);
                return data;
              
            })
          );
        }),

      );
  }

  updateVitalsData(id: number, vitalsDTO: VitalsDTO) {
    Logger.debug(`updateVitalsData() id:${id} vitalsDTO: ${JSON.stringify(vitalsDTO)} `, APP);
    return this.testStatusService.find({ id: id }).pipe(
      map(res => {
        if (res.length == 0) throw new NotFoundException()
        else {
          return this.testStatusService.findByIdandUpdate({ id: id.toString(), quries: vitalsDTO }).pipe(
            map(doc => {
              console.log(doc)
            }),
            catchError(err => { throw new NotFoundException() })
          )
        }
      }),
      switchMap(doc => {
        return this.testStatusService.find({ id: id }).pipe(map(doc => { return doc[0] }))
      })
    )
  }

  findAllStatusDetails(statusDto: StatusDTO) {

    Logger.debug(`findAllStatusDetails()`, APP);
    return this.testStatusService.fetchAll().pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('No user Found')
        }
        else {
          doc.map(ele => {
            delete ele.id;
          })
          return doc
        }
      }),
    );;


  }
  findAllStatus(params: StatusDTO) {
    Logger.debug(`findAllStatus() params: ${params}`, APP);
    console.log(params.test_date);
    const test_date = params.test_date;

    console.log("test_date", test_date);
    // params.test_date=test_date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }).replace("/", "-").replace("/", "-");

    // params.test_date=test_date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }).replace("/", "-").replace("/", "-");
    console.log("params.test_date", params.test_date);

    return this.testStatusService.find({ test_date: params.test_date }).pipe(
      catchError(err => {
        throw new UnprocessableEntityException(err.message);
      }),
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException();
        }
        console.log(doc);
        return doc;
      })
    );
  }

  fetchAllRowDetails(org_id: StatusDTO, test_date: StatusDTO) {

    Logger.debug(`fetchRowDetails() org_id:${org_id}, test_date:${test_date}`, APP);
    return this.testStatusService.find({ org_id: org_id, test_date: test_date }).pipe(
      catchError(err => {
        throw new UnprocessableEntityException(err.message);
      }),
      map((doc) => {
        if (doc.length === 0) {
          throw new NotFoundException();
        }
        console.log(doc);
        return doc;
      })
    );
  
  }

  
  async encryptXAPIKey(encryptXAPIKey) {
    const NodeRSA = require('node-rsa');
    // const apiKey = "custid=1&orgid=10";
    console.log(encryptXAPIKey, typeof (encryptXAPIKey));
    let key_public = new NodeRSA(PUBLIC_KEY)
    var encryptedString = await key_public.encrypt(encryptXAPIKey, 'base64')
    console.log('result', encryptedString);
    return JSON.stringify({ 'api-key': encryptedString })
  }

  decryptXAPIKey(apiKey) {
    try {
      const NodeRSA = require('node-rsa');
      let key_public = new NodeRSA(PRIVATE_KEY)
      var decryptedString = key_public.decrypt(apiKey, 'utf8')
      console.log(decryptedString.split('&'));
      console.log(typeof (decryptedString));
      var keyValueArray = decryptedString.split("&");
      var keyValueObject = {};
      for (var i = 0; i < keyValueArray.length; i++) {
        var pair = keyValueArray[i].split("=");
        var key = pair[0];
        var value = pair[1];
        keyValueObject[key] = value;
        console.log(keyValueObject);
      }
      return keyValueObject;
    }
    catch (e) {
      throw new BadRequestException();
    }
  }


}
