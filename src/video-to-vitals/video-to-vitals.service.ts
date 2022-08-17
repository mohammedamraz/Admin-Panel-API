import { HttpService } from '@nestjs/axios';
import { ConflictException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { catchError, map, switchMap } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { AddUserDTO, CreateVideoToVitalDto, UpdateImageDTO } from './dto/create-video-to-vital.dto';

const APP = 'VideoToVitalsService'

@Injectable()
export class VideoToVitalsService {

  constructor(
    @DatabaseTable('video_to_vitals')
    private readonly videoToVitalsDb: DatabaseService<CreateVideoToVitalDto>,
    @DatabaseTable('org_users')
    private readonly orgUserDb: DatabaseService<AddUserDTO>,
    private http: HttpService,
  ) {}

  createPilot(createVideoToVitalDto: CreateVideoToVitalDto,path:string) {
    Logger.debug(`createPilot() createVideoToVitalDto:${JSON.stringify(createVideoToVitalDto,)} filename:${path}`, APP);

    return this.fetchPilotByOrgName(createVideoToVitalDto.organization_name).pipe(
      map(doc=>{
        if (doc.length==0){
          createVideoToVitalDto.logo_image = path
          return this.videoToVitalsDb.save(createVideoToVitalDto).pipe(
            map(res=>{return res})
          );
        }
        else{
         throw new ConflictException('pilot alreay exist')
        }
      }),
      switchMap(res=>res)   
    ) 
  }

  addUser(addUserDTO:AddUserDTO){
    Logger.debug(`addUser() addUserDTO:${JSON.stringify(addUserDTO)} `, APP);

   return this.fetchAllUsersByEmailAndMobile(addUserDTO).pipe(
    map(doc=>{
      if (doc.length==0){
        return this.fetchAllUsersByEmail(addUserDTO).pipe(
          map(doc1=>{
            return doc1
          }),
          switchMap(doc1=>{
            if (doc1.length==0){
               return this.fetchAllUsersByMobile(addUserDTO).pipe(
                map(doc2=>{
                  return doc2
                }),
                switchMap(doc2=>{
                  if (doc2.length==0){
                    return this.orgUserDb.save(addUserDTO).pipe(
                      map(res=>{return res})
                    )
                  }
                })
               )
            }
          })
          
        )
      }
    }),
    switchMap(res=>res)
   )
  
  }

  fetchAllUsers(){
    return this.orgUserDb.fetchAll().pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc=>{
        if (doc.length==0){
           throw new NotFoundException('user not found')
        }
        else{
          return doc
        }
      }),
    );
  }

  fetchPilotByOrgName(name:string){
    Logger.debug(`fetchPilotByOrgName() name:${name}`, APP);

    return this.videoToVitalsDb.find({organization_name:name}).pipe(
      map(doc=>doc)
    )
  }

  fetchAllUsersByEmailAndMobile(addUserDTO:AddUserDTO){
    Logger.debug(`fetchAllUsertByEmailAndMobile() addUserDTO:${JSON.stringify(addUserDTO)} `, APP);

    return this.orgUserDb.find({email:addUserDTO.email,mobile:addUserDTO.mobile}).pipe(
      map(doc=>{
        if(doc.length!=0){
          throw new ConflictException("user exist with email id and mobile no.")
        }
        else {return doc}
      })
    )
  }

  fetchAllUsersByEmail(addUserDTO:AddUserDTO){
    Logger.debug(`fetchAllUsertByEmail() addUserDTO:${JSON.stringify(addUserDTO)} `, APP);

    return this.orgUserDb.find({email:addUserDTO.email}).pipe(
      map(doc=>{
        if(doc.length!=0){
          throw new ConflictException("user exist with email id")
        }
        else {return doc}
      })
    )
  }

  fetchAllUsersByMobile(addUserDTO:AddUserDTO){
    Logger.debug(`fetchAllUsertByMobile() addUserDTO:${JSON.stringify(addUserDTO)} `, APP);

    return this.orgUserDb.find({mobile:addUserDTO.mobile}).pipe(
      map(doc=>{
        if(doc.length!=0){
          throw new ConflictException("user exist with mobile number")
        }
        else {return doc}
      })
    )
  }

  fetchAllPilot() {
    Logger.debug(`fetchAllPilot() `, APP);

    return this.videoToVitalsDb.fetchAll().pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc=>{
        if (doc.length==0){
           throw new NotFoundException('pilot not found')
        }
        else{
          return doc
        }
      }),
    );
  }

  fetchOnePilot(id: number) {
    
    return this.videoToVitalsDb.find({id:id}).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc=>{
        if (doc.length==0){
           throw new NotFoundException('pilot not found')
        }
        else{
          return doc
        }
      }),
      
    )
  }


  updateImage(id: string, fileName: string) {
    Logger.debug(`updateImage(), ${fileName},`, APP);
    
    const imageDetails: UpdateImageDTO = {
      logo_image: fileName,
    }
      return this.videoToVitalsDb.find({ id: id }).pipe(
      map(res => {
        if (res.length == 0) throw new NotFoundException('pilot not found')
        return this.videoToVitalsDb.findByIdandUpdate({ id: id, quries: imageDetails })
      }))
  };



  // update(id: number, updateVideoToVitalDto: UpdateVideoToVitalDto) {
  //   return `This action updates a #${id} videoToVital`;
  // }

  deletePilot(id: number) {

    return this.videoToVitalsDb.find({ id: id }).pipe(
      map(doc=>{
        if (doc.length==0){
          throw new NotFoundException('pilot not found')
        }
        else{
          return this.videoToVitalsDb.findByIdAndDelete(String(id)).pipe(
            map(doc=>{return {status: "deleted"}})
          )
        }
      }),
      switchMap(res=>res)

    )

  }
}
