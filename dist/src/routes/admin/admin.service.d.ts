import { HttpService } from '@nestjs/axios';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateSalesJunction, CreateSalesPartner, CreateSalesPartnerRequest, Period, SalesUserJunction } from '../sales/dto/create-sale.dto';
import { createPaid, DateDTO, MobileDtO, MobileNumberAndOtpDtO, MobileNumberDtO, ParamDto, requestDto, sendEmailOnCreationOfDirectSalesPartner, User, YearMonthDto } from './dto/create-admin.dto';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO, LoginDTO, PeriodRange, State } from './dto/login.dto';
import { TemplateService } from 'src/constants/template.service';
export declare class AdminService {
    private readonly salesJunctionDb;
    private readonly salesDb;
    private readonly salesPartnerRequestDb;
    private readonly salesuser;
    private readonly salesUserJunctionDb;
    private readonly templateService;
    private http;
    constructor(salesJunctionDb: DatabaseService<CreateSalesJunction>, salesDb: DatabaseService<CreateSalesPartner>, salesPartnerRequestDb: DatabaseService<CreateSalesPartnerRequest>, salesuser: DatabaseService<SalesUserJunction>, salesUserJunctionDb: DatabaseService<CreateSalesJunction>, templateService: TemplateService, http: HttpService);
    client: any;
    salesPartnerRequestDetails: any;
    salesPartnerDetails: any;
    salesParterEmail: any;
    fetchSalesPartnerAccountDetails(): import("rxjs").Observable<Promise<any[]>>;
    fetchCommissionDispersals(period: PeriodRange): import("rxjs").Observable<{
        thisMonth: number;
        previousMonth: number;
    }>;
    fetchPreviousMonthCommissionDispersal(createSalesJunction: CreateSalesJunction[], period: PeriodRange, date: Date): import("rxjs").Observable<{
        thisMonth: number;
        previousMonth: number;
    }>;
    fetchInvitationResponse(state: State): import("rxjs").Observable<Promise<{
        signups: any;
    }>>;
    fetchSignUps(createSalesPartner: CreateSalesPartner[], state: State): Promise<{
        signups: any;
    }>;
    fetchSalesPartner(period: Period): import("rxjs").Observable<Promise<any>>;
    fetchSalesPartnerCommission(createSalesPartner: CreateSalesPartner[], period: Period): Promise<any>;
    fetchTotalCommission(createSalesPartner: CreateSalesPartner, period: Period): import("rxjs").Observable<{
        totalCommission: number;
        name: string;
        signups: number;
    }>;
    fetchSalesPartnerSignups(createSalesJunction: CreateSalesJunction[], createSalesPartner: CreateSalesPartner, period: Period): import("rxjs").Observable<{
        totalCommission: number;
        name: string;
        signups: number;
    }>;
    fetchUser(createSalesPartner: CreateSalesPartner[]): Promise<any[]>;
    fetchAccount(userDoc: User[], saleDoc: CreateSalesPartner): Promise<{
        account_holder_name: string;
        account_number: string;
        ifsc_code: string;
        bank: string;
        sales_code: string;
        remarks: string;
        payout: Date;
        status: string;
        commission_amount: number;
    }>;
    fetchSalesPartnerAccountDetailsBySalesCode(salesCode: string): import("rxjs").Observable<Promise<any[]>>;
    fetchUserById(createSalesPartner: CreateSalesPartner[]): Promise<any[]>;
    fetchAccountById(userDoc: User[], saleDoc: CreateSalesPartner): Promise<{
        account_holder_name: string;
        account_number: string;
        ifsc_code: string;
        bank: string;
        sales_code: string;
        commission_amount: number;
    }>;
    sentOtpToPhoneNumber(mobileNumberDtO: MobileNumberDtO): import("rxjs").Observable<{
        status: any;
    }>;
    verifyOtp(mobileNumberAndOtpDtO: MobileNumberAndOtpDtO): import("rxjs").Observable<{
        status: any;
    }>;
    sentFedoAppDownloadLinkToPhoneNumber(mobileNumberDtO: MobileNumberDtO): any;
    sentFedoAppDownloadLinkToWhatsappNumber(mobileNumberDtO: MobileNumberDtO): any;
    sentFedoAppDownloadLinkToMobileAndWhatsappNumber(mobileNumberDtO: MobileNumberDtO): import("rxjs").Observable<{
        status: string;
    }>;
    sendEmailOnIncorrectBankDetails(body: requestDto, param: ParamDto): import("rxjs").Observable<unknown>;
    sendEmailOnCreationOfDirectSalesPartner(body: sendEmailOnCreationOfDirectSalesPartner): Promise<unknown>;
    sendEmailOnGreivanceRegressal(body: sendEmailOnCreationOfDirectSalesPartner): Promise<unknown>;
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
    encryptPassword: (password: any) => {
        passcode: any;
    };
    updatePaidAmount(updateAmountdto: createPaid): Promise<void>;
    sendCreateSalesPartnerLinkToPhoneNumber(mobileNumberDtO: MobileDtO): any;
    sendCreateSalesPartnerLinkToWhatsappNumber(mobileNumberDtO: MobileDtO): any;
    sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(mobileNumberDtO: MobileDtO): import("rxjs").Observable<{
        status: string;
    }>;
    encryptPassword_(password: any): any;
    fetchCommissionReport(yearMonthDto: YearMonthDto): import("rxjs").Observable<any[]>;
    fetchMonthlyReport(dateDTO: DateDTO): import("rxjs").Observable<Promise<any[]>>;
    fetchCommissionReportforSalesPartner(createSalesPartner: CreateSalesPartner[], dateDTO: DateDTO): Promise<any[]>;
    fetchSignupforPerformace(createSalesPartner: CreateSalesPartner, dateDTO: DateDTO): import("rxjs").Observable<{
        name: string;
        earnings: number;
        dues: number;
        signups: number;
    }>;
    fetchSignUpsforPerformance(createSalesPartner: CreateSalesPartner, createSalesJunction: CreateSalesJunction[], dateDTO: DateDTO): import("rxjs").Observable<{
        name: string;
        earnings: number;
        dues: number;
        signups: number;
    }>;
    fetchSignup(year: any, month: any): Promise<number>;
    sendNotificationToSalesPartnerOnMobile(mobileNumberDtO: MobileDtO): any;
    sendNotificationToSalesPartnerOnWhatsappNumber(mobileNumberDtO: MobileDtO): any;
    sendNotificationToSalesPartnerOnMobileAndWhatsappNumber(mobileNumberDtO: MobileDtO): import("rxjs").Observable<{
        status: string;
    }>;
}
