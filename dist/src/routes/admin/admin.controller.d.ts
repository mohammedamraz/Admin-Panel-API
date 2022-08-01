import { AdminService } from './admin.service';
import { createPaid, MobileNumberAndOtpDtO, MobileNumberDtO, ParamDto, requestDto } from './dto/create-admin.dto';
import { ConfirmForgotPasswordDTO, ForgotPasswordDTO, LoginDTO } from './dto/login.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    fetchSalesPartnerAccountDetails(): any;
    sentOtpToPhoneNumber(mobileNumberDtO: MobileNumberDtO): any;
    verifyOtp(mobileNumberAndOtpDtO: MobileNumberAndOtpDtO): any;
    sentFedoAppDownloadLinkToMobileAndWhatsappNumber(mobileNumberDtO: MobileNumberDtO): any;
    login(Logindto: LoginDTO): any;
    forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): any;
    confirmForgotPassword(confirmForgotPasswordDTO: ConfirmForgotPasswordDTO): any;
    sendEmailOnIncorrectBankDetails(body: requestDto, param: ParamDto): any;
    updatingPaidAmount(updateAmountdto: createPaid): Promise<void>;
}
