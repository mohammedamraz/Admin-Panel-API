import { HttpService } from '@nestjs/axios';
import { ConflictException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { catchError, map, switchMap } from 'rxjs';
import { GUPSHUP_OTP_MESSAGE_FORMAT, GUPSHUP_OTP_VERIFICATION } from 'src/constants';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateIndividualUserDto, MobileNumberAndOtpDtO, MobileNumberDtO, UpdateUserDto } from './dto/create-individual-user.dto';
import { UpdateIndividualUserDto } from './dto/update-individual-user.dto';

const APP = "IndividualUserService"
@Injectable()

export class IndividualUserService {

  constructor(@DatabaseTable('individual_user')
  private readonly individualUserDb: DatabaseService<CreateIndividualUserDto>,
    private http: HttpService,
  ) { }
  userRegistration(createIndividualUserDto: CreateIndividualUserDto) {
    Logger.debug(`userRegistration() createIndividualUserDto: [${JSON.stringify(createIndividualUserDto,)}]`, APP,);

    return this.individualUserDb.save(createIndividualUserDto)
  }

  sentOtpToPhoneNumber(mobileNumberDtO: MobileNumberDtO) {
    Logger.debug(`sentOtpToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO,)}]`, APP,);

    return this.fetchUserByPhoneNumber(mobileNumberDtO.phone_number).pipe(
      map(userDoc => {
        userDoc
      }),
      switchMap(userDoc => {
        return this.http.post(`${GUPSHUP_OTP_VERIFICATION}&phone_no=${mobileNumberDtO.phone_number}${GUPSHUP_OTP_MESSAGE_FORMAT}`,).pipe(
          catchError((err) => { return err; }),
          map((doc) => {
            return { status: doc['data'] };
          }),
        );
      })
    )
  }

  fetchUserByPhoneNumber(phone_number: string) {
    Logger.debug(`fetchUserByPhoneNumber() phone_number: [${JSON.stringify(phone_number,)}]`,APP,);

    return this.individualUserDb.find({ phone_number: phone_number }).pipe(

      map(userDoc => {
        if (userDoc.length != 0) {
          throw new ConflictException("user already registered with mobile number, please login with your credentials")
        }
        else return userDoc
      })
    )

  }

  verifyOtpAndRegisterUser(mobileNumberAndOtpDtO: MobileNumberAndOtpDtO,createIndividualUserDto:CreateIndividualUserDto) {
    Logger.debug(`verifyOtp() mobileNumberAndOtpDtO: [${JSON.stringify(mobileNumberAndOtpDtO,)}]`,APP,);

    return this.http.post(`${GUPSHUP_OTP_VERIFICATION}&phone_no=${mobileNumberAndOtpDtO.phone_number}&otp_code=${mobileNumberAndOtpDtO.otp}`,) .pipe(
        catchError((err) => {return err;}),
        map((doc) => {
          var data = doc['data'].split(' ');
          if (data[0] === 'success') {
            createIndividualUserDto["phone_number"] = mobileNumberAndOtpDtO.phone_number
             return this.userRegistration(createIndividualUserDto).pipe(
              map(doc=>doc)
             )
            // return { status: doc['data'] };
          } else {
            throw new HttpException(
              { status: data[2], error: data.slice(4, 9).join(' ') },
              HttpStatus.BAD_REQUEST,
            );
          }
        }),
        switchMap(doc=>doc)
      );
  }


  fetchUserByUsingPhoneNumber(phone_number: string) {
    Logger.debug(`fetchUserByUsingPhoneNumber() phone_number: [${JSON.stringify(phone_number,)}]`,APP,);

    return this.individualUserDb.find({ phone_number: phone_number }).pipe(

      map(userDoc => {
        if (userDoc.length == 0) {
          throw new NotFoundException("user not found")
        }
        else return userDoc
      })
    )

  }

  updateUserDate(id:number,updateUserDto: UpdateUserDto){
    Logger.debug(`fetchUserByUsingPhoneNumber() phone_number: [${JSON.stringify(updateUserDto,)}]`,APP,);

    return this.individualUserDb.find({ id: id }).pipe(
      map(res => {
        if (res.length == 0) throw new NotFoundException('user not found')
        else return this.individualUserDb.findByIdandUpdate({ id: id.toString(), quries: updateUserDto})
      }))

  }


}
