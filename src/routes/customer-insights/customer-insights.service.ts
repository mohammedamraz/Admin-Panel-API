import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateCustomerInsightDTO, QueryParamsDto } from './dto/create-customer-insight.dto';
import { catchError, lastValueFrom, map, pipe } from 'rxjs';
import { UpdateCustomerInsightsDTO } from './dto/update-customer-insight.dto';

const APP = 'CustomerInsightsService';
@Injectable()
export class CustomerInsightsService {
    constructor(
        @DatabaseTable('customer_insights')
        private readonly insights_db: DatabaseService<CreateCustomerInsightDTO>
    ) {

    }

    CreateCustomerInsight(customer_id: any, CreateCustomerInsightDTO: CreateCustomerInsightDTO) {
        Logger.debug(`CreateCustomerInsight id: ${customer_id}`, APP)

        CreateCustomerInsightDTO.created_time = new Date().toLocaleTimeString();
        return this.FetchCustomerInsightById(customer_id).pipe(map(doc => {
            if (doc.length == 0) {
                CreateCustomerInsightDTO.customer_id = customer_id;
                return lastValueFrom(this.insights_db.save(CreateCustomerInsightDTO)).then(doc => doc)
            }
            else return doc
        }))
    }

    FetchAllCustomerInsight() {
        Logger.debug(`FetchAllCustomerInsight`, APP)

        return this.insights_db.fetchAll().pipe(map(doc => doc),
            catchError(err => { throw new BadRequestException(err.message) }))
    }

    FetchCustomerInsightById(customer_id: any) {
        Logger.debug(`FetchCustomerInsightById id : ${customer_id}`, APP)

        return this.insights_db.find({ customer_id: customer_id }).pipe(map(doc => doc),
            catchError(err => { throw new BadRequestException(err.message) }))
    }

    UpdateCustomerInsight(customer_id: any, QueryParamsDto: QueryParamsDto, UpdateCustomerInsightsDTO: UpdateCustomerInsightsDTO) {
        Logger.debug(`UpdateCustomerInsight id : ${customer_id}`, APP)

        UpdateCustomerInsightsDTO.updated_time = new Date().toLocaleTimeString();
        UpdateCustomerInsightsDTO.updated_date = new Date();
        if (!QueryParamsDto.type) {
            return this.insights_db.findandUpdate({ columnName: 'customer_id', columnvalue: customer_id, quries: UpdateCustomerInsightsDTO })
        }
        else {
            console.log("doc",QueryParamsDto)
            if (QueryParamsDto.type == 'attempts') {
                return this.FetchCustomerInsightById(customer_id).pipe(map(doc => {
                    return this.insights_db.findandUpdate({ columnName: 'customer_id', columnvalue: doc[0].customer_id, quries: { total_attempts: doc[0].total_attempts + 1 } })
                }),
                    catchError(err => { throw new BadRequestException(err.message) }))
            }
            else if (QueryParamsDto.type == 'clicks') {
            console.log("clicks")
            return this.FetchCustomerInsightById(customer_id).pipe(map(doc => {
                    return this.insights_db.findandUpdate({ columnName: 'customer_id', columnvalue: doc[0].customer_id, quries: { total_clicks: doc[0].total_clicks + 1 } })
                }),
                    catchError(err => { throw new BadRequestException(err.message) }))

            }
            else return [];
        }
    }
}
