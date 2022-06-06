import { CreateSalesPartner, Period, UpdateSalesPartner, ZQueryParamsDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    createSalesPartner(createSalesPartner: CreateSalesPartner): import("rxjs").Observable<CreateSalesPartner[]>;
    deleteSalesPartner(id: string): import("rxjs").Observable<Promise<CreateSalesPartner[]>>;
    fetchSalesPartnerById(id: string): import("rxjs").Observable<CreateSalesPartner[]>;
    fetchEarnings(salesCode: string, period: Period): import("rxjs").Observable<import("./dto/create-sale.dto").EarningResponse>;
    fetchInvitationResponse(salesCode: string): import("rxjs").Observable<{
        signup: number;
    }>;
    updateSalesPartner(id: string, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<CreateSalesPartner[]>>;
    fetchAllSalesPartnersByDate(params: ZQueryParamsDto): import("rxjs").Observable<any>;
    fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto): any[] | import("rxjs").Observable<any>;
    uploadImage(id: string, file: any): Promise<CreateSalesPartner[]>;
    paymentCalculation(salesCode: String): import("rxjs").Observable<import("./dto/create-sale.dto").CreateSalesJunction[]>;
    changeBankDetailsVerificationStatus(id: number): import("rxjs").Observable<import("rxjs").Observable<CreateSalesPartner[]>>;
}
