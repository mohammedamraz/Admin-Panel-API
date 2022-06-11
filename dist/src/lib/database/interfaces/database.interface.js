"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMonthYear = exports.findByConditionParamsAlign = exports.findByDateParams = void 0;
class findByDateParams {
}
exports.findByDateParams = findByDateParams;
const findByConditionParamsAlign = (findbyConditionParams) => {
    const params = {
        created_date: findbyConditionParams.created_date,
        endcreated_date: findbyConditionParams.endcreated_date,
        orderByColumnname: findbyConditionParams.orderByColumnname,
        pageNumber: findbyConditionParams.pageNumber,
        numberOfRows: findbyConditionParams.numberOfRows
    };
    return params;
};
exports.findByConditionParamsAlign = findByConditionParamsAlign;
const fetchMonthYear = (MONTHYEAR) => {
    const params = {
        year: MONTHYEAR.year,
        month: MONTHYEAR.month
    };
    return params;
};
exports.fetchMonthYear = fetchMonthYear;
//# sourceMappingURL=database.interface.js.map