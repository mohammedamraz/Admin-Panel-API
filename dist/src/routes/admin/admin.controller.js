"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const create_sale_dto_1 = require("../sales/dto/create-sale.dto");
const admin_service_1 = require("./admin.service");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const login_dto_1 = require("./dto/login.dto");
const APP = 'AdminController';
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    fetchSalesPartner(period) {
        common_1.Logger.debug(`fetchSalesPartner() period: [${JSON.stringify(period)}]`, APP);
        return this.adminService.fetchSalesPartner(period);
    }
    fetchCommissionReport(yearMonthDto) {
        common_1.Logger.debug(`fetchCommissionReport() yearMonthDto: [${yearMonthDto.year}]`, APP);
        return this.adminService.fetchCommissionReport(yearMonthDto);
    }
    fetchMonthlyReport(dateDTO) {
        common_1.Logger.debug(`fetchMonthlyReport() dateDTO: [${JSON.stringify(dateDTO)}]`, APP);
        return this.adminService.fetchMonthlyReport(dateDTO);
    }
    fetchSalesPartnerAccountDetails() {
        common_1.Logger.debug(`getSalesPartnerAccountDetails()`, APP);
        return this.adminService.fetchSalesPartnerAccountDetails();
    }
    fetchCommissionDispersals(period) {
        common_1.Logger.debug(`fetchCommissionDispersals() period: [${JSON.stringify(period.period)}]`, APP);
        return this.adminService.fetchCommissionDispersals(period);
    }
    fetchInvitationResponses(state) {
        common_1.Logger.debug(`fetchInvitationResponses() state: [${JSON.stringify(state)}]`, APP);
        return this.adminService.fetchInvitationResponse(state);
    }
    fetchSalesPartnerAccountDetailsBySalesCode(salesCode) {
        common_1.Logger.debug(`fetchSalesPartnerAccountDetailsByID()`, APP);
        return this.adminService.fetchSalesPartnerAccountDetailsBySalesCode(salesCode);
    }
    sentOtpToPhoneNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sentOtpToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.adminService.sentOtpToPhoneNumber(mobileNumberDtO);
    }
    verifyOtp(mobileNumberAndOtpDtO) {
        common_1.Logger.debug(`verifyOtp() mobileNumberAndOtpDtO: [${JSON.stringify(mobileNumberAndOtpDtO)}]`, APP);
        return this.adminService.verifyOtp(mobileNumberAndOtpDtO);
    }
    sentFedoAppDownloadLinkToMobileAndWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sentFedoAppDownloadLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.adminService.sentFedoAppDownloadLinkToMobileAndWhatsappNumber(mobileNumberDtO);
    }
    login(Logindto) {
        common_1.Logger.debug(`login() UserLoginDTO:[${JSON.stringify(Logindto)}]`);
        return this.adminService.login(Logindto);
    }
    forgotPassword(forgotPasswordDTO) {
        common_1.Logger.debug(`forgotPassword() forgotPasswordDTO:[${JSON.stringify(forgotPasswordDTO)}]`);
        return this.adminService.forgotPassword(forgotPasswordDTO);
    }
    confirmForgotPassword(confirmForgotPasswordDTO) {
        common_1.Logger.debug(`confirmForgotPassword() confirmForgotPasswordDTO:[${JSON.stringify(confirmForgotPasswordDTO)}]`);
        return this.adminService.confirmForgotPassword(confirmForgotPasswordDTO);
    }
    sendEmailOnIncorrectBankDetails(body, param) {
        common_1.Logger.debug(`sendEmailOnIncorrectBankDetails() body: [${JSON.stringify(body)}] param: [${JSON.stringify(param)}] `, APP);
        return this.adminService.sendEmailOnIncorrectBankDetails(body, param);
    }
    updatePaidAmount(updateAmountdto) {
        common_1.Logger.debug(`updatePaidAmount() updateAmountdto: [${JSON.stringify(updateAmountdto)}]`, APP);
        return this.adminService.updatePaidAmount(updateAmountdto);
    }
    sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sendCreateSalesPartnerLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.adminService.sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(mobileNumberDtO);
    }
};
__decorate([
    (0, common_1.Get)('sales-partner'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_1.Period]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "fetchSalesPartner", null);
__decorate([
    (0, common_1.Get)('commission-report/:year'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.YearMonthDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "fetchCommissionReport", null);
__decorate([
    (0, common_1.Get)('monthly-report/:year/:month'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.DateDTO]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "fetchMonthlyReport", null);
__decorate([
    (0, common_1.Get)('sales/account-details'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "fetchSalesPartnerAccountDetails", null);
__decorate([
    (0, common_1.Get)('commission-dispersals'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.PeriodRange]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "fetchCommissionDispersals", null);
__decorate([
    (0, common_1.Get)('invitation-responses'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.State]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "fetchInvitationResponses", null);
__decorate([
    (0, common_1.Get)('sales/account-details/:salesCode'),
    __param(0, (0, common_1.Param)('salesCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "fetchSalesPartnerAccountDetailsBySalesCode", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.MobileNumberDtO]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "sentOtpToPhoneNumber", null);
__decorate([
    (0, common_1.Get)(':phoneNumber/:otp'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.MobileNumberAndOtpDtO]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('download-link'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.MobileNumberDtO]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "sentFedoAppDownloadLinkToMobileAndWhatsappNumber", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDTO]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.ForgotPasswordDTO]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('password/otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.ConfirmForgotPasswordDTO]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "confirmForgotPassword", null);
__decorate([
    (0, common_1.Post)('send-email/:mobileNumber'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.requestDto, create_admin_dto_1.ParamDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "sendEmailOnIncorrectBankDetails", null);
__decorate([
    (0, common_1.Post)("payment-record"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.createPaid]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updatePaidAmount", null);
__decorate([
    (0, common_1.Post)('/sales-link'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.MobileDtO]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "sendCreateSalesPartnerLinkToMobileAndWhatsappNumber", null);
AdminController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map