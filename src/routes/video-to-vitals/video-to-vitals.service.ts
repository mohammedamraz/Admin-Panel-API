import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { catchError, concatMap, from, lastValueFrom, map, of, switchMap, throwError } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { PasswordResetDTO } from '../admin/dto/create-admin.dto';
import { ProductService } from '../product/product.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { AWS_COGNITO_USER_CREATION_URL_SIT, AWS_COGNITO_USER_CREATION_URL_SIT_ADMIN_PANEL, FEDO_APP, FEDO_USER_ADMIN_PANEL_POOL_NAME, PRIVATE_KEY, PUBLIC_KEY } from 'src/constants';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO } from '../admin/dto/login.dto';
import { CreateOrganizationDto, LoginUserDTO, LoginUserPasswordCheckDTO, OrgDTO, CONVERTINNUMBER, ProductDto, RegisterUserDTO, UpdateOrganizationDto, UpdateUserDTO, UserDTO, UserProfileDTO, VitalUserDTO, CONVERTINACTIVE, QueryParamsDto, UserParamDto, CONVERTPILOTSTATUS, format_user, format_user_update } from './dto/create-video-to-vital.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserProductJunctionDto } from '../user-product-junction/dto/create-user-product-junction.dto';
import { OrganizationService } from './organization.service';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { SendEmailService } from '../send-email/send-email.service';
import { UsersService } from './users.service';
import { OrganisationDTO, StatusDTO, VitalsDTO } from './dto/vitals-dto';
import { ConfigService } from 'src/lib/config/config.service';
import { decryptXAPIKey, encryptXAPIKey } from 'src/constants/helper';

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
    @DatabaseTable('vitals_table')
    private readonly statusDb: DatabaseService<StatusDTO>,
    @DatabaseTable('vitals_table')
    private readonly vitalsDb: DatabaseService<VitalsDTO>,
    @DatabaseTable('vitals_table')
    private readonly con: DatabaseService<VitalsDTO>,

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



  findAllVitalsDetails(vitalsDto: VitalsDTO) {
    Logger.debug(`findAllVitalsDetails() data:${vitalsDto}}`);
    return this.vitalsDb.fetchAll().pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('No user Found')
        }
        else {
          return doc
        }
      }),
    );;
  }

  saveToStatusDb(statusDTO: StatusDTO) {
    Logger.debug(`saveToStatusDb() data:${statusDTO}}`);
    return this.statusDb.save(statusDTO);
  }

  //  saveToOrgDb(orgDTO:OrganisationDTO){
  //   Logger.debug(`saveToStatusDb() data:${orgDTO}}`);
  //   return this.statusDb.save(orgDTO);
  //  }

  fetchCustomerIdAndScanId(customer_id: StatusDTO, scan_id: StatusDTO,apiKey) {
    Logger.debug(`fetchCustomerIdAndScanId() cust_id:${customer_id},scan_id:${scan_id} }`, APP);
    var decryptedId:any = this.decryptXAPIKey(apiKey)
    console.log('d', decryptedId);
    return this.organizationService.fetchOrganizationDetailsById(decryptedId.orgId)
    .pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        
        
          // console.log(doc);
          //  return doc
          return this.statusDb.find({ customer_id: customer_id, scan_id: scan_id }).pipe(
              map((doc) => {
                console.log(doc);
                return doc
              }))

        
      }))
    // return this.statusDb.find({ customer_id: customer_id, scan_id: scan_id }).pipe(
    //   switchMap((doc) => {
    //     return doc
    //   }),
    //   map(doc => {
    //     let data = new StatusDTO();
    //     data.customer_id = doc.customer_id;
    //     data.scan_id = doc.scan_id;
    //     data.tenant_id = doc.tenant_id;
    //     data.message = doc.message;
    //     data.status = doc.status;
    //     this.res.push(data);
    //     return this.res;
    //   })
    // )
  }


  fetchRowDetails(customer_id: VitalsDTO, scan_id: VitalsDTO, apiKey) {
    Logger.debug(`fetchRowDetails() cust_id:${customer_id},scan_id:${scan_id} }`, APP);

    console.log("encryptXAPIKey", apiKey);

    var decryptedId:any = this.decryptXAPIKey(apiKey)
    console.log('d', decryptedId);

    return this.organizationService.fetchOrganizationDetailsById(decryptedId.orgId)
    .pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('data not found')
        }
        else {
          return doc
        }
      }))
    // map(), org data
    // catch error
    //   map(doc => {
    //     return this.vitalsDb.find({ customer_id: customer_id, scan_id: scan_id }).pipe(
    //       map(doc => {return doc})
    //     )
    //   })
    // )
    //       return this.vitalsDb.find({ customer_id: customer_id, scan_id: scan_id }).pipe(
    //         map(ele => {
    //           // this.decryptXAPIKey();
    // // this.organizationService.fetchOrganizationDetailsById(1).pipe(map)
    //         }),
    //          map((doc) => {
    //             return doc
    //          }),)
  }


  updateVitalsData(id: number, vitalsDTO: VitalsDTO) {
    Logger.debug(`updateVitalsData() id:${id} vitalsDTO: ${JSON.stringify(vitalsDTO)} `, APP);
    return this.vitalsDb.find({ id: id }).pipe(map(res => {
      if (res.length == 0) throw new NotFoundException('user not found')
      else {
        lastValueFrom(this.vitalsDb.findByIdandUpdate({ id: id.toString(), quries: vitalsDTO }))

      }

    }))
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
    const NodeRSA = require('node-rsa');
    // const encryptedString = "Ds6LUhvrqP/lvuWWIhh33hhOikq6g/lrzMp3gRHCiMjQ4byjOqq92M81tpl4GRykDr1iMQ1tmKtAPmjhszRlq7uigw3Rj/1jdbPWsvYQQF6HR9j2sUs9FcX9W2ty7p+qBSRW4WAzmJudQIho+4MU/+GPhuejVFEIrqo/3Ak7hUXXsk2BMkXKWjAJrn5XdpWiFhH9qFTbUxnwMrsTzX+KT8OIaJZXeHNaqsBh2bg25w/j0Bv07Pv9DXj+0rlLkYDaWtQqLqiT8YcPyJfRzKrOvwC2kkOvPBEruP3nRjYslLQxFFrbIfKYCv5EMswfviM0U9B+EfTD3opYHt9FFN1CZLWTCgrueJcsGT4soinqsMIK01SpQu3qZk3WbJy9mvZnOxnmz9tKIg0qj3400MXQZwztNpAI7Ek0Gg4b7oRofXgoxd3VRfIIL31Gwhgqy2jyGOZobaLsfvQGAb5Nu9J1d4EmlwT3AxiK34bF9uwjNZHgM6sqpnC7hxTkRMCf0xSSl5qB0S6zBdh21B9xKzUAGbSxXQ9y9o/k6/xJW+DevBi9Ovg7e+0xF3tkzO6uVAZAhhn5GTjQISl4Zj9M5bmYN/cvbRVfFhYZ8uEqoH+tC6l/QSvnwyitcmngA3sS3xlmZGDlZW7fLTkLhdzI5cxxW59U/wc1KZtzVEvv8hB89aMtf/HET75pQ89iudYOrZQfZcTRjiajE4cm1ipUkZ7CVGSs1PHzZfpljZvTYHLXv1yN0m6+kZacpueNpK9J6tdrtwekG3znZeLT91+ql5ft0IoS8Rx3P4E2te+T/xBYLDoL91GAglmTXBZDhQFUlK1zpqzL2UfgfYBKAFA9hfvXOddD0X6PPXDs120G6Y2ad3Qys2mHbgl603aFTp0naKS6cTQVYpzQ76VnMm6o8KsmIdZKr7cLXC9pWdd4WLl+kCFuFVdKutIf6EPdMwKCNhsp4VmrC29AbU0Hq8nzBhoWtdhXnaWYbgSU39ZZb7cRmLSD6fXD9RU0Rvmalk6DrgkLNPabtxb9DFlA+m7UwzaQ9VNyJn55xSmY0dPsxf0A2D2u8v61HWvQ0pAMHhsc0qJtLIQnNhKcq8IcqKZrMkqz7NWI8JQ+c1nwsEvRlo2Q8KFuTHtrVUlmJvkNp5Nuax8FGH1SrI5QDBomF9IP0udSCRScyHdFdHqSTajZTt/QWSiXhv47uHZpiLEjRXsztdfr10Db2WgxQ7nZeHtLjAyrKnhTuHmN1qe/GGAUWwuzL/P65Lt8YvqZpwxrOLvq8OJKXrscQtjIkopPukkwHRIpc2bhn7JB+asKnFH09BiOyLrdL6a4mPzJPH165icZXjmnccAPpimN2bj/gyL8eA8lhg==";
    // const encryptedString="e0TYgxfHba8byhFZxtGaMtAS2q/S5HVu58cqRbZD80P6f7F8IzjN2bTazBCbc3UnLO4XQ7vhGSs6pKWxVlwAZjGmESgWcjfvuWsrvqsTU4EFppDPlvc0tsga2I/JGXYIkl2TUUtvp9lmSYDbuXL4sXMDpv2ryUmEvThHbAJtYHNh8cJDkjszcS9zI55ORcWbs/Ox6dBx7KyRYta56wAUzfxc3HiHjcufvz1gr0yZ4hL0d34Uva5y6B5oNfdP5/fG88w1x7fR7inIwrHEjRi4fHmgGB5fOUK6G85iWzYIUEYIHsZEfck/2WaYfBjKFDTx9+3SOsGxz382os8XKmlLERMs3Y/rrOwx4iMzR8Uw7yxuBeF+nZur/Lnwdn7teFEJklpK54+p3CLGATl1PPUwhi+kZFvfVmYa/LPI3TiIaiLZSbSWuXH7XkhnqwK7gARpFTl9m9unrFcaZnkit0eV359oUHrp21E6JqjvcBL34L0EBMcSuLDoMz+Td+A1uePIvVSGgpaBdPx0rcfRZFj0fe9FeROOJIPuE4YVG/23hEDcfP7qa1rbyI9Wt3b2LqNRWj8Gp0pdE1RUpMpn/gkW80ny8egU3exAuZxBFGcLMR8R2ANQLDGn2kkCDXHoYvos0Hf7+1nVFdK7WR51ejlncyuQoP/7c69aLGnn5vZi1TA68A/5QlV17kRmnR/tf2pYkWByrAIJtm7uSoeXDHJ39TC7XiltJx4yWrkXTXSV3Db+FohDzdLBK1OzjHlPxRo3tzv159Gn2xu+8YZoQVYk0UJRlMg8Cshxr8EWGdY8OlrdupKDLLrMy8A7lwCNpPMGTImPKNptpV59373MvUXWCSouwbI6+vx0vVkd/wND2nZThx+x4EMwpLcI/nQ8Ow59XX3gYiBkNMABUckMBNUFNrizkT8RYqiGGUDYA00cywoT8nkpCd2cJrSBqMcU3Drb773yCRoLQcsqONvLipccReDaFXQah3+E4bc8iRZvSNfrWGCPBNNlD3+KDmOyG7UUYK62AWPLsW49DbaJXamwz6T8yVZZQo4W8QrlY2PpdxzzmlTe6R5IYVSpXDkYOCo0VktgPFMO5+CiVZhT2ESYwsLfbLzO72lXhpQ7JDhLgiNSWC+xQuf1XozMeLrOGY1TADW7uD5RlxWbuIxPIjdd3PTlp4FBdY8wX9EOLIOVQAk2LPPJbgisBwGsYeLln9VatWDyoz85gGTchELA06x1vIlYYAIXQKor/fVJUpjL0Rr8cOzuQ9C+Q+L7JLqmEW4JD2UC0PlfiH7iGkiX1wUN00srgSORLrcQ1QoKgBJbbpcZwQ+tnl9EnwodsaLTLsFO3cVXep56tJgUzxk+5AExSw==";
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


}
