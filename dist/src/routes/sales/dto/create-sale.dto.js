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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesYearMonth = exports.YearMonthDto = exports.makeEarningFormat = exports.Interval = exports.EarningResponse = exports.PERIOD = exports.Period = exports.UpdateImageDTO = exports.Periodicity = exports.LoginDTO = exports.ZQueryParamsDto = exports.Is_active = exports.UpdateSalesPartner = exports.CreateSalesInvitationJunction = exports.CreateWithdrawn = exports.CreateSalesPartnerRequest = exports.CreateSalesPartner = exports.CreateSalesJunction = void 0;
const class_validator_1 = require("class-validator");
class CreateSalesJunction {
}
exports.CreateSalesJunction = CreateSalesJunction;
class CreateSalesPartner {
}
__decorate([
    (0, class_validator_1.IsPhoneNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSalesPartner.prototype, "mobile", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSalesPartner.prototype, "commission", void 0);
exports.CreateSalesPartner = CreateSalesPartner;
class CreateSalesPartnerRequest {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSalesPartnerRequest.prototype, "sales_code", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSalesPartnerRequest.prototype, "request_id", void 0);
exports.CreateSalesPartnerRequest = CreateSalesPartnerRequest;
class CreateWithdrawn {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateWithdrawn.prototype, "created_date", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateWithdrawn.prototype, "updated_date", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWithdrawn.prototype, "sp_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateWithdrawn.prototype, "paid_amount", void 0);
exports.CreateWithdrawn = CreateWithdrawn;
class CreateSalesInvitationJunction {
}
exports.CreateSalesInvitationJunction = CreateSalesInvitationJunction;
class UpdateSalesPartner {
}
exports.UpdateSalesPartner = UpdateSalesPartner;
var Is_active;
(function (Is_active) {
    Is_active["TRUE"] = "true";
    Is_active["FALSE"] = "false";
})(Is_active = exports.Is_active || (exports.Is_active = {}));
class ZQueryParamsDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ZQueryParamsDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ZQueryParamsDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ZQueryParamsDto.prototype, "number_of_pages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ZQueryParamsDto.prototype, "number_of_rows", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Is_active),
    __metadata("design:type", String)
], ZQueryParamsDto.prototype, "is_active", void 0);
exports.ZQueryParamsDto = ZQueryParamsDto;
class LoginDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDTO.prototype, "mobile", void 0);
exports.LoginDTO = LoginDTO;
var Periodicity;
(function (Periodicity) {
    Periodicity["DAILY"] = "daily";
    Periodicity["WEEKLY"] = "weekly";
    Periodicity["MONTHLY"] = "monthly";
    Periodicity["QUARTERLY"] = "quarterly";
    Periodicity["HALF_YEARLY"] = "halfyearly";
    Periodicity["YEARLY"] = "yearly";
    Periodicity["DECADE"] = "decade";
})(Periodicity = exports.Periodicity || (exports.Periodicity = {}));
class UpdateImageDTO {
}
exports.UpdateImageDTO = UpdateImageDTO;
class Period {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(Periodicity),
    __metadata("design:type", String)
], Period.prototype, "period", void 0);
exports.Period = Period;
exports.PERIOD = {
    daily: '1',
    weekly: '7',
    monthly: '30',
    quarterly: '90',
    halfyearly: '180',
    yearly: '365'
};
class EarningResponse {
}
exports.EarningResponse = EarningResponse;
const Interval = (period) => exports.PERIOD[period.period];
exports.Interval = Interval;
const makeEarningFormat = (earning) => ({
    earnedAmount: earning[0],
    paidAmount: earning[1]
});
exports.makeEarningFormat = makeEarningFormat;
class YearMonthDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.MinLength)(4, { message: 'Enter only 4 digit value of year, This is too short', }),
    (0, class_validator_1.MaxLength)(4, { message: 'Enter only 4 digit value of year, This is too long', }),
    __metadata("design:type", String)
], YearMonthDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], YearMonthDto.prototype, "salesCode", void 0);
exports.YearMonthDto = YearMonthDto;
class SalesYearMonth extends YearMonthDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], SalesYearMonth.prototype, "month", void 0);
exports.SalesYearMonth = SalesYearMonth;
//# sourceMappingURL=create-sale.dto.js.map