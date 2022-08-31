import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { catchError, map, switchMap } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateOrganizationDto, UserDTO } from 'src/routes/video-to-vitals/dto/create-video-to-vital.dto';
import { CreateProfileInfoDTO, ZQueryParamsDto } from './dto/create-video-to-vital.dto';
const APP = "ProfileViewService"
@Injectable()
export class ProfileInfoService {

    constructor(
        @DatabaseTable('user_profile_info')
        private readonly userProfileDb: DatabaseService<CreateProfileInfoDTO>,
        @DatabaseTable('users')
    private readonly userDb: DatabaseService<UserDTO>,
    @DatabaseTable('organization')
    private readonly organizationDb: DatabaseService<CreateOrganizationDto>,) { }

    updateProfileInfo(createProfileInfoDTO: CreateProfileInfoDTO) {
        Logger.debug(`updateUser() updateUserDTO:${JSON.stringify(createProfileInfoDTO)} `, APP);

        return this.userProfileDb.find({ user_id: createProfileInfoDTO.user_id }).pipe(
            switchMap(res => {
                if (res.length == 0) {

                    return this.userProfileDb.find({ org_id: createProfileInfoDTO.org_id }).pipe(
                        switchMap(res => {
                            if (res.length == 0) throw new NotFoundException('profile info not found')
                            else if(res[0].is_editable==true) return this.userProfileDb.findandUpdate({ columnName: 'org_id', columnvalue: createProfileInfoDTO.org_id.toString(), quries: createProfileInfoDTO })
                            else throw new BadRequestException('profile info cannot be editable')
                        }))
                }
                else if(res[0].is_editable==true) return this.userProfileDb.findandUpdate({ columnName: 'user_id', columnvalue: createProfileInfoDTO.user_id, quries: createProfileInfoDTO })
                else throw new BadRequestException('profile info cannot be editable')

            }))
    }


    createProfileInfo(createProfileInfoDTO: CreateProfileInfoDTO) {
        Logger.debug(`createProfileInfo() updateUserDTO:${JSON.stringify(createProfileInfoDTO)} `, APP);

        return this.userDb.find({ id: createProfileInfoDTO.user_id }).pipe(
            switchMap(doc => {
              if (doc.length == 0){          
              return this.organizationDb.find({id:createProfileInfoDTO.org_id}).pipe(
                map(doc=>{
                if (doc.length == 0) throw new NotFoundException('user not found')
                else return this.userProfileDb.save(createProfileInfoDTO)
      
                })
              )
            }
              else {               
                return this.userProfileDb.save(createProfileInfoDTO)}
            }),
          )
    }


    fetchProfileByUserId(user_id:number){
        Logger.debug(`fetchProfileByUserId()  `, APP);

        return this.userProfileDb.find({user_id:user_id}).pipe(
            map(doc=>{
                if(doc.length==0)throw new NotFoundException('user not found');
                return doc
            })
        )

    }


    fetchProfileByOrgId(org_id:number){
        Logger.debug(`fetchProfileByOrgId()  `, APP);

        return this.userProfileDb.find({org_id:org_id}).pipe(
            map(doc=>{
                if(doc.length==0)throw new NotFoundException('user not found');
                return doc
            })
        )

    }

    updateTotalTestsInProfileInfo(createProfileInfoDTO: CreateProfileInfoDTO) {
        Logger.debug(`updateTotalTestsInProfileInfo() updateUserDTO:${JSON.stringify(createProfileInfoDTO)} `, APP);

    return this.userProfileDb.find({ application_id: createProfileInfoDTO.application_id }).pipe(
        switchMap(res => {
            if (res.length == 0) throw new NotFoundException('profile info not found')
            else  return this.userProfileDb.findandUpdate({ columnName: 'application_id', columnvalue: createProfileInfoDTO.application_id, quries: {total_tests:Number(res[0].total_tests)+1} })
        }))

    }


    fetchProfileByOrgIdByQueryParams(params : ZQueryParamsDto){
        Logger.debug(`fetchProfileByOrgId()  `, APP);

        return this.userProfileDb.find({user_id:params.user_id}).pipe(
            map(doc=>doc),
            map(doc=>{
                if(doc.length==0){return this.userProfileDb.find({org_id:params.org_id}).pipe(
                    map(doc=>doc),
                    // this has to change source source returning 
                    switchMap(doc=>{
                        if(doc.length==0)throw new NotFoundException('user not found');
                        return doc
                    })
                )}
                return doc
            })
        )
        

    }


    fetchProfileInfoByApplicationId(app_id:string){
        Logger.debug(`fetchProfileByOrgId()  app_id:${app_id}`, APP);

        return this.userProfileDb.find({application_id:app_id}).pipe(
            map(doc=>{
                if(doc.length==0)throw new NotFoundException('user with applicatio id not found');
                return doc
            })
        )

    }







}
