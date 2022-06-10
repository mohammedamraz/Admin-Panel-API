import { CreateSalesPartner, Period, UpdateSalesPartner, YearMonthDto, ZQueryParamsDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    createSalesPartner(createSalesPartner: CreateSalesPartner): import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>;
    addCommission(salesCode: string): import("rxjs").Observable<import("./dto/create-sale.dto").CreateSalesJunction[]>;
    deleteSalesPartner(id: string): import("rxjs").Observable<Promise<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
    fetchSalesPartnerById(id: string): import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>;
    fetchEarnings(salesCode: string, period: Period): import("rxjs").Observable<import("./dto/create-sale.dto").EarningResponse>;
    fetchAllSalesPartnersByDate(params: ZQueryParamsDto): import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>;
    fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto): any[] | import("rxjs").Observable<Promise<any[]>>;
    uploadImage(id: string, file: any): Promise<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>;
    updateSalesPartner(id: number, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
    changeBankDetailsVerificationStatus(id: number): import("rxjs").Observable<import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
    updateUserIdInSales(id: string, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
    fetchEarnigReport(yearMonthDto: YearMonthDto): import("rxjs").Observable<any[]>;
}
