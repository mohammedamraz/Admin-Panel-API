"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageFileFilter = exports.editFileName = exports.fetchAccountBySalesCode = exports.fetchUserByMobileNumber = exports.fetchAccount = exports.fetchUser = void 0;
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const fetchUser = (userId) => {
    return new axios_1.HttpService().get(`http://0.0.0.0:35000/users/${userId}`).pipe((0, rxjs_1.catchError)(err => onHTTPErrorResponse(err)), (0, rxjs_1.map)((res) => res.data));
};
exports.fetchUser = fetchUser;
const fetchAccount = (userId, accountId) => {
    return new axios_1.HttpService().get(`http://0.0.0.0:35000/users/${userId}/accounts/${accountId}`).pipe((0, rxjs_1.catchError)(err => onHTTPErrorResponse(err)), (0, rxjs_1.map)((res) => res.data));
};
exports.fetchAccount = fetchAccount;
const fetchUserByMobileNumber = (phoneNumber) => {
    return new axios_1.HttpService().get(`http://0.0.0.0:35000/users/${phoneNumber}/phoneNumber`).pipe((0, rxjs_1.catchError)(err => onHTTPErrorResponse(err)), (0, rxjs_1.map)((res) => res.data));
};
exports.fetchUserByMobileNumber = fetchUserByMobileNumber;
const fetchAccountBySalesCode = (salesCode) => {
    return new axios_1.HttpService().get(`http://0.0.0.0:35000/users/${salesCode}/accounts`).pipe((0, rxjs_1.catchError)(err => onHTTPErrorResponse(err)), (0, rxjs_1.map)((res) => res.data));
};
exports.fetchAccountBySalesCode = fetchAccountBySalesCode;
const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = (0, path_1.extname)(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};
exports.editFileName = editFileName;
const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
        return callback(new Error('Only image files are allowed!'), false);
    callback(null, true);
};
exports.imageFileFilter = imageFileFilter;
const onHTTPErrorResponse = async (err) => {
    console.log('dasdasdfasdf', err);
    if (err.response.data.statusCode === 401)
        throw new common_1.UnauthorizedException(err.response.data.message);
    if (err.response.data.statusCode === 422)
        throw new common_1.UnprocessableEntityException(err.response.data.error.message);
    if (err.response.data.statusCode === 404)
        throw new common_1.NotFoundException(err.response.data.message);
    if (err.response.data.statusCode === 400)
        throw new common_1.NotFoundException(err.response.data.message);
    return (0, rxjs_1.throwError)(() => err);
};
//# sourceMappingURL=helper.js.map