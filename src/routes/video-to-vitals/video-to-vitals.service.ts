import { ConflictException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { catchError, concatMap, from, lastValueFrom, map, switchMap } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { ProductService } from '../product/product.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
import { CreateOrganizationDto, OrgDTO, UpdateOrganizationDto, UpdateUserDTO, UserDTO, VitalUserDTO } from './dto/create-video-to-vital.dto';

const APP = 'VideoToVitalsService'

@Injectable()
export class VideoToVitalsService {

  constructor(
    @DatabaseTable('organization')
    private readonly organizationDb: DatabaseService<CreateOrganizationDto>,
    @DatabaseTable('users')
    private readonly userDb: DatabaseService<UserDTO>,
    @DatabaseTable('product')
    private readonly productDb: DatabaseService<CreateProductDto>,
    private readonly productService: ProductService,
    private readonly userProductJunctionService: UserProductJunctionService,
  ) { }

  createOrganization(createOrganizationDto: CreateOrganizationDto, path: string) {
    Logger.debug(`createOrganization() createOrganizationDto:${JSON.stringify(createOrganizationDto,)} filename:${path}`, APP);

    return this.fetchOrgByUrl(createOrganizationDto.url).pipe(
      map(doc => {
        if (doc.length == 0) {
          return this.productService.fetchProductByNewName(createOrganizationDto.product_name).pipe(
            map(doc => {
              delete createOrganizationDto.product_name
              return doc[0].id
            }),
            switchMap(async (id) => {
              const tomorrow = new Date();
              const duration = createOrganizationDto.pilot_duration
              createOrganizationDto.product_id = id
              createOrganizationDto.logo = path
              createOrganizationDto.end_date = new Date(tomorrow.setDate(tomorrow.getDate() + Number(duration)));
              createOrganizationDto.status = "Active"
              const application_id  = createOrganizationDto.organization_email
              createOrganizationDto.application_id = application_id.slice(0,application_id.indexOf('@'));
              return this.organizationDb.save(createOrganizationDto).pipe(
                map(res => { return res })
              );
            }),
            switchMap(res => res)
          )
        }
        else {
          throw new ConflictException('domain already taken')
        }
      }),
      switchMap(res => res)
    )
  }

  fetchOrgByUrl(url: string) {
    Logger.debug(`fetchOrgByUrl() name:${OrgDTO}`, APP);

    return this.organizationDb.find({ url: url }).pipe(
      map(doc => doc)
    )
  }

  fetchOrgCount() {
    return this.organizationDb.fetchAll().pipe(
      map(doc => { return { "total_organizations_count": doc.length } })
    )
  }

  fetchAllVitalsPilot() {
    Logger.debug(`fetchAllVitalsPilot()`, APP);

    return this.organizationDb.find({ product_id: 2 }).pipe(
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
    return this.organizationDb.find(orgDTO).pipe(
      map(doc => {
        console.log("length", doc.length)
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
        console.log("length", doc.length)
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
        console.log("length", doc.length)
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
      map(doc => doc

        //   {
        //   console.log("length", doc.length)
        //   if (doc.length != 0) {
        //     throw new ConflictException("organization exist with organization name.")
        //   }
        //   else { return doc }
        // }
      )
    )
  }

  fetchOrgByEmail(orgDTO: OrgDTO) {
    Logger.debug(`fetchOrgByEmailAndMobile() orgDTO:${JSON.stringify(orgDTO)} `, APP);
    return this.organizationDb.find({ organization_email: orgDTO.organization_email }).pipe(
      map(doc => {
        console.log("length", doc.length)
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

    return this.organizationDb.fetchAll().pipe(
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

    return this.organizationDb.find({ id: id }).pipe(
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


  updateOrganization(id: string, updateOrganizationDto: UpdateOrganizationDto, path: string) {
    Logger.debug(`updateImage(), ${path},`, APP);


    if (path) {
      updateOrganizationDto.logo = path
    }
    if (updateOrganizationDto.pilot_duration) {
      const tomorrow = new Date();
      const duration = updateOrganizationDto.pilot_duration
      updateOrganizationDto.end_date = new Date(tomorrow.setDate(tomorrow.getDate() + Number(duration)));
      delete updateOrganizationDto.pilot_duration
    }

    updateOrganizationDto.start_date = new Date(Date.now()),
      delete updateOrganizationDto.pilot_duration

    return this.organizationDb.find({ id: id }).pipe(
      map(res => {
        if (res.length == 0) throw new NotFoundException('organization not found')
        return this.organizationDb.findByIdandUpdate({ id: id, quries: updateOrganizationDto })
      }))
  };

  deleteLogo(id: number) {
    Logger.debug(`deleteLogo(),id:${id},`, APP);

    return this.organizationDb.findByIdandUpdate({ id: id.toString(), quries: { logo: '' } })

  }

  deleteOrganizationByID(id: number) {

    return this.organizationDb.find({ id: id }).pipe(
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

    return this.fetchOrgByName(userDTO.organization_name).pipe(
      map(org_doc => {
        if (org_doc.length == 0) {
          throw new NotFoundException('enterd third party organization name which is not exist')
        }
        else {
          delete userDTO.organization_name
          return org_doc
        }
      }),
      switchMap(org_doc => {
        userDTO.org_id = org_doc[0].id
        return this.productService.fetchProductByNewName(userDTO.product_name).pipe(
          map(product_doc => {
            delete userDTO.product_name
            return product_doc[0].id
          }),
          switchMap(product_id => {
            userDTO.product_id = product_id
            delete userDTO.product_name
            return this.userDb.save(userDTO).pipe(
              map(doc => { return doc })
            )
          }),
          switchMap(doc => {
            this.userProductJunctionService.createUserProductJunction({ user_id: doc[0].id, org_id: userDTO.org_id, product_id: userDTO.product_id,total_tests:1 })
            return doc;
          })

        )
      }),

    )

  }

  fetchUsersCountByOrgId(org_id: number) {
    Logger.debug(`fetchUsersCountByOrgId() org_id:${org_id}} `, APP);

    return this.userDb.find({ org_id: org_id }).pipe(
      map(doc => { return { "total user for a particular organization": doc.length } })
    )
  }

  fetchAllUsersByOrgIdAndProductId(vitalUserDTO:VitalUserDTO) {
    Logger.debug(`fetchAllUsersByOrgIdAndProductId()`, APP);

    return this.userDb.find({org_id:vitalUserDTO.org_id,product_id:2}).pipe(
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
        return lastValueFrom(this.userProductJunctionService.fetchUserProductJunctionDataByUserIdAndProductId(userData.id,userData.product_id))
          .then(doc => {
            userData['total_tests'] = doc[0].total_tests
            console.log("DOC",doc)
            temp.push(userData);
            return userData
          })
          .catch(err=>{throw new UnprocessableEntityException(err.message)} )
      }),
    )).then(_doc => temp)
  }

  fetchFiveLatestUsersByOrgIdAndProductId(vitalUserDTO:VitalUserDTO) {
    Logger.debug(`fetchFiveLatestUsersByOrgIdAndProductId() vitalUserDTO:${JSON.stringify(vitalUserDTO)} `, APP);

    return this.userDb.fetchLatestFiveUserByProductIdOrgId(2,vitalUserDTO.org_id,).pipe(
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


}
