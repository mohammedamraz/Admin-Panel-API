import { PartialType } from "@nestjs/mapped-types";
import { CreateCustomerInsightDTO } from "./create-customer-insight.dto";

export class UpdateCustomerInsightsDTO extends PartialType(CreateCustomerInsightDTO){}