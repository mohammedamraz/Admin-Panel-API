import { Period } from '../sales/dto/create-sale.dto';
import { AdminService } from './admin.service';
import { createPaid, DateDTO, MobileDtO, MobileNumberAndOtpDtO, MobileNumberDtO, ParamDto, requestDto, YearMonthDto } from './dto/create-admin.dto';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO, LoginDTO, PeriodRange, State } from './dto/login.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    sentOtpToPhoneNumber(mobileNumberDtO: MobileNumberDtO): any;
    sentFedoAppDownloadLinkToMobileAndWhatsappNumber(mobileNumberDtO: MobileNumberDtO): import("rxjs").Observable<{
        status: string;
    }>;
    login(Logindto: LoginDTO): import("rxjs").Observable<{
        jwtToken: any;
        refreshToken: any;
        accessToken: any;
    }>;
    forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): import("rxjs").Observable<any>;
    confirmForgotPassword(confirmForgotPasswordDTO: ConfirmForgotPasswordDTO): import("rxjs").Observable<any[]>;
    sendEmailOnIncorrectBankDetails(body: requestDto, param: ParamDto): import("rxjs").Observable<unknown>;
    updatePaidAmount(updateAmountdto: createPaid): Promise<void>;
    sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(mobileNumberDtO: MobileDtO): import("rxjs").Observable<{
        status: string;
    }>;
    fetchSalesPartner(period: Period): import("rxjs").Observable<Promise<any>>;
    fetchCommissionReport(yearMonthDto: YearMonthDto): import("rxjs").Observable<any[]>;
    fetchMonthlyReport(dateDTO: DateDTO): import("rxjs").Observable<Promise<any[]>>;
    fetchSalesPartnerAccountDetails(): import("rxjs").Observable<Promise<any[]>>;
    fetchCommissionDispersals(period: PeriodRange): import("rxjs").Observable<{
        thisMonth: number;
        previousMonth: number;
    }>;
    fetchInvitationResponses(state: State): import("rxjs").Observable<Promise<{
        signups: any;
    }>>;
    fetchSalesPartnerAccountDetailsBySalesCode(salesCode: string): import("rxjs").Observable<Promise<any[]>>;
    verifyOtp(mobileNumberAndOtpDtO: MobileNumberAndOtpDtO): any;
}
