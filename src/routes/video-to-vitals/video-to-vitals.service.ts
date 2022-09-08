import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { catchError, concatMap, from, lastValueFrom, map, switchMap, throwError } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { SendEmailService } from 'src/send-email/send-email.service';
import { PasswordResetDTO } from '../admin/dto/create-admin.dto';
// import { CreateProductDto } from '../product/dto/create-product.dto';
import { ProductService } from '../product/product.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { AWS_ACCESS_KEY_ID, AWS_COGNITO_USER_CREATION_URL_SIT, AWS_SECRET_ACCESS_KEY, FEDO_APP, FEDO_USER_ADMIN_PANEL_POOL_NAME, PUBLIC_KEY } from 'src/constants';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO } from '../admin/dto/login.dto';
import { CreateOrganizationDto, LoginUserDTO, LoginUserPasswordCheckDTO, OrgDTO, RegisterUserDTO, UpdateOrganizationDto, UpdateUserDTO, UserDTO, UserProfileDTO, VitalUserDTO } from './dto/create-video-to-vital.dto';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { application } from 'express';
import { CreateUserProductJunctionDto } from '../user-product-junction/dto/create-user-product-junction.dto';
import { OrganizationService } from './organization.service';
import { CreateProductDto } from '../product/dto/create-product.dto';

const APP = 'VideoToVitalsService'

@Injectable()
export class VideoToVitalsService {
  bucket: any;
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
    @DatabaseTable('product')
    private readonly productDb: DatabaseService<CreateProductDto>,
    private readonly productService: ProductService,
    private readonly userProductJunctionService: UserProductJunctionService,
    private readonly sendEmailService: SendEmailService,
    private readonly organizationService: OrganizationService,
    private http: HttpService,

  ) {

  }



  fetchAllVitalsPilot() {
    Logger.debug(`fetchAllVitalsPilot()`, APP);

    return this.organizationDb.find({ product_id: 2, is_deleted: false }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('No Data available')
        }
        else {
          return this.fetchotherDetails(doc)
        }
      }),
    );
  }

  fetchFiveLatestVitalsPilot() {
    Logger.debug(`fetchFiveLatestVitalsPilot()`, APP);

    return this.organizationDb.fetchLatestFiveByProductId(2).pipe(
      catchError(err => {
        throw new UnprocessableEntityException(err.message)
      }),
      map(doc => this.fetchotherDetails(doc))
    );


  }

  fetchVitalsPilotCount() {
    return this.organizationDb.find({ product_id: 2, is_deleted: false }).pipe(
      map(doc => { return { "total_Vitals_pilot_count": doc.length } })
    )
  }

  fetchActiveVitalsPilotCount() {
    return this.organizationDb.find({ product_id: 2, status: 'Active', is_deleted: false }).pipe(
      map(doc => { return { "Active_Vitals_pilot_count": doc.length } })
    )
  }


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

  fetchotherDetails(createOrganizationDto: CreateOrganizationDto[]) {

    let temp: CreateOrganizationDto[] = [];
    return lastValueFrom(from(createOrganizationDto).pipe(
      concatMap(orgData => {
        return lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByOrgId(orgData.id))
          .then(doc => {
            orgData['total_users'] = doc.length;
            orgData['total_tests'] = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
            orgData['progress'] = this.fetchDate(orgData);
            temp.push(orgData);
            return orgData
          })
      }),
    )).then(_doc => temp)
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



  fetchVitalsPilotById(id: number) {
    Logger.debug(`fetchVitalsPilotById() id:${id} `, APP);

    return this.organizationDb.find({ id: id, is_deleted: false, product_id: 2 }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('vitals pilot not found')
        }
        else {
          return doc
        }
      }),

    )
  }



  changeRegisterStatusOnceConfirmed(id: number) {
    Logger.debug(`changeRegisterStatusOnceConfirmed() id:${id} `, APP);

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

  fetchAllVitalsTestCount() {
    Logger.debug(`fetchAllVitalsTestCount() ) `, APP);

    return this.userProductJunctionService.fetchUserProductJunctionDataByProductId(2).pipe(
      map(doc => {
        const total_tests = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
        return { "total_tests": total_tests }
      })
    )
  }

  addUser(userDTO: UserDTO) {
    Logger.debug(`addUser() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    let product_user_list = userDTO.product_id.toString().split(",")
    return this.fetchUserByCondition(userDTO).pipe(
      map(user_doc => user_doc),
      switchMap(user_doc => {
        return this.fetchOrgByNameForUserCreation(userDTO.organization_name).pipe(
          map(org_doc => {
            return org_doc
          }),
          switchMap(org_doc => {
            console.log("docuser", org_doc);
            userDTO["org_id"] = org_doc[0].id
            delete userDTO.product_name
            userDTO.application_id = userDTO.mobile.slice(3, 14);
            userDTO.product_id = Number(product_user_list[0]);
            return this.userDb.save(userDTO).pipe(
              map(userdoc => {
                console.log("deletion", userdoc);

                return [userdoc, org_doc]
              }),

              switchMap(doc => {
                console.log("after deletiom", doc);
                var encryption = { user_id: doc[0][0]['id'] };

                console.log("data to check after deletion", doc[0][0]['id']);
                console.log("data to check after deletion", doc[1][0]['admin_name']);


                this.sendEmailService.sendEmailOnCreateOrgUser(

                  {
                    "email": userDTO.email,
                    "organisation_admin_name": doc[1][0]['admin_name'],
                    "fedo_app": "FEDO VITALS",
                    "url": doc[1][0]['url'] + "?" + encodeURIComponent(this.encryptPassword(JSON.stringify(encryption))),
                    "name": userDTO.user_name,
                    "pilot_duration": doc[1][0]['pilot_duration'],
                    "organisation_admin_email": doc[1][0]['organization_email'],
                    "application_id": userDTO.application_id
                  }
                )
                return doc[0]
              }),

            )


          }),
          map(doc => {
            console.log("org-id", userDTO["org_id"]);

            product_user_list.map(res1 =>
              this.userProductJunctionService.createUserProductJunction({ user_id: doc["id"], org_id: userDTO["org_id"], product_id: Number(res1), total_tests: 0 })

            )
            doc["id"]
            this.userProfileDb.save({ application_id: doc['application_id'], user_id: doc['id'], org_id: doc['org_id'], name: doc['user_name'], is_editable: true })
            return doc;
          })

        )
      }),

    )


  }


  // addUser(userDTO: UserDTO) {
  //   Logger.debug(`addUser() addUserDTO:${JSON.stringify(userDTO)} `, APP);

  //   return this.fetchUserByCondition(userDTO).pipe(
  //     map(user_doc=>user_doc),
  //     switchMap(user_doc=>{
  //        return  this.fetchOrgByNameForUserCreation(userDTO.organization_name).pipe(
  //         map(org_doc => {
  //           return org_doc
  //         }),
  //         switchMap(org_doc => {
  //           userDTO["org_id"] = org_doc[0].id
  //           return this.productService.fetchProductByNewName(userDTO.product_name).pipe(
  //             map(product_doc => {
  //               delete userDTO.product_name
  //               userDTO.application_id = userDTO.mobile.slice(3, 14);
  //               return [product_doc[0].id, org_doc]
  //             }),
  //             switchMap(doc => {
  //               console.log("deszfsd");

  //               userDTO.product_id = Number(doc[0])
  //               return this.userDb.save(userDTO).pipe(
  //                 map(userdoc => {
  //                   return [userdoc, doc]
  //                 }),

  //                 switchMap(doc => {
  //                   var encryption={user_id: doc[0][0]['id']};

  //                   this.sendEmailService.sendEmailOnCreateOrgUser(

  //                     {
  //                       "email": userDTO.email,
  //                       "organisation_admin_name": doc[1][1][0].admin_name,
  //                       "fedo_app": "FEDO VITALS",
  //                       "url": doc[1][1][0].url+"?"+encodeURIComponent(this.encryptPassword(JSON.stringify(encryption))),
  //                       "name": userDTO.user_name,
  //                       "pilot_duration": doc[1][1][0].pilot_duration,
  //                       "organisation_admin_email": doc[1][1][0].organization_email,
  //                       "application_id":userDTO.application_id
  //                     }
  //                   )
  //                   return doc[0]
  //                 }),

  //               )


  //             }),
  //             map(doc => {
  //               doc["id"]
  //               this.userProductJunctionService.createUserProductJunction({ user_id: doc["id"], org_id: userDTO["org_id"], product_id: userDTO.product_id, total_tests: 1 });
  //               this.userProfileDb.save({ application_id: doc['application_id'], user_id: doc['id'], org_id: doc['org_id'], name: doc['user_name'], is_editable: true })
  //               return doc;
  //             })

  //           )
  //         }),

  //       )
  //     })
  //   )



  // }

  fetchUsersCountByOrgId(org_id: number) {
    Logger.debug(`fetchUsersCountByOrgId() org_id:${org_id}} `, APP);

    return this.userDb.find({ org_id: org_id }).pipe(
      map(doc => { return { "total user for a particular organization": doc.length } })
    )
  }

  fetchAllUsersByOrgIdAndProductId(vitalUserDTO: VitalUserDTO) {
    Logger.debug(`fetchAllUsersByOrgIdAndProductId()`, APP);

    return this.userDb.find({ org_id: vitalUserDTO.org_id, product_id: 2 }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('user not found')
        }
        else {
          return this.fetchUsersotherDetails(doc)
        }
      }),
    );
  }

  fetchUsersotherDetails(userDTO: UserDTO[]) {
    Logger.debug(`fetchUsersotherDetails() userDTO:${JSON.stringify(userDTO)} `, APP);


    let temp: UserDTO[] = [];
    return lastValueFrom(from(userDTO).pipe(
      concatMap(userData => {
        return lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByUserIdAndProductId(userData.id, userData.product_id))
          .then(doc => {
            userData['total_tests'] = doc[0].total_tests
            temp.push(userData);
            return userData
          })
          .catch(err => { throw new UnprocessableEntityException(err.message) })
      }),
    )).then(_doc => temp)
  }

  fetchFiveLatestUsersByOrgIdAndProductId(vitalUserDTO: VitalUserDTO) {
    Logger.debug(`fetchFiveLatestUsersByOrgIdAndProductId() vitalUserDTO:${JSON.stringify(vitalUserDTO)} `, APP);

    return this.userDb.fetchLatestFiveUserByProductIdOrgId(2, vitalUserDTO.org_id,).pipe(
      map(doc => this.fetchUsersotherDetails(doc))
    )
  }

  fetchUserByCondition(userDTO: UserDTO) {
    Logger.debug(`fetchAllUsertByEmailAndMobile() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    return this.fetchAllUsersByEmailAndMobile(userDTO).pipe(
      map(doc => doc),
      switchMap(doc => {
        return this.fetchAllUsersByEmail(userDTO).pipe(
          map(doc => doc),
          switchMap(doc => {
            return this.fetchAllUsersByMobile(userDTO).pipe(
              map(doc => { return doc })
            )
          }),
        )
      })
    )
  }

  fetchAllUsersByEmailAndMobile(userDTO: UserDTO) {
    Logger.debug(`fetchAllUsertByEmailAndMobile() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    return this.userDb.find({ email: userDTO.email, mobile: userDTO.mobile }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException("user exist with email id and mobile no.")
        }
        else { return doc }
      })
    )
  }

  fetchAllUsersByEmail(userDTO: UserDTO) {
    Logger.debug(`fetchAllUsertByEmail() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    return this.userDb.find({ email: userDTO.email }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException("user exist with email id")
        }
        else { return doc }
      })
    )
  }

  fetchAllUsersByMobile(userDTO: UserDTO) {
    Logger.debug(`fetchAllUsertByMobile() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    return this.userDb.find({ mobile: userDTO.mobile }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException("user exist with mobile number")
        }
        else { return doc }
      })
    )
  }

  fetchUserById(id: number) {
    Logger.debug(`fetchUserById() id:${id}} `, APP);

    return this.userDb.find({ id: id }).pipe(
      map(doc => doc)
    )
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

    return this.userDb.find({ id: id }).pipe(
      map(res => {
        if (res.length == 0) throw new NotFoundException('organization not found')
        return this.userDb.findByIdandUpdate({ id: id.toString(), quries: updateUserDTO })
      }))

  }

  updateUserByApplicationId(user_id: string) {
    Logger.debug(`updateUserByApplicationId() id:${user_id} updateUserDTO:)} `, APP);

    return this.userDb.find({ id: user_id }).pipe(
      switchMap(res => {
        if (res.length == 0) throw new NotFoundException('user not found')
        else {
          return this.userProductJunctionDb.find({ user_id: user_id }).pipe(switchMap(doc => {
            console.log("doc");
            console.log("doc", doc);

            return this.userProductJunctionDb.findandUpdate({ columnName: 'user_id', columnvalue: user_id, quries: { total_tests: doc[0].total_tests + 1 } })
          }))
        }
      }))

  }

  checkEmailIsPresentInUsersOrOrganisation(loginUserPasswordCheckDTO: LoginUserDTO) {
    Logger.debug(`checkEmailIsPresentInUsersOrOrganisation() loginUserDTO:${JSON.stringify(LoginUserDTO)} `, APP);

    return this.userDb.find({ email: loginUserPasswordCheckDTO.username }).pipe(
      switchMap(doc => {
        if (doc.length == 0) {
          return this.organizationDb.find({ organization_email: loginUserPasswordCheckDTO.username }).pipe(
            map(doc => {
              if (doc.length == 0) throw new NotFoundException('user with this email is not found')
              else return doc

            })
          )
        }
        else return doc
      }),
    )
  }




  user_data: any;
  org_data: any

  loginUserByEmail(loginUserDTO: LoginUserDTO) {
    Logger.debug(`loginUserByEmail() loginUserDTO:${JSON.stringify(loginUserDTO)} `, APP);


    loginUserDTO.fedoApp = FEDO_APP;
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
              return {
                jwtToken: res.data.idToken.jwtToken,
                refreshToken: res.data.refreshToken,
                accessToken: res.data.accessToken.jwtToken,
                user_data: this.user_data
              };
            }),
          );
      })
    )

  }

  loginOrganizationByEmail(loginUserDTO: LoginUserDTO) {
    Logger.debug(`loginOrganizationByEmail() loginUserDTO:${JSON.stringify(loginUserDTO)} `, APP);


    loginUserDTO.fedoApp = FEDO_APP;
    return this.getOrganisationDetailsByEmail(loginUserDTO).pipe((map(doc => { this.org_data = doc })),
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
              return {
                jwtToken: res.data.idToken.jwtToken,
                refreshToken: res.data.refreshToken,
                accessToken: res.data.accessToken.jwtToken,
                user_data: this.org_data
              };
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

    forgotPasswordDTO.fedoApp = FEDO_APP;
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

    confirmForgotPasswordDTO.fedoApp = FEDO_APP;
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

    RegisterUserdto.fedoApp = FEDO_APP
    return this.http.post(`${AWS_COGNITO_USER_CREATION_URL_SIT}/`, { passcode: this.encryptPassword(RegisterUserdto) }).pipe(
      map(doc => {
      }),
      catchError(err => { return this.onAWSErrorResponse(err) }))

  }

  confirmSignupUserByEmail(RegisterUserdto: RegisterUserDTO) {
    Logger.debug(`confirmSignupUserByEmail(), RegisterUserdto: keys ${[JSON.stringify(Object.keys(RegisterUserdto))]} values ${JSON.stringify(Object.values(RegisterUserdto).length)} `, APP);

    RegisterUserdto.fedoApp = FEDO_APP
    const passcode = this.encryptPassword(RegisterUserdto)
    return this.http.post(`${AWS_COGNITO_USER_CREATION_URL_SIT}/signupcode`, { passcode: passcode }).pipe(map(res => []), catchError(err => {
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


}
