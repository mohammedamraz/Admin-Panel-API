import { CreateSalesPartner, Period, UpdateSalesPartner, YearMonthDto, ZQueryParamsDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    createSalesPartner(createSalesPartner: CreateSalesPartner): import("rxjs").Observable<CreateSalesPartner[]>;
    addCommission(salesCode: string): import("rxjs").Observable<import("./dto/create-sale.dto").CreateSalesJunction[]>;
    deleteSalesPartner(id: string): import("rxjs").Observable<Promise<CreateSalesPartner[]>>;
    fetchSalesPartnerById(id: string): import("rxjs").Observable<CreateSalesPartner[]>;
    fetchEarnings(salesCode: string, period: Period): import("rxjs").Observable<import("./dto/create-sale.dto").EarningResponse>;
    fetchInvitationResponse(salesCode: string, period: Period): import("rxjs").Observable<{
        signup: number;
    }>;
    fetchAllSalesPartnersByDate(params: ZQueryParamsDto): import("rxjs").Observable<any>;
    fetchCommissionFromJunctionDb(params: ZQueryParamsDto): any[] | import("rxjs").Observable<import("./dto/create-sale.dto").CreateSalesJunction[]>;
    fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto): any[] | import("rxjs").Observable<any>;
    uploadImage(id: string, file: any): Promise<CreateSalesPartner[]>;
    updateSalesPartner(id: number, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<CreateSalesPartner[]>>;
    changeBankDetailsVerificationStatus(id: number): import("rxjs").Observable<import("rxjs").Observable<CreateSalesPartner[]>>;
    updateUserIdInSales(id: string, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<CreateSalesPartner[]>>;
    fetchEarnigReport(yearMonthDto: YearMonthDto): import("rxjs").Observable<any[]>;
}
