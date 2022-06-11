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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const sales_service_1 = require("./sales.service");
const multer_1 = require("multer");
const constants_1 = require("../../constants");
const helper_1 = require("../../constants/helper");
const APP = 'SalesController';
let SalesController = class SalesController {
    constructor(salesService) {
        this.salesService = salesService;
    }
    createSalesPartner(createSalesPartner) {
        common_1.Logger.debug(`createSalesPartner() DTO:${JSON.stringify(createSalesPartner)}`, APP);
        return this.salesService.createSalesPartner(createSalesPartner);
    }
    addCommission(salesCode) {
        common_1.Logger.debug(`addCommission() salesCode: [${salesCode}] `, APP);
        return this.salesService.addCommission(salesCode);
    }
    deleteSalesPartner(id) {
        common_1.Logger.debug(`deleteSalesPartner() id: [${id}]`, APP);
        return this.salesService.deleteSalesPartner(id);
    }
    fetchSalesPartnerById(id) {
        common_1.Logger.debug(`fetchSalesPartnerById() id: [${id}]`, APP);
        return this.salesService.fetchSalesPartnerById(id);
    }
    fetchEarnings(salesCode, period) {
        common_1.Logger.debug(`fetchEarnings()salesCode: [${salesCode}] `, APP);
        return this.salesService.fetchEarnings(salesCode, period);
    }
    fetchAllSalesPartnersByDate(params) {
        common_1.Logger.debug(`fetchAllSalesPartnersByDate() params:${JSON.stringify(params)}`, APP);
        return this.salesService.fetchAllSalesPartnersByDate(params);
    }
    fetchAllSalesPartnersFromJunctionByDate(id, params) {
        common_1.Logger.debug(`fetchAllSalesPartnersFromJunctionByDate() id: [${id}] params:${JSON.stringify(params)}`, APP);
        return this.salesService.fetchAllSalesPartnersFromJunctionByDate(id, params);
    }
    async uploadImage(id, file) {
        common_1.Logger.debug(`UploadImage: ${file}`, APP);
        return this.salesService.uploadImage(id, file.filename);
    }
    updateSalesPartner(id, updateSalesPartnerDto) {
        common_1.Logger.debug(`updateSalesPartner() id: [${id}] DTO:${JSON.stringify(updateSalesPartnerDto)}`, APP);
        return this.salesService.updateSalesPartner(id, updateSalesPartnerDto);
    }
    changeBankDetailsVerificationStatus(id) {
        common_1.Logger.debug(`changeBankDetailsVerificationSatatus() id:[${id}] `, APP);
        return this.salesService.changeBankDetailsVerificationSatatus(id);
    }
    updateUserIdInSales(id, updateSalesPartnerDto) {
        common_1.Logger.debug(`updateCustomerIdInSales() id: [${id}] DTO:${JSON.stringify(updateSalesPartnerDto)}`, APP);
        return this.salesService.updateUserIdInSales(id, updateSalesPartnerDto);
    }
    fetchEarnigReport(yearMonthDto) {
        common_1.Logger.debug(`fetchEarnigReport() year: [${yearMonthDto.year}`, APP);
        return this.salesService.fetchEarnigReport(yearMonthDto);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_1.CreateSalesPartner]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "createSalesPartner", null);
__decorate([
    (0, common_1.Post)(':sales_code/addCommission'),
    __param(0, (0, common_1.Param)('sales_code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "addCommission", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "deleteSalesPartner", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "fetchSalesPartnerById", null);
__decorate([
    (0, common_1.Get)(':salesCode/earning'),
    __param(0, (0, common_1.Param)('salesCode')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_sale_dto_1.Period]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "fetchEarnings", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_1.ZQueryParamsDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "fetchAllSalesPartnersByDate", null);
__decorate([
    (0, common_1.Get)(':id/sales_junction'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_sale_dto_1.ZQueryParamsDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "fetchAllSalesPartnersFromJunctionByDate", null);
__decorate([
    (0, common_1.Patch)(':id/image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            _destination: constants_1.STATIC_IMAGES_PROFILE,
            get destination() {
                return this._destination;
            },
            set destination(value) {
                this._destination = value;
            },
            filename: helper_1.editFileName,
        }),
        fileFilter: helper_1.imageFileFilter,
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_sale_dto_1.UpdateSalesPartner]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "updateSalesPartner", null);
__decorate([
    (0, common_1.Patch)('bank-details-verification/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "changeBankDetailsVerificationStatus", null);
__decorate([
    (0, common_1.Patch)(':id/updateCustomer'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_sale_dto_1.UpdateSalesPartner]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "updateUserIdInSales", null);
__decorate([
    (0, common_1.Get)(':salesCode/earning-report/:year'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sale_dto_1.YearMonthDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "fetchEarnigReport", null);
SalesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
exports.SalesController = SalesController;
//# sourceMappingURL=sales.controller.js.map