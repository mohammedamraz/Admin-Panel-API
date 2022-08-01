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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaid = exports.createPaidAmountDto = exports.createAccount = exports.sendEmailOnIncorrectBankDetailsDto = exports.AccountZwitchResponseBody = exports.User = exports.ParamDto = exports.requestDto = exports.MobileNumberAndOtpDtO = exports.MobileNumberDtO = void 0;
const class_validator_1 = require("class-validator");
const importexport_1 = require("aws-sdk/clients/importexport");
const class_transformer_1 = require("class-transformer");
class MobileNumberDtO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", typeof (_a = typeof importexport_1.phoneNumber !== "undefined" && importexport_1.phoneNumber) === "function" ? _a : Object)
], MobileNumberDtO.prototype, "phoneNumber", void 0);
exports.MobileNumberDtO = MobileNumberDtO;
class MobileNumberAndOtpDtO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", typeof (_b = typeof importexport_1.phoneNumber !== "undefined" && importexport_1.phoneNumber) === "function" ? _b : Object)
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
//# sourceMappingURL=create-admin.dto.js.map