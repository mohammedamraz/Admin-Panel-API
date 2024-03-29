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
const login_dto_1 = require("./dto/login.dto");
const helper_1 = require("../../constants/helper");
const template_service_1 = require("../../constants/template.service");
const APP = 'AdminService';
let AdminService = class AdminService {
    constructor(salesJunctionDb, salesDb, salesPartnerRequestDb, salesuser, salesUserJunctionDb, templateService, http) {
        this.salesJunctionDb = salesJunctionDb;
        this.salesDb = salesDb;
        this.salesPartnerRequestDb = salesPartnerRequestDb;
        this.salesuser = salesuser;
        this.salesUserJunctionDb = salesUserJunctionDb;
        this.templateService = templateService;
        this.http = http;
        this.client = require('twilio')(constants_1.AMRAZ_ACCOUNTID, constants_1.AMRAZ_AUTHTOKEN);
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
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.TOO_MANY_REQUESTS,
                    error: 'Please wait for a short period of time and make the request again',
                }, common_1.HttpStatus.TOO_MANY_REQUESTS);
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
        this.encryptPassword = (password) => {
            const NodeRSA = require('node-rsa');
            let key_public = new NodeRSA(constants_1.PUBLIC_KEY);
            var encryptedString = { passcode: key_public.encrypt(password, 'base64') };
            return encryptedString;
        };
    }
    fetchSalesPartnerAccountDetails() {
        common_1.Logger.debug(`fetchSalesPartnerAccountDetails()`, APP);
        return this.salesDb
            .find({ block_account: false, is_hsa_account: true })
            .pipe((0, rxjs_1.map)((salesDoc) => {
            if (salesDoc.length === 0)
                throw new common_1.NotFoundException('sales partner not found');
            return this.fetchUser(salesDoc);
        }), (0, rxjs_1.catchError)((err) => {
            throw new common_1.BadRequestException(err.message);
        }));
    }
    fetchCommissionDispersals(period) {
        common_1.Logger.debug(`fetchCommissionDispersals()  period: [${JSON.stringify(period)}]`, APP);
        return this.salesJunctionDb
            .fetchBetweenRange((0, login_dto_1.fetchDAte)(new Date(), login_dto_1.PERIODADMIN[period.period]))
            .pipe((0, rxjs_1.switchMap)((salesJunctionDoc) => this.fetchPreviousMonthCommissionDispersal(salesJunctionDoc, period, new Date((0, login_dto_1.fetchDAte)(new Date(), login_dto_1.PERIODADMIN[period.period]).from))));
    }
    fetchPreviousMonthCommissionDispersal(createSalesJunction, period, date) {
        common_1.Logger.debug(`fetchPreviousMonthCommissionDispersal() createSalesJunction: [${JSON.stringify(createSalesJunction)}] period: [${JSON.stringify(period)}] date: [${date}]`, APP);
        return this.salesJunctionDb
            .fetchBetweenRange((0, login_dto_1.fetchDAte)(date, login_dto_1.PERIODADMIN[period.period]))
            .pipe((0, rxjs_1.map)((salesJunctionDoc) => ({
            thisMonth: createSalesJunction.reduce((acc, curr) => (acc += curr.paid_amount), 0),
            previousMonth: salesJunctionDoc.reduce((acc, curr) => (acc += curr.paid_amount), 0),
        })));
    }
    fetchInvitationResponse(state) {
        common_1.Logger.debug(`fetchInvitationResponse() state: [${JSON.stringify(state)}]`, APP);
        if (state.state !== 'all')
            return this.salesDb
                .find({ is_active: (0, login_dto_1.makeStateFormat)(state) })
                .pipe((0, rxjs_1.map)((doc) => this.fetchSignUps(doc, state)));
        return this.salesDb
            .fetchAll()
            .pipe((0, rxjs_1.map)((doc) => this.fetchSignUps(doc, state)));
    }
    fetchSignUps(createSalesPartner, state) {
        common_1.Logger.debug(`fetchSignUps() createSalesPartner: [${JSON.stringify(createSalesPartner)}]`, APP);
        let signups = [];
        return (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(createSalesPartner).pipe((0, rxjs_1.concatMap)((salesPartner) => this.salesuser.findByPeriod({
            columnName: 'sales_code',
            columnvalue: salesPartner.sales_code,
            period: create_sale_dto_1.PERIOD[state.period],
        })), (0, rxjs_1.map)((salesuser) => signups.push(salesuser.length)))).then(() => ({
            signups: signups.reduce((acc, curr) => (acc += curr), 0),
        }));
    }
    fetchSalesPartner(period) {
        common_1.Logger.debug(`fetchSalesPartner() period: [${JSON.stringify(period)}]`, APP);
        return this.salesDb.fetchAllByPeriod((0, create_sale_dto_1.Interval)(period)).pipe((0, rxjs_1.catchError)((err) => {
            throw new common_1.BadRequestException(err.message);
        }), (0, rxjs_1.map)((doc) => {
            if (doc.length === 0)
                throw new common_1.NotFoundException('sales partner not found');
            return this.fetchSalesPartnerCommission(doc, period);
        }));
    }
    fetchSalesPartnerCommission(createSalesPartner, period) {
        common_1.Logger.debug(`fetchSalesPartnerCommission() createSalesPartner: [${JSON.stringify(createSalesPartner)}]`, APP);
        let commission = [];
        return (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(createSalesPartner).pipe((0, rxjs_1.switchMap)((salesPartner) => (0, rxjs_1.lastValueFrom)(this.fetchTotalCommission(salesPartner, period)).then((doc) => {
            commission.push(doc);
        })))).then((_doc) => (Object.assign(Object.assign({}, commission.reduce((prev, current) => current.totalCommission > prev.totalCommission ? current : prev)), { count: createSalesPartner.length })));
    }
    fetchTotalCommission(createSalesPartner, period) {
        common_1.Logger.debug(`fetchTotalCommission() CreateSalesPartner: [${JSON.stringify(createSalesPartner)}] , period: [${JSON.stringify(period)}]`, APP);
        return this.salesJunctionDb
            .find({ sales_code: createSalesPartner.sales_code })
            .pipe((0, rxjs_1.concatMap)((doc) => this.fetchSalesPartnerSignups(doc, createSalesPartner, period)), (0, rxjs_1.map)((doc) => doc));
    }
    fetchSalesPartnerSignups(createSalesJunction, createSalesPartner, period) {
        common_1.Logger.debug(`fetchSalesPartnerSignups() createSalesJunction: [${JSON.stringify(createSalesJunction)}],  CreateSalesPartner: [${JSON.stringify(createSalesPartner)}], period: [${JSON.stringify(period)}]`, APP);
        return this.salesuser
            .find({ sales_code: createSalesPartner.sales_code })
            .pipe((0, rxjs_1.map)((doc) => ({
            totalCommission: createSalesJunction.reduce((acc, curr) => (acc += curr.commission_amount), 0),
            name: createSalesPartner.name,
            signups: doc.length,
        })));
    }
    async fetchUser(createSalesPartner) {
        common_1.Logger.debug(`fetchUser() createSalesPartner: ${JSON.stringify(createSalesPartner)}`, APP);
        let salesPartnerAccountDetails = [];
        return (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(createSalesPartner).pipe((0, rxjs_1.concatMap)((saleDoc) => (0, rxjs_1.lastValueFrom)((0, helper_1.fetchUser)(saleDoc.user_id.toString()))
            .then((userDoc) => this.fetchAccount(userDoc, saleDoc).then((result) => {
            salesPartnerAccountDetails.push(result);
        }))
            .catch((error) => {
            throw new common_1.UnprocessableEntityException(error.message);
        })))).then((_doc) => salesPartnerAccountDetails);
    }
    async fetchAccount(userDoc, saleDoc) {
        common_1.Logger.debug(`fetchAccount() userDoc: ${JSON.stringify(userDoc)}  saleDoc: ${JSON.stringify(saleDoc)}`, APP);
        return (0, rxjs_1.lastValueFrom)((0, helper_1.fetchAccount)(userDoc[0].fedo_id, String(userDoc[0].account_id))).then(async (accountDoc) => {
            const salesJunctionDoc = await (0, rxjs_1.lastValueFrom)(this.salesJunctionDb.find({ sales_code: saleDoc.sales_code })).catch((error) => {
                throw new common_1.NotFoundException(error.message);
            });
            console.log('SALESJUNCTION', salesJunctionDoc);
            return {
                account_holder_name: accountDoc.name,
                account_number: accountDoc.account_number,
                ifsc_code: accountDoc.ifsc_code,
                bank: accountDoc.bank_name,
                sales_code: saleDoc.sales_code,
                remarks: salesJunctionDoc[0].payout.toLocaleString('default', { month: 'long' }) + '  payout',
                payout: salesJunctionDoc[0].payout,
                status: salesJunctionDoc[0].dues === 0 ? 'paid' : 'unpaid',
                commission_amount: salesJunctionDoc.pop().dues,
            };
        });
    }
    fetchSalesPartnerAccountDetailsBySalesCode(salesCode) {
        common_1.Logger.debug(`fetchSalesPartnerAccountDetailsBySalesCode() salesCode: ${salesCode}`, APP);
        return this.salesDb.find({ sales_code: salesCode }).pipe((0, rxjs_1.map)((salesDoc) => {
            if (salesDoc.length === 0)
                throw new common_1.NotFoundException('sales partner not found');
            return this.fetchUserById(salesDoc);
        }), (0, rxjs_1.catchError)((err) => {
            throw new common_1.BadRequestException(err.message);
        }));
    }
    async fetchUserById(createSalesPartner) {
        common_1.Logger.debug(`fetchUserById() createSalesPartner: ${JSON.stringify(createSalesPartner)}`, APP);
        let salesPartnerAccountData = [];
        if (!createSalesPartner[0].user_id)
            throw new common_1.NotFoundException('HSA account not found ');
        return (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(createSalesPartner).pipe((0, rxjs_1.concatMap)(async (saleDoc) => await (0, rxjs_1.lastValueFrom)((0, helper_1.fetchUser)(saleDoc.user_id.toString()))
            .then((userDoc) => this.fetchAccountById(userDoc, saleDoc).then((result) => {
            salesPartnerAccountData.push(result);
        }))
            .catch((error) => {
            throw new common_1.UnprocessableEntityException(error.message);
        })))).then((doc) => salesPartnerAccountData);
    }
    async fetchAccountById(userDoc, saleDoc) {
        common_1.Logger.debug(`fetchAccountById() userDoc: ${JSON.stringify(userDoc)}  saleDoc: ${JSON.stringify(saleDoc)}`, APP);
        return (0, rxjs_1.lastValueFrom)((0, helper_1.fetchAccount)(userDoc[0].fedo_id, userDoc[0].account_id.toString())).then(async (accountDoc) => {
            const salesJunctionDoc = await (0, rxjs_1.lastValueFrom)(this.salesJunctionDb.find({ sales_code: saleDoc.sales_code })).catch((error) => {
                throw new common_1.NotFoundException(error.message);
            });
            return {
                account_holder_name: accountDoc.name,
                account_number: accountDoc.account_number,
                ifsc_code: accountDoc.ifsc_code,
                bank: accountDoc.bank_name,
                sales_code: saleDoc.sales_code,
                commission_amount: salesJunctionDoc.pop().dues,
            };
        });
    }
    sentOtpToPhoneNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sentOtpToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.http
            .post(`${constants_1.GUPSHUP_OTP_VERIFICATION}&phone_no=${mobileNumberDtO.phoneNumber}${constants_1.GUPSHUP_OTP_MESSAGE_FORMAT}`)
            .pipe((0, rxjs_1.catchError)((err) => {
            return err;
        }), (0, rxjs_1.map)((doc) => {
            return { status: doc['data'] };
        }));
    }
    verifyOtp(mobileNumberAndOtpDtO) {
        common_1.Logger.debug(`verifyOtp() mobileNumberAndOtpDtO: [${JSON.stringify(mobileNumberAndOtpDtO)}]`, APP);
        return this.http
            .post(`${constants_1.GUPSHUP_OTP_VERIFICATION}&phone_no=${mobileNumberAndOtpDtO.phoneNumber}&otp_code=${mobileNumberAndOtpDtO.otp}`)
            .pipe((0, rxjs_1.catchError)((err) => {
            return err;
        }), (0, rxjs_1.map)((doc) => {
            var data = doc['data'].split(' ');
            if (data[0] === 'success') {
                return { status: doc['data'] };
            }
            else {
                throw new common_1.HttpException({ status: data[2], error: data.slice(4, 9).join(' ') }, common_1.HttpStatus.BAD_REQUEST);
            }
        }));
    }
    sentFedoAppDownloadLinkToPhoneNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sentFedoAppDownloadLinkToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.client.messages
            .create({
            body: constants_1.APP_DOWNLOAD_LINK,
            from: constants_1.TWILIO_PHONE_NUMBER,
            to: mobileNumberDtO.phoneNumber,
        })
            .then((_res) => ({
            status: `Link ${constants_1.APP_DOWNLOAD_LINK}  send to  ${mobileNumberDtO.phoneNumber} number`,
        }))
            .catch((err) => this.onTwilioErrorResponse(err));
    }
    sentFedoAppDownloadLinkToWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sentFedoAppDownloadLinkToWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.client.messages
            .create({
            body: constants_1.APP_DOWNLOAD_LINK,
            from: `whatsapp:${constants_1.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${mobileNumberDtO.phoneNumber}`,
        })
            .then((_res) => ({
            status: `Link ${constants_1.APP_DOWNLOAD_LINK}  send to  ${mobileNumberDtO.phoneNumber} whatsapp number`,
        }))
            .catch((err) => this.onTwilioErrorResponse(err));
    }
    sentFedoAppDownloadLinkToMobileAndWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sentFedoAppDownloadLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return (0, rxjs_1.from)(this.sentFedoAppDownloadLinkToPhoneNumber(mobileNumberDtO)).pipe((0, rxjs_1.map)((_doc) => this.sentFedoAppDownloadLinkToWhatsappNumber(mobileNumberDtO)), (0, rxjs_1.switchMap)((doc) => (0, rxjs_1.of)({ status: 'Download link sent' })));
    }
    sendEmailOnIncorrectBankDetails(body, param) {
        common_1.Logger.debug(`sendEmailOnIncorrectBankDetails() body: [${JSON.stringify(body)}] param: [${JSON.stringify(param)}] `, APP);
        return (0, helper_1.fetchUserByMobileNumber)(param.mobileNumber).pipe((0, rxjs_1.map)((doc) => {
            this.salesParterEmail = doc[0].email;
            return doc;
        }), (0, rxjs_1.switchMap)((doc) => this.salesDb.find({ user_id: doc[0].fedo_id })), (0, rxjs_1.switchMap)((doc) => {
            if (doc.length === 0)
                throw new common_1.NotFoundException('Sales Partner not found');
            else
                this.salesPartnerDetails = doc[0];
            return this.salesPartnerRequestDb.save({
                sales_code: doc[0].sales_code,
            });
        }), (0, rxjs_1.switchMap)((doc) => {
            const request_id = 'FEDSPSR' + doc[0].id;
            this.salesPartnerRequestDetails = doc[0];
            return this.salesPartnerRequestDb.findByIdandUpdate({
                id: doc[0].id,
                quries: { request_id: request_id },
            });
        }), (0, rxjs_1.switchMap)((_doc) => this.salesPartnerRequestDb.find({
            id: this.salesPartnerRequestDetails.id,
        })), (0, rxjs_1.switchMap)((doc) => {
            var _a;
            if (doc.length === 0)
                throw new common_1.NotFoundException('Sales Partner Request Details not found');
            else
                return this.templateService
                    .sendEmailOnIncorrectBankDetailsToSupportEmail({
                    toAddresses: [this.salesParterEmail],
                    subject: 'Incorrect Bank Details',
                }, {
                    name: (_a = this.salesPartnerDetails) === null || _a === void 0 ? void 0 : _a.name,
                    message: body.message,
                    request_id: doc[0].request_id,
                })
                    .then((_res) => {
                    var _a;
                    return this.templateService.sendEmailOnIncorrectBankDetailsToHsaEmail({ toAddresses: ['support@fedo.health'] }, {
                        name: (_a = this.salesPartnerDetails) === null || _a === void 0 ? void 0 : _a.name,
                        message: body.message,
                        request_id: doc[0].request_id,
                    });
                })
                    .catch((err) => {
                    throw new common_1.BadRequestException(err);
                });
        }));
    }
    sendEmailOnCreationOfDirectSalesPartner(body) {
        common_1.Logger.debug(`sendEmailOnCreationOfDirectSalesPartner() body: [${JSON.stringify(body)}]`, APP);
        return this.templateService.sendEmailOnCreationOfDirectSalesPartner(body);
    }
    sendEmailOnGreivanceRegressal(body) {
        common_1.Logger.debug(`sendEmailOnGreivanceRegressal() body: [${JSON.stringify(body)}]`, APP);
        return this.templateService.sendEmailOnGreivanceRegressal(body);
    }
    login(logindto) {
        common_1.Logger.debug(`admin-console login() loginDTO:[${JSON.stringify(Object.keys(logindto))}}] UserLoginDTO:[${JSON.stringify(logindto)}]`);
        logindto.fedoApp = constants_1.FEDO_APP;
        return this.http
            .post(`${constants_1.AWS_COGNITO_USER_CREATION_URL_SIT}/token`, this.encryptPassword(logindto))
            .pipe((0, rxjs_1.catchError)((err) => {
            return this.onAWSErrorResponse(err);
        }), (0, rxjs_1.map)((res) => {
            if (!res.data)
                throw new common_1.UnauthorizedException();
            return {
                jwtToken: res.data.idToken.jwtToken,
                refreshToken: res.data.refreshToken,
                accessToken: res.data.accessToken.jwtToken,
            };
        }));
    }
    forgotPassword(forgotPasswordDTO) {
        common_1.Logger.debug(`admin-console forgotPassword() forgotPasswordDTO:[${JSON.stringify(forgotPasswordDTO)}]`);
        forgotPasswordDTO.fedoApp = constants_1.FEDO_APP;
        const passcode = this.encryptPassword(forgotPasswordDTO);
        return this.http
            .post(`${constants_1.AWS_COGNITO_USER_CREATION_URL_SIT}/password/otp/`, passcode)
            .pipe((0, rxjs_1.catchError)((err) => {
            console.log(err);
            return this.onAWSErrorResponse(err);
        }), (0, rxjs_1.map)((res) => res.data));
    }
    confirmForgotPassword(confirmForgotPasswordDTO) {
        common_1.Logger.debug(`admin-console confirmForgotPassword() confirmForgotPasswordDTO:[${JSON.stringify(confirmForgotPasswordDTO)}]`);
        confirmForgotPasswordDTO.fedoApp = constants_1.FEDO_APP;
        const passcode = this.encryptPassword(confirmForgotPasswordDTO);
        return this.http
            .patch(`${constants_1.AWS_COGNITO_USER_CREATION_URL_SIT}/password/otp/${confirmForgotPasswordDTO.ConfirmationCode}`, passcode)
            .pipe((0, rxjs_1.catchError)((err) => {
            return this.onHTTPErrorResponse(err);
        }), (0, rxjs_1.map)((_res) => []));
    }
    async updatePaidAmount(updateAmountdto) {
        common_1.Logger.debug(`updatePaidAmount() updateAmountdto: [${JSON.stringify(updateAmountdto)}]`, APP);
        await (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(updateAmountdto['data']).pipe((0, rxjs_1.map)((res) => {
            return (0, rxjs_1.lastValueFrom)(this.salesJunctionDb.find({ sales_code: res.salesCode }).pipe((0, rxjs_1.map)((doc) => {
                var _a, _b;
                const sort_doc = Math.max(...doc.map((user) => parseInt(user['id'].toString())));
                const user_doc = doc.filter((item) => item['id'] == sort_doc);
                const finalRes = (_a = user_doc[0]) === null || _a === void 0 ? void 0 : _a.dues;
                const dueCommission = Number(finalRes) - Number(res.paid_amount);
                if (user_doc.length != 0)
                    return this.salesJunctionDb.save({
                        sales_code: (_b = user_doc[0]) === null || _b === void 0 ? void 0 : _b.sales_code,
                        paid_amount: res.paid_amount,
                        dues: dueCommission,
                    });
            })));
        })));
    }
    sendCreateSalesPartnerLinkToPhoneNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sendCreateSalesPartnerLinkToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.client.messages
            .create({
            body: `Click on Link ${constants_1.SALES_PARTNER_LINK}?query=${encodeURIComponent(this.encryptPassword_(JSON.stringify(mobileNumberDtO)))}`,
            from: constants_1.TWILIO_PHONE_NUMBER,
            to: mobileNumberDtO.phoneNumber,
        })
            .then((_res) => ({
            status: `Link ${constants_1.SALES_PARTNER_LINK}  send to  ${mobileNumberDtO.phoneNumber} number`,
        }))
            .catch((err) => this.onTwilioErrorResponse(err));
    }
    sendCreateSalesPartnerLinkToWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sendCreateSalesPartnerLinkToWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.client.messages
            .create({
            body: `Click on Link ${constants_1.SALES_PARTNER_LINK}?query=${encodeURIComponent(this.encryptPassword_(JSON.stringify(mobileNumberDtO)))}`,
            from: `whatsapp:${constants_1.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${mobileNumberDtO.phoneNumber}`,
        })
            .then((_res) => ({
            status: `Link ${constants_1.SALES_PARTNER_LINK}  send to  ${mobileNumberDtO.phoneNumber} whatsapp number`,
        }))
            .catch((err) => this.onTwilioErrorResponse(err));
    }
    sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sendCreateSalesPartnerLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return (0, rxjs_1.from)(this.sendCreateSalesPartnerLinkToPhoneNumber(mobileNumberDtO)).pipe((0, rxjs_1.map)((_doc) => this.sendCreateSalesPartnerLinkToWhatsappNumber(mobileNumberDtO)), (0, rxjs_1.switchMap)((doc) => (0, rxjs_1.of)({ status: 'Sales Partner link sent' })));
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
        return (0, rxjs_1.from)((0, create_admin_dto_1.fetchmonths)(yearMonthDto.year)).pipe((0, rxjs_1.concatMap)(async (month) => {
            return await (0, rxjs_1.lastValueFrom)(this.salesJunctionDb.fetchCommissionReportByYear(yearMonthDto.year, month))
                .then(async (salesJunctionDoc) => {
                const paidAmount = salesJunctionDoc.map((doc) => doc.paid_amount);
                const totalPaidAmount = paidAmount.reduce((next, prev) => next + prev, 0);
                const date = salesJunctionDoc.map((doc) => {
                    if (doc.paid_amount > 0)
                        return doc.created_date;
                });
                const paidOn = date.filter((res) => res);
                await this.fetchSignup(yearMonthDto.year, month - 1)
                    .then((signup) => {
                    if (month === (0, create_admin_dto_1.fetchmonths)(yearMonthDto.year)[0] && month !== 12)
                        this.fetchSignup(yearMonthDto.year, month).then((doc) => reportData.push({
                            month: month,
                            hsa_sign_up: doc,
                            dues: (0, create_admin_dto_1.fetchDues)(salesJunctionDoc),
                        }));
                    if (month === 12) {
                        (0, rxjs_1.lastValueFrom)(this.salesJunctionDb.fetchCommissionReportByYear(yearMonthDto.year, month)).then((salesJunctionDoc) => {
                            var _a;
                            reportData.push({
                                total_paid_amount: salesJunctionDoc.reduce((next, pre) => next + pre.paid_amount, 0),
                                month: 12,
                                hsa_sign_up: signup,
                                paid_on: (_a = salesJunctionDoc.filter((doc) => {
                                    if (doc.paid_amount > 0)
                                        return doc;
                                })[0]) === null || _a === void 0 ? void 0 : _a.created_date,
                            });
                        });
                    }
                    if (month - 1 !== 0)
                        reportData.push({
                            total_paid_amount: totalPaidAmount,
                            month: month - 1,
                            hsa_sign_up: signup,
                            paid_on: paidOn[0],
                        });
                })
                    .catch((error) => {
                    throw new common_1.NotFoundException(error.message);
                });
                return reportData;
            })
                .catch((error) => {
                throw new common_1.NotFoundException(error.message);
            })
                .then((_doc) => reportData.sort((a, b) => a.month < b.month ? 1 : b.month < a.month ? -1 : 0));
        }));
    }
    fetchMonthlyReport(dateDTO) {
        common_1.Logger.debug(`fetchMonthlyReport() date: [${JSON.stringify(dateDTO)}]`, APP);
        return this.salesDb
            .fetchAll()
            .pipe((0, rxjs_1.map)((salesDb) => this.fetchCommissionReportforSalesPartner(salesDb, dateDTO)));
    }
    fetchCommissionReportforSalesPartner(createSalesPartner, dateDTO) {
        common_1.Logger.debug(`fetchCommissionReportforSalesPartner() createSalesPartner: [${JSON.stringify(createSalesPartner)}]`, APP);
        let performance = [];
        return (0, rxjs_1.lastValueFrom)((0, rxjs_1.from)(createSalesPartner).pipe((0, rxjs_1.switchMap)((salesDoc) => {
            return (0, rxjs_1.lastValueFrom)(this.fetchSignupforPerformace(salesDoc, dateDTO)).then((doc) => performance.push(doc));
        }))).then((_doc) => (0, login_dto_1.applyPerformance)(performance, (0, login_dto_1.averageSignup)(createSalesPartner.length, performance.reduce((acc, curr) => (acc += curr.signups), 0))));
    }
    fetchSignupforPerformace(createSalesPartner, dateDTO) {
        common_1.Logger.debug(`fetchSignupAndPerformace() createSalesPartner: [${JSON.stringify(createSalesPartner)}]`, APP);
        return this.salesJunctionDb
            .fetchByYear({
            columnvalue: createSalesPartner.sales_code,
            year: dateDTO.year,
            month: dateDTO.month,
        })
            .pipe((0, rxjs_1.switchMap)((salesJunctionDoc) => this.fetchSignUpsforPerformance(createSalesPartner, salesJunctionDoc, dateDTO)));
    }
    fetchSignUpsforPerformance(createSalesPartner, createSalesJunction, dateDTO) {
        common_1.Logger.debug(`fetchSignUpsforPerformance() createSalesJunction: [${JSON.stringify(createSalesJunction)}]`, APP);
        return this.salesuser
            .fetchByYear({
            columnvalue: createSalesPartner.sales_code,
            year: dateDTO.year,
            month: dateDTO.month,
        })
            .pipe((0, rxjs_1.map)((doc) => (0, login_dto_1.makeEarningDuesFormat)(createSalesPartner.name, createSalesJunction.reduce((acc, curr) => (acc += curr.commission_amount), 0), !createSalesJunction[createSalesJunction.length - 1]
            ? 0
            : createSalesJunction[createSalesJunction.length - 1].dues, doc.length)));
    }
    async fetchSignup(year, month) {
        common_1.Logger.debug(`fetchSignup() year: [${year}] month: [${month}]`, APP);
        return await (0, rxjs_1.lastValueFrom)(this.salesUserJunctionDb.fetchCommissionReportByYear(year, month))
            .then((userJunctionDoc) => {
            return userJunctionDoc.length;
        })
            .catch((error) => {
            throw new common_1.UnprocessableEntityException(error.message);
        });
    }
    sendNotificationToSalesPartnerOnMobile(mobileNumberDtO) {
        common_1.Logger.debug(`sendCreateSalesPartnerLinkToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.client.messages
            .create({
            body: `Click on Link ${constants_1.SALES_PARTNER_NOTIFICATION}?query=${this.encryptPassword_(JSON.stringify(mobileNumberDtO))}`,
            from: constants_1.TWILIO_PHONE_NUMBER,
            to: mobileNumberDtO.phoneNumber,
        })
            .then((_res) => ({
            status: `Link ${constants_1.SALES_PARTNER_NOTIFICATION}  send to  ${mobileNumberDtO.phoneNumber} number`,
        }))
            .catch((err) => this.onTwilioErrorResponse(err));
    }
    sendNotificationToSalesPartnerOnWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sendCreateSalesPartnerLinkToWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return this.client.messages
            .create({
            body: `Click on Link ${constants_1.SALES_PARTNER_NOTIFICATION}?query=${this.encryptPassword_(JSON.stringify(mobileNumberDtO))}`,
            from: `whatsapp:${constants_1.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${mobileNumberDtO.phoneNumber}`,
        })
            .then((_res) => ({
            status: `Link ${constants_1.SALES_PARTNER_NOTIFICATION}  send to  ${mobileNumberDtO.phoneNumber} whatsapp number`,
        }))
            .catch((err) => this.onTwilioErrorResponse(err));
    }
    sendNotificationToSalesPartnerOnMobileAndWhatsappNumber(mobileNumberDtO) {
        common_1.Logger.debug(`sendCreateSalesPartnerLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
        return (0, rxjs_1.from)(this.sendNotificationToSalesPartnerOnMobile(mobileNumberDtO)).pipe((0, rxjs_1.map)((_doc) => this.sendNotificationToSalesPartnerOnWhatsappNumber(mobileNumberDtO)), (0, rxjs_1.switchMap)((doc) => (0, rxjs_1.of)({ status: 'Notification send on mobile and whatsapp' })));
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