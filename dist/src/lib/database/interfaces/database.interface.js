"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByConditionParamsAlign = exports.findByDateParams = void 0;
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
//# sourceMappingURL=database.interface.js.map