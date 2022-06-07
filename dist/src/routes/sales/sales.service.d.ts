import { DatabaseService } from 'src/lib/database/database.service';
import { CreateSalesInvitationJunction, CreateSalesJunction, CreateSalesPartner, CreateWithdrawn, Period, UpdateSalesPartner, ZQueryParamsDto } from './dto/create-sale.dto';
import { HttpService } from '@nestjs/axios';
export declare class SalesService {
    private readonly db;
    private readonly invitationJunctiondb;
    private readonly junctiondb;
    private readonly withdrawndb;
    private http;
    constructor(db: DatabaseService<CreateSalesPartner>, invitationJunctiondb: DatabaseService<CreateSalesInvitationJunction>, junctiondb: DatabaseService<CreateSalesJunction>, withdrawndb: DatabaseService<CreateWithdrawn>, http: HttpService);
    createSalesPartner(createSalesPartner: CreateSalesPartner): import("rxjs").Observable<CreateSalesPartner[]>;
    createInvitation(createSalesPartner: CreateSalesPartner, createSalesJunction: CreateSalesJunction[]): import("rxjs").Observable<CreateSalesPartner[]> | CreateSalesJunction[];
    fetchSalesPartnerByMobileNumber(mobile: string): import("rxjs").Observable<CreateSalesPartner[]>;
    fetchSalesPartnerByUserId(id: string): import("rxjs").Observable<CreateSalesPartner[]>;
    fetchSalesPartnerById(id: string): import("rxjs").Observable<CreateSalesPartner[]>;
    deleteSalesPartner(id: string): import("rxjs").Observable<Promise<CreateSalesPartner[]>>;
    updateSalesPartner(id: string, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<CreateSalesPartner[]>>;
    fetchAllSalesPartnersByDate(params: ZQueryParamsDto): import("rxjs").Observable<any>;
    fetchCommissionFromJunctionDb(params: ZQueryParamsDto): any[] | import("rxjs").Observable<void>;
    fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto): any[] | import("rxjs").Observable<any>;
    makeDateFormat(params: any): {
        number_of_rows: any;
        number_of_pages: any;
        name: any;
        date: string;
        is_active: any;
    };
    uploadImage(id: string, fileName: string): Promise<CreateSalesPartner[]>;
    updateImageById(id: string, updateSalesPartnerDto: object): Promise<CreateSalesPartner[]>;
    fetchSalesBySalesCode(sales_code: string): import("rxjs").Observable<CreateSalesPartner>;
    fetchCommisionBySalesCode(salesCode: string): import("rxjs").Observable<CreateSalesJunction>;
    paymentCalculation(salesCode: string): import("rxjs").Observable<CreateSalesJunction[]>;
    changeBankDetailsVerificationSatatus(id: number): import("rxjs").Observable<import("rxjs").Observable<CreateSalesPartner[]>>;
    fetchEarnings(salesCode: string, period: Period): import("rxjs").Observable<import("./dto/create-sale.dto").EarningResponse>;
    fetchInvitationResponse(salesCode: string): import("rxjs").Observable<{
        signup: number;
    }>;
}
