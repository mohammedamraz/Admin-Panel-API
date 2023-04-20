import { HttpService } from '@nestjs/axios';
import { ConflictException, HttpException, HttpStatus, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { catchError, concatMap, from, lastValueFrom, map, switchMap } from 'rxjs';
import { GUPSHUP_OTP_MESSAGE_FORMAT, GUPSHUP_OTP_VERIFICATION } from 'src/constants';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { ProductTestsService } from '../product_tests/product_tests/product_tests.service';
import { SendEmailService } from '../send-email/send-email.service';
import { CreateIndividualReferenceDto, CreateIndividualUserDto, EmailOtpDto, FetchIndividualUserData, FreeQuotaExhaustedDto, MobileNumberAndOtpDtO, MobileNumberDtO, QueryParamsDto, UpdateUserDto } from './dto/create-individual-user.dto';
import { UpdateIndividualUserDto } from './dto/update-individual-user.dto';

const APP = "IndividualUserService"
@Injectable()

export class IndividualUserService {

  constructor(@DatabaseTable('individual_user')
  private readonly individualUserDb: DatabaseService<CreateIndividualUserDto>,
  @DatabaseTable('individual_user_reference_junction')
  private readonly individual_referencedb: DatabaseService<CreateIndividualReferenceDto>,
  private http: HttpService,
    private readonly emailService: SendEmailService,
    private readonly productTestsService: ProductTestsService,

  ) { }
  userRegistration(createIndividualUserDto: CreateIndividualUserDto) {
    Logger.debug(`userRegistration() createIndividualUserDto: [${JSON.stringify(createIndividualUserDto,)}]`, APP,);

    return this.individualUserDb.save(createIndividualUserDto)
  }

  // sentOtpToPhoneNumber(mobileNumberDtO: MobileNumberDtO) {
  //   Logger.debug(`sentOtpToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO,)}]`, APP,);

  //   return this.fetchUserByPhoneNumber(mobileNumberDtO.phone_number).pipe(
  //     map(userDoc => {
  //       userDoc
  //     }),
  //     switchMap(userDoc => {
  //       return this.http.post(`${GUPSHUP_OTP_VERIFICATION}&phone_no=${mobileNumberDtO.phone_number}${GUPSHUP_OTP_MESSAGE_FORMAT}`,).pipe(
  //         catchError((err) => { return err; }),
  //         map((doc) => {
  //           return { status: doc['data'] };
  //         }),
  //       );
  //     })
  //   )
  // }

  fetchUserByPhoneNumber(phone_number: string) {
    Logger.debug(`fetchUserByPhoneNumber() phone_number: [${JSON.stringify(phone_number,)}]`, APP,);

    return this.individualUserDb.find({ phone_number: phone_number }).pipe(

      map(userDoc => {
        if (userDoc.length != 0) {
          throw new ConflictException("user already registered with mobile number, please login with your credentials")
        }
        else return userDoc
      })
    )

  }

  verifyOtpAndRegisterUser(mobileNumberAndOtpDtO: MobileNumberAndOtpDtO, createIndividualUserDto: CreateIndividualUserDto) {
    Logger.debug(`verifyOtp() mobileNumberAndOtpDtO: [${JSON.stringify(mobileNumberAndOtpDtO,)}]`, APP,);

    return this.http.post(`${GUPSHUP_OTP_VERIFICATION}&phone_no=${mobileNumberAndOtpDtO.phone_number}&otp_code=${mobileNumberAndOtpDtO.otp}`,).pipe(
      catchError((err) => { return err; }),
      map((doc) => {
        var data = doc['data'].split(' ');
        if (data[0] === 'success') {
          createIndividualUserDto["phone_number"] = mobileNumberAndOtpDtO.phone_number
          return this.userRegistration(createIndividualUserDto).pipe(
            map(doc => doc)
          )
          // return { status: doc['data'] };
        } else {
          throw new HttpException(
            { status: data[2], error: data.slice(4, 9).join(' ') },
            HttpStatus.BAD_REQUEST,
          );
        }
      }),
      switchMap(doc => doc)
    );
  }


  fetchUserByUsingPhoneNumber(phone_number: string) {
    Logger.debug(`fetchUserByUsingPhoneNumber() phone_number: [${JSON.stringify(phone_number,)}]`, APP,);

    return this.individualUserDb.find({ phone_number: phone_number }).pipe(

      map(userDoc => {
        if (userDoc.length == 0) {
          throw new NotFoundException("user not found")
        }
        else return userDoc
      })
    )

  }

  updateUserDate(updateUserDto: UpdateUserDto) {
    Logger.debug(`fetchUserByUsingPhoneNumber() phone_number: [${JSON.stringify(updateUserDto,)}]`, APP,);

    return this.individualUserDb.find({ email: updateUserDto.email }).pipe(
      map((res: any) => {
        if (res.length == 0) throw new NotFoundException('user not found')
        else return this.individualUserDb.findByIdandUpdate({ id: res[0]?.id, quries: updateUserDto })
      }))

  }

  fetchUserByEmail(email: string) {
    return this.individualUserDb.find({ email: email }).pipe(
      map(doc => {
        if (doc.length == 0) { throw new NotFoundException('user not found') }
        else return doc[0];
      })
    )
  }

  sendEmailOnQuotaExhaustion(quotaExhaustionEmailDto: FreeQuotaExhaustedDto) {
    return this.emailService.sendEmailToIncreaseTestsForIndividuals(quotaExhaustionEmailDto).then(doc => {
      return doc;
    }).catch(error => {
      return error;
    })
  }

  sendOtpToEmail(emailOtpDto: EmailOtpDto) {
    Logger.debug(`sendOtpToEmail() email: [${JSON.stringify(emailOtpDto)}]`, APP);

    return this.individualUserDb.find({ email: emailOtpDto.email }).pipe(
      map((res: any) => {
        if (res.length == 0) {
          let minimumNumber = 100000;
          let maximumNumber = 999999;
          let randomSixDigitNumber = Math.floor(Math.random() * (maximumNumber - minimumNumber + 1)) + minimumNumber;
          let emailAndOtp = {
            email: emailOtpDto.email,
            otp: randomSixDigitNumber
          }
          return this.emailService.sendOtpToEmail(emailAndOtp).then(async v => {
            return await lastValueFrom(this.saveToRandomIdDB());
          }).then(doc => {
            this.individualUserDb.save({ email: emailAndOtp.email, fedo_score: true, attempts: 3, total_tests : 3  ,  is_verified: false , product_id : 2 , unique_id : doc[0].unique_id  });
            return emailAndOtp;
          }).catch(err => {
            throw new UnprocessableEntityException('Failed to send OTP. Please try again')
          })
        }
        else {
          let minimumNumber = 100000;
          let maximumNumber = 999999;
          let randomSixDigitNumber = Math.floor(Math.random() * (maximumNumber - minimumNumber + 1)) + minimumNumber;
          let emailAndOtp = {
            email: emailOtpDto.email,
            otp: randomSixDigitNumber
          }
          if (res[0].is_verified == false) {
            return this.emailService.sendOtpToEmail(emailAndOtp).then(async v => {
              // return await lastValueFrom(this.saveToRandomIdDB());
            }).then(doc => {
              // this.individualUserDb.save({ email: emailAndOtp.email, fedo_score: true, attempts: 3, total_tests : 3 ,  is_verified: false , product_id : 2 , unique_id : doc[0].unique_id  });
              return emailAndOtp;
            }).catch(err => {
              throw new UnprocessableEntityException('Failed to send OTP. Please try again')
            })
          }
          else {
            return res[0];
          }
        }
      }),
    )
  }


  fetchAllIndividualUserList(queryParamsDto: QueryParamsDto){
    Logger.debug(`fetchAllIndividualUserList() ${queryParamsDto}`, APP,);

    return this.individualUserDb.find({product_id:queryParamsDto.product_id}).pipe(
      map(async (res: any) => {
        res.sort((a: { id?: number; },b: { id?: number; })=> b.id-a.id);    
        return await this.fetchotherDetails(res,queryParamsDto) 
      })
      )
  }

  fetchotherDetails(FetchIndividualUserData : FetchIndividualUserData[],queryParamsDto: QueryParamsDto) {
    Logger.debug(`fetchotherDetails() createOrganizationDto: ${JSON.stringify(FetchIndividualUserData)}`, APP);

    let userProfileData: FetchIndividualUserData[] = [];
    return lastValueFrom(from(FetchIndividualUserData).pipe(
      concatMap(async individualUser => {      
        const doc = await lastValueFrom(this.productTestsService.fetchProductTestUsingApplicationId(individualUser.unique_id,queryParamsDto.product_id));
        if(doc.length!=0){
          individualUser['total_tests_viu'] = doc?.reduce((pre, acc) => pre + acc['tests'], 0);
          individualUser['first_scan'] = new Date(doc[0]?.test_date).toISOString().split("T")[0];
          individualUser['last_scan'] = new Date(doc[doc.length-1]?.test_date).toISOString().split("T")[0];
        }        
        individualUser['data'] = doc
        userProfileData.push(individualUser);
        return this.Paginator(userProfileData,queryParamsDto.page,queryParamsDto.per_page) 
      }),
    ))
  }

  Paginator(items: any, page: any, per_page: any) {

    var page = page || 1,
      per_page = per_page || 10,
      offset = (page - 1) * per_page,
  
      paginatedItems = items.slice(offset).slice(0, per_page),
      total_pages = Math.ceil(items.length / per_page);
    return {
      page: page,
      per_page: per_page,
      pre_page: page - 1 ? page - 1 : null,
      next_page: (total_pages > page) ? page + 1 : null,
      total: items.length,
      total_pages: total_pages,
      data: paginatedItems
    };
  }

  saveToRandomIdDB() {
    Logger.debug(`saveToRandomIdDB() id $}`, APP)

    let minimumNumber = 1000000;
    let maximumNumber = 9999999;
    let randomSevenDigitNumber = Math.floor(Math.random() * (maximumNumber - minimumNumber + 1)) + minimumNumber;
    return this.individual_referencedb.save({  unique_id : "VIU"+randomSevenDigitNumber }).pipe(catchError(err => { return this.saveToRandomIdDB(); }),
      map(res =>   res ))
  }


}
