import { HttpService } from '@nestjs/axios';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { application } from 'express';
// import { ConflictException, Injectable, Logger, NotFoundException, UnprocessableEntityExcepti on } from '@nestjs/common';
import { convertMultiFactorInfoToServerFormat } from 'firebase-admin/lib/auth/user-import-builder';
import { catchError, concatMap, from, lastValueFrom, map, switchMap } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { ProductService } from '../product/product.service';
import { SendEmailService } from '../send-email/send-email.service';
import { CreateUserProductJunctionDto } from '../user-product-junction/dto/create-user-product-junction.dto';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { CreateOrganizationDto, UserDTO, UserParamDto, UserProfileDTO } from './dto/create-video-to-vital.dto';
import { OrganizationService } from './organization.service';

const APP = "UsersService"
@Injectable()
export class UsersService {
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
    // private readonly organizationService: OrganizationService,
    // private http: HttpService,

  ) { }

  saveUsersToUserDb(userDto: UserDTO,product_user_list:any,org_id:number) {
    Logger.debug(`saveUsersToUserDb() data:${userDto}} `, APP);

    return this.userDb.save(userDto).pipe(
      // map(doc => { return doc}),
      catchError(err=>{throw new BadRequestException(err.message)}),
      switchMap(doc => { 
        product_user_list.map(res1 =>
          this.userProductJunctionService.createUserProductJunction({ user_id: doc[0].id, org_id: org_id, product_id: Number(res1), total_tests: 0 }))
        return doc;
      })
    )
  }

  fetchAllUsers(org_id: number, userParamDto: UserParamDto) {
    Logger.debug(`fetchAllUsers()`, APP);
    if (userParamDto.type) {
      return this.userDb.fetchLatestFiveUserByOrgId(org_id).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(doc => {
          if (doc.length == 0) { throw new NotFoundException(`user Not available for organization id ${org_id}`) }
          else {
            return this.fetchUsersTestDetails(doc,userParamDto)
          }
        })
      )
    }
    else {
      if(Boolean(userParamDto.is_deleted) === true){
        
      return this.userDb.find({ org_id: org_id , is_deleted :userParamDto.is_deleted }).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(doc => {
          if (doc.length == 0) { throw new NotFoundException(`user Not available for organization id ${org_id}`) }
          else {
            return this.fetchUsersTestDetails(doc,userParamDto)
          }
        })
      )}
      else{        
        return this.userDb.find({ org_id: org_id}).pipe(
          catchError(err => { throw new UnprocessableEntityException(err.message) }),
          map(doc => {
            if (doc.length == 0) { throw new NotFoundException(`user Not available for organization id ${org_id}`) }
            else {
              return this.fetchUsersTestDetails(doc,userParamDto)
            }
          })
        )
      }
    }
  }

  fetchUsersTestDetails(userDTO: UserDTO[],userParamDto: UserParamDto) {
    Logger.debug(`fetchUsersotherDetails() userDTO:${JSON.stringify(userDTO)} `, APP);

    let temp: UserDTO[] = [];
    if (userParamDto.product_id){
      
      return lastValueFrom(from(userDTO).pipe(
        concatMap(userData => {
          
          return lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByUserIdAndProductId(userData.id,userParamDto.product_id))
            .then(doc => {
              
              userData['tests'] = doc
              userData['total_test'] = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
              temp.push(userData);temp = temp.filter(item => item.tests.length != 0)
              temp.sort((a: { id?: number; },b: { id?: number; })=> b.id-a.id);
              return userData
            })
            .catch(err => { throw new UnprocessableEntityException(err.message) })
        }),
      )).then(_doc => this.Paginator(temp, userParamDto.page,userParamDto.per_page))

    }

    else{
    
    return lastValueFrom(from(userDTO).pipe(
      concatMap(userData => {
        return lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByUserId(userData.id))
          .then(doc => {

            userData['tests'] = doc
            userData['total_test'] = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
            temp.push(userData);
            temp.sort((a: { id?: number; },b: { id?: number; })=> b.id-a.id);
            return userData
          })
          .catch(err => { throw new UnprocessableEntityException(err.message) })
      }),
    )).then(_doc => this.Paginator(temp, userParamDto.page,userParamDto.per_page))
    }

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
          throw new ConflictException("This email, mobile is already in use. Please try with a different email and mobile")
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
          throw new ConflictException("This email is already in use. Please try with a different email")
        }
        else { return doc }
      })
    )
  }

  fetchUserById(user_id:any){
    Logger.debug(`fetchUserById() addUserDTO:${JSON.stringify(user_id)} `, APP);

    return this.userDb.find({id:user_id}).pipe(map(doc=>doc))
  }

  fetchAllUsersByMobile(userDTO: UserDTO) {
    Logger.debug(`fetchAllUsertByMobile() addUserDTO:${JSON.stringify(userDTO)} `, APP);

    return this.userDb.find({ mobile: userDTO.mobile }).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException("This mobile is already in use. Please try with a different mobile number")
        }
        else { return doc }
      })
    )
  }

  fetchAllUsersByApplicationId(application_id: string, data:any) {
    Logger.debug(`fetchAllUsersByApplicationId() addUserDTO:${JSON.stringify(application_id)} `, APP);

    return this.userDb.find({ application_id: application_id }).pipe(
      map(doc => {
        
        if (doc.length == 0) {
          return data
        }
        else {data.push(doc[0])
           return data }
      })
    )
  }

  changeUserRegisterStatusOnceConfirmed(id: number) {
    Logger.debug(`changeUserRegisterStatusOnceConfirmed() id:${id} `, APP);

    return this.userDb.find({ id: id }).pipe(
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('user not found')
        }
        else {
          return this.userDb.findByIdandUpdate({ id: id.toString(), quries: { is_register: true } })
        }
      }),

    )
  }

  fetchTotalTestOfOrgAndMaxTestByUser(){
    Logger.debug(`fetchTotalTestOfOrgAndMaxTestByUser() `, APP);

    return this.organizationDb.find({ is_deleted: false }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        if (doc.length == 0) throw new NotFoundException('No Data available')
        else { return this.fetcTestDetails(doc) }
      }),
    );
  }
 
  fetcTestDetails(createOrganizationDto: CreateOrganizationDto[]) {
    Logger.debug(`fetchotherDetails() createOrganizationDto: ${JSON.stringify(createOrganizationDto)}`, APP);

    let mainData= [];
    return lastValueFrom(from(createOrganizationDto).pipe(
      concatMap(async orgData => {
        const doc = await lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByOrgId(orgData.id));
        console.log("doc",doc)
        if (doc.length==0) {
          const org_id = orgData.id
          const org_name =orgData.organization_name
          const total_org_tests = doc.reduce((pre, acc) => pre + acc['total_tests'], 0); 
          mainData.push({org_id, org_name, total_org_tests})
        }
        else{
          var holder = []
          doc.forEach( object => {
            const data = holder.find( doc => doc.user_id=== object.user_id)
            if(!data){
              holder.push({user_id:object.user_id,total_tests:object.total_tests})
            }
            else{
             data.total_tests = (data.total_tests) + (object.total_tests)
            }
          });
          const max_test_by_user= Math.max.apply(Math, holder.map(doc=>doc.total_tests)) 
          if  (max_test_by_user==0){        
           const org_id = orgData.id
           const org_name =orgData.organization_name
           const total_org_tests = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);    
           mainData.push({org_id, org_name, total_org_tests, max_test_by_user})
          }
          else{ 
           const userData = holder.find(doc=>doc.total_tests=== max_test_by_user)
           const userDoc = await lastValueFrom(this.userDb.find({id:userData.user_id}));
        
           const org_id = orgData.id
           const org_name =orgData.organization_name
           const total_org_tests = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
           const user_email = userDoc[0]?.email
           mainData.push({org_id, org_name, total_org_tests, max_test_by_user, user_email})
          }
        
        }
       
      }),
    )).then(_doc => (mainData))
  }

  patchUserByApplicationId(application_id : string, data : any){
    Logger.debug(`fetchTestDetails() userDTO:${JSON.stringify(data)} `, APP);

    return this.userDb.findandUpdate({columnName: 'application_id', columnvalue: application_id, quries:{user_name:data.admin_name+'(OA)',mobile:data.organization_mobile}})
    // switchMap(doc => this.db.findandUpdate({ columnName: 'sales_code', columnvalue: createSalesPartner.refered_by, quries: { sales_invitation_count: doc.length } })));
  }

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
}
