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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const database_decorator_1 = require("../../lib/database/database.decorator");
const database_service_1 = require("../../lib/database/database.service");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const axios_1 = require("@nestjs/axios");
const helper_1 = require("../../constants/helper");
const rxjs_1 = require("rxjs");
const create_admin_dto_1 = require("../admin/dto/create-admin.dto");
const APP = 'SalesService';
let SalesService = class SalesService {
    constructor(db, invitationJunctiondb, junctiondb, withdrawndb, salesuser, salesUserJunctionDb, http) {
        this.db = db;
        this.invitationJunctiondb = invitationJunctiondb;
        this.junctiondb = junctiondb;
        this.withdrawndb = withdrawndb;
        this.salesuser = salesuser;
        this.salesUserJunctionDb = salesUserJunctionDb;
        this.http = http;
    }
    createSalesPartner(createSalesPartner) {
        common_1.Logger.debug(`createSalesPartner() DTO:${JSON.stringify(createSalesPartner)}`, APP);
        let userId;
        let salesId;
        var todayDate;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        todayDate = mm + dd;
        return this.fetchSalesPartnerByMobileNumber(createSalesPartner.mobile).pipe((0, rxjs_1.switchMap)(doc => (0, helper_1.fetchUserByMobileNumber)(createSalesPartner.mobile)), (0, rxjs_1.switchMap)(doc => {
            if (!doc[0])
                return this.db.save({ name: createSalesPartner.name, location: createSalesPartner.location, commission: createSalesPartner.commission, mobile: createSalesPartner.mobile, email: createSalesPartner.email });
            else
                return this.db.save({ name: createSalesPartner.name, location: createSalesPartner.location, commission: createSalesPartner.commission, mobile: createSalesPartner.mobile, email: createSalesPartner.email, user_id: doc[0].fedo_id });
        }), (0, rxjs_1.switchMap)(doc => { salesId = doc[0].id; createSalesPartner.sales_code = "FEDSP" + todayDate + 500 + doc[0].id; createSalesPartner.id = doc[0].id; return this.junctiondb.save({ sales_code: "FEDSP" + todayDate + 500 + doc[0].id }).pipe((0, rxjs_1.catchError)(err => { throw new common_1.BadRequestException(err.message); }), (0, rxjs_1.map)(doc => doc)); }), (0, rxjs_1.switchMap)(doc => this.createInvitation(createSalesPartner, doc)), (0, rxjs_1.switchMap)(doc => this.updateSalesPartner(salesId, { sales_code: createSalesPartner.sales_code })), (0, rxjs_1.switchMap)(doc => this.fetchSalesPartnerById(createSalesPartner.id.toString())));
    }
    createInvitation(createSalesPartner, createSalesJunction) {
        if (createSalesPartner.refered_by)
            return this.invitationJunctiondb.save({ sp_id: createSalesPartner.sales_code, refered_by: createSalesPartner.refered_by }).pipe((0, rxjs_1.switchMap)(_doc => this.invitationJunctiondb.find({ refered_by: createSalesPartner.refered_by })), (0, rxjs_1.switchMap)(doc => this.db.findandUpdate({ columnName: 'sales_code', columnvalue: createSalesPartner.refered_by, quries: { sales_invitation_count: doc.length } })));
        else
            return createSalesJunction;
    }
    fetchSalesPartnerByMobileNumber(mobile) {
        common_1.Logger.debug(`fetchSalesPartnerByUserId() id: [${JSON.stringify(mobile)}]`, APP);
        return (0, rxjs_1.from)((0, rxjs_1.lastValueFrom)(this.db.find({ mobile: mobile }).pipe((0, rxjs_1.catchError)(err => { throw new common_1.UnprocessableEntityException(err.message); }), (0, rxjs_1.map)((res) => {
            if (res[0] != null)
                throw new common_1.NotFoundException(`sales partner already present with same phone number`);
            return res;
        }))));
    }
    fetchSalesPartnerByUserId(id) {
        common_1.Logger.debug(`fetchSalesPartnerByUserId() id: [${JSON.stringify(id)}]`, APP);
        return (0, rxjs_1.from)((0, rxjs_1.lastValueFrom)(this.db.find({ user_id: id }).pipe((0, rxjs_1.catchError)(err => { throw new common_1.UnprocessableEntityException(err.message); }), (0, rxjs_1.map)((res) => {
            if (res[0] !== null)
                throw new common_1.NotFoundException(`user already present with same phone number`);
            return res;
        }))));
    }
    fetchSalesPartnerById(id) {
        common_1.Logger.debug(`fetchSalesPartnerById() id: [${JSON.stringify(id)}]`, APP);
        return (0, rxjs_1.from)((0, rxjs_1.lastValueFrom)(this.db.find({ id: id }).pipe((0, rxjs_1.catchError)(err => { throw new common_1.UnprocessableEntityException(err.message); }), (0, rxjs_1.map)((res) => {
            if (res[0] == null)
                throw new common_1.NotFoundException(`Sales Partner Not Found`);
            if (res[0].is_active == false)
                throw new common_1.NotFoundException(`Sales Partner Not Found`);
            return res;
        }))));
    }
    deleteSalesPartner(id) {
        common_1.Logger.debug(`deleteSalesPartner id: [${id}]`, APP);
        return this.db.find({ id: id }).pipe((0, rxjs_1.map)(res => {
            if (res[0] === null)
                throw new common_1.NotFoundException(`Sales Partner Not Found`);
            if (res[0].is_active.toString() === "false")
                throw new common_1.NotFoundException(`Sales Partner Not Found`);
            return (0, rxjs_1.lastValueFrom)(this.db.findandUpdate({ columnName: 'id', columnvalue: id, quries: { "is_active": "false" } }).pipe((0, rxjs_1.catchError)(err => { throw new common_1.BadRequestException(); }), (0, rxjs_1.map)(doc => { return doc; })));
        }));
    }
    updateSalesPartner(id, updateSalesPartnerDto) {
        common_1.Logger.debug(`updateSalesPartner() id: [${id}], body: [${JSON.stringify(updateSalesPartnerDto)}]`, APP);
        return this.db.find({ id: id }).pipe((0, rxjs_1.map)(res => {
            if (res[0] === null)
                throw new common_1.NotFoundException(`Sales Partner Not Found`);
            if (res[0].is_active === false)
                throw new common_1.NotFoundException(`Sales Partner Not Found`);
            return (0, rxjs_1.lastValueFrom)(this.db.findByIdandUpdate({ id: String(id), quries: updateSalesPartnerDto }).pipe((0, rxjs_1.catchError)(err => { throw new common_1.BadRequestException(); }), (0, rxjs_1.map)(doc => { return doc; })));
        }));
    }
    fetchAllSalesPartnersByDate(params) {
        common_1.Logger.debug(`fetchAllSalesPartnersByDate() params:[${JSON.stringify(params)}] `, APP);
        if (Object.keys(params).length == 0)
            return this.db.fetchAll();
        else {
            if (params.date === undefined)
                return this.db.findByAlphabet(params).pipe((0, rxjs_1.map)(doc => { return doc; }));
            else
                return this.db.findByDate(this.makeDateFormat(params)).pipe((0, rxjs_1.map)(doc => { return doc; }));
        }
    }
    fetchCommissionFromJunctionDb(params) {
        common_1.Logger.debug(`fetchCommissionFromJunctionDb() params:[${JSON.stringify(params)}] `, APP);
        if (params.date === undefined)
            return [];
        else
            return this.junctiondb.findByDate(this.makeDateFormat(params)).pipe((0, rxjs_1.map)(doc => { return doc; }));
    }
    fetchAllSalesPartnersFromJunctionByDate(id, params) {
        common_1.Logger.debug(`fetchAllSalesPartnersByDate() id: [${id}] params:[${JSON.stringify(params)}] `, APP);
        if (params.date == undefined)
            return [];
        else
            return this.invitationJunctiondb.findByConditionSales(id, this.makeDateFormat(params)).pipe((0, rxjs_1.map)(doc => { return doc; }));
    }
    makeDateFormat(params) {
        common_1.Logger.debug(`makeDateFormat() params:[${JSON.stringify(params)}] `, APP);
        let date = '';
        if (params.date === 'monthly')
            date = '30';
        else if (params.date === 'quarterly')
            date = '90';
        else if (params.date === 'weekly')
            date = '7';
        else if (params.date === 'yearly')
            date = '365';
        else if (params.date === 'daily')
            date = '1';
        const modifiedParams = {
            number_of_rows: params.number_of_rows,
            number_of_pages: params.number_of_pages,
            name: params.name,
            date: date,
            is_active: params.is_active
        };
        return modifiedParams;
    }
    uploadImage(id, fileName) {
        common_1.Logger.debug(`uploadImage(), ${fileName},`, APP);
        const imageDetails = {
            user_image: fileName,
        };
        return this.updateImageById(id, imageDetails);
    }
    ;
    updateImageById(id, updateSalesPartnerDto) {
        common_1.Logger.debug(`updateImageById() id: ${id} Body: ${JSON.stringify(updateSalesPartnerDto)}`, APP);
        return (0, rxjs_1.lastValueFrom)(this.db.findByIdandUpdate({ id: id, quries: updateSalesPartnerDto }).pipe((0, rxjs_1.map)(res => { return res; }), (0, rxjs_1.catchError)(error => { throw new common_1.BadRequestException(error.message); })));
    }
    fetchSalesBySalesCode(sales_code) {
        common_1.Logger.debug(`fetchSalesBySalesCode sales_code:${sales_code}`, APP);
        return this.db.find({ sales_code: sales_code }).pipe((0, rxjs_1.switchMap)(res => {
            if (res.length === 0)
                throw new common_1.NotFoundException("sales partner not found");
            return res;
        }));
    }
    fetchCommisionBySalesCode(salesCode) {
        common_1.Logger.debug(`fetchCommisionBySalesCode sales_code:${salesCode}`, APP);
        return this.junctiondb.find({ 'sales_code': salesCode }).pipe((0, rxjs_1.map)(res => {
            if (res.length === 0)
                throw new common_1.NotFoundException("sales partner not found");
            return res[res.length - 1];
        }));
    }
    changeBankDetailsVerificationSatatus(id) {
        common_1.Logger.debug(`changeBankDetailsVerificationSatatus() id: [${id}] `, APP);
        return (this.db.find({ id: id })).pipe((0, rxjs_1.catchError)(err => { (err); throw new common_1.UnprocessableEntityException(err.message); }), (0, rxjs_1.map)(res => {
            if (res.length === 0)
                throw new common_1.NotFoundException();
            return this.db.findByIdandUpdate({ id: String(id), quries: { 'bank_details_verification': true } });
        }));
    }
    fetchEarnings(salesCode, period) {
        common_1.Logger.debug(`fetchEarnings() salesCode: ${salesCode},  period: ${JSON.stringify(period)}`, APP);
        return this.junctiondb.findByPeriod({ columnName: "sales_code", columnvalue: salesCode, period: (0, create_sale_dto_1.Interval)(period) }).pipe((0, rxjs_1.map)(salesjuncdoc => {
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
    addCommission(salesCode) {
        common_1.Logger.debug(`addCommission() salesCode: ${salesCode}`, APP);
        return this.fetchSalesBySalesCode(salesCode).pipe((0, rxjs_1.switchMap)(salesCommission => (0, rxjs_1.lastValueFrom)(this.junctiondb.find({ "sales_code": String(salesCode), }))
            .then(res => { console.log('dds', res); return [salesCommission, res[res.length - 1]]; })), (0, rxjs_1.switchMap)(async ([salesCommission, res]) => { await this.salesuser.save({ sales_code: salesCode }); return [salesCommission, res]; }), (0, rxjs_1.switchMap)(([salesCommission, res]) => this.junctiondb.save({ sales_code: salesCode, commission_amount: salesCommission["commission"], dues: (Number(res['dues']) + Number(salesCommission["commission"])) })));
    }
    updateUserIdInSales(id, updateSalesPartnerDto) {
        common_1.Logger.debug(`updateSalesPartner() id: [${id}], body: [${JSON.stringify(updateSalesPartnerDto)}]`, APP);
        return this.db.find({ id: id }).pipe((0, rxjs_1.switchMap)(res => {
            if (res.length == 0)
                throw new common_1.NotFoundException(`Sales Partner Not Found`);
            else
                return (0, helper_1.findUserByCustomerId)(updateSalesPartnerDto.customer_id).pipe((0, rxjs_1.map)((userDoc) => {
                    if (userDoc.length == 0)
                        throw new common_1.NotFoundException("User not found");
                    else if (userDoc[0].userreference_id === updateSalesPartnerDto.customer_id) {
                        return (0, rxjs_1.lastValueFrom)(this.db.findByIdandUpdate({ id: id, quries: { user_id: userDoc[0].fedo_id } }).pipe((0, rxjs_1.catchError)(err => { throw new common_1.BadRequestException(err.message); }), (0, rxjs_1.map)(doc => { return doc; })));
                    }
                }));
        }));
    }
    fetchEarnigReport(yearMonthDto) {
        common_1.Logger.debug(`fetchCommissionReport() year: [${yearMonthDto.year}]`);
        const reportData = [];
        return (0, rxjs_1.from)((0, create_admin_dto_1.fetchmonths)((yearMonthDto.year))).pipe((0, rxjs_1.concatMap)(async (month) => {
            return await (0, rxjs_1.lastValueFrom)(this.junctiondb.fetchByYear({ columnName: 'sales_code', columnvalue: yearMonthDto.salesCode, year: yearMonthDto.year, month: month.toString() }))
                .then(async (salesJunctionDoc) => {
                const paid_amount = salesJunctionDoc.map(doc => doc.paid_amount);
                const total_paid_amount = paid_amount.reduce((next, prev) => next + prev, 0);
                const date = salesJunctionDoc.map(doc => { if (doc.paid_amount > 0)
                    return doc.created_date; });
                const paid_on = date.filter((res) => res);
                await this.fetchSignup(yearMonthDto.year, month, yearMonthDto)
                    .then(signup => {
                    var _a;
                    reportData.push({ "total_paid_amount": total_paid_amount, "month": month, "hsa_sing_up": signup, "paid_on": paid_on[0], 'total_dues': Number((_a = salesJunctionDoc[salesJunctionDoc.length - 1]) === null || _a === void 0 ? void 0 : _a.dues) });
                }).catch(error => { throw new common_1.NotFoundException(error.message); });
                return reportData;
            })
                .catch(error => { throw new common_1.NotFoundException(error.message); });
        }));
    }
    async fetchSignup(year, month, yearMonthDto) {
        common_1.Logger.debug(`fetchSignup() year: [${year}] month: [${month}] salesCode:[${yearMonthDto.salesCode}]`, APP);
        return await (0, rxjs_1.lastValueFrom)(this.salesUserJunctionDb.fetchSignUp({ columnName: 'sales_code', columnvalue: yearMonthDto.salesCode, year: yearMonthDto.year, month: month.toString() }))
            .then(userJunctionDoc => {
            console.log("junct", userJunctionDoc);
            console.log("junct", userJunctionDoc.length);
            return userJunctionDoc.length;
        })
            .catch(error => { throw new common_1.UnprocessableEntityException(error.message); });
    }
};
SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_decorator_1.DatabaseTable)('sales_partner')),
    __param(1, (0, database_decorator_1.DatabaseTable)('sales_partner_invitation_junction')),
    __param(2, (0, database_decorator_1.DatabaseTable)('sales_commission_junction')),
    __param(3, (0, database_decorator_1.DatabaseTable)('sales_withdrawn_amount')),
    __param(4, (0, database_decorator_1.DatabaseTable)('sales_user_junction')),
    __param(5, (0, database_decorator_1.DatabaseTable)('sales_user_junction')),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        database_service_1.DatabaseService,
        database_service_1.DatabaseService,
        database_service_1.DatabaseService,
        database_service_1.DatabaseService,
        database_service_1.DatabaseService,
        axios_1.HttpService])
], SalesService);
exports.SalesService = SalesService;
//# sourceMappingURL=sales.service.js.map