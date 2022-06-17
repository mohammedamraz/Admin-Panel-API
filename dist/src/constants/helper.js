"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPassword = exports.imageFileFilter = exports.editFileName = exports.findUserByCustomerId = exports.fetchAccountBySalesCode = exports.fetchUserByMobileNumber = exports.fetchAccount = exports.fetchUser = void 0;
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const index_1 = require("./index");
const fetchUser = (userId) => {
    return new axios_1.HttpService().get(`${index_1.FEDO_HSA_USER_CONNECTION_URL}${userId}`).pipe((0, rxjs_1.catchError)(err => onHTTPErrorResponse(err)), (0, rxjs_1.map)((res) => res.data));
};
exports.fetchUser = fetchUser;
const fetchAccount = (userId, accountId) => {
    return new axios_1.HttpService().get(`${index_1.FEDO_HSA_USER_CONNECTION_URL}${userId}/accounts/${accountId}`).pipe((0, rxjs_1.catchError)(err => onHTTPErrorResponse(err)), (0, rxjs_1.map)((res) => res.data));
};
exports.fetchAccount = fetchAccount;
const fetchUserByMobileNumber = (phoneNumber) => {
    return new axios_1.HttpService().get(`${index_1.FEDO_HSA_USER_CONNECTION_URL}${phoneNumber}/phoneNumber`).pipe((0, rxjs_1.catchError)(err => onHTTPErrorResponse(err)), (0, rxjs_1.map)((res) => res.data));
};
exports.fetchUserByMobileNumber = fetchUserByMobileNumber;
const fetchAccountBySalesCode = (salesCode) => {
    return new axios_1.HttpService().get(`${index_1.FEDO_HSA_USER_CONNECTION_URL}${salesCode}/accounts`).pipe((0, rxjs_1.catchError)(err => onHTTPErrorResponse(err)), (0, rxjs_1.map)((res) => res.data));
};
exports.fetchAccountBySalesCode = fetchAccountBySalesCode;
const findUserByCustomerId = (id) => {
    return new axios_1.HttpService().get(`${index_1.FEDO_HSA_USER_CONNECTION_URL}customer/${id}`).pipe((0, rxjs_1.catchError)(err => onHTTPErrorResponse(err)), (0, rxjs_1.map)((res) => res.data));
};
exports.findUserByCustomerId = findUserByCustomerId;
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
const encryptPassword = (password) => {
    const NodeRSA = require('node-rsa');
    let key_public = new NodeRSA(index_1.PUBLIC_KEY);
    var encryptedString = key_public.encrypt(password, 'base64');
    return encryptedString;
};
exports.encryptPassword = encryptPassword;
//# sourceMappingURL=helper.js.map