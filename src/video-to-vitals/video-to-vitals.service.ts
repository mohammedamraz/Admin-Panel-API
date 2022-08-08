import { HttpService } from '@nestjs/axios';
import { BadRequestException, ConflictException, HttpException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { catchError, map, switchMap } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateVideoToVitalDto, UpdateImageDTO } from './dto/create-video-to-vital.dto';
import { UpdateVideoToVitalDto } from './dto/update-video-to-vital.dto';

const APP = 'VideoToVitalsService'

@Injectable()
export class VideoToVitalsService {

  constructor(
    @DatabaseTable('video_to_vitals')
    private readonly videoToVitalsDb: DatabaseService<CreateVideoToVitalDto>,
    private http: HttpService,
  ) {}

  createPilot(createVideoToVitalDto: CreateVideoToVitalDto,filename:string) {
    Logger.debug(`createPilot() createVideoToVitalDto:${JSON.stringify(createVideoToVitalDto,)} filename:${filename}`, APP);

    return this.fetchPilotByOrgName(createVideoToVitalDto.organization_name).pipe(
      map(doc=>{
        if (doc.length==0){
          createVideoToVitalDto.logo_image =filename
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

  fetchPilotByOrgName(name:string){
    Logger.debug(`fetchPilotByOrgName() name:${name}`, APP);

    return this.videoToVitalsDb.find({organization_name:name}).pipe(
      map(doc=>doc)
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
