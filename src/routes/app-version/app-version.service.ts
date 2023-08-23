import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { map, catchError } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateAppVersionDTO } from './dto/create-appversion.dto';

const APP = 'AppVersionService';
@Injectable()
export class AppVersionService {

    constructor(
        @DatabaseTable('app_version')
        private readonly app_version_db: DatabaseService<CreateAppVersionDTO>
    ) {

    }

    CreateAppVersion(CreateAppVersionDTO: CreateAppVersionDTO) {
        Logger.debug(`CreateAppVersion body : ${CreateAppVersionDTO}`, APP)

        return this.app_version_db.save(CreateAppVersionDTO).pipe(map(doc => doc),
            catchError(err => { throw new BadRequestException(err.message) }))
    }

    GetAllAppVersion() {
        Logger.debug(`GetAllAppVersion`, APP)

        return this.app_version_db.fetchAll().pipe(map(doc => doc),
            catchError(err => { throw new BadRequestException(err.message) }))
    }

    GetAppVersionById(id: number) {
        Logger.debug(`GetAppVersionById id : ${id}`, APP)

        return this.app_version_db.find({ id: id }).pipe(map(doc => doc),
            catchError(err => { throw new BadRequestException(err.message) }))
    }

}
