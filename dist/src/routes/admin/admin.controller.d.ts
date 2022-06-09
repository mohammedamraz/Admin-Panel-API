import { Period } from '../sales/dto/create-sale.dto';
import { AdminService } from './admin.service';
import { createPaid, MobileNumberAndOtpDtO, MobileNumberDtO, ParamDto, requestDto, YearMonthDto } from './dto/create-admin.dto';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO, LoginDTO } from './dto/login.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    fetchCommissionReport(yearMonthDto: YearMonthDto): import("rxjs").Observable<any[]>;
    fetchSalesPartnerAccountDetails(): import("rxjs").Observable<Promise<any[]>>;
    fetchEarnings(salesCode: string, period: Period): import("rxjs").Observable<import("../sales/dto/create-sale.dto").EarningResponse>;
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
