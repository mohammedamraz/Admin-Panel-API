import { AccountZwitchResponseBody, createAccount, User } from "src/routes/admin/dto/create-admin.dto";
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { catchError, map, throwError } from "rxjs";
import { extname } from "path";
import { BadRequestException, NotFoundException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
export const fetchUser =(userId: string) => {

    return new HttpService().get(`http://0.0.0.0:35000/users/${userId}`).pipe(
		catchError(err => onHTTPErrorResponse(err)),
		map((res: AxiosResponse) => <User[]>res.data))
}
export const fetchAccount =(userId: string, accountId: string) => {

    return new HttpService().get(`http://0.0.0.0:35000/users/${userId}/accounts/${accountId}`).pipe(
		catchError(err => onHTTPErrorResponse(err)),
		map((res: AxiosResponse) => <AccountZwitchResponseBody>res.data))
}
export const fetchUserByMobileNumber =(phoneNumber: string) => {

    return new HttpService().get(`http://0.0.0.0:35000/users/${phoneNumber}/phoneNumber`).pipe(
		catchError(err => onHTTPErrorResponse(err)),
		map((res: AxiosResponse) => <User[]>res.data),
		)
}
export const fetchAccountBySalesCode =(salesCode: string) => {

    return new HttpService().get(`http://0.0.0.0:35000/users/${salesCode}/accounts`).pipe(
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
const onHTTPErrorResponse = async (err) => {
	console.log('dasdasdfasdf', err)
	if (err.response.data.statusCode === 401) throw new UnauthorizedException(err.response.data.message);
	if (err.response.data.statusCode === 422) throw new UnprocessableEntityException(err.response.data.error.message);
	if (err.response.data.statusCode === 404) throw new NotFoundException(err.response.data.message);
	if (err.response.data.statusCode === 400) throw new NotFoundException(err.response.data.message);
	return throwError(() => err);
};

