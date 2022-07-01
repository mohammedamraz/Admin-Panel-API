import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnprocessableEntityException } from "@nestjs/common";
import { isObject } from "class-validator";
import { Observable, tap } from "rxjs";
import { decryptPassword } from "src/constants/helper";
// import { decryptPassword } from "src/constants/helpers";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const body = context.switchToHttp().getRequest().body
        const method = context.switchToHttp().getRequest()['method']
        const route = context.switchToHttp().getRequest().route.path
        const image = '/users/:userId/demography/image';
        const selfBeneficiary = '/users/:userId/beneficiaries/self';

        if ((method == 'POST' && selfBeneficiary != route) || (method == 'PATCH' && image != route)) {
            if (body['passcode']) { context.switchToHttp().getRequest().body = decryptPassword(body['passcode']) }
            else throw new UnprocessableEntityException();
        }

        const now = Date.now();
        return next.handle()
    }
}