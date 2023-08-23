import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateIndustryTypeDTO } from './dto/create-industrytype.dto';
import { map, catchError } from 'rxjs';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';

const APP = 'IndustryTypeService';
@Injectable()
export class IndustryTypeService {

    constructor(
        @DatabaseTable('industry_type')
        private readonly industry_type_db: DatabaseService<CreateIndustryTypeDTO>
    ) {

    }

    CreateIndustryType(CreateIndustryTypeDTO: CreateIndustryTypeDTO) {
        Logger.debug(`CreateIndustryTyp body : ${CreateIndustryTypeDTO}`, APP)

        return this.industry_type_db.save(CreateIndustryTypeDTO).pipe(map(doc => doc),
            catchError(err => { throw new BadRequestException(err.message) }))
    }

    GetAllIndustryType() {
        Logger.debug(`GetAllIndustryType`, APP)

        return this.industry_type_db.fetchAll().pipe(map(doc => doc),
            catchError(err => { throw new BadRequestException(err.message) }))
    }

    GetIndustryTypeById(id: number) {
        Logger.debug(`GetIndustryTypeById id : ${id}`, APP)

        return this.industry_type_db.find({ id: id }).pipe(map(doc => doc),
            catchError(err => { throw new BadRequestException(err.message) }))
    }

}
