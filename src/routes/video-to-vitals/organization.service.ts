import { HttpService } from '@nestjs/axios';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { CreateOrganizationDto, OrgDTO, QueryParamsDto, UpdateOrganizationDto, UpdateWholeOrganizationDto, UserProfileDTO } from './dto/create-video-to-vital.dto';
import { DatabaseService } from 'src/lib/database/database.service';
import { catchError, concatMap, from, lastValueFrom, map, switchMap, throwError } from 'rxjs';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, PUBLIC_KEY } from 'src/constants';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { OrgProductJunctionService } from '../org-product-junction/org-product-junction.service';
import { CreateOrgProductJunctionDto } from '../org-product-junction/dto/create-org-product-junction.dto';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { SendEmailService } from '../send-email/send-email.service';
import { ProductService } from '../product/product.service';

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
    // @DatabaseTable('product')
    private readonly sendEmailService: SendEmailService,
    private readonly productService: ProductService,
    private readonly orgProductJunctionService: OrgProductJunctionService,
    private readonly userProductJunctionService: UserProductJunctionService,
    private http: HttpService,
  ) { }

  bucket: any;
  urlAWSPhoto: any

  respilot_duration: any

  async createOrganization(createOrganizationDto: CreateOrganizationDto, path: any) {
    Logger.debug(`createOrganization() createOrganizationDto:${JSON.stringify(createOrganizationDto,)} filename:${path}`, APP);

    if (path != null) {
      await this.upload(path);
      createOrganizationDto.logo = this.urlAWSPhoto;
    }
    else delete createOrganizationDto.logo
    let productlist = createOrganizationDto.product_id.split(",")
    let productlist_pilotduration = (createOrganizationDto.pilot_duration)?.toString().split(",")
    let productlist_fedoscore = (createOrganizationDto.fedo_score)?.toString().split(",")
    let productlist_webApp = (createOrganizationDto.productaccess_web)?.toString().split(",") || []
    let productlist_webFedoscore = (createOrganizationDto.web_fedoscore)?.toString().split(",") || []
    let productlist_weburl = (createOrganizationDto.web_url)?.toString().split(",") || []
    // productlist_weburl.map(res=>{


    //   return this.fetchOrgByUrlBoth(createOrganizationDto.url,res).pipe(
    
    return this.fetchOrgByUrl(createOrganizationDto.url).pipe(
      map(doc => {
        if (doc.length == 0) {
          return this.fetchOrgByCondition(createOrganizationDto).pipe(
            map(doc => { return doc }),
            switchMap((doc) => {
              this.respilot_duration = Number(productlist_pilotduration[0]);
              createOrganizationDto.application_id = createOrganizationDto.organization_mobile.slice(3, 14);
              delete createOrganizationDto.product_id;
              delete createOrganizationDto.pilot_duration;
              delete createOrganizationDto.fedo_score;
              delete createOrganizationDto.productaccess_mobile;
              delete createOrganizationDto.productaccess_web;
              delete createOrganizationDto.web_fedoscore;
              delete createOrganizationDto.web_url;
              return this.organizationDb.save(createOrganizationDto).pipe(
                map(res => {
                  var encryption = { org_id: res[0].id };
                  this.sendEmailService.sendEmailOnCreateOrg(
                    {
                      "email": createOrganizationDto.organization_email,
                      "organisation_admin_name": createOrganizationDto.admin_name,
                      "fedo_app": "FEDO VITALS",
                      "url": createOrganizationDto.url + "?" + encodeURIComponent(this.encryptPassword(encryption)),
                      "pilot_duration": this.respilot_duration,
                      "application_id": (res[0].application_id)
                    })
                  return res
                }))
            }))
        }
        else {
          throw new ConflictException('domain already taken')
        }
      }),
      switchMap(res => res),
      switchMap(async res => {
        for (let index = 0; index < productlist.length; index++) {
          if ((productlist_webApp[index] == undefined) || (productlist_webApp[index].toString().length < 1)) productlist_webApp.push('false')
          if ((productlist_webFedoscore[index] == undefined) || (productlist_webFedoscore[index].toString().length < 1)) productlist_webFedoscore.push('false')
          if ((productlist_weburl[index] == undefined) || (productlist_weburl[index].toString().length < 1)) productlist_weburl.push('')
          createOrganizationDto.status = "Active"
          const tomorrow = new Date();
          const duration = productlist_pilotduration[index]
          createOrganizationDto.end_date = new Date(tomorrow.setDate(tomorrow.getDate() + Number(duration)));
          await lastValueFrom(this.organizationProductJunctionDb.save({ org_id: res[0].id, end_date: createOrganizationDto.end_date, pilot_duration: productlist_pilotduration[index], status: createOrganizationDto.status, product_id: productlist[index], fedoscore: productlist_fedoscore[index], web_access: productlist_webApp[index], web_fedoscore: productlist_webFedoscore[index], web_url: productlist_weburl[index] }))
        }
        this.userProfileDb.save({ application_id: res[0].application_id, org_id: res[0].id });
        return res
      }))
    // })
  }

  async updateOrganizationByFedoAdmin(id: number, updateWholeOrganizationDto: UpdateWholeOrganizationDto, path: any) {
    Logger.debug(`createOrganization() createOrganizationDto:${JSON.stringify(updateWholeOrganizationDto)} filename:{path}`, APP);

    if (path != null) {
      await this.upload(path);
      updateWholeOrganizationDto.logo = this.urlAWSPhoto;
    }
    else delete updateWholeOrganizationDto.logo
    let productlist = updateWholeOrganizationDto.product_id?.split(",")
    let productlist_junction = updateWholeOrganizationDto.product_junction_id?.split(",")
    let productlist_pilotduration = (updateWholeOrganizationDto.pilot_duration)?.toString().split(",")
    let productlist_fedoscore = (updateWholeOrganizationDto.fedo_score)?.toString().split(",")
    let productlist_webApp = (updateWholeOrganizationDto.productaccess_web)?.toString().split(",") || []
    let productlist_webFedoscore = (updateWholeOrganizationDto.web_fedoscore)?.toString().split(",") || []
    let productlist_weburl = (updateWholeOrganizationDto.web_url)?.toString().split(",") || []
    return this.fetchOrganizationByIdDetails(id).pipe(
      map(doc => { return doc }),
      switchMap((doc) => {
        // updateWholeOrganizationDto.application_id = updateWholeOrganizationDto.organization_mobile?.slice(3, 14);
        delete updateWholeOrganizationDto.product_id;
        delete updateWholeOrganizationDto.pilot_duration;
        delete updateWholeOrganizationDto.fedo_score;
        delete updateWholeOrganizationDto.productaccess_mobile;
        delete updateWholeOrganizationDto.productaccess_web;
        delete updateWholeOrganizationDto.web_fedoscore;
        delete updateWholeOrganizationDto.web_url;  
        delete updateWholeOrganizationDto.product_junction_id;
        updateWholeOrganizationDto.updated_date = new Date();
        return this.organizationDb.findByIdandUpdate({ id: String(id), quries: updateWholeOrganizationDto })
      }),
      switchMap(async res => {
        // for (let index = 0; index < productlist_junction.length; index++) {
        //   if ((productlist_webApp[index] == undefined) || (productlist_webApp[index].toString().length < 1)) productlist_webApp.push('false')
        //   if ((productlist_webFedoscore[index] == undefined) || (productlist_webFedoscore[index].toString().length < 1)) productlist_webFedoscore.push('false')
        //   if ((productlist_weburl[index] == undefined) || (productlist_weburl[index].toString().length < 1)) productlist_weburl.push('')
        //   const tomorrow = new Date();
        //   const duration = productlist_pilotduration[index]
        //   updateWholeOrganizationDto.end_date = new Date(tomorrow.setDate(tomorrow.getDate() + Number(duration)));
        //   await lastValueFrom(this.organizationProductJunctionDb.findByIdandUpdate({ id: productlist_junction[index], quries: { org_id: id, end_date: updateWholeOrganizationDto.end_date, pilot_duration: productlist_pilotduration[index], fedoscore: productlist_fedoscore[index], web_access: productlist_webApp[index], web_fedoscore: productlist_webFedoscore[index], web_url: productlist_weburl[index] } }))
        // }
        for (let index = 0; index < productlist.length; index++) {
          if ((productlist_webApp[index] == undefined) || (productlist_webApp[index].toString().length < 1)) productlist_webApp.push('false')
          if ((productlist_webFedoscore[index] == undefined) || (productlist_webFedoscore[index].toString().length < 1)) productlist_webFedoscore.push('false')
          if ((productlist_weburl[index] == undefined) || (productlist_weburl[index].toString().length < 1)) productlist_weburl.push('')
          const tomorrow = new Date();
          const duration = productlist_pilotduration[index]
          updateWholeOrganizationDto.end_date = new Date(tomorrow.setDate(tomorrow.getDate() + Number(duration)));
          await lastValueFrom(this.organizationProductJunctionDb.find({ id: productlist_junction[index] }).pipe(
            map(async doc => {
              if (doc.length != 0) await lastValueFrom(this.organizationProductJunctionDb.findByIdandUpdate({ id: productlist_junction[index], quries: { org_id: id, end_date: updateWholeOrganizationDto.end_date, pilot_duration: productlist_pilotduration[index], fedoscore: productlist_fedoscore[index], web_access: productlist_webApp[index], web_fedoscore: productlist_webFedoscore[index], web_url: productlist_weburl[index] } }))
              else await lastValueFrom(this.organizationProductJunctionDb.save({ org_id: id, end_date: updateWholeOrganizationDto.end_date, pilot_duration: productlist_pilotduration[index], status: "Active", product_id: productlist[index], fedoscore: productlist_fedoscore[index], web_access: productlist_webApp[index], web_fedoscore: productlist_webFedoscore[index], web_url: productlist_weburl[index] }))
            })
          )
          )
        }
      })
    )
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

  fetchOrgCount() {
    Logger.debug(`fetchOrgCount() `, APP);

    return this.organizationDb.find({ is_deleted: false }).pipe(
      map(doc => { return { "total_organizations_count": doc.length } }),
      catchError(err => { throw new UnprocessableEntityException(err.message) })
    )
  }

  fetchAllOrganization(queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchAllOrganization() queryParamsDto: ${JSON.stringify(queryParamsDto)}`, APP);

    if (queryParamsDto.type) {
      return this.organizationDb.fetchLatestFive().pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(doc => this.fetchotherDetails(doc)),
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
            throw new ConflictException("domain already taken")
          }
        })
      )

    }
    else {
      return this.organizationDb.find({ is_deleted: false }).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(doc => {
          if (doc.length == 0) throw new NotFoundException('No Data available')
          else { return this.fetchotherDetails(doc) }
        }),
        switchMap(doc => this.updateStatus(doc))
      );
    }
  }

  fetchotherDetails(createOrganizationDto: CreateOrganizationDto[]) {
    Logger.debug(`fetchotherDetails() createOrganizationDto: ${JSON.stringify(createOrganizationDto)}`, APP);

    let userProfileData: CreateOrganizationDto[] = [];
    return lastValueFrom(from(createOrganizationDto).pipe(
      concatMap(orgData => {
        return lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByOrgId(orgData.id))

          .then(doc => {
            orgData['total_users'] = doc.length;
            orgData['total_tests'] = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
            userProfileData.push(orgData);
            return orgData
          })
      }),
    )).then(_doc => this.fetchotherMoreDetails(userProfileData))
  }

  fetchotherMoreDetails(createOrganizationDto: CreateOrganizationDto[]) {
    Logger.debug(`fetchotherMoreDetails() createOrganizationDto: ${JSON.stringify(createOrganizationDto)}`, APP);

    let orgData: CreateOrganizationDto[] = [];
    return lastValueFrom(from(createOrganizationDto).pipe(
      concatMap(orgJunData => {
        return lastValueFrom(this.orgProductJunctionService.fetchOrgProductJunctionDataByOrgId(orgJunData.id))
          .then(doc => {
            doc.forEach(object => {
              object['progress'] = this.fetchDate(object);
            });
            orgJunData['product'] = doc
            orgData.push(orgJunData);
            return orgJunData
          })
      }),
    )).then(_doc => orgData)
  }

  fetchProductDetails(createOrganizationDto: CreateOrganizationDto[]) {
    Logger.debug(`fetchotherMoreDetails() createOrganizationDto: ${JSON.stringify(createOrganizationDto)}`, APP);

    let orgData: CreateOrganizationDto[] = [];
    return lastValueFrom(from(createOrganizationDto).pipe(
      concatMap(orgJunData => {
        let doc = lastValueFrom(this.orgProductJunctionService.fetchOrgProductJunctionDataByOrgId(orgJunData.id))


        let result: Array<object> = [];

        let res = new Promise<void>(async (resolve, rejects) => {
          (await doc).forEach(async (object, index) => {
            await lastValueFrom(this.productService.fetchProductById(object.product_id)).then(
              productDoc => {
                result.push(object);
                result[index]['progress'] = this.fetchDate(object);
                result[index]['url'] = productDoc

              }
            );
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
          throw new ConflictException("domain already taken")
        }
      })
    )
  }

  fetchOrgByUrlBoth(url: string,web_url:string) {
    Logger.debug(`fetchOrgByUrl() url:${url}`, APP);

    return this.organizationDb.find({ url: url }).pipe(
      switchMap(doc => {
        if (doc.length == 0) {
          return this.organizationProductJunctionDb.find({ web_url: web_url }).pipe(
            map(doc => {
              console.log("doc",doc);
              
              if (doc.length == 0) {
                return []
              }
              else {
                throw new ConflictException("web domain already taken")
              }
            })
          )
        }
        else {
          throw new ConflictException("domain already taken")
        }
      })
    )
  }

  fetchOrgByUrlFromJunction(weburl: string) {
    Logger.debug(`fetchOrgByUrl() url:${weburl}`, APP);

    return this.organizationProductJunctionDb.find({ web_url: weburl }).pipe(
      map(doc=> doc),
      switchMap(doc => {
        console.log("doc",doc)
        if (doc.length == 0) {
          throw new NotFoundException("domain not found")
        }
        else {
          return doc
        }
      }),
      switchMap(doc=>{ return this.fetchOrganizationByIdDetails(Number(doc.org_id)).pipe(switchMap(doc=>{
        console.log("sdfcsdfc",doc);return doc
      }))})
    )
  }


  // 
  fetchOrganizationById(id: number) {
    Logger.debug(`fetchOrganizationById() id:${id} `, APP);

    return this.organizationDb.find({ id: id, is_deleted: false }).pipe(
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


  fetchFiveLatestOrganization() {
    Logger.debug(`fetchFiveLatestOrganization()`, APP);

    return this.organizationDb.fetchLatestFive().pipe(
      catchError(err => {
        throw new UnprocessableEntityException(err.message)
      }),
      map(doc => this.fetchotherDetails(doc))
    );

  }

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

    return this.organizationDb.find({ id: id, is_deleted: false }).pipe(
      map(res => {
        if (res.length == 0) throw new NotFoundException('organization not found')
        else return this.organizationDb.findByIdandUpdate({ id: id.toString(), quries: updateOrganizationDto })
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


}