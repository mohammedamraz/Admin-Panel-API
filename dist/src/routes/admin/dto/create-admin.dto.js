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
exports.fetchDues = exports.fetchmonths = exports.DateDTO = exports.YearMonthDto = exports.createPaid = exports.createPaidAmountDto = exports.createAccount = exports.sendEmailOnIncorrectBankDetailsDto = exports.AccountZwitchResponseBody = exports.User = exports.ParamDto = exports.requestDto = exports.MobileNumberAndOtpDtO = exports.MobileNumberDtO = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const common_1 = require("@nestjs/common");
class MobileNumberDtO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], MobileNumberDtO.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], MobileNumberDtO.prototype, "commission", void 0);
exports.MobileNumberDtO = MobileNumberDtO;
class MobileNumberAndOtpDtO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], MobileNumberAndOtpDtO.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], MobileNumberAndOtpDtO.prototype, "otp", void 0);
exports.MobileNumberAndOtpDtO = MobileNumberAndOtpDtO;
class requestDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], requestDto.prototype, "message", void 0);
exports.requestDto = requestDto;
class ParamDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ParamDto.prototype, "mobileNumber", void 0);
exports.ParamDto = ParamDto;
class User {
}
exports.User = User;
class AccountZwitchResponseBody {
}
exports.AccountZwitchResponseBody = AccountZwitchResponseBody;
class sendEmailOnIncorrectBankDetailsDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], sendEmailOnIncorrectBankDetailsDto.prototype, "message", void 0);
exports.sendEmailOnIncorrectBankDetailsDto = sendEmailOnIncorrectBankDetailsDto;
class createAccount {
}
exports.createAccount = createAccount;
class createPaidAmountDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], createPaidAmountDto.prototype, "paid_amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], createPaidAmountDto.prototype, "salesCode", void 0);
exports.createPaidAmountDto = createPaidAmountDto;
class createPaid {
}
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => createPaidAmountDto),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], createPaid.prototype, "data", void 0);
exports.createPaid = createPaid;
class YearMonthDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.MinLength)(4, { message: 'Enter only 4 digit value of year, This is too short' }),
    (0, class_validator_1.MaxLength)(4, { message: 'Enter only 4 digit value of year, This is too long' }),
    __metadata("design:type", String)
], YearMonthDto.prototype, "year", void 0);
exports.YearMonthDto = YearMonthDto;
class DateDTO extends YearMonthDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumberString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Enter only 2 digit value of month, This is too short' }),
    (0, class_validator_1.MaxLength)(2, { message: 'Enter only 2 digit value of month, This is too long' }),
    __metadata("design:type", String)
], DateDTO.prototype, "month", void 0);
exports.DateDTO = DateDTO;
const fetchmonths = (year) => {
    common_1.Logger.debug(`fetchmonths() year: [${year}]`);
    let month = [];
    let i = 0;
    if (new Date().getFullYear().toString() === year) {
        for (i = new Date().getMonth() + 1; i > 0; i--)
            month.push(i);
        return month;
    }
    else {
        for (i = 12; i > 0; i--)
            month.push(i);
        return month;
    }
};
exports.fetchmonths = fetchmonths;
const fetchDues = (createSalesJunction) => {
    common_1.Logger.debug(`fetchDues() createSalesJunction: [${createSalesJunction}]`);
    const don = createSalesJunction.reduce((acc, curr) => {
        const index = acc.findIndex(x => x.sales_code === curr.sales_code);
        index === -1 ? acc.push({ sales_code: curr.sales_code, dues: [curr.dues] }) : acc[index].dues.push(curr.dues);
        return acc;
    }, []).map(salesCode => ({ sales_code: salesCode.sales_code, dues: Math.max(...salesCode.dues) }));
    return don.reduce((acc, curr) => acc += curr.dues, 0);
};
exports.fetchDues = fetchDues;
//# sourceMappingURL=create-admin.dto.js.map