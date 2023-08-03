import { Body, Controller, Get, Logger, Param, Patch, Post, Query } from '@nestjs/common';
import { CustomerInsightsService } from './customer-insights.service';
import { CreateCustomerInsightDTO, QueryParamsDto } from './dto/create-customer-insight.dto';
import { UpdateCustomerInsightsDTO } from './dto/update-customer-insight.dto';

const APP = 'CustomerInsightsController';
@Controller()
export class CustomerInsightsController {
    constructor(
        private readonly CustomerInsightService: CustomerInsightsService
    ) {

    }

    @Post(':customer_id')
    CreateCustomerInsight(@Param('customer_id') customer_id: any, @Body() CreateCustomerInsightDTO: CreateCustomerInsightDTO) {
        Logger.debug(`CreateCustomerInsight customer_id : ${customer_id} body : ${CreateCustomerInsightDTO}`, APP)

        return this.CustomerInsightService.CreateCustomerInsight(customer_id, CreateCustomerInsightDTO);
    }

    @Patch(':customer_id')
    UpdateCustomerInsight(@Param('customer_id') customer_id: any,@Query() QueryParamsDto : QueryParamsDto , @Body() UpdateCustomerInsightsDTO: UpdateCustomerInsightsDTO) {
        Logger.debug(`UpdateCustomerInsight id: ${customer_id} body : ${UpdateCustomerInsightsDTO}`, APP)

        return this.CustomerInsightService.UpdateCustomerInsight(customer_id, QueryParamsDto , UpdateCustomerInsightsDTO);
    }

    @Get()
    FetchAllCustomerInsight() {
        Logger.debug(`FetchAllCustomerInsight`, APP)

        return this.CustomerInsightService.FetchAllCustomerInsight();
    }

    @Get(':customer_id')
    FetchCustomerInsightById(@Param('customer_id') customer_id: any) {
        Logger.debug(`FetchCustomerInsightById id : ${customer_id}`, APP)

        return this.CustomerInsightService.FetchCustomerInsightById(customer_id);
    }
}
