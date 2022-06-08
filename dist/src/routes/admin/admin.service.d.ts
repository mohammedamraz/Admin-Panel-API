import { HttpService } from '@nestjs/axios';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateSalesJunction, CreateSalesPartner, CreateSalesPartnerRequest, Period, SalesUserJunction } from '../sales/dto/create-sale.dto';
import { createPaid, MobileNumberAndOtpDtO, MobileNumberDtO, ParamDto, requestDto, User } from './dto/create-admin.dto';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO, LoginDTO } from './dto/login.dto';
import { TemplateService } from 'src/constants/template.service';
export declare class AdminService {
    private readonly salesJunctionDb;
    private readonly salesDb;
    private readonly salesPartnerRequestDb;
    private readonly salesuser;
    private readonly templateService;
    private http;
    constructor(salesJunctionDb: DatabaseService<CreateSalesJunction>, salesDb: DatabaseService<CreateSalesPartner>, salesPartnerRequestDb: DatabaseService<CreateSalesPartnerRequest>, salesuser: DatabaseService<SalesUserJunction>, templateService: TemplateService, http: HttpService);
    accountSid: string;
    authToken: string;
    serviceSid: string;
    client: any;
    salesPartnerAccountDetails: any[];
    salesPartnerAccountData: any[];
    salesPartnerRequestDetails: any;
    salesPartnerDetails: any;
    salesParterEmail: any;
    fetchSalesPartnerAccountDetails(): import("rxjs").Observable<Promise<any[]>>;
    fetchCommissionDispersals(): import("rxjs").Observable<{
        thisMonth: number;
        previousMonth: number;
    }>;
    fetchPreviousMonthCommissionDispersal(createSalesJunction: CreateSalesJunction[]): import("rxjs").Observable<{
        thisMonth: number;
        previousMonth: number;
    }>;
    fetchInvitationResponse(salesCode: string, period: Period): import("rxjs").Observable<{
        signup: number;
    }>;
    fetchUser(createSalesPartner: CreateSalesPartner[]): Promise<any[]>;
    fetchAccount(userDoc: User[], saleDoc: CreateSalesPartner): Promise<{
        account_holder_name: string;
        account_number: string;
        ifsc_code: string;
        bank: string;
        sales_code: string;
        commission_amount: number;
    }>;
    fetchSalesPartnerAccountDetailsBySalesCode(sales_code: string): import("rxjs").Observable<Promise<any[]>>;
    fetchUserById(createSalesPartner: CreateSalesPartner[]): Promise<any[]>;
    fetchAccountById(userDoc: User[], saleDoc: CreateSalesPartner): Promise<{
        account_holder_name: string;
        account_number: string;
        ifsc_code: string;
        bank: string;
        sales_code: string;
        commission_amount: number;
    }>;
    sentOtpToPhoneNumber(mobileNumberDtO: MobileNumberDtO): any;
    verifyOtp(mobileNumberAndOtpDtO: MobileNumberAndOtpDtO): any;
    sentFedoAppDownloadLinkToPhoneNumber(mobileNumberDtO: MobileNumberDtO): any;
    sentFedoAppDownloadLinkToWhatsappNumber(mobileNumberDtO: MobileNumberDtO): any;
    sentFedoAppDownloadLinkToMobileAndWhatsappNumber(mobileNumberDtO: MobileNumberDtO): import("rxjs").Observable<{
        status: string;
    }>;
    sendEmailOnIncorrectBankDetails(body: requestDto, param: ParamDto): import("rxjs").Observable<unknown>;
    private readonly onTwilioErrorResponse;
    login(logindto: LoginDTO): import("rxjs").Observable<{
        jwtToken: any;
        refreshToken: any;
        accessToken: any;
    }>;
    forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): import("rxjs").Observable<any>;
    confirmForgotPassword(confirmForgotPasswordDTO: ConfirmForgotPasswordDTO): import("rxjs").Observable<any[]>;
    private readonly onAWSErrorResponse;
    private readonly onHTTPErrorResponse;
    encryptPassword(password: any): any;
    updatingPaidAmount(updateAmountdto: createPaid): Promise<void>;
    sendCreateSalesPartnerLinkToPhoneNumber(mobileNumberDtO: MobileNumberDtO): any;
    sendCreateSalesPartnerLinkToWhatsappNumber(mobileNumberDtO: MobileNumberDtO): any;
    sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(mobileNumberDtO: MobileNumberDtO): import("rxjs").Observable<{
        status: string;
    }>;
    encryptPassword_(password: any): any;
}
