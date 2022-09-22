import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { catchError, map, switchMap } from 'rxjs';
// import { GOOGLE_APPLICATION_CREDENTIALS } from 'src/constants';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateOrganizationDto, UserDTO } from 'src/routes/video-to-vitals/dto/create-video-to-vital.dto';
import { OrganizationService } from 'src/routes/video-to-vitals/organization.service';
import { VideoToVitalsService } from 'src/routes/video-to-vitals/video-to-vitals.service';
import { CreateProfileInfoDTO, ZQueryParamsDto } from './dto/create-video-to-vital.dto';
const APP = "ProfileViewService"
// const check=true
@Injectable()
export class ProfileInfoService {

    constructor(
        @DatabaseTable('user_profile_info')
        private readonly userProfileDb: DatabaseService<CreateProfileInfoDTO>,
        //     @DatabaseTable('users')
        // private readonly userDb: DatabaseService<UserDTO>,
        private readonly videoToVitalsService: VideoToVitalsService,
        private readonly organizationService: OrganizationService,
        // @DatabaseTable('organization')
        // private readonly organizationDb: DatabaseService<CreateOrganizationDto>,
    ) {

    }

    updateProfileInfo(id: number, createProfileInfoDTO: CreateProfileInfoDTO) {
        Logger.debug(`updateUser() updateUserDTO:${JSON.stringify(createProfileInfoDTO)} `, APP);

        return this.userProfileDb.find({ id: id }).pipe(
            switchMap(res => {
                if (res.length == 0) throw new NotFoundException('profile info not found')

                //     return this.userProfileDb.find({ org_id: createProfileInfoDTO.org_id }).pipe(
                //         switchMap(res => {
                //             if (res.length == 0) throw new NotFoundException('profile info not found')
                //             else if (res[0].is_editable == true) return this.userProfileDb.findandUpdate({ columnName: 'org_id', columnvalue: createProfileInfoDTO.org_id.toString(), quries: createProfileInfoDTO })
                //             else throw new BadRequestException('profile info cannot be editable')
                //         }))
                // }


                else if (res[0].is_editable == true) return this.userProfileDb.findandUpdate({ columnName: 'id', columnvalue: id.toString(), quries: createProfileInfoDTO })
                else throw new BadRequestException('profile info cannot be editable')

            }))
    }

    addInfo(createProfileInfoDTO: CreateProfileInfoDTO) {
        Logger.debug(`addInfo() updateUserDTO:${JSON.stringify(createProfileInfoDTO)} `, APP);
        return this.userProfileDb.save(createProfileInfoDTO).pipe(map(doc => {

            if (createProfileInfoDTO.application_id == undefined) {
                throw new ConflictException();

            }

        }), catchError(err => {

            return err

        }));

    }


    createProfileInfo(createProfileInfoDTO: CreateProfileInfoDTO) {
        Logger.debug(`createProfileInfo() updateUserDTO:${JSON.stringify(createProfileInfoDTO)} `, APP);

        return this.videoToVitalsService.fetchUserById(Number(createProfileInfoDTO.user_id)).pipe(
            switchMap(doc => {
                if (doc.length == 0) {
                    return this.organizationService.fetchOrganizationDetailsById(createProfileInfoDTO.org_id).pipe(
                        map(doc => {
                            if (doc.length == 0) throw new NotFoundException('user not found')
                            else return this.userProfileDb.save(createProfileInfoDTO)

                        })
                    )
                }
                else {
                    return this.userProfileDb.save(createProfileInfoDTO)
                }
            }),
        )
    }


    fetchProfileByUserId(user_id: number) {
        Logger.debug(`fetchProfileByUserId()  `, APP);

        return this.userProfileDb.find({ user_id: user_id }).pipe(
            map(doc => {
                if (doc.length == 0) throw new NotFoundException('user not found');
                return doc
            })
        )

    }


    fetchProfileByOrgId(org_id: number) {
        Logger.debug(`fetchProfileByOrgId()  `, APP);

        return this.userProfileDb.find({ org_id: org_id }).pipe(
            map(doc => {
                if (doc.length == 0) throw new NotFoundException('user not found');
                return doc
            })
        )

    }

    updateTotalTestsInProfileInfo(createProfileInfoDTO: CreateProfileInfoDTO) {
        Logger.debug(`updateTotalTestsInProfileInfo() updateUserDTO:${JSON.stringify(createProfileInfoDTO)} `, APP);

        // application_id and product_id is mandatory fields
        return this.userProfileDb.find({ application_id: createProfileInfoDTO.application_id }).pipe(
            switchMap(res => {
                if (res.length == 0) throw new NotFoundException('profile info not found')
                else {
                    this.userProfileDb.findandUpdate({ columnName: 'application_id', columnvalue: createProfileInfoDTO.application_id, quries: { total_tests: Number(res[0].total_tests) + 1 } });
                    return this.videoToVitalsService.updateUserByApplicationId(res[0].user_id, createProfileInfoDTO.product_id)
                }
            }))

    }


    fetchProfileByOrgIdByQueryParams(params: ZQueryParamsDto) {
        Logger.debug(`fetchProfileByOrgId()  `, APP);

        return this.userProfileDb.find({ user_id: params.user_id }).pipe(
            map(doc => doc),
            map(doc => {
                if (doc.length == 0) {
                    return this.userProfileDb.find({ org_id: params.org_id }).pipe(
                        map(doc => doc),
                        // this has to change source source returning 
                        switchMap(doc => {
                            if (doc.length == 0) throw new NotFoundException('user not found');
                            return doc
                        })
                    )
                }
                return doc
            })
        )


    }


    fetchProfileInfoByApplicationId(app_id: string) {
        Logger.debug(`fetchProfileByOrgId()  app_id:${app_id}`, APP);

        return this.userProfileDb.find({ application_id: app_id }).pipe(
            switchMap(doc => {
                if (doc.length == 0) throw new NotFoundException('user with applicatio id not found');
                return doc
            })
        )

    }







}
