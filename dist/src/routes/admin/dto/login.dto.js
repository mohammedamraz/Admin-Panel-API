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
exports.makeStateFormat = exports.State = exports.STATE = exports.Stateness = exports.fetchDAte = exports.formatDate = exports.PERIODADMIN = exports.PeriodRange = exports.PeriodicityAdmin = exports.ConfirmForgotPasswordDTO = exports.ForgotPasswordDTO = exports.LoginDTO = void 0;
const class_validator_1 = require("class-validator");
const create_sale_dto_1 = require("../../sales/dto/create-sale.dto");
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
var PeriodicityAdmin;
(function (PeriodicityAdmin) {
    PeriodicityAdmin["MONTH"] = "month";
    PeriodicityAdmin["QUARTER"] = "quarter";
    PeriodicityAdmin["YEARLY"] = "year";
})(PeriodicityAdmin = exports.PeriodicityAdmin || (exports.PeriodicityAdmin = {}));
class PeriodRange {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(PeriodicityAdmin),
    __metadata("design:type", String)
], PeriodRange.prototype, "period", void 0);
exports.PeriodRange = PeriodRange;
exports.PERIODADMIN = {
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
var Stateness;
(function (Stateness) {
    Stateness["ACTIVE"] = "active";
    Stateness["INACTIVE"] = "inactive";
    Stateness["ALL"] = "all";
})(Stateness = exports.Stateness || (exports.Stateness = {}));
exports.STATE = {
    active: true,
    inactive: false,
    ALL: undefined
};
class State {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(Stateness),
    __metadata("design:type", String)
], State.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(create_sale_dto_1.Periodicity),
    __metadata("design:type", String)
], State.prototype, "period", void 0);
exports.State = State;
const makeStateFormat = (state) => exports.STATE[state.state];
exports.makeStateFormat = makeStateFormat;
//# sourceMappingURL=login.dto.js.map