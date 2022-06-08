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
exports.fetchmonths = exports.createPaid = exports.createPaidAmountDto = exports.createAccount = exports.sendEmailOnIncorrectBankDetailsDto = exports.AccountZwitchResponseBody = exports.User = exports.ParamDto = exports.requestDto = exports.MobileNumberAndOtpDtO = exports.MobileNumberDtO = void 0;
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
const fetchmonths = (year) => {
    common_1.Logger.debug(`fetchmonths() year: [${year}]`);
    let month = [];
    let month1 = [];
    let i = 0;
    if (new Date().getFullYear().toString() === year.toString()) {
        for (i = new Date().getMonth() + 1; i > 0; i--)
            month.push(i);
        return month;
    }
    else {
        for (i = 12; i > 0; i--)
            month1.push(i);
        console.log("month1", month1);
        return month1;
    }
};
exports.fetchmonths = fetchmonths;
//# sourceMappingURL=create-admin.dto.js.map