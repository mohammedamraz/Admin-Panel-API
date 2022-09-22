import { HttpService } from '@nestjs/axios';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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
    private http: HttpService,

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
            return this.fetchUsersTestDetails(doc)
          }
        })
      )
    }
    else {
      return this.userDb.find({ org_id: org_id }).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(doc => {
          if (doc.length == 0) { throw new NotFoundException(`user Not available for organization id ${org_id}`) }
          else {
            return this.fetchUsersTestDetails(doc)
          }
        })
      )
    }
  }

  fetchUsersTestDetails(userDTO: UserDTO[]) {
    Logger.debug(`fetchUsersotherDetails() userDTO:${JSON.stringify(userDTO)} `, APP);


    let temp: UserDTO[] = [];
    return lastValueFrom(from(userDTO).pipe(
      concatMap(userData => {
        return lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByUserId(userData.id))
          .then(doc => {

            userData['tests'] = doc
            userData['total_test'] = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
            temp.push(userData);
            return userData
          })
          .catch(err => { throw new UnprocessableEntityException(err.message) })
      }),
    )).then(_doc => temp)
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

  changeUserRegisterStatusOnceConfirmed(id: number) {
    Logger.debug(`changeUserRegisterStatusOnceConfirmed() id:${id} `, APP);

    return this.organizationDb.find({ id: id }).pipe(
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

  fetchTotalTestOfOrgAndMaxTestByUser(org_id: number){
    Logger.debug(`fetchTotalTestOfOrgAndMaxTestByUser() org_id: ${org_id}`, APP);

    return this.userProductJunctionService.fetchUserProductJunctionDataByOrgId(org_id).pipe(
      map(userProductDoc=>{
        console.log("USERPRODUCTDOC",userProductDoc)
        const total_tests_of_org = userProductDoc.reduce((pre, acc) => pre + acc['total_tests'], 0);
        //  for (let i=0; i<userProductDoc.length; i++){
           
        //  }
        
        return {"total_tests_of_org": total_tests_of_org}
      }),
      switchMap(total_tests_of_org=>{
       return this.userDb.find({org_id: org_id }).pipe(
          map(userDoc=>this.fetchTestDetails(userDoc,total_tests_of_org))
        ) 
      })
    )
   
  }



  fetchTestDetails(userDTO: UserDTO[], total_tests_of_org) {
    Logger.debug(`fetchTestDetails() userDTO:${JSON.stringify(userDTO)} `, APP);


    let temp: UserDTO[] = [];
    temp.push(total_tests_of_org)
    return lastValueFrom(from(userDTO).pipe(
      concatMap(async userData => {
        try {
          const doc = await lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByUserId(userData.id));
          console.log("userData", userData);
          const total_tests_of_user = doc.reduce((pre, acc) => pre + acc['total_tests'], 0);
          userData['tests_by_user'] = total_tests_of_user;
          total_tests_of_org['user'] = userData;
          
        } catch (err) {
          throw new UnprocessableEntityException(err.message);
        }
      }),
    )).then(_doc => temp)
  }
}
