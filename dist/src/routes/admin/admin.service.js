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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const constants_1 = require("../../constants");
const database_decorator_1 = require("../../lib/database/database.decorator");
const database_service_1 = require("../../lib/database/database.service");
const create_sale_dto_1 = require("../sales/dto/create-sale.dto");
const create_admin_dto_1 = require("./dto/create-admin.dto");
const rxjs_1 = require("rxjs");
const helper_1 = require("../../constants/helper");
const template_service_1 = require("../../constants/template.service");
const APP = "AdminService";
let AdminService = class AdminService {
    constructor(salesJunctionDb, salesDb, salesPartnerRequestDb, salesuser, salesUserJunctionDb, templateService, http) {
        this.salesJunctionDb = salesJunctionDb;
        this.salesDb = salesDb;
        this.salesPartnerRequestDb = salesPartnerRequestDb;
        this.salesuser = salesuser;
        this.salesUserJunctionDb = salesUserJunctionDb;
        this.templateService = templateService;
        this.http = http;
        this.accountSid = constants_1.AKASH_ACCOUNTID;
        this.authToken = constants_1.AKASH_AUTHTOKEN;
        this.serviceSid = constants_1.AKASH_SERVICEID;
        this.client = require('twilio')(this.accountSid, this.authToken);
        this.salesPartnerAccountDetails = [];
        this.salesPartnerAccountData = [];
        this.onTwilioErrorResponse = async (err) => {
            common_1.Logger.debug('onTwilioErrorResponse(), ' + err, APP);
            if (err.status === 400)
                throw new common_1.BadRequestException(err.message);
            if (err.status === 401)
                throw new common_1.UnauthorizedException(err.message);
            if (err.status === 422)
                throw new common_1.UnprocessableEntityException(err.message);
            if (err.status === 404)
                throw new common_1.NotFoundException(err.message);
            if (err.status === 409)
                throw new common_1.ConflictException(err.message);
            if (err.status === 429)
                throw new common_1.HttpException({ status: common_1.HttpStatus.TOO_MANY_REQUESTS, error: 'Please wait for a short period of time and make the request again' }, common_1.HttpStatus.TOO_MANY_REQUESTS);
            return (0, rxjs_1.throwError)(() => err);
        };
        this.onAWSErrorResponse = async (err) => {
            common_1.Logger.debug('onAWSErrorResponse(), ' + err, APP);
            if (err.response.status === 400)
                throw new common_1.BadRequestException(err.response.data);
            if (err.response.status === 401)
                throw new common_1.UnauthorizedException(err.response.data);
            if (err.response.status === 422)
                throw new common_1.UnprocessableEntityException(err.response.data);
            if (err.response.status === 404)
                throw new common_1.NotFoundException(err.response.data);
            if (err.response.status === 409)
                throw new common_1.ConflictException(err.response.data);
            return (0, rxjs_1.throwError)(() => err);
        };
        this.onHTTPErrorResponse = async (err) => {
            common_1.Logger.debug('onHTTPErrorResponse(), ' + err, APP);
            if (err.response.status === 400)
                throw new common_1.BadRequestException(err.response.data);
            if (err.response.status === 401)
                throw new common_1.UnauthorizedException(err.response.data.message);
            if (err.response.status === 422)
                throw new common_1.UnprocessableEntityException(err.response.data.message);
            if (err.response.status === 404)
                throw new common_1.NotFoundException(err.response.data.message);
            if (err.response.status === 409)
                throw new common_1.ConflictException(err.response.data.message);
            return (0, rxjs_1.throwError)(() => err);
        };
    }
    fetchSalesPartnerAccountDetails() {
        common_1.Logger.debug(`fetchSalesPartnerAccountDetails()`, APP);
        return this.salesDb.find({ block_account: false, is_hsa_account: true }).pipe((0, rxjs_1.map)(salesDoc => {
            if (salesDoc.length === 0)
                throw new common_1.NotFoundException("sales partner not found");
            return this.fetchUser(salesDoc);
        }), (0, rxjs_1.catchError)(err => { throw new common_1.BadRequestException(err.message); }));
    }
    fetchEarnings(period) {
        common_1.Logger.debug(`fetchEarnings()  period: ${JSON.stringify(period)}`, APP);
        return this.salesJunctionDb.fetchAllByPeriod((0, create_sale_dto_1.Interval)(period)).pipe((0, rxjs_1.map)(salesjuncdoc => {
            if (salesjuncdoc.length === 0)
                throw new common_1.NotFoundException("no Account found");
            return (0, create_sale_dto_1.makeEarningFormat)(salesjuncdoc.reduce((acc, curr) => ([acc[0] += curr.commission_amount, acc[1] += curr.paid_amount]), [0, 0]));
        }));
    }
    fetchInvitationResponse(salesCode, period) {
        common_1.Logger.debug(`fetchInvitationResponse() salesCode: ${salesCode}`, APP);
        return this.salesuser.findByPeriod({ columnName: "sales_code", columnvalue: salesCode, period: (0, create_sale_dto_1.Interval)(period) }).pipe((0, rxjs_1.catchError)(error => { throw new common_1.BadRequestException(error.message); }), (0, rxjs_1.map)(salesuser => {
            if (salesuser.length === 0)
                throw new common_1.NotFoundException("no Account found");
            return { "signup": salesuser.length };
        }));
    }
    async fetchUser(createSalesPartner) {
        common_1.Logger.debug(`fetchUser() createSalesPartner: ${JSON.stringify(createSalesPartner)}`, APP);
        this.salesPartnerAccountDetails = [];
        return (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(createSalesPartner).pipe((0, rxjs_1.concatMap)(async (saleDoc) => await (0, rxjs_1.lastValueFrom)((0, helper_1.fetchUser)(saleDoc.user_id.toString()))
            .then(userDoc => this.fetchAccount(userDoc, saleDoc).then(result => { this.salesPartnerAccountDetails.push(result); }))
            .catch(error => { throw new common_1.UnprocessableEntityException(error.message); })))).then(doc => this.salesPartnerAccountDetails);
    }
    async fetchAccount(userDoc, saleDoc) {
        common_1.Logger.debug(`fetchAccount() userDoc: ${JSON.stringify(userDoc)}  saleDoc: ${JSON.stringify(saleDoc)}`, APP);
        return (0, rxjs_1.lastValueFrom)((0, helper_1.fetchAccount)(userDoc[0].fedo_id, String(userDoc[0].account_id)))
            .then(async (accountDoc) => {
            const salesJunctionDoc = await (0, rxjs_1.lastValueFrom)(this.salesJunctionDb.find({ sales_code: saleDoc.sales_code })).catch(error => { throw new common_1.NotFoundException(error.message); });
            return { "account_holder_name": accountDoc.name, "account_number": accountDoc.account_number, "ifsc_code": accountDoc.ifsc_code, "bank": accountDoc.bank_name, "sales_code": saleDoc.sales_code, "commission_amount": salesJunctionDoc.pop().dues };
        });
    }
    fetchSalesPartnerAccountDetailsBySalesCode(sales_code) {
        common_1.Logger.debug(`fetchSalesPartnerAccountDetailsBySalesCode()`, APP);
        return this.salesDb.find({ sales_code: sales_code }).pipe((0, rxjs_1.map)(salesDoc => {
            if (salesDoc.length === 0)
                throw new common_1.NotFoundException("sales partner not found");
            return this.fetchUserById(salesDoc);
        }), (0, rxjs_1.catchError)(err => { throw new common_1.BadRequestException(err.message); }));
    }
    async fetchUserById(createSalesPartner) {
        common_1.Logger.debug(`fetchUserById() createSalesPartner: ${JSON.stringify(createSalesPartner)}`, APP);
        this.salesPartnerAccountData = [];
        if (!createSalesPartner[0].user_id)
            throw new common_1.NotFoundException("HSA account not found ");
        return (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(createSalesPartner).pipe((0, rxjs_1.concatMap)(async (saleDoc) => await (0, rxjs_1.lastValueFrom)((0, helper_1.fetchUser)(saleDoc.user_id.toString()))
            .then(userDoc => this.fetchAccountById(userDoc, saleDoc).then(result => { this.salesPartnerAccountData.push(result); }))
            .catch(error => { throw new common_1.UnprocessableEntityException(error.message); })))).then(doc => this.salesPartnerAccountData);
    }
    async fetchAccountById(userDoc, saleDoc) {
        common_1.Logger.debug(`fetchAccountById() userDoc: ${JSON.stringify(userDoc)}  saleDoc: ${JSON.stringify(saleDoc)}`, APP);
        return (0, rxjs_1.lastValueFrom)((0, helper_1.fetchAccount)(userDoc[0].fedo_id, (userDoc[0].account_id).toString()))
            .then(async (accountDoc) => {
            const salesJunctionDoc = await (0, rxjs_1.lastValueFrom)(this.salesJunctionDb.find({ sales_code: saleDoc.sales_code })).catch(error => { throw new common_1.NotFoundException(error.message); });
            return { "account_holder_name": accountDoc.name, "account_number": accountDoc.account_number, "ifsc_code": accountDoc.ifsc_code, "bank": accountDoc.bank_name, "sales_code": saleDoc.sales_code, "commission_amount": salesJunctionDoc.pop().dues };
        });
    }
    sentOtpToPhoneNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sentOtpToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.client.verify.services(this.serviceSid)
            .verifications
            .create({
            to: mobileNumberDtO.phoneNumber,
            channel: 'sms',
            locale: 'en'
        })
            .then(_res => {
            return { 'status': `OTP Send to ${mobileNumberDtO.phoneNumber} number` };
        })
            .catch(err => this.onTwilioErrorResponse(err));
    }
    verifyOtp(mobileNumberAndOtpDtO) {
        common_1.Logger.debug(`verifyOtp() mobileNumberAndOtpDtO: [${JSON.stringify(mobileNumberAndOtpDtO)}]`, APP);
        return this.client.verify.services(this.serviceSid)
            .verificationChecks
            .create({ to: mobileNumberAndOtpDtO.phoneNumber, code: mobileNumberAndOtpDtO.otp.toString() })
            .then(verification_check => {
            if (!verification_check.valid || verification_check.status !== 'approved')
                throw new common_1.BadRequestException('Wrong code provided ');
            return { "status": verification_check.status };
        })
            .catch(err => this.onTwilioErrorResponse(err));
    }
    sentFedoAppDownloadLinkToPhoneNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sentFedoAppDownloadLinkToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.client.messages
            .create({
            body: constants_1.APP_DOWNLOAD_LINK,
            from: '+19402908957',
            to: mobileNumberDtO.phoneNumber
        })
            .then(_res => {
            return { "status": `Link ${constants_1.APP_DOWNLOAD_LINK}  send to  ${mobileNumberDtO.phoneNumber} number` };
        })
            .catch(err => this.onTwilioErrorResponse(err));
    }
    sentFedoAppDownloadLinkToWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sentFedoAppDownloadLinkToWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.client.messages
            .create({
            body: constants_1.APP_DOWNLOAD_LINK,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${mobileNumberDtO.phoneNumber}`
        })
            .then(_res => {
            return { "status": `Link ${constants_1.APP_DOWNLOAD_LINK}  send to  ${mobileNumberDtO.phoneNumber} whatsapp number` };
        })
            .catch(err => this.onTwilioErrorResponse(err));
    }
    sentFedoAppDownloadLinkToMobileAndWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sentFedoAppDownloadLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return (0, rxjs_1.from)(this.sentFedoAppDownloadLinkToPhoneNumber(mobileNumberDtO)).pipe((0, rxjs_1.map)(_doc => this.sentFedoAppDownloadLinkToWhatsappNumber(mobileNumberDtO)), (0, rxjs_1.switchMap)(doc => (0, rxjs_1.of)({ status: "Download link sent" })));
    }
    sendEmailOnIncorrectBankDetails(body, param) {
        common_1.Logger.debug(`sendEmailOnIncorrectBankDetails() body: [${JSON.stringify(body)}] param: [${JSON.stringify(param)}] `, APP);
        return (0, helper_1.fetchUserByMobileNumber)(param.mobileNumber).pipe((0, rxjs_1.map)(doc => { this.salesParterEmail = doc[0].email; return doc; }), (0, rxjs_1.switchMap)(doc => { return this.salesDb.find({ user_id: doc[0].fedo_id }); }), (0, rxjs_1.switchMap)(doc => {
            if (doc.length === 0)
                throw new common_1.NotFoundException('Sales Partner not found');
            else
                this.salesPartnerDetails = doc[0];
            return this.salesPartnerRequestDb.save({ sales_code: doc[0].sales_code });
        }), (0, rxjs_1.switchMap)(doc => {
            const request_id = "FEDSPSR" + doc[0].id;
            this.salesPartnerRequestDetails = doc[0];
            return this.salesPartnerRequestDb.findByIdandUpdate({ id: doc[0].id, quries: { request_id: request_id } });
        }), (0, rxjs_1.switchMap)(_doc => this.salesPartnerRequestDb.find({ id: this.salesPartnerRequestDetails.id })), (0, rxjs_1.switchMap)(doc => {
            var _a;
            if (doc.length === 0)
                throw new common_1.NotFoundException('Sales Partner Request Details not found');
            else
                return this.templateService.sendEmailOnIncorrectBankDetailsToSupportEmail({ toAddresses: [this.salesParterEmail], subject: "Incorrect Bank Details" }, { name: (_a = this.salesPartnerDetails) === null || _a === void 0 ? void 0 : _a.name, message: body.message, request_id: doc[0].request_id })
                    .then(_res => { var _a; return this.templateService.sendEmailOnIncorrectBankDetailsToHsaEmail({ toAddresses: ["support@fedo.health"] }, { name: (_a = this.salesPartnerDetails) === null || _a === void 0 ? void 0 : _a.name, message: body.message, request_id: doc[0].request_id }); })
                    .catch(err => { throw new common_1.BadRequestException(err); });
        }));
    }
    login(logindto) {
        common_1.Logger.debug(`admin-console login() loginDTO:[${JSON.stringify(Object.keys(logindto))} values ${JSON.stringify(Object.values(logindto).length)}]`);
        logindto.fedoApp = constants_1.FEDO_APP;
        logindto.password = this.encryptPassword(logindto.password);
        return this.http.post(`${constants_1.AWS_COGNITO_USER_CREATION_URL_SIT}/token`, logindto).pipe((0, rxjs_1.catchError)(err => { return this.onAWSErrorResponse(err); }), (0, rxjs_1.map)((res) => {
            return { jwtToken: res.data.idToken.jwtToken, refreshToken: res.data.refreshToken, accessToken: res.data.accessToken.jwtToken };
        }));
    }
    forgotPassword(forgotPasswordDTO) {
        common_1.Logger.debug(`admin-console forgotPassword() forgotPasswordDTO:[${JSON.stringify(forgotPasswordDTO)}]`);
        forgotPasswordDTO.fedoApp = constants_1.FEDO_APP;
        return this.http.post(`${constants_1.AWS_COGNITO_USER_CREATION_URL_SIT}/password/otp/`, forgotPasswordDTO).pipe((0, rxjs_1.catchError)(err => { console.log(err); return this.onAWSErrorResponse(err); }), (0, rxjs_1.map)((res) => res.data));
    }
    confirmForgotPassword(confirmForgotPasswordDTO) {
        common_1.Logger.debug(`admin-console confirmForgotPassword() confirmForgotPasswordDTO:[${JSON.stringify(confirmForgotPasswordDTO)}]`);
        confirmForgotPasswordDTO.fedoApp = constants_1.FEDO_APP;
        return this.http.patch(`${constants_1.AWS_COGNITO_USER_CREATION_URL_SIT}/password/otp/${confirmForgotPasswordDTO.ConfirmationCode}`, confirmForgotPasswordDTO).pipe((0, rxjs_1.catchError)(err => { return this.onHTTPErrorResponse(err); }), (0, rxjs_1.map)(_res => []));
    }
    encryptPassword(password) {
        const NodeRSA = require('node-rsa');
        let key_public = new NodeRSA(constants_1.PUBLIC_KEY);
        var encryptedString = key_public.encrypt(password, 'base64');
        return encryptedString;
    }
    async updatingPaidAmount(updateAmountdto) {
        common_1.Logger.debug(`updatePaidAmount() updateAmountdto: [${JSON.stringify(updateAmountdto)}]`, APP);
        updateAmountdto['data'].map(res => {
            return (0, rxjs_1.lastValueFrom)(this.salesJunctionDb.find({ "sales_code": res.salesCode }).pipe((0, rxjs_1.map)(doc => {
                const sort_doc = Math.max(...doc.map(user => parseInt(user['id'].toString())));
                const user_doc = doc.filter(item => item['id'] == sort_doc);
                const finalRes = user_doc[0].dues;
                const dueCommission = Number(finalRes) - Number(res.paid_amount);
                return this.salesJunctionDb.save({ sales_code: user_doc[0].sales_code, paid_amount: res.paid_amount, dues: dueCommission });
            })));
        });
    }
    sendCreateSalesPartnerLinkToPhoneNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sendCreateSalesPartnerLinkToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        let phone_number = this.encryptPassword_(mobileNumberDtO.phoneNumber);
        let commission = this.encryptPassword_(mobileNumberDtO.commission);
        return this.client.messages
            .create({
            body: `Click on Link ${constants_1.SALES_PARTNER_LINK}?mobile=${phone_number}&commission=${commission} `,
            from: '+19402908957',
            to: mobileNumberDtO.phoneNumber
        })
            .then(_res => {
            return { "status": `Link ${constants_1.SALES_PARTNER_LINK}  send to  ${mobileNumberDtO.phoneNumber} number` };
        })
            .catch(err => this.onTwilioErrorResponse(err));
    }
    sendCreateSalesPartnerLinkToWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sendCreateSalesPartnerLinkToWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        let phone_number = this.encryptPassword_(mobileNumberDtO.phoneNumber);
        let commission = this.encryptPassword_(mobileNumberDtO.commission);
        return this.client.messages
            .create({
            body: `Click on Link ${constants_1.SALES_PARTNER_LINK}?mobile=${phone_number}&commission=${commission} `,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:${mobileNumberDtO.phoneNumber}`
        })
            .then(_res => {
            return { "status": `Link ${constants_1.SALES_PARTNER_LINK}  send to  ${mobileNumberDtO.phoneNumber} whatsapp number` };
        })
            .catch(err => this.onTwilioErrorResponse(err));
    }
    sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sendCreateSalesPartnerLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return (0, rxjs_1.from)(this.sendCreateSalesPartnerLinkToPhoneNumber(mobileNumberDtO)).pipe((0, rxjs_1.map)(_doc => this.sendCreateSalesPartnerLinkToWhatsappNumber(mobileNumberDtO)), (0, rxjs_1.switchMap)(doc => (0, rxjs_1.of)({ status: "Sales Partner link sent" })));
    }
    encryptPassword_(password) {
        const NodeRSA = require('node-rsa');
        let key_public = new NodeRSA(constants_1.PUBLIC_KEY);
        var encryptedString = key_public.encrypt(password, 'base64');
        return encryptedString;
    }
    fetchCommissionReport(yearMonthDto) {
        common_1.Logger.debug(`fetchCommissionReport() year: [${yearMonthDto.year}]`, APP);
        const reportData = [];
        return (0, rxjs_1.from)((0, create_admin_dto_1.fetchmonths)((yearMonthDto.year))).pipe((0, rxjs_1.concatMap)(async (month) => {
            return await (0, rxjs_1.lastValueFrom)(this.salesJunctionDb.fetchCommissionReportByYear(yearMonthDto.year, month))
                .then(async (salesJunctionDoc) => {
                const paid_amount = salesJunctionDoc.map(doc => doc.paid_amount);
                const total_paid_amount = paid_amount.reduce((next, prev) => next + prev, 0);
                const due = salesJunctionDoc.map(doc => doc.dues);
                const total_dues = due.reduce((next, prev) => Number(next) + Number(prev), 0);
                const date = salesJunctionDoc.map(doc => { if (doc.paid_amount > 0)
                    return doc.created_date; });
                const paid_on = date.filter((res) => res);
                await this.fetchSignup(yearMonthDto.year, month)
                    .then(signup => {
                    reportData.push({ "total_paid_amount": total_paid_amount, "month": month, "total_dues": total_dues, "hsa_sing_up": signup, "paid_on": paid_on[0] });
                }).catch(error => { throw new common_1.NotFoundException(error.message); });
                return reportData;
            })
                .catch(error => { throw new common_1.NotFoundException(error.message); })
                .then(doc => reportData);
        }));
    }
    async fetchSignup(year, month) {
        common_1.Logger.debug(`fetchSignup() year: [${year}] month: [${month}]`, APP);
        return await (0, rxjs_1.lastValueFrom)(this.salesUserJunctionDb.fetchCommissionReportByYear(year, month))
            .then(userJunctionDoc => { return userJunctionDoc.length; })
            .catch(error => { throw new common_1.UnprocessableEntityException(error.message); });
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_decorator_1.DatabaseTable)('sales_commission_junction')),
    __param(1, (0, database_decorator_1.DatabaseTable)('sales_partner')),
    __param(2, (0, database_decorator_1.DatabaseTable)('sales_partner_requests')),
    __param(3, (0, database_decorator_1.DatabaseTable)('sales_user_junction')),
    __param(4, (0, database_decorator_1.DatabaseTable)('sales_user_junction')),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        database_service_1.DatabaseService,
        database_service_1.DatabaseService,
        database_service_1.DatabaseService,
        database_service_1.DatabaseService,
        template_service_1.TemplateService,
        axios_1.HttpService])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map