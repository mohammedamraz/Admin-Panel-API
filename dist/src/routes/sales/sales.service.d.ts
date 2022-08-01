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
    createSalesPartner(createSalesPartner: CreateSalesPartner): any;
    createInvitation(createSalesPartner: CreateSalesPartner, createSalesJunction: CreateSalesJunction[]): any;
    fetchSalesPartnerByMobileNumber(mobile: string): any;
    fetchSalesPartnerByUserId(id: string): any;
    fetchSalesPartnerById(id: string): any;
    deleteSalesPartner(id: string): any;
    updateSalesPartner(id: string, updateSalesPartnerDto: UpdateSalesPartner): any;
    fetchAllSalesPartnersByDate(params: ZQueryParamsDto): any;
    fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto): any;
    makeDateFormat(params: any): {
        number_of_rows: any;
        number_of_pages: any;
        name: any;
        date: string;
    };
    uploadImage(id: string, fileName: string): any;
    updateImageById(id: string, updateSalesPartnerDto: object): any;
    fetchSalesBySalesCode(sales_code: string): any;
    fetchCommisionBySalesCode(salesCode: string): any;
    paymentCalculation(salesCode: string): any;
    changeBankDetailsVerificationSatatus(id: number): any;
    fetchEarnings(salesCode: string, period: Period): any;
    fetchInvitationResponse(salesCode: string): any;
}
