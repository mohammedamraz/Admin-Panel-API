import { CreateSalesPartner, Period, UpdateSalesPartner, ZQueryParamsDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    createSalesPartner(createSalesPartner: CreateSalesPartner): import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>;
    deleteSalesPartner(id: string): import("rxjs").Observable<Promise<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
    fetchSalesPartnerById(id: string): import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>;
    fetchEarnings(salesCode: string, period: Period): import("rxjs").Observable<import("./dto/create-sale.dto").EarningResponse>;
    fetchInvitationResponse(salesCode: string): import("rxjs").Observable<{
        signup: number;
    }>;
    updateSalesPartner(id: string, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
    fetchAllSalesPartnersByDate(params: ZQueryParamsDto): import("rxjs").Observable<any>;
    fetchCommissionFromJunctionDb(params: ZQueryParamsDto): any[] | import("rxjs").Observable<void>;
    fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto): any[] | import("rxjs").Observable<unknown>;
    uploadImage(id: string, file: any): Promise<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>;
    paymentCalculation(salesCode: String): import("rxjs").Observable<import("./dto/create-sale.dto").CreateSalesJunction[]>;
    changeBankDetailsVerificationStatus(id: number): import("rxjs").Observable<import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
}
