import { HttpService } from '@nestjs/axios';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { CreateOrganizationDto, format_organisation, format_organisation_update, format_org_product_juction, format_org_product_juction_update, OrgDTO, QueryParamsDto, RegisterUserDTO, UpdateOrganizationDto, UpdateWholeOrganizationDto, UserProfileDTO } from './dto/create-video-to-vital.dto';
import { DatabaseService } from 'src/lib/database/database.service';
import { catchError, concatMap, from, lastValueFrom, map, switchMap, throwError } from 'rxjs';
import { AWS_ACCESS_KEY_ID, AWS_COGNITO_USER_CREATION_URL_SIT_ADMIN_PANEL, AWS_SECRET_ACCESS_KEY, FEDO_USER_ADMIN_PANEL_POOL_NAME, PUBLIC_KEY } from 'src/constants';
import AWS, { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { OrgProductJunctionService } from '../org-product-junction/org-product-junction.service';
import { CreateOrgProductJunctionDto, ZQueryParamsDto } from '../org-product-junction/dto/create-org-product-junction.dto';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { SendEmailService } from '../send-email/send-email.service';
import { ProductService } from '../product/product.service';
import { UsersService } from './users.service';
import { EncryptUrlDTO, sendEmailOnCreationOfOrgAndUser } from '../admin/dto/create-admin.dto';
import { decryptPassword } from 'src/constants/helper';
import axios from 'axios';
import * as htmlpdf from 'puppeteer-html-pdf';
import { ProductTestsDto } from '../product_tests/product_tests/dto/create-product_tests.dto';



const APP = 'OrganizationService'
@Injectable()
export class OrganizationService {

  constructor(
    @DatabaseTable('organization')
    private readonly organizationDb: DatabaseService<CreateOrganizationDto>,
    @DatabaseTable('organization_product_junction')
    private readonly organizationProductJunctionDb: DatabaseService<CreateOrganizationDto>,
    @DatabaseTable('user_profile_info')
    private readonly userProfileDb: DatabaseService<UserProfileDTO>,
    @DatabaseTable('product_tests')
        private readonly productTestDB: DatabaseService<ProductTestsDto>,
    // @DatabaseTable('product')
    private readonly sendEmailService: SendEmailService,
    private readonly usersService: UsersService,

    private readonly productService: ProductService,
    private readonly orgProductJunctionService: OrgProductJunctionService,
    private readonly userProductJunctionService: UserProductJunctionService,
    private http: HttpService,
  ) { }

  bucket: any;
  urlAWSPhoto: any

  respilot_duration: any
  create_organization_response: any
  params : ZQueryParamsDto = new ZQueryParamsDto() ;

  async createOrganization(createOrganizationDto: CreateOrganizationDto, path: any) {
    Logger.debug(`createOrganization() createOrganizationDto:${JSON.stringify(createOrganizationDto,)} filename:${path}`, APP);

    if (path != null) {
      await this.upload(path);
      createOrganizationDto.logo = this.urlAWSPhoto;
    }
    else delete createOrganizationDto.logo

    if(Boolean(createOrganizationDto.is_web) == true) createOrganizationDto.url = createOrganizationDto.organization_name.split(' ')[0];
    else createOrganizationDto.url = createOrganizationDto.url;
    return this.fetchOrgByUrlBoth(createOrganizationDto).pipe(
        map(doc => {
            return this.fetchOrgByCondition(createOrganizationDto).pipe(
              map(doc => { return doc }),
              switchMap((doc) => {
                this.respilot_duration = Number(createOrganizationDto.pilot_duration[0]);
                createOrganizationDto.application_id = createOrganizationDto.organization_mobile.slice(3, 14);
                return this.organizationDb.save(format_organisation(createOrganizationDto)).pipe(
                  map(res => {
                    if(Boolean(createOrganizationDto.is_web) == true)  return res
                    else{
                    var encryption = { org_id: res[0].id };
                    this.sendEmailService.sendEmailOnCreateOrg(
                      {
                        "email": createOrganizationDto.organization_email,
                        "organisation_admin_name": createOrganizationDto.admin_name.split(' ')[0],
                        "fedo_app": "Fedo Vitals",
                        "url": "https://fedo.ai/admin/vital/" + createOrganizationDto.url + "?" + encodeURIComponent(this.encryptPassword(encryption)),
                        "pilot_duration": this.respilot_duration,
                        "application_id": (res[0].application_id)
                      })
                    return res
                  }
                  }))
              }))
        }),
        switchMap(res => res),
        switchMap(async res => {
          for (let index = 0; index < createOrganizationDto.product_id.length; index++) {
            await lastValueFrom(this.organizationProductJunctionDb.save(format_org_product_juction(createOrganizationDto,index,res[0].id)))
          }
          return res
        }),
        switchMap(res => {
          this.create_organization_response = res
          return this.usersService.saveUsersToUserDb({ user_name: createOrganizationDto.admin_name, org_id: Number(res[0].id), designation: createOrganizationDto.designation, email: createOrganizationDto.organization_email, application_id: res[0].application_id, organization_name: createOrganizationDto.organization_name, mobile: createOrganizationDto.organization_mobile , type : 'OrgAdmin'}, {product_id : createOrganizationDto.product_id, is_pilot_duration : createOrganizationDto.is_pilot_duration, attempts : createOrganizationDto.attempts}, Number(res[0].id))
        }),
        switchMap(res => {
          this.userProfileDb.save({ application_id: res.application_id, user_id: res.id, org_id: res.org_id , name : createOrganizationDto.admin_name , mobile : createOrganizationDto.organization_mobile.slice(3,14) , is_editable: true , country_code : '+91'});
          return [this.create_organization_response]
        })
      )
  }

  async createOrganizationAndDirectRegister(createOrganizationDto: CreateOrganizationDto, path: any) {
    Logger.debug(`createOrganizationAndDirectRegister() createOrganizationDto:${JSON.stringify(createOrganizationDto,)} filename:${path}`, APP);

    if (path != null) {
      await this.upload(path);
      createOrganizationDto.logo = this.urlAWSPhoto;
    }
    else delete createOrganizationDto.logo
      return this.fetchOrgByUrlBoth(createOrganizationDto).pipe(
        map(doc => {
          if (doc.length == 0) {
            return this.fetchOrgByCondition(createOrganizationDto).pipe(
              map(doc => { return doc }),
              switchMap(async (doc) => {
                // let aws_password = createOrganizationDto.password;  
                createOrganizationDto.is_register = true;
                this.respilot_duration = Number(createOrganizationDto.pilot_duration[0]);
                createOrganizationDto.application_id = createOrganizationDto.organization_mobile.slice(3, 14);
                // delete createOrganizationDto.password;
                return await lastValueFrom(this.organizationDb.save(format_organisation(createOrganizationDto)).pipe(
                  map(async res => {
                    await lastValueFrom(this.registerUserbyEmail(
                  {
                    "email": createOrganizationDto.organization_email,
                    "username": createOrganizationDto.organization_email,
                    "password": createOrganizationDto.password 
                  }
                ))
                    return res
                  })))
              }))
          }
          else {
            throw new ConflictException(['domain already taken'])
          }
        }),
        switchMap(res => res),
        switchMap(async res => {
          for (let index = 0; index < createOrganizationDto.product_id.length; index++) {
            await lastValueFrom(this.organizationProductJunctionDb.save(format_org_product_juction(createOrganizationDto,index,res[0].id)))
          }
          return res
        }),
        switchMap(res => {
          this.create_organization_response = res
          return this.usersService.saveUsersToUserDb({ user_name: createOrganizationDto.admin_name, org_id: Number(res[0].id), designation: createOrganizationDto.designation, email: createOrganizationDto.organization_email, application_id: res[0].application_id, organization_name: createOrganizationDto.organization_name, mobile: createOrganizationDto.organization_mobile , type : 'OrgAdmin'}, {product_id : createOrganizationDto.product_id, is_pilot_duration : createOrganizationDto.is_pilot_duration, attempts : createOrganizationDto.attempts}, Number(res[0].id))
        }),
        switchMap(res => {
          this.userProfileDb.save({ application_id: res.application_id, user_id: res.id, org_id: res.org_id , name : createOrganizationDto.admin_name , mobile : createOrganizationDto.organization_mobile.slice(3,14) , is_editable: true , country_code : '+91'});
          return [this.create_organization_response]
        })
      )

  }


  async updateOrganizationByFedoAdmin(id: number, updateWholeOrganizationDto: UpdateWholeOrganizationDto, path: any) {
    Logger.debug(`createOrganization() createOrganizationDto:${JSON.stringify(updateWholeOrganizationDto)} filename:{path}`, APP);

    if (path != null) {
      await this.upload(path);
      updateWholeOrganizationDto.logo = this.urlAWSPhoto;
    }
    else delete updateWholeOrganizationDto.logo

    return this.fetchOrganizationByIdDetails(id).pipe(
      map(doc => { return doc }),
      switchMap(async (doc) => {
        updateWholeOrganizationDto.updated_date = new Date();
        await lastValueFrom(this.organizationDb.findByIdandUpdate({ id: String(id), quries: format_organisation_update(updateWholeOrganizationDto,doc[0]) }))
        return doc
      }),
      switchMap(async res => {
        for (let index = 0; index < updateWholeOrganizationDto.product_id.length; index++) {
          await lastValueFrom(this.organizationProductJunctionDb.find({ id: updateWholeOrganizationDto.product_junction_id[index] }).pipe(
            map(async doc => {
              if (doc.length != 0) {
                if(JSON.parse(updateWholeOrganizationDto.is_change[index]) == true){
                await lastValueFrom(this.organizationProductJunctionDb.findByIdandUpdate({ id: updateWholeOrganizationDto.product_junction_id[index], quries: format_org_product_juction(updateWholeOrganizationDto,index,id)}))
                await lastValueFrom(this.userProductJunctionService.fetchByOrgIdAndProductIdAndUpdate(id, updateWholeOrganizationDto.product_id[index], updateWholeOrganizationDto.attempts[index], updateWholeOrganizationDto.is_pilot_duration[index]))
            }
            else{
              await lastValueFrom(this.organizationProductJunctionDb.findByIdandUpdate({ id: updateWholeOrganizationDto.product_junction_id[index], quries: format_org_product_juction_update(updateWholeOrganizationDto,index,id)}))
                await lastValueFrom(this.userProductJunctionService.fetchByOrgIdAndProductIdAndUpdateWithNoAttempts(id, updateWholeOrganizationDto.product_id[index], updateWholeOrganizationDto.is_pilot_duration[index]))
            }
          }
              else {
                await lastValueFrom(this.organizationProductJunctionDb.save(format_org_product_juction(updateWholeOrganizationDto,index,id)));
                await lastValueFrom(this.usersService.updateOrgUserByApplicationId(res[0].application_id,Number(updateWholeOrganizationDto.product_id[index]), updateWholeOrganizationDto.attempts[index],updateWholeOrganizationDto.is_pilot_duration[index]));
              }
            })
          )
          )
        }
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

  //this function can be used for the paginator function that we are using in the list of datas in the admin panel 
  Paginator(items: any, page: any, per_page: any) {

    var page = page || 1,
      per_page = per_page || 10,
      offset = (page - 1) * per_page,

      paginatedItems = items.slice(offset).slice(0, per_page),
      total_pages = Math.ceil(items.length / per_page);
    return {
      page: page,
      per_page: per_page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: (total_pages > page) ? page + 1 : null,
      total: items.length,
      total_pages: total_pages,
      data: paginatedItems
    };
  }


  patchImageToOrganization(id: number, path: any) {
    Logger.debug(`patchImageToOrganization() id:${id} filename:}`, APP);
    if (path != null) {

      return this.fetchOrganizationByIdDetails(id).pipe(
        map(async doc => { await this.upload(path); this.organizationDb.findByIdandUpdate({ id: id.toString(), quries: { logo: this.urlAWSPhoto } }) })
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

  fetchOrgCount(queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchOrgCount() `, APP);

    if(Boolean(queryParamsDto.is_web) == true){
      return this.organizationDb.find({ is_web: queryParamsDto.is_web , is_read: false }).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(async doc => {
          if (doc.length == 0) throw new NotFoundException('No Data available')
          else return { "total_organizations_count": doc.length } 
        }),)
    }
    else{
    return this.organizationDb.fetchAll().pipe(
      map(doc => { return { "total_organizations_count": doc.length } }),
      catchError(err => { throw new UnprocessableEntityException(err.message) })
    )}
  }

  fetchAllOrganization(queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchAllOrganization() queryParamsDto: ${JSON.stringify(queryParamsDto)}`, APP);

    if (queryParamsDto.type) {
      return this.organizationDb.fetchLatestFive().pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(doc => this.fetchotherDetails(doc,queryParamsDto)),
        switchMap(doc => this.updateStatus(doc))
      );
    }
    if (queryParamsDto.url) {
      return this.organizationDb.find({ url: queryParamsDto.url }).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(doc => {
          if (doc.length == 0) {
            return doc
          }
          else {
            throw new ConflictException(["domain already taken"])
          }
        })
      )

    }
    else {
      if(Boolean(queryParamsDto.is_deleted) === true){
      return this.organizationDb.find({ is_deleted: queryParamsDto.is_deleted }).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(async doc => {
          if (doc.length == 0) throw new NotFoundException('No Data available')
          else {  return await this.fetchotherDetails(doc,queryParamsDto) }
        }),
        switchMap(doc => this.updateStatus(doc))
      );
      }
      else if(Boolean(queryParamsDto.is_web) === true){
        return this.organizationDb.find({ is_web: queryParamsDto.is_web, is_read: queryParamsDto.is_read }).pipe(
          catchError(err => { throw new UnprocessableEntityException(err.message) }),
          map(async doc => {
            if (doc.length == 0) throw new NotFoundException('No Data available')
            else {  return await this.fetchotherDetails(doc,queryParamsDto) }
          }),
          // switchMap(doc => this.updateStatus(doc))
        );
        }
        else if(queryParamsDto.name !=  null){
          return this.organizationDb.findByAlphabet({ name : queryParamsDto.name }).pipe(
            catchError(err => { throw new UnprocessableEntityException(err.message) }),
            map(async doc => {
              if (doc.length == 0) return new NotFoundException('No Data available')
              else {  return await this.fetchotherDetails(doc,queryParamsDto) }
            }),
            // switchMap(doc => this.updateStatus(doc))
          );
          }
      else{
        return this.organizationDb.fetchAll().pipe(
          catchError(err => { throw new UnprocessableEntityException(err.message) }),
          map(async doc => {
            if (doc.length == 0) throw new NotFoundException('No Data available')
            else {  return await this.fetchotherDetails(doc,queryParamsDto) }
          }),
          switchMap(doc => this.updateStatus(doc))
        );

      }
    }
  }

  fetchotherDetails(createOrganizationDto: CreateOrganizationDto[],queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchotherDetails() createOrganizationDto: ${JSON.stringify(createOrganizationDto)}`, APP);

    let userProfileData: CreateOrganizationDto[] = [];
    return lastValueFrom(from(createOrganizationDto).pipe(
      concatMap(async orgData => {
        const doc = await lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByOrgId(orgData.id));
        orgData['total_users'] = orgData['total_users'] = new Set(doc.map((item) => item.user_id)).size;
        orgData['total_tests'] = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
        userProfileData.push(orgData);
        return orgData;
      }),
    )).then(_doc => this.fetchotherMoreDetails(userProfileData,queryParamsDto))
  }

  fetchotherMoreDetails(createOrganizationDto: CreateOrganizationDto[], queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchotherMoreDetails() createOrganizationDto: ${JSON.stringify(createOrganizationDto)}`, APP);

    let orgData: CreateOrganizationDto[] = [];
    return lastValueFrom(from(createOrganizationDto).pipe(
      concatMap(async orgJunData => {
        const doc = await lastValueFrom(this.orgProductJunctionService.fetchOrgProductJunctionDataByOrgId(orgJunData.id));
        let result: Array<object> = [];
        let res = new Promise<void>(async (resolve, rejects) => {
          (doc).forEach(async (object, index) => {
            await lastValueFrom(this.productService.fetchProductById(object.product_id)).then(
              productDoc => {
                result.push(object);
                result[index]['progress'] = this.fetchDate(object);
                result[index]['product_detail'] = productDoc;
              }
            ).catch(err => { throw new UnprocessableEntityException(err.message); });
            if (result.length == doc.length) {
              orgJunData['product'] = result;
              orgData.push(orgJunData);
              orgData.sort((a: { id?: number; },b: { id?: number; })=> b.id-a.id);

              resolve();
              return orgJunData;
            }
          });
        });
        const item = await res;
        return item;
      }),
    )).then(_doc => this.Paginator(orgData,queryParamsDto.page,queryParamsDto.per_page))
  }

  

  fetchProductDetails(createOrganizationDto: CreateOrganizationDto[]) {
    Logger.debug(`fetchProductDetails() createOrganizationDto: ${JSON.stringify(createOrganizationDto)}`, APP);

    let orgData: CreateOrganizationDto[] = [];
    return lastValueFrom(from(createOrganizationDto).pipe(
      concatMap(async orgJunData => {
        let doc = await lastValueFrom(this.orgProductJunctionService.fetchOrgProductJunctionDataByOrgId(orgJunData.id))
        let result: Array<object> = [];
        let res = new Promise<void>(async (resolve, rejects) => {
          (doc).forEach(async (object, index) => {
            await lastValueFrom(this.productService.fetchProductById(object.product_id)).then(
              productDoc => {
                result.push(object);
                result[index]['progress'] = this.fetchDate(object);
                result[index]['url'] = productDoc
              }
            ).catch(err => { throw new UnprocessableEntityException(err.message) });
            if (result.length == (await doc).length) {
              orgJunData['product'] = result
              orgData.push(orgJunData);
              resolve()
              return orgJunData
            }
          });
        })
        return res.then((item) => { return item })
      }),
    )).then(_doc => orgData)
      .catch(err => { throw new UnprocessableEntityException(err.message) })
  }

  fetchDate(createOrgProductJunctionDto: CreateOrgProductJunctionDto) {
    Logger.debug(`fetchDate() createOrgProductJunctionDto: ${JSON.stringify(createOrgProductJunctionDto)}`, APP);

    let countDownDate = new Date(createOrgProductJunctionDto.end_date).getTime();
    let startDate = new Date(createOrgProductJunctionDto.start_date).getTime();
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


  // fetchUserProfileDataByOrgId(org_id:number){
  //   return this.userProfileDb.find({org_id:org_id}).pipe(
  //     map(doc=>doc)
  //   )
  // }

  fetchOrgByUrl(url: string) {
    Logger.debug(`fetchOrgByUrl() url:${url}`, APP);

    return this.organizationDb.find({ url: url }).pipe(
      map(doc => {
        if (doc.length == 0) {
          return doc
        }
        else {
          throw new ConflictException(["domain already taken"])
        }
      })
    )
  }

  fetchOrgByUrlBoth(createOrganizationDto:CreateOrganizationDto) {
    Logger.debug(`fetchOrgByUrlBoth() url:${createOrganizationDto.url}`, APP);
    console.log("in",createOrganizationDto.web_url)

    return this.organizationDb.find({ url: createOrganizationDto.url }).pipe(
      switchMap(doc => {
        console.log(doc);
        if (doc.length == 0){
          
          
         
        if((createOrganizationDto.web_url?.length == undefined)|| (createOrganizationDto.web_url == null)) {
          console.log("in")
           return [doc]
        }else
          { 
            console.log("rsdzfxcersdX")
            return lastValueFrom(this.organizationProductJunctionDb.find({ web_url:createOrganizationDto.web_url }).pipe(
              map(doc => { if (doc.length == 0) {console.log("in web ",doc);return []}
              else { console.log("doc web");throw new ConflictException(doc)}})
              ))}}
              else {throw new ConflictException(["domain already taken"])}
          })
        
    )
  }

  fetchOrgByUrlFromJunction(weburl: string) {
    Logger.debug(`fetchOrgByUrl() url:${weburl}`, APP);

    return this.organizationProductJunctionDb.find({ web_url: weburl }).pipe(
      map(doc => doc),
      switchMap(doc => {
        console.log("doc", doc)
        if (doc.length == 0) {
          throw new NotFoundException(["domain not found"])
        }
        else {
          return doc
        }
      }),
      switchMap(doc => {
        return this.fetchOrganizationByIdDetails(Number(doc.org_id)).pipe(switchMap(doc => {
          console.log("sdfcsdfc", doc); return doc
        }))
      })
    )
  }


  // 
  fetchOrganizationById(id: number) {
    Logger.debug(`fetchOrganizationById() id:${id} `, APP);

    return this.organizationDb.find({ id: id }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('organization not found')
        }
        else {
          return this.fetchProductDetails(doc)
        }
      }),
      switchMap(doc => this.updateStatus(doc))


    )
  }


  updateStatus(data: any) {
    return this.organizationDb.updateColumnByCondition().pipe(
      map(doc => { return { "status": "updated" } }),
      map(doc => data))
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
    return this.organizationDb.find({ organization_name: orgDTO.organization_name, organization_email: orgDTO.organization_email, organization_mobile: orgDTO.organization_mobile }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException(["This email, name, mobile is already in use. Please try with a different email, name and mobile number"])
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
          throw new ConflictException(["This email, name is already in use. Please try with a different email and email "])
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
          throw new ConflictException(["This email, mobile is already in use. Please try with a different email and mobile number"])
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
          throw new ConflictException(["This name, mobile is already in use. Please try with a different name and mobile number "])
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
          throw new ConflictException([`This name is already in use. Please try with a different name`])
        }
        else { return doc }
      }),
    )
  }

  // fetchOrganizationDetailsByUrl(url: string) {
  //   Logger.debug(`fetchOrganizationDetailsByUrl() orgDTO:${JSON.stringify(url)} `, APP);
  //   return this.organizationDb.find({ url: 'http://www.fedo.ai/admin/vital/'+url }).pipe(
  //     switchMap(doc => {
  //       console.log("res",doc);

  //       if (doc.length == 0) {
  //         throw new NotFoundException(`organization not found`)
  //       }
  //       else { return doc }
  //     })
  //   )
  // }

  fetchOrgByEmail(orgDTO: OrgDTO) {
    Logger.debug(`fetchOrgByEmailAndMobile() orgDTO:${JSON.stringify(orgDTO)} `, APP);
    return this.organizationDb.find({ organization_email: orgDTO.organization_email }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException(["This email is already in use. Please try with a different email"])
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
          throw new ConflictException(["This mobile number is already in use. Please try with a different mobile number."])
        }
        else { return doc }
      })
    )
  }


  // fetchFiveLatestOrganization() {
  //   Logger.debug(`fetchFiveLatestOrganization()`, APP);

  //   return this.organizationDb.fetchLatestFive().pipe(
  //     catchError(err => {
  //       throw new UnprocessableEntityException(err.message)
  //     }),
  //     map(doc => this.fetchotherDetails(doc,queryParamsDto))
  //   );

  // }

  findAllProductsMappedWithOrganization(id: any) {
    Logger.debug(`findAllProductsMappedWithOrganization() `, APP);

    return this.fetchOrganizationByIdDetails(id).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      switchMap(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('No Organization Found')
        }
        else {
          return this.orgProductJunctionService.fetchOrgProductJunctionDataByOrgId(id)
        }
      }),
    );
  }




  fetchOrganizationByIdDetails(id: number) {
    Logger.debug(`fetchOrganizationByIdDetails() id:${id} `, APP);

    return this.fetchOrganizationDetailsById(id).pipe(
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



  updateOrganization(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    Logger.debug(`updateOrganization() id:${id} updateOrganizationDto: ${JSON.stringify(updateOrganizationDto)} `, APP);

    return this.organizationDb.find({ id: id }).pipe(
      map(res => {
        if (res.length == 0) throw new NotFoundException('organization not found')
        else{ lastValueFrom(this.usersService.patchUserByApplicationId(res[0].application_id,updateOrganizationDto))
           lastValueFrom(this.organizationDb.findByIdandUpdate({ id: id.toString(), quries: updateOrganizationDto }))
           lastValueFrom(this.userProfileDb.findandUpdate({ columnName : 'application_id', columnvalue : res[0].application_id , quries: {name : updateOrganizationDto.admin_name? updateOrganizationDto.admin_name : res[0].admin_name , mobile : updateOrganizationDto.organization_mobile? updateOrganizationDto.organization_mobile.slice(3,14) : res[0].organization_mobile.slice(3,14) } }))
        }
      
      }))
  };

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

  fetchOrganizationDetailsById(id: number) {
    Logger.debug(`fetchOrganizationDetailsById() id:${id}} `, APP);

    return this.organizationDb.find({ id: id }).pipe(
      map(doc => doc)
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

  encryptPassword(password) {
    const NodeRSA = require('node-rsa');

    let key_public = new NodeRSA(PUBLIC_KEY)
    var encryptedString = key_public.encrypt(password, 'base64')
    return encryptedString

  }

  async fetchOrgDetailsByExpiryDateForDays(params: ZQueryParamsDto){
    Logger.debug(`fetchOrgDetailsByExpiryDateForDays() params:${params}} `, APP);

    let dateParams=['1','3','7']
    for(let i=0 ;i<=dateParams.length-1 ; i++){
    var date= (d => new Date(d.setDate(d.getDate()+Number(dateParams[i]))).toISOString().split("T")[0])(new Date());
    this.params.date=date
    await lastValueFrom(this.orgProductJunctionService.fetchOrgDetailsByExpiryDateForDays(this.params).pipe(
      map(res=>{
      res.forEach(doc1=>{
        return this.fetchOrganizationDetailsById(doc1.org_id).subscribe({
          next: async doc=>{
           return await this.sendEmailService.sendFinalEmailWhenDaysLeftToPilotExpire({
            product_name : Number(doc1.product_id) === 1 ? 'HSA' : (Number(doc1.product_id) === 2 ? 'Vitals':'RUW'),
            email:doc[0].organization_email,
            organisation_name : doc[0].organization_name,
            organisation_admin_name : doc[0].admin_name.split(' ')[0],
            expired_date : (Number(dateParams[i])).toString()
          })          
        }
      })})
      })))
    }
    }

    async fetchOrgDetailsByExpiryDateOrgExpired(params: ZQueryParamsDto){
      Logger.debug(`fetchOrgDetailsByExpiryDateOrgExpired() params:${params}} `, APP);
  
      var date= (d => new Date(d.setDate(d.getDate())).toISOString().split("T")[0])(new Date());
      this.params.date=date
      await lastValueFrom(this.orgProductJunctionService.fetchOrgDetailsByExpiryDateForDays(this.params).pipe(
        map(res=>{
        res.forEach(doc1=>{
          return this.fetchOrganizationDetailsById(doc1.org_id).subscribe({
            next: async doc=>{
            return await this.sendEmailService.sendFinalEmailOncePilotIsExpired({
              product_name : Number(doc1.product_id) === 1 ? 'HSA' : (Number(doc1.product_id) === 2 ? 'Vitals':'RUW'),
              email:doc[0].organization_email,
              organisation_name : doc[0].organization_name,
              organisation_admin_name : doc[0].admin_name.split(' ')[0],
              expired_date : (d => new Date(d.setDate(d.getDate()-1)).toISOString().split("T")[0])(new Date())
            })            
          }})})
        })))
      }

      deleteLastOrgRow(){
      Logger.debug(`deleteLastOrgRow()} `, APP);

      return this.organizationDb.deleteLastRow().pipe(map(doc => doc),
      catchError(err => {throw new BadRequestException(err.message)}))
      
    }

    private createQueryString(params: Record<string, any>): string {
      return Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
    }

    generateEncryptedUrlForCanara(EncryptUrlDTO : EncryptUrlDTO){
      Logger.debug(`generateEncryptedUrl,APP`,APP);

      EncryptUrlDTO.orgId = '88';
      EncryptUrlDTO.userId = '689';
      EncryptUrlDTO.tenantId = '88';
        const str = this.createQueryString(EncryptUrlDTO);
        const url = 'https://fedo.ai/products/vitals/webapp/vitals?' + str;
        return url;
    }

    generateEncryptedUrlForPurpleGrid(EncryptUrlDTO : EncryptUrlDTO){
      Logger.debug(`generateEncryptedUrlForPurpleGrid,APP`,APP);

      EncryptUrlDTO.orgId = '107';
      EncryptUrlDTO.userId = '643';
      EncryptUrlDTO.tenantId = '89';
        const str = this.createQueryString(EncryptUrlDTO);
        const url = 'https://fedo.ai/products/vitals/webapp/vitals?' + str;
        return url;
    }

    generateEncryptedUrlForHealthIndia(EncryptUrlDTO : EncryptUrlDTO){
      Logger.debug(`generateEncryptedUrlForHealthIndia,APP`,APP);

      EncryptUrlDTO.orgId = '19';
      EncryptUrlDTO.userId = '702';
      EncryptUrlDTO.tenantId = '124';
      if(EncryptUrlDTO.time_stamp == true){

       EncryptUrlDTO.expiryDateTime = new Date().getTime().toString();
       delete EncryptUrlDTO.time_stamp;
      }
      else{

       delete EncryptUrlDTO.time_stamp;
       delete EncryptUrlDTO.expiryDateTime;
      }
      // This to do in a dynamic way, we can call by tpa_name rather than calling as org_name and that will work
      // return this.organizationDb.findByAlphabet(EncryptUrlQueryDTO).pipe(map(doc => {
      //   console.log("doc",doc);
      //   EncryptUrlDTO.orgId = doc[0].id.toString();
      // })),
      // map(_res  => {
      //   return this.usersService.fetchUserByOrgId(_res[0].id);

      // }),
      // map(_doc =>{
      //   console.log("doc",_doc)
      // })
        const str = this.createQueryString(EncryptUrlDTO);
        console.log("the str",str)
        const url = 'https://fedo.ai/products/vitals/webapp/vitals?'+ str;
        return url;
    }

    async uploadVideoTOPresignedUrl(file : any, policy_number : any){
      Logger.debug(`uploadVideoTOPresignedUrl`,APP);

      const presignedUrl = await this.generatePresignedUrl(file.originalname,file.mimetype);
      await this.uploadToPresignedUrl(presignedUrl,file.buffer);
      const questionMarkIndex = presignedUrl.indexOf('?');
      const filteredUrl = presignedUrl.slice(0, questionMarkIndex);
      return this.productTestDB.findandUpdate({ columnName: 'policy_number', columnvalue: policy_number, quries: {video_location : filteredUrl} });
    }

  async generatePresignedUrl(key: string, contentType: string): Promise<string> {
    
    const s3 = this.getS3();
    const params = {
      Bucket: 'fedo-vitals',
      Key: key,
      ContentType: contentType,
      Expires: 3600,
    };
    return s3.getSignedUrlPromise('putObject', params);
  }


  async uploadToPresignedUrl(url: string, file: Buffer): Promise<void> {
    console.log("firstrt");
    await axios.put(url, file, { maxRedirects: 0 });
  }

    async uploadPDFTOPresignedUrl(content : sendEmailOnCreationOfOrgAndUser){
      Logger.debug(`uploadPDFTOPresignedUrl`,APP);

      let options = {
        format: 'A4',
        margin: {
            top: '2cm',
            right: '2cm',
            bottom: '2cm',
            left: '2cm'
        },
        displayHeaderFooter: true,
        footerTemplate: `
      <div style="font-size: 12px; text-align: center; {{#isLastPage}}position: absolute; bottom: 0; width: 100%;{{/isLastPage}}">
        Powered by Fedo.Ai
    </div>
    `};
    var currentdate = new Date();
    
    var scanDate =
        currentdate.getFullYear().toString()
        + (currentdate.getMonth() + 1).toString() +
        currentdate.getDate().toString() + '-' +
        currentdate.getHours().toString() +
        currentdate.getMinutes().toString() +
        currentdate.getSeconds().toString();
    var name = content.policy_number + '-' + scanDate + '.pdf'
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    const ses = new AWS.SES({ apiVersion: '2010-12-01' });
    var scan_data = (new Function("return [" + content.content + "];")());
    var fedoscore_data = (new Function("return [" + content.fedoscore_content + "];")());
    var riskclassification_data = (new Function("return [" + content.riskclassification_content + "];")());
    var diseaserisk_data = (new Function("return [" + content.diseaserisk_content + "];")());
    var questionnaire_data = (new Function("return [" + content.is_questioannire + "];")());
    let bodyhtml = `<html lang="en"> 
    <head> <link href="https://fonts.googleapis.com/css?family=Calibri:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
    <body style="font-family:'Calibri',sans-serif;">
       <div style="display: grid;">
       <div style="display:block"><img style="height: 1rem; width : 3rem" src="https://fedo-vitals.s3.ap-south-1.amazonaws.com/MicrosoftTeams-image.png">`
    if (content.logo != null) {
        bodyhtml += `<img style="    width: 3rem;
       margin-left: 1rem;" src="${content.logo}">`
    }
    bodyhtml += `</div>
       <p style="font-size:28px">Health Report of <b>${content.policy_number}</b><br><span style="font-size:14px"><b>Date: </b>${datetime} <br><hr style="width : 100%" /><br></p>
       </div>
       </body> 
       </html>`
    if (content.fedoscore_content != null) {
        for (let i = 0; i < fedoscore_data.length; i++) {
            bodyhtml += `<p style="font-family:'Calibri',sans-serif; font-size:20px;margin-top:1.5rem">` + `<b>Fedo Score</b> <br><b><span style="font-size:26px">` + fedoscore_data[i]?.fedo_score + `</span><br><span style="font-size:12px">What does this score mean?</b></span><br><span style="font-size:12px">` + fedoscore_data[i]?.condition + `</span></p>`;
        }
    }
    if (content.riskclassification_content != null) {
        for (let i = 0; i < riskclassification_data.length; i++) {
            bodyhtml += `<p style="font-family:'Calibri',sans-serif;font-size:14px;margin-top:3rem">` + `<b>Risk Category</b> <br> <span style="font-size:12px">` + riskclassification_data[i]?.condition + `</span></p>`;
        }
    }
    if (content.diseaserisk_content != null) {
        bodyhtml += `<p style="font-family:'Calibri',sans-serif;margin-bottom : 0;margin-top:3rem; font-size:14px"><b>Diseases Risks Prediction</b></p>`
        for (let i = 0; i < diseaserisk_data.length; i++) {
            bodyhtml += `<ul style="font-family:'Calibri',sans-serif;font-size:12px">`;
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>Diabetes : </b>` + diseaserisk_data[i]?.diabetes; + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>Hypertension : </b>` + diseaserisk_data[i]?.hypertension; + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>Respiratory : </b>` + diseaserisk_data[i]?.respiratory; + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>CHD : </b>` + diseaserisk_data[i]?.chd; + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>CVD : </b>` + diseaserisk_data[i]?.cvd; + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>Kidney : </b>` + diseaserisk_data[i]?.kidney; + '</li>';
            bodyhtml += '</ul>';
        }
    }
    if (content.content != null) {
        bodyhtml += `<p style="font-family:'Calibri',sans-serif;margin-bottom : 0;margin-top:3rem;font-size:14px"><b>Vital Parameters</b></p>`
        for (let i = 0; i < scan_data.length; i++) {
            bodyhtml += `<ul style="font-family:'Calibri',sans-serif; font-size:12px">`;
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>Heart Rates : </b>` + scan_data[i]?.heart_rate + ` [Ref: 60 - 90 bpm]` + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>Blood Pressure : </b>` + scan_data[i]?.bp + ' [Ref: systolic: 120 - 139 mm Hg diastolic: 80 - 89 mm Hg]' + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>BMI : </b>` + scan_data[i]?.bmi + ' [Ref: 18.5 - 24.9 bpm]' + '</li>';
            if (scan_data[i].smoking != null) {
                bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>Smoker (Beta) : </b>` + scan_data[i]?.smoking; + '</li>';
            }
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>Stress (SNS) : </b>` + scan_data[i]?.stress; + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>SPO2 : </b>` + scan_data[i]?.blood_oxygen + ' [Ref: 95 - 99 % bpm]' + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>HRV-SDNN : </b>` + scan_data[i]?.hrv + ' [Ref: greater than 100]' + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>Respiration Rate : </b>` + scan_data[i]?.respiration + ' [Ref:  12 to 18 breaths per minute]' + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>Random Blood Sugar (Beta) : </b>` + scan_data[i]?.rbs + ' [Ref: 100 - 170 mg/dL]' + '</li>';
            bodyhtml += `<li style="font-family:'Calibri',sans-serif;"><b>Haemoglobin (Beta) : </b>` + scan_data[i]?.hb + ' [Ref: 14 to 18 g/dl (Male) 12 to 16 g/dl (Female)]' + '</li>';
            bodyhtml += '</ul>';
        }
    }
    if (content.is_questioannire != null) {
        bodyhtml += `<p style="font-family:'Calibri',sans-serif;margin-bottom : 0;margin-top:3rem;font-size:14px"><b>Additional Questionnaire</b></p>`
        for (let i = 0; i < questionnaire_data.length; i++) {
            bodyhtml += `<p style="font-family:'Calibri',sans-serif; font-size:12px">` + `<b>[Q${i + 1}] ` + questionnaire_data[i]?.question + `</b><br><span style="font-size:12px">[Ans] ` + questionnaire_data[i]?.answer + `</span></p>`;
        }
    }
    if(content.org_id == "63"){
        bodyhtml += `<ul style="font-family:'Calibri',sans-serif;margin-top:3rem; font-size:14px">Please be advised that for doctor consultations, contact us at the following channels:
        <li style="font-family:'Calibri',sans-serif; font-size:12px">Mobile Number: <b>+918069088088</b></li>
        <li style="font-family:'Calibri',sans-serif; font-size:12px">WhatsApp Number: <b>+916291075616</b></li>
        </ul>`
    }

    bodyhtml += `<p style="font-family:'Calibri',sans-serif;margin-top:3rem; font-size:14px"><b>Disclaimer</b> </p>
            <p style="font-family:'Calibri',sans-serif; font-size:10px">THIS IS NOT A MEDICAL DIAGNOSTIC DEVICE OR A REPLACEMENT FOR MEDICAL DIAGNOSTIC DEVICES.<br><br>
            
            We do not share your personal information with any third parties for commercial use or revenue generation. Personal Information provided by You is used by Us to improve our Products, Platforms and/or Services or for your information purposes only.<br><br>
            
            The data collected and the analysis must only be considered as indicators and/or as early warnings. You must always seek advice of an experienced and qualified doctor or your family doctor or other qualified healthcare provider/practitioner regarding your health and/or medical condition or treatment, before undertaking any new healthcare systems or methods. You must not disregard professional medical advice or delay in seeking medical consultation from qualified health professionals because of any Information received during this process.<br><br>
    
            By accessing or using our products, platforms and/or services, You have authorized Us to collect, store, process, handle and use all such information about you, in accordance with our Privacy Policy and any other terms and conditions of use (as amended from time to time).
            </p>
            <br>
            <hr style="border-top: dotted 1px;width : 25%" />`

    let file = bodyhtml;
    const generated_pdf = await htmlpdf.create(file, options, { handlebars: true });
    const file_data = {
      fieldname: 'file',
      originalname: name,
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: generated_pdf,
      size: generated_pdf.length
    };
    const presignedUrl = await this.generatePresignedUrl(file_data.originalname,file_data.mimetype);
      await this.uploadToPresignedUrl(presignedUrl,file_data.buffer);
      const questionMarkIndex = presignedUrl.indexOf('?');
      const filteredUrl = presignedUrl.slice(0, questionMarkIndex);
    return this.productTestDB.findandUpdate({ columnName: 'policy_number', columnvalue: content.policy_number, quries: {pdf_location : filteredUrl} });
    }

}
