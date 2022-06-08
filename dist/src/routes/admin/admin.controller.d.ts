import { AdminService } from './admin.service';
import { createPaid, MobileNumberAndOtpDtO, MobileNumberDtO, ParamDto, requestDto } from './dto/create-admin.dto';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO, LoginDTO, PeriodRange } from './dto/login.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    fetchSalesPartnerAccountDetails(): import("rxjs").Observable<Promise<any[]>>;
    fetchCommissionDispersals(period: PeriodRange): import("rxjs").Observable<{
        thisMonth: number;
        previousMonth: number;
    }>;
    fetchSalesPartnerAccountDetailsBySalesCode(sales_code: string): import("rxjs").Observable<Promise<any[]>>;
    sentOtpToPhoneNumber(mobileNumberDtO: MobileNumberDtO): any;
    verifyOtp(mobileNumberAndOtpDtO: MobileNumberAndOtpDtO): any;
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
    updatingPaidAmount(updateAmountdto: createPaid): Promise<void>;
    sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(mobileNumberDtO: MobileNumberDtO): import("rxjs").Observable<{
        status: string;
    }>;
}
