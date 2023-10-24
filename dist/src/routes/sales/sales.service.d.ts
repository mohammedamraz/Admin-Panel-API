import { DatabaseService } from 'src/lib/database/database.service';
import { CreateSalesInvitationJunction, CreateSalesJunction, CreateSalesPartner, SalesYearMonth, UpdateSalesPartner, ZQueryParamsDto } from './dto/create-sale.dto';
import { HttpService } from '@nestjs/axios';
import { CreateSalesPartnerModel } from 'src/lib/config/model/sales.model';
export declare class SalesService {
    private readonly db;
    private readonly invitationJunctiondb;
    private readonly junctiondb;
    private http;
    constructor(db: DatabaseService<CreateSalesPartnerModel>, invitationJunctiondb: DatabaseService<CreateSalesInvitationJunction>, junctiondb: DatabaseService<CreateSalesJunction>, http: HttpService);
    saveToDb(userId: any, createSalesPartner: CreateSalesPartner): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    createInvitation(createSalesPartner: CreateSalesPartner, createSalesJunction: CreateSalesJunction[]): CreateSalesJunction[] | import("rxjs").Observable<CreateSalesPartnerModel[]>;
    fetchSalesPartnerByMobileNumber(mobile: string): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    fetchSalesPartnerById(id: string): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    fetchSalesCodeByMobileNumber(mobile: string): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    findUserByCustomerId(id: string): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    fetchSalesPartnerBySalesCode(id: string): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    deleteSalesPartner(id: string): import("rxjs").Observable<Promise<CreateSalesPartnerModel[]>>;
    updateSalesPartner(id: string, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<CreateSalesPartnerModel[]>>;
    fetchAllSalesPartnersByDate(params: ZQueryParamsDto): import("rxjs").Observable<CreateSalesPartnerModel[]>;
    fetchCommissionFromJunctionDb(ZQueryParamsDto: ZQueryParamsDto): import("rxjs").Observable<void>;
    fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto): any[] | import("rxjs").Observable<Promise<any[]>>;
    makeDateFormatJunction(params: any): {
        number_of_rows: any;
        number_of_pages: any;
        name: any;
        date: string;
        is_active: any;
    };
    makeDateFormat(params: any): {
        number_of_rows: any;
        number_of_pages: any;
        name: any;
        date: string;
        is_active: any;
    };
    makeParams(date: string, params: any): {
        number_of_rows: any;
        number_of_pages: any;
        name: any;
        date: string;
        is_active: any;
    };
    uploadImage(id: string, fileName: string): import("rxjs").Observable<import("rxjs").Observable<CreateSalesPartnerModel[]>>;
    updateImageById(id: string, updateSalesPartnerDto: object): import("rxjs").Observable<import("rxjs").Observable<CreateSalesPartnerModel[]>>;
    fetchCommisionBySalesCode(salesCode: string): import("rxjs").Observable<CreateSalesJunction>;
    updateUserIdInSales(id: string, updateSalesPartnerDto: UpdateSalesPartner): import("rxjs").Observable<Promise<CreateSalesPartnerModel[]>>;
    fetchEarnigReportByMonth(salesYearMonth: SalesYearMonth): import("rxjs").Observable<import("../admin/dto/create-admin.dto").AccountShort[]>;
    fetchAccountfromHSA(createSalesPartnerModel: CreateSalesPartnerModel, salesYearMonth: SalesYearMonth): import("rxjs").Observable<import("../admin/dto/create-admin.dto").AccountShort[]>;
    fetchuserbyCustomerId(id: string): import("rxjs").Observable<import("../admin/dto/create-admin.dto").createAccount[]>;
}
