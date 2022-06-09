import { DatabaseService } from 'src/lib/database/database.service';
import { CreateSalesInvitationJunction, CreateSalesJunction, CreateSalesPartner, CreateWithdrawn, Period, UpdateSalesPartner, ZQueryParamsDto } from './dto/create-sale.dto';
import { HttpService } from '@nestjs/axios';
import { CreateSalesPartnerModel } from 'src/lib/config/model/sales.model';
export declare class SalesService {
    private readonly db;
    private readonly invitationJunctiondb;
    private readonly junctiondb;
    private readonly withdrawndb;
    private http;
    constructor(db: DatabaseService<CreateSalesPartnerModel>, invitationJunctiondb: DatabaseService<CreateSalesInvitationJunction>, junctiondb: DatabaseService<CreateSalesJunction>, withdrawndb: DatabaseService<CreateWithdrawn>, http: HttpService);
    createSalesPartner(createSalesPartner: CreateSalesPartner): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    createInvitation(createSalesPartner: CreateSalesPartner, createSalesJunction: CreateSalesJunction[]): import("rxjs").Observable<CreateSalesPartnerModel[]> | CreateSalesJunction[];
    fetchSalesPartnerByMobileNumber(mobile: string): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    fetchSalesPartnerByUserId(id: string): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    fetchSalesPartnerById(id: string): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    fetchSalesPartnerBySalesCode(id: string): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    deleteSalesPartner(id: string): import("rxjs").Observable<Promise<CreateSalesPartnerModel[]>>;
    updateSalesPartner(id: string, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<CreateSalesPartnerModel[]>>;
    fetchAllSalesPartnersByDate(params: ZQueryParamsDto): import("rxjs").Observable<any>;
    fetchCommissionFromJunctionDb(ZQueryParamsDto: ZQueryParamsDto): import("rxjs").Observable<void>;
    fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto): any[] | import("rxjs").Observable<Promise<any[]>>;
    makeDateFormat(params: any): {
        number_of_rows: any;
        number_of_pages: any;
        name: any;
        date: string;
        is_active: any;
    };
    makeDateFormatJunction(params: any): {
        number_of_rows: any;
        number_of_pages: any;
        name: any;
        date: string;
        is_active: any;
    };
    uploadImage(id: string, fileName: string): Promise<CreateSalesPartnerModel[]>;
    updateImageById(id: string, updateSalesPartnerDto: object): Promise<CreateSalesPartnerModel[]>;
    fetchSalesBySalesCode(sales_code: string): import("rxjs").Observable<CreateSalesPartnerModel>;
    fetchCommisionBySalesCode(salesCode: string): import("rxjs").Observable<CreateSalesJunction>;
    paymentCalculation(salesCode: string): import("rxjs").Observable<CreateSalesJunction[]>;
    changeBankDetailsVerificationSatatus(id: number): import("rxjs").Observable<import("rxjs").Observable<CreateSalesPartnerModel[]>>;
    fetchEarnings(salesCode: string, period: Period): import("rxjs").Observable<import("./dto/create-sale.dto").EarningResponse>;
    fetchInvitationResponse(salesCode: string): import("rxjs").Observable<{
        signup: number;
    }>;
}
