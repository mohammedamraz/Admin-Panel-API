import { HttpService } from '@nestjs/axios';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { SendEmailService } from 'src/send-email/send-email.service';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { ProductService } from '../product/product.service';
import { CreateUserProductJunctionDto } from '../user-product-junction/dto/create-user-product-junction.dto';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { CreateOrganizationDto,OrgDTO, UpdateOrganizationDto, UserDTO, UserProfileDTO} from './dto/create-video-to-vital.dto';
import { DatabaseService } from 'src/lib/database/database.service';
import { catchError, concatMap, from, lastValueFrom, map, switchMap, throwError } from 'rxjs';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, PUBLIC_KEY } from 'src/constants';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const APP = 'OrganizationService'
@Injectable()
export class OrganizationService {

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
    private http: HttpService,
  
    ) {
  
    }
    bucket: any;
    urlAWSPhoto: any
  
    respilot:any
    createOrganization(createOrganizationDto: CreateOrganizationDto, path: any) {
      Logger.debug(`createOrganization() createOrganizationDto:${JSON.stringify(createOrganizationDto,)} filename:${path}`, APP);
      let productlist = createOrganizationDto.product_id.split(",")
      let productlist_pilotduration = (createOrganizationDto.pilot_duration).toString().split(",")
      // let productlist_status = (createOrganizationDto.fedo_score).toString().split(",")
      let productlist_fedoscore = (createOrganizationDto.fedo_score).toString().split(",")


      return this.fetchOrgByUrl(createOrganizationDto.url).pipe(
        map(doc => {
          if (doc.length == 0) {
            return this.fetchOrgByCondition(createOrganizationDto).pipe(
              map(doc => {
               return doc
              }),
              switchMap( (doc) => {
            createOrganizationDto.product_id = productlist[0];
            createOrganizationDto.pilot_duration = Number(productlist[0]);
            createOrganizationDto.fedo_score = Boolean(productlist_fedoscore[0])


            createOrganizationDto.logo = path
            
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
          // productlistpilot.map(respilot=>
          //   this.respilot=respilot)
            console.log("respilot",this.respilot);
            
          for (let index = 0; index < productlist.length; index++) {
            const tomorrow = new Date();
            const duration = productlist_pilotduration[index]
            createOrganizationDto.end_date = new Date(tomorrow.setDate(tomorrow.getDate() + Number(duration)));
            await lastValueFrom(this.organizationProductJunctionDb.save({ org_id: res[0].id, end_date: createOrganizationDto.end_date, pilot_duration: productlist_pilotduration[index], status: res[0].status, product_id: productlist[index],fedoscore:productlist_fedoscore[index] }))
            // const element = array[index];
            
          }
          // (res1 =>
          //   // console.log("res",res1,this.respilot)
            
            
              // )
          //   )
            // productlistfedoscore.map(res1 =>
            //   // console.log("res",res1,this.respilot)
              
            //   this.organizationProductJunctionDb.find({ org_id: res[0].id, start_date: createOrganizationDto.start_date, end_date: createOrganizationDto.end_date, pilot_duration: createOrganizationDto.pilot_duration, status: res[0].status, stage: res[0].stage, product_id: res1 })
            //   )
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

    //this function can be used for the paginator function that we are using in the list of datas in the admin panel 
    Paginator(items:any, page:any, per_page:any) {

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
