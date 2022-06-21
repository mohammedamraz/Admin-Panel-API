import { CreateSalesPartner, LoginDTO, Period, SalesYearMonth, UpdateSalesPartner, YearMonthDto, ZQueryParamsDto } from './dto/create-sale.dto';
import { SalesService } from './sales.service';
import { SalesCommissionService } from './sales-commission.service';
export declare class SalesController {
    private readonly salesService;
    private readonly salesCommissionService;
    constructor(salesService: SalesService, salesCommissionService: SalesCommissionService);
    createSalesPartner(createSalesPartner: CreateSalesPartner): import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>;
    deleteSalesPartner(id: string): import("rxjs").Observable<Promise<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
    fetchSalesPartnerById(id: string): import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>;
    fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto): any[] | import("rxjs").Observable<Promise<any[]>>;
    fetchAllSalesPartnersByDate(params: ZQueryParamsDto): import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>;
    fetchSalesPartnerByMobileNumber(mobileDTO: LoginDTO): import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>;
    updateSalesPartner(id: string, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
    uploadImage(id: string, file: any): Promise<import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
    updateUserIdInSales(id: string, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
    fetchEarnings(salesCode: string, period: Period): import("rxjs").Observable<import("./dto/create-sale.dto").EarningResponse>;
    fetchInvitationResponse(salesCode: string, period: Period): import("rxjs").Observable<{
        signup: number;
    }>;
    changeBankDetailsVerificationStatus(id: number): import("rxjs").Observable<import("rxjs").Observable<import("../../lib/config/model/sales.model").CreateSalesPartnerModel[]>>;
    fetchEarnigReportByMonth(salesYearMonth: SalesYearMonth): import("rxjs").Observable<import("../admin/dto/create-admin.dto").AccountShort[]>;
    fetchEarnigReport(yearMonthDto: YearMonthDto): import("rxjs").Observable<any[]>;
}
