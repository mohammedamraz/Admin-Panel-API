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
exports.fetchDAte = exports.formatDate = exports.PERIOD = exports.PeriodRange = exports.Periodicity = exports.ConfirmForgotPasswordDTO = exports.ForgotPasswordDTO = exports.LoginDTO = void 0;
const class_validator_1 = require("class-validator");
class LoginDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDTO.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDTO.prototype, "password", void 0);
exports.LoginDTO = LoginDTO;
class ForgotPasswordDTO {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ForgotPasswordDTO.prototype, "username", void 0);
exports.ForgotPasswordDTO = ForgotPasswordDTO;
class ConfirmForgotPasswordDTO {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ConfirmForgotPasswordDTO.prototype, "ConfirmationCode", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ConfirmForgotPasswordDTO.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ConfirmForgotPasswordDTO.prototype, "password", void 0);
exports.ConfirmForgotPasswordDTO = ConfirmForgotPasswordDTO;
var Periodicity;
(function (Periodicity) {
    Periodicity["MONTH"] = "month";
    Periodicity["QUARTER"] = "quarter";
    Periodicity["YEARLY"] = "year";
})(Periodicity = exports.Periodicity || (exports.Periodicity = {}));
class PeriodRange {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(Periodicity),
    __metadata("design:type", String)
], PeriodRange.prototype, "period", void 0);
exports.PeriodRange = PeriodRange;
exports.PERIOD = {
    month: 1,
    quarter: 3,
    year: 12
};
const formatDate = (date) => {
    let d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
};
exports.formatDate = formatDate;
const fetchDAte = (date, period) => {
    let d = new Date(date);
    return {
        'from': (0, exports.formatDate)(date.setMonth((date.getMonth()) - period)),
        'to': (0, exports.formatDate)(d)
    };
};
exports.fetchDAte = fetchDAte;
//# sourceMappingURL=login.dto.js.map