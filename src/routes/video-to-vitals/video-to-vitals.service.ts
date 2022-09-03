import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { catchError, concatMap, from, lastValueFrom, map, switchMap, throwError } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { SendEmailService } from 'src/send-email/send-email.service';
import { PasswordResetDTO } from '../admin/dto/create-admin.dto';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { ProductService } from '../product/product.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { AWS_ACCESS_KEY_ID, AWS_COGNITO_USER_CREATION_URL_SIT, AWS_SECRET_ACCESS_KEY, FEDO_APP, FEDO_USER_ADMIN_PANEL_POOL_NAME, PUBLIC_KEY } from 'src/constants';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO } from '../admin/dto/login.dto';
import { CreateOrganizationDto, LoginUserDTO, LoginUserPasswordCheckDTO, OrgDTO, RegisterUserDTO, UpdateOrganizationDto, UpdateUserDTO, UserDTO, UserProfileDTO, VitalUserDTO } from './dto/create-video-to-vital.dto';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from 'aws-sdk';

const APP = 'VideoToVitalsService'

@Injectable()
export class VideoToVitalsService {
  bucket: any;
  constructor(
    @DatabaseTable('organization')
    private readonly organizationDb: DatabaseService<CreateOrganizationDto>,
    @DatabaseTable('organization_product_junction')
    private readonly organizationProductJunctionDb: DatabaseService<CreateOrganizationDto>,
    @DatabaseTable('users')
    private readonly userDb: DatabaseService<UserDTO>,
    @DatabaseTable('user_profile_info')
    private readonly userProfileDb: DatabaseService<UserProfileDTO>,
    @DatabaseTable('product')
    private readonly productDb: DatabaseService<CreateProductDto>,
    private readonly productService: ProductService,
    private readonly userProductJunctionService: UserProductJunctionService,
    private readonly sendEmailService: SendEmailService,
    private http: HttpService,

  ) {

  }

  urlAWSPhoto: any

  createOrganization(createOrganizationDto: CreateOrganizationDto, path: any) {
    Logger.debug(`createOrganization() createOrganizationDto:${JSON.stringify(createOrganizationDto,)} filename:${path}`, APP);
    let productlist = createOrganizationDto.product_id.split(",")
    return this.fetchOrgByUrl(createOrganizationDto.url).pipe(
      map(doc => {
        if (doc.length == 0) {
          return this.fetchOrgByCondition(createOrganizationDto).pipe(
            map(doc => {
             return doc
            }),
            switchMap( (doc) => {
          createOrganizationDto.product_id = productlist[0];
          const tomorrow = new Date();
          const duration = createOrganizationDto.pilot_duration
          createOrganizationDto.logo = path
          createOrganizationDto.end_date = new Date(tomorrow.setDate(tomorrow.getDate() + Number(duration)));
          createOrganizationDto.status = "Active"
          createOrganizationDto.application_id = createOrganizationDto.organization_mobile.slice(3, 14);

          delete createOrganizationDto.logo;
          return this.organizationDb.save(createOrganizationDto).pipe(
            map(res => {
              var encryption={org_id:res[0].id};
              this.sendEmailService.sendEmailOnCreateOrg(
                {
                  "email": createOrganizationDto.organization_email,
                  "organisation_admin_name": createOrganizationDto.admin_name,
                  "fedo_app": "FEDO VITALS",
                  "url": createOrganizationDto.url+"?"+encodeURIComponent(this.encryptPassword(encryption)),
                  "pilot_duration": (createOrganizationDto.pilot_duration),
                  "application_id": (res[0].application_id)
                }
              )
              return res
            })
          );
          }),
          // switchMap(res =>  res)
          )
        }
        else {
          throw new ConflictException('domain already taken')
        }
      }),
      switchMap(res => res),
      switchMap(async res => {
        productlist.map(res1 =>
          this.organizationProductJunctionDb.save({ org_id: res[0].id, start_date: createOrganizationDto.start_date, end_date: createOrganizationDto.end_date, pilot_duration: createOrganizationDto.pilot_duration, status: res[0].status, stage: res[0].stage, product_id: res1 }))
        if (path != null) {
          this.userProfileDb.save({ application_id: res[0].application_id, org_id: res[0].id });
        
          
          await this.upload(path); this.organizationDb.findByIdandUpdate({ id: res[0].id.toString(), quries: { logo: this.urlAWSPhoto } });
          delete res[0].logo; return res
        }
        else {
          this.userProfileDb.save({ application_id: res[0].application_id, org_id: res[0].id });
          this.organizationDb.findByIdandUpdate({ id: res[0].id.toString(), quries: { logo: this.urlAWSPhoto } });
          delete res[0].logo; return res

        }
      }

      )
    )
  }


  patchImageToOrganization(id:number,path:any){
    Logger.debug(`patchImageToOrganization() id:${id} filename:}`, APP);
    if (path != null){
  
    return this.fetchOrganizationById(id).pipe(
      map( async doc=>{ await this.upload(path); this.organizationDb.findByIdandUpdate({ id: id.toString(), quries: { logo: this.urlAWSPhoto } }) })
    )
  }
  else return []    

  }

  async upload(file) {
    const { originalname } = file;
    const bucketS3 = 'fedo-vitals';
    await this.uploadS3(file.buffer, bucketS3, originalname);
  }

  async uploadS3(file, bucket, name) {
    const s3 = this.getS3();

    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      acl: 'public',


    };


    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          Logger.error(err);
          reject(err.message);
        }
        const url = s3.getSignedUrl('getObject', {
          Bucket: 'fedo-vitals',
          Key: String(name)
        })

        resolve(url);
        this.urlAWSPhoto = data.Location;
      });
    });
  }

  getS3() {
    return new S3({
      accessKeyId: AWS_ACCESS_KEY_ID,

      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });
  }



  fetchOrgByUrl(url: string) {
    Logger.debug(`fetchOrgByUrl() name:${OrgDTO}`, APP);

    return this.organizationDb.find({ url: url }).pipe(
      map(doc => {
        if (doc.length == 0){
          return doc
        }
        if (doc.length != 0){
          throw new ConflictException("domain already taken") 
        }
      })
    )
  }

  fetchOrgCount() {
    return this.organizationDb.find({ is_deleted: false }).pipe(
      map(doc => { return { "total_organizations_count": doc.length } })
    )
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

  updateStatus() {
    return this.organizationDb.updateColumnByCondition().pipe(
      map(doc => { return { "status": "updated" } })
    )
  }

  fetchOrgByCondition(orgDTO: OrgDTO) {
    Logger.debug(`fetchOrgByCondition() orgDTO:${JSON.stringify(orgDTO)} `, APP);

    return this.fetchOrgByNameEmailAndMobile(orgDTO).pipe(
      map(doc => {
        if (doc.length == 0) {
          return doc
        }
      }),
      switchMap(doc => {
        return this.fetchOrgByNameEmail(orgDTO).pipe(
          map(doc => {
            if (doc.length == 0) {
              return doc
            }
          }),
        )
      }),
      switchMap(doc => {
        return this.fetchOrgByEmailAndMobile(orgDTO).pipe(
          map(doc => {
            if (doc.length == 0) {
              return doc
            }
          }),
        )
      }),
      switchMap(doc => {
        return this.fetchOrgByNameMobile(orgDTO).pipe(
          map(doc => {
            if (doc.length == 0) {
              return doc
            }
          }),
        )
      }),
      switchMap(doc => {
        return this.fetchOrgByName(orgDTO.organization_name).pipe(
          map(doc => {
            if (doc.length == 0) {
              return doc
            }
          }),
        )
      }),
      switchMap(doc => {
        return this.fetchOrgByEmail(orgDTO).pipe(
          map(doc => {
            if (doc.length == 0) {
              return doc
            }
          }),
        )
      }),
      switchMap(doc => {
        return this.fetchOrgByMobile(orgDTO).pipe(
          map(doc => {
            if (doc.length == 0) {
              return doc
            }
          }),
        )
      })
    )
  }

  fetchOrgByNameEmailAndMobile(orgDTO: OrgDTO) {
    Logger.debug(`fetchOrgByNameEmailAndMobile() orgDTO:${JSON.stringify(orgDTO)} `, APP);
    return this.organizationDb.find({ organization_name: orgDTO.organization_name, organization_email: orgDTO.organization_email, organization_mobile:orgDTO.organization_mobile}).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException("organization exist with organization name, email id and mobile no.")
        }
        else { return doc }
      })
    )
  }

  fetchOrgByNameEmail(orgDTO: OrgDTO) {
    Logger.debug(`fetchOrgByNameEmail() orgDTO:${JSON.stringify(orgDTO)} `, APP);
    return this.organizationDb.find({ organization_name: orgDTO.organization_name, organization_email: orgDTO.organization_email }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException("organization exist with organization name, email id ")
        }
        else { return doc }
      })
    )
  }

  fetchOrgByEmailAndMobile(orgDTO: OrgDTO) {
    Logger.debug(`fetchOrgByEmailAndMobile() orgDTO:${JSON.stringify(orgDTO)} `, APP);

    return this.organizationDb.find({ organization_email: orgDTO.organization_email, organization_mobile: orgDTO.organization_mobile }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException("organization exist with email id and mobile no.")
        }
        else { return doc }
      })
    )
  }

  fetchOrgByNameMobile(orgDTO: OrgDTO) {
    Logger.debug(`fetchOrgByNameMobile() orgDTO:${JSON.stringify(orgDTO)} `, APP);
    return this.organizationDb.find({ organization_name: orgDTO.organization_name, organization_mobile: orgDTO.organization_mobile }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException("organization exist with organization name, mobile no. ")
        }
        else { return doc }
      })
    )
  }

  fetchOrgByName(organization_name: string) {
    Logger.debug(`fetchOrgByName() orgDTO:${JSON.stringify(organization_name)} `, APP);
    return this.organizationDb.find({ organization_name: organization_name }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException(`organization exist with organization_name`)
        }
        else { return doc }
      }),
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

  fetchOrgByEmail(orgDTO: OrgDTO) {
    Logger.debug(`fetchOrgByEmailAndMobile() orgDTO:${JSON.stringify(orgDTO)} `, APP);
    return this.organizationDb.find({ organization_email: orgDTO.organization_email }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException("organization exist with email id.")
        }
        else { return doc }
      })
    )
  }

  fetchOrgByMobile(orgDTO: OrgDTO) {
    Logger.debug(`fetchOrgByMobile() orgDTO:${JSON.stringify(orgDTO)} `, APP);
    return this.organizationDb.find({ organization_mobile: orgDTO.organization_mobile }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException("organization exist with mobile no.")
        }
        else { return doc }
      })
    )
  }

  fetchAllOrganization() {
    Logger.debug(`fetchAllOrganization() `, APP);

    return this.organizationDb.find({ is_deleted: false }).pipe(
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

  fetchFiveLatestOrganization() {
    Logger.debug(`fetchFiveLatestOrganization()`, APP);

    return this.organizationDb.fetchLatestFive().pipe(
      catchError(err => {
        throw new UnprocessableEntityException(err.message)
      }),
      map(doc => this.fetchotherDetails(doc))
    );

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





  fetchOrganizationById(id: number) {
    Logger.debug(`fetchOrganizationById() id:${id} `, APP);

    return this.organizationDb.find({ id: id, is_deleted: false }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('organization not found')
        }
        else {
          return doc
        }
      }),

    )
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

  updateOrganization(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    Logger.debug(`updateOrganization(), ,`, APP);


  
    if (updateOrganizationDto.pilot_duration) {
      const tomorrow = new Date();
      const duration = updateOrganizationDto.pilot_duration
      updateOrganizationDto.end_date = new Date(tomorrow.setDate(tomorrow.getDate() + Number(duration)));
      delete updateOrganizationDto.pilot_duration
    }

    updateOrganizationDto.start_date = new Date(Date.now()),
      delete updateOrganizationDto.pilot_duration

    return this.organizationDb.find({ id: id, is_deleted: false }).pipe(
      map(res => {
        if (res.length == 0) throw new NotFoundException('organization not found')
        else return this.organizationDb.findByIdandUpdate({ id: id, quries: updateOrganizationDto })
      }))
  };

  changeRegisterStatusOnceConfirmed(id: number) {
    Logger.debug(`changeRegisterStatusOnceConfirmed() id:${id} `, APP);

    return this.organizationDb.find({ id: id, is_deleted: false }).pipe(
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('organization not found')
        }
        else {
          return this.organizationDb.findByIdandUpdate({id:id.toString(),quries:{is_register:true}})
        }
      }),

    )
  }

  deleteLogo(id: number) {
    Logger.debug(`deleteLogo(),id:${id},`, APP);

    return this.organizationDb.find({ id: id, is_deleted: false }).pipe(
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('organization not found')
        }
        else {
          return this.organizationDb.findByIdandUpdate({ id: id.toString(), quries: { logo: '' } }).pipe(
            map(doc => { return { status: "deleted" } })
          )
        }
      }),
      switchMap(res => res)

    )


  }

  deleteOrganizationByID(id: number) {

    return this.organizationDb.find({ id: id, is_deleted: false }).pipe(
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('organization not found')
        }
        else {
          return this.organizationDb.findByIdandUpdate({ id: id.toString(), quries: { is_deleted: true } }).pipe(
            map(doc => { return { status: "deleted" } })
          )
        }
      }),
      switchMap(res => res)

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

    return this.fetchUserByCondition(userDTO).pipe(
      map(user_doc=>user_doc),
      switchMap(user_doc=>{
         return  this.fetchOrgByNameForUserCreation(userDTO.organization_name).pipe(
          map(org_doc => {
            return org_doc
          }),
          switchMap(org_doc => {
            userDTO["org_id"] = org_doc[0].id
            return this.productService.fetchProductByNewName(userDTO.product_name).pipe(
              map(product_doc => {
                delete userDTO.product_name
                userDTO.application_id = userDTO.mobile.slice(3, 14);
                return [product_doc[0].id, org_doc]
              }),
              switchMap(doc => {
                console.log("deszfsd");
                
                userDTO.product_id = Number(doc[0])
                return this.userDb.save(userDTO).pipe(
                  map(userdoc => {
                    return [userdoc, doc]
                  }),
    
                  switchMap(doc => {
                    var encryption={user_id: doc[0][0]['id']};
                    
                    this.sendEmailService.sendEmailOnCreateOrgUser(
    
                      {
                        "email": userDTO.email,
                        "organisation_admin_name": doc[1][1][0].admin_name,
                        "fedo_app": "FEDO VITALS",
                        "url": doc[1][1][0].url+"?"+encodeURIComponent(this.encryptPassword(JSON.stringify(encryption))),
                        "name": userDTO.user_name,
                        "pilot_duration": doc[1][1][0].pilot_duration,
                        "organisation_admin_email": doc[1][1][0].organization_email,
                        "application_id":userDTO.application_id
                      }
                    )
                    return doc[0]
                  }),
    
                )
    
    
              }),
              map(doc => {
                doc["id"]
                this.userProductJunctionService.createUserProductJunction({ user_id: doc["id"], org_id: userDTO["org_id"], product_id: userDTO.product_id, total_tests: 1 });
                this.userProfileDb.save({ application_id: doc['application_id'], user_id: doc['id'], org_id: doc['org_id'], name: doc['user_name'], is_editable: true })
                return doc;
              })
    
            )
          }),
    
        )
      })
    )
    
   

  }

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

  fetchOrganizationDetailsById(id: number) {
    Logger.debug(`fetchOrganizationDetailsById() id:${id}} `, APP);

    return this.organizationDb.find({ id: id }).pipe(
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

  getOrganisationDetailsOfUserByEmail(loginUserPasswordCheckDTO: LoginUserPasswordCheckDTO) {
    Logger.debug(`findUserByEmail() loginUserDTO:${JSON.stringify(LoginUserDTO)} `, APP);

    return this.userDb.find({ email: loginUserPasswordCheckDTO.email }).pipe(
      map(doc => {
        if (doc.length == 0) throw new NotFoundException('user not found')
        else return doc
      }),
      switchMap(doc => {
        if (doc[0].org_id != null) {
          return this.fetchOrganizationById(doc[0].org_id)
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
