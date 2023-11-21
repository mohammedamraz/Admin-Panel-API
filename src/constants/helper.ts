import { AccountShort, AccountZwitchResponseBody, createAccount, User } from "src/routes/admin/dto/create-admin.dto";
import { HttpService } from '@nestjs/axios';
import { AxiosResponse, AxiosError } from 'axios';
import { catchError, map, throwError } from "rxjs";
import { extname } from "path";
import { BadRequestException, NotFoundException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { FEDO_HSA_USER_CONNECTION_URL, PRIVATE_KEY, PUBLIC_KEY } from "src/constants/index";

export const fetchUser = (userId: string) => {

	return new HttpService().get(`${FEDO_HSA_USER_CONNECTION_URL}${userId}`).pipe(
		catchError(err => onHTTPErrorResponse(err)),
		map((res: AxiosResponse) => <User[]>res.data))
}
export const fetchAccount = (userId: string, accountId: string) => {

	return new HttpService().get(`${FEDO_HSA_USER_CONNECTION_URL}${userId}/accounts/${accountId}`).pipe(
		catchError(err => onHTTPErrorResponse(err)),
		map((res: AxiosResponse) => <AccountZwitchResponseBody>res.data))
}
export const fetchUserByMobileNumber = (phoneNumber: string) => {

	return new HttpService().get(`${FEDO_HSA_USER_CONNECTION_URL}${phoneNumber}/phoneNumber`).pipe(
		catchError(err => onHTTPErrorResponse(err)),
		map((res: AxiosResponse) => <User[]>res.data),
	)
}
export const fetchAccountBySalesCode = (salesCode: string) => {
	
	return new HttpService().get(`${FEDO_HSA_USER_CONNECTION_URL}${salesCode}/accounts`).pipe(
		catchError(err => onHTTPErrorResponse(err)),
		map((res: AxiosResponse) => <AccountShort[]>res.data))
}

export const findUserByCustomerId = (id: string) => {

	return new HttpService().get(`${FEDO_HSA_USER_CONNECTION_URL}customer/${id}`).pipe(
		catchError(err => onHTTPErrorResponse(err)),
		map((res: AxiosResponse) => <createAccount[]>res.data))
}
export const editFileName = (req, file, callback) => {
	const name = file.originalname.split('.')[0];
	const fileExtName = extname(file.originalname);
	const randomName = Array(4)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join('');
	callback(null, `${name}-${randomName}${fileExtName}`);
};
export const imageFileFilter = (req, file, callback) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
		return callback(new Error('Only image files are allowed!'), false);

	callback(null, true);
};
const onHTTPErrorResponse = async (err: AxiosError) => {
	if (err.code === 'ECONNREFUSED') throw new UnprocessableEntityException('Please check your server connection');
	// if (err.response.data.statusCode === 401) throw new UnauthorizedException(err.response.data.message);
	// if (err.response.data.statusCode === 422) throw new UnprocessableEntityException(err.response.data.error.message);
	// if (err.response.data.statusCode === 404) throw new NotFoundException(err.response.data.message);
	// if (err.response.data.statusCode === 400) throw new NotFoundException(err.response.data.message);
	return throwError(() => err);
};


export const encryptPassword = (password) => {

	const NodeRSA = require('node-rsa');
	let key_public = new NodeRSA(PUBLIC_KEY)
	var encryptedString = key_public.encrypt(password, 'base64')
	return encryptedString
}


export const decryptPassword = (encryptedPassword) => {
    const NodeRSA = require('node-rsa');
    var private_key = PRIVATE_KEY
    let key_private = new NodeRSA(private_key)
    var decryptedString = key_private.decrypt(encryptedPassword, 'utf8')
    return JSON.parse(decryptedString)
  
  }

  export const encryptXAPIKey=(APIKey) =>{
    const NodeRSA = require('node-rsa');
    // const apiKey = "custid=1&orgid=10";
    let key_public = new NodeRSA(PUBLIC_KEY)
    var encryptedString = key_public.encrypt(APIKey, 'base64')
    console.log(encryptedString);
    return encryptedString
   }

   export const decryptXAPIKey=(encryptXAPIKey)=>{
    const NodeRSA = require('node-rsa');
	var private_key = PRIVATE_KEY
	let key_private = new NodeRSA(private_key)
    var decryptedString = key_private.decrypt(encryptXAPIKey, 'utf8')
    return JSON.parse(decryptedString)
   }
  