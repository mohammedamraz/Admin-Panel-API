import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateLevelDTO } from './dto/create-level.dto';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { catchError, map } from 'rxjs';

const APP = 'ScanLevelService';
@Injectable()
export class ScanLevelService {
    constructor(
        @DatabaseTable('scan_level')
        private readonly insights_db: DatabaseService<CreateLevelDTO>
    ) {

    }

    CreateScanLevel(CreateLevelDTO: CreateLevelDTO) {
        Logger.debug(`CreateScanLevel body : ${CreateLevelDTO}`, APP)

        return this.insights_db.save(CreateLevelDTO).pipe(map(doc => doc),
            catchError(err => { throw new BadRequestException(err.message) }))
    }

    GetAllScanLevels() {
        Logger.debug(`GetAllScanLevels`, APP)

        return this.insights_db.fetchAll().pipe(map(doc => doc),
            catchError(err => { throw new BadRequestException(err.message) }))
    }

    GetScanLevelById(id: number) {
        Logger.debug(`GetScanLevelById id : ${id}`, APP)

        return this.insights_db.find({ id: id }).pipe(map(doc => doc),
            catchError(err => { throw new BadRequestException(err.message) }))
    }


}
