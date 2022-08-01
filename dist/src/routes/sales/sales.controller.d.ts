import { CreateSalesPartner, Period, UpdateSalesPartner, ZQueryParamsDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    createSalesPartner(createSalesPartner: CreateSalesPartner): any;
    deleteSalesPartner(id: string): any;
    fetchSalesPartnerById(id: string): any;
    fetchEarnings(salesCode: string, period: Period): any;
    fetchInvitationResponse(salesCode: string): any;
    updateSalesPartner(id: string, updateSalesPartnerDto: UpdateSalesPartner): any;
    fetchAllSalesPartnersByDate(params: ZQueryParamsDto): any;
    fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto): any;
    uploadImage(id: string, file: any): Promise<any>;
    paymentCalculation(salesCode: String): any;
    changeBankDetailsVerificationStatus(id: number): any;
}
