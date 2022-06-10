/* eslint-disable max-lines */
import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, Logger, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AKASH_ACCOUNTID, AKASH_AUTHTOKEN, AKASH_SERVICEID, APP_DOWNLOAD_LINK, AWS_COGNITO_USER_CREATION_URL_SIT, FEDO_APP, PUBLIC_KEY, SALES_PARTNER_LINK } from 'src/constants';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateSalesJunction, CreateSalesPartner, CreateSalesPartnerRequest, Interval, makeEarningFormat, PERIOD, Period, SalesUserJunction } from '../sales/dto/create-sale.dto';
import { AccountZwitchResponseBody,  createPaid,  DateDTO,  fetchDues,  fetchmonths,  MobileNumberAndOtpDtO, MobileNumberDtO, ParamDto, requestDto, sendEmailOnIncorrectBankDetailsDto, User, YearMonthDto } from './dto/create-admin.dto';
import { AxiosResponse } from 'axios';
import { catchError, concatMap, from, lastValueFrom, map, of, switchMap, throwError } from 'rxjs';
import { applyPerformance, averageSignup, ConfirmForgotPasswordDTO, fetchDAte, ForgotPasswordDTO, LoginDTO, makeEarningDuesFormat, makeStateFormat, PERIODADMIN, PeriodRange, State } from './dto/login.dto';
import { fetchAccount, fetchUser, fetchUserByMobileNumber } from 'src/constants/helper';
import { TemplateService } from 'src/constants/template.service';
import { EmailDTO } from './dto/template.dto';

const APP = "AdminService";


@Injectable()
export class AdminService {
  constructor(
    // @DatabaseTable('accounts') private readonly accountsdb: DatabaseService<createAccount>,
    @DatabaseTable('sales_commission_junction') private readonly salesJunctionDb: DatabaseService<CreateSalesJunction>,
    @DatabaseTable('sales_partner') private readonly salesDb: DatabaseService<CreateSalesPartner>,
    @DatabaseTable('sales_partner_requests') private readonly salesPartnerRequestDb: DatabaseService<CreateSalesPartnerRequest>,
    @DatabaseTable('sales_user_junction') private readonly salesuser: DatabaseService<SalesUserJunction>,
    @DatabaseTable('sales_user_junction') private readonly salesUserJunctionDb: DatabaseService<CreateSalesJunction>,

    // private readonly accountService: AccountsService,
    // private readonly usersservice: UsersService,
    private readonly templateService: TemplateService,
    private http: HttpService) { }

  accountSid = AKASH_ACCOUNTID;
  authToken = AKASH_AUTHTOKEN;
  serviceSid = AKASH_SERVICEID;
  client = require('twilio')(this.accountSid, this.authToken);
  salesPartnerAccountDetails = []
  salesPartnerAccountData = []
  salesPartnerRequestDetails: any;
  salesPartnerDetails : any;
  salesParterEmail : any;

  fetchSalesPartnerAccountDetails() {
    Logger.debug(`fetchSalesPartnerAccountDetails()`, APP);

    return this.salesDb.find({ block_account: false, is_hsa_account:true }).pipe(
      map(salesDoc =>{
          if (salesDoc.length === 0) throw new NotFoundException("sales partner not found");
        return this.fetchUser(salesDoc)
      }),
      catchError(err => { throw new BadRequestException(err.message) }),
    )
  }

  fetchCommissionDispersals(period: PeriodRange){
    Logger.debug(`fetchEarnings()  }`, APP);

    return this.salesJunctionDb.fetchBetweenRange(fetchDAte(new Date(), PERIODADMIN[period.period])).pipe(
      switchMap(salesJunctionDoc => this.fetchPreviousMonthCommissionDispersal(salesJunctionDoc, period, new Date(fetchDAte(new Date(), PERIODADMIN[period.period]).from))))
  }

  fetchPreviousMonthCommissionDispersal(createSalesJunction: CreateSalesJunction[], period: PeriodRange, date: Date) {
    Logger.debug(`fetchPreviousMonthCommissionDispersal()`, APP);

    return this.salesJunctionDb.fetchBetweenRange(fetchDAte(date, PERIODADMIN[period.period])).pipe(
      map(salesJunctionDoc =>{
        return {'thisMonth': createSalesJunction.reduce((acc, curr) => acc += curr.paid_amount, 0),
                'previousMonth': salesJunctionDoc.reduce((acc, curr) => acc += curr.paid_amount, 0)}
      }))
  }

  fetchInvitationResponse(state: State) {
    Logger.debug(`fetchInvitationResponse() state: [${JSON.stringify(state)}]`, APP);

    if(state.state !== 'all')
    return this.salesDb.find({ is_active: makeStateFormat(state) }).pipe(
      map(doc => this.fetchSignUps(doc, state)))    
    else 
    return this.salesDb.fetchAll().pipe(
      map(doc => this.fetchSignUps(doc, state)))}

  fetchSignUps(createSalesPartner: CreateSalesPartner[], state: State) {
    Logger.debug(`fetchSignUps() createSalesPartner: [${JSON.stringify(createSalesPartner)}]`, APP);

    let signups =[]
    return lastValueFrom(from(createSalesPartner).pipe(
      concatMap(salesPartner => this.salesuser.findByPeriod({columnName: "sales_code", columnvalue: salesPartner.sales_code, period: PERIOD[state.period] })),
      map(salesuser => signups.push(salesuser.length))))
      .then(() =>{return {'signups': signups.reduce((acc, curr) => acc += curr, 0)}})
  }

  fetchSalesPartner(period: Period) {
    Logger.debug(`fetchSalesPartner() period: [${JSON.stringify(period)}]`, APP);

    return this.salesDb.fetchAllByPeriod(Interval(period)).pipe(
      
      catchError(err => { throw new BadRequestException(err.message) }),
      map( doc =>{
        if (doc.length === 0) throw new NotFoundException("sales partner not found");
        return this.fetchSalesPartnerCommission(doc, period)}))
  }

  fetchSalesPartnerCommission(createSalesPartner: CreateSalesPartner[], period: Period){
    Logger.debug(`fetchSalesPartnerCommission() createSalesPartner: [${JSON.stringify(createSalesPartner)}]`, APP);

    let commission =[]
    return lastValueFrom(from(createSalesPartner).pipe(
      switchMap(salesPartner => lastValueFrom( this.fetchTotalCommission(salesPartner, period)).then(doc => {commission.push(doc)}))
    )).then(doc => ({...commission.reduce((prev, current) => current.totalCommission > prev.totalCommission ? current:prev), 'count': createSalesPartner.length}))
  }

  fetchTotalCommission(createSalesPartner: CreateSalesPartner, period: Period) {
    Logger.debug(`fetchTotalCommission() CreateSalesPartner: [${JSON.stringify(createSalesPartner)}] , period: [${JSON.stringify(period)}]`, APP);

    return this.salesJunctionDb.find({sales_code: createSalesPartner.sales_code}).pipe(
      concatMap(doc => this.fetchSalesPartnerSignups(doc, createSalesPartner,period)),
      map(doc => doc))
  }

  fetchSalesPartnerSignups(createSalesJunction: CreateSalesJunction[],createSalesPartner: CreateSalesPartner, period: Period)  {
    Logger.debug(`fetchSalesPartnerSignups() createSalesJunction: [${JSON.stringify(createSalesJunction)}],  CreateSalesPartner: [${JSON.stringify(createSalesPartner)}], period: [${JSON.stringify(period)}]`, APP);

   return this.salesuser.find({sales_code: createSalesPartner.sales_code}).pipe(
      map(doc => { 
        return {'totalCommission': createSalesJunction.reduce((acc, curr) => acc += curr.commission_amount, 0),
                'name': createSalesPartner.name,
                'signups': doc.length }}))
  }

  async fetchUser(createSalesPartner: CreateSalesPartner[]) {
    Logger.debug(`fetchUser() createSalesPartner: ${JSON.stringify(createSalesPartner)}`, APP);

    this.salesPartnerAccountDetails = []
    
    return lastValueFrom(from(createSalesPartner).pipe(
      concatMap(async saleDoc => await lastValueFrom(fetchUser(saleDoc.user_id.toString()))
      .then(userDoc => this.fetchAccount(userDoc, saleDoc).then(result => {this.salesPartnerAccountDetails.push(result) }))
      .catch(error => { throw new UnprocessableEntityException(error.message) })))).then(doc => this.salesPartnerAccountDetails)
  }
  

  async fetchAccount(userDoc: User[], saleDoc: CreateSalesPartner) {
    Logger.debug(`fetchAccount() userDoc: ${JSON.stringify(userDoc)}  saleDoc: ${JSON.stringify(saleDoc)}`, APP);
    return lastValueFrom(
      fetchAccount(userDoc[0].fedo_id, String(userDoc[0].account_id)))
      .then(
        async (accountDoc:AccountZwitchResponseBody) =>{
          const salesJunctionDoc = await lastValueFrom(this.salesJunctionDb.find({ sales_code: saleDoc.sales_code })).catch(error=>{throw new NotFoundException(error.message)});
          return { "account_holder_name": accountDoc.name, "account_number": accountDoc.account_number, "ifsc_code": accountDoc.ifsc_code, "bank": accountDoc.bank_name,"sales_code": saleDoc.sales_code, "commission_amount":salesJunctionDoc.pop().dues };
        }
      )
  }

  fetchSalesPartnerAccountDetailsBySalesCode(sales_code:string){
    Logger.debug(`fetchSalesPartnerAccountDetailsBySalesCode()`, APP);

    return this.salesDb.find({sales_code: sales_code}).pipe(
      map(salesDoc =>{
          if (salesDoc.length === 0) throw new NotFoundException("sales partner not found");
        return this.fetchUserById(salesDoc)
      }),
      catchError(err => { throw new BadRequestException(err.message) }),
    )
  }

  async fetchUserById(createSalesPartner: CreateSalesPartner[]) {

    Logger.debug(`fetchUserById() createSalesPartner: ${JSON.stringify(createSalesPartner)}`, APP);
    this.salesPartnerAccountData = []

    if (!createSalesPartner[0].user_id) throw new NotFoundException("HSA account not found ")
    return lastValueFrom(from(createSalesPartner).pipe(concatMap(async saleDoc => await lastValueFrom(fetchUser(saleDoc.user_id.toString()))
      .then(userDoc => this.fetchAccountById(userDoc, saleDoc).then(result => {this.salesPartnerAccountData.push(result) }))
      .catch(error => { throw new UnprocessableEntityException(error.message) })))).then(doc => this.salesPartnerAccountData)
  }

  async fetchAccountById(userDoc: User[], saleDoc: CreateSalesPartner) {

    Logger.debug(`fetchAccountById() userDoc: ${JSON.stringify(userDoc)}  saleDoc: ${JSON.stringify(saleDoc)}`, APP);
    return lastValueFrom(
      fetchAccount(userDoc[0].fedo_id, (userDoc[0].account_id).toString()))
      .then(
        async (accountDoc:AccountZwitchResponseBody) =>{
          const salesJunctionDoc = await lastValueFrom(this.salesJunctionDb.find({ sales_code: saleDoc.sales_code })).catch(error=>{throw new NotFoundException(error.message)});
          return { "account_holder_name": accountDoc.name, "account_number": accountDoc.account_number, "ifsc_code": accountDoc.ifsc_code, "bank": accountDoc.bank_name,"sales_code": saleDoc.sales_code, "commission_amount":salesJunctionDoc.pop().dues };
        }
      )
  }

  sentOtpToPhoneNumber(mobileNumberDtO: MobileNumberDtO) {
    Logger.debug(`sentOtpToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return this.client.verify.services(this.serviceSid)
      .verifications
      .create({
        to: mobileNumberDtO.phoneNumber,
        channel: 'sms',
        locale: 'en'
      })
      .then(_res => {
        return { 'status': `OTP Send to ${mobileNumberDtO.phoneNumber} number` }
      })
      .catch(err => this.onTwilioErrorResponse(err));
  }

  verifyOtp(mobileNumberAndOtpDtO: MobileNumberAndOtpDtO) {
    Logger.debug(`verifyOtp() mobileNumberAndOtpDtO: [${JSON.stringify(mobileNumberAndOtpDtO)}]`, APP);

    return this.client.verify.services(this.serviceSid)
      .verificationChecks
      .create({ to: mobileNumberAndOtpDtO.phoneNumber, code: mobileNumberAndOtpDtO.otp.toString() })
      .then(verification_check => {
        if (!verification_check.valid || verification_check.status !== 'approved')
          throw new BadRequestException('Wrong code provided ');

        return { "status": verification_check.status }
      })
      .catch(err => this.onTwilioErrorResponse(err));
  }

  sentFedoAppDownloadLinkToPhoneNumber(mobileNumberDtO: MobileNumberDtO) {
    Logger.debug(`sentFedoAppDownloadLinkToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return this.client.messages
      .create({
        body: APP_DOWNLOAD_LINK,
        from: '+19402908957',
        to: mobileNumberDtO.phoneNumber
      })
      .then(_res => {
        return { "status": `Link ${APP_DOWNLOAD_LINK}  send to  ${mobileNumberDtO.phoneNumber} number` }
      })
      .catch(err => this.onTwilioErrorResponse(err));
  }

  sentFedoAppDownloadLinkToWhatsappNumber(mobileNumberDtO: MobileNumberDtO) {
    Logger.debug(`sentFedoAppDownloadLinkToWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return this.client.messages
      .create({
        body: APP_DOWNLOAD_LINK,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${mobileNumberDtO.phoneNumber}`
      })
      .then(_res => {
        return { "status": `Link ${APP_DOWNLOAD_LINK}  send to  ${mobileNumberDtO.phoneNumber} whatsapp number` }
      })
      .catch(err => this.onTwilioErrorResponse(err));
  }

  sentFedoAppDownloadLinkToMobileAndWhatsappNumber(mobileNumberDtO: MobileNumberDtO) {
    Logger.debug(`sentFedoAppDownloadLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return from(this.sentFedoAppDownloadLinkToPhoneNumber(mobileNumberDtO)).pipe(map(_doc => this.sentFedoAppDownloadLinkToWhatsappNumber(mobileNumberDtO)), switchMap(doc => of({ status: "Download link sent" })))
  }

  sendEmailOnIncorrectBankDetails(body: requestDto, param: ParamDto) {
    Logger.debug(`sendEmailOnIncorrectBankDetails() body: [${JSON.stringify(body)}] param: [${JSON.stringify(param)}] `, APP);

    return fetchUserByMobileNumber(param.mobileNumber).pipe(
      map(doc => { this.salesParterEmail = doc[0].email; return doc }),
      switchMap(doc => { return this.salesDb.find({ user_id: doc[0].fedo_id }) }),
      switchMap(doc => { 
        if (doc.length === 0) throw new NotFoundException('Sales Partner not found')
        else this.salesPartnerDetails = doc[0]; 
        return this.salesPartnerRequestDb.save({ sales_code: doc[0].sales_code })  }),
      switchMap(doc => {
        const request_id = "FEDSPSR" + doc[0].id
        this.salesPartnerRequestDetails = doc[0];
        return this.salesPartnerRequestDb.findByIdandUpdate({ id: doc[0].id, quries: { request_id: request_id } })
      }),
      switchMap(_doc => this.salesPartnerRequestDb.find({ id: this.salesPartnerRequestDetails.id })),
      switchMap(doc => {
        if (doc.length === 0) throw new NotFoundException('Sales Partner Request Details not found') 
        else
          return this.templateService.sendEmailOnIncorrectBankDetailsToSupportEmail(<EmailDTO>{ toAddresses: [this.salesParterEmail], subject: "Incorrect Bank Details" }, <sendEmailOnIncorrectBankDetailsDto>{ name: this.salesPartnerDetails?.name, message: body.message, request_id: doc[0].request_id })
            .then(_res => { return this.templateService.sendEmailOnIncorrectBankDetailsToHsaEmail(<EmailDTO>{ toAddresses: ["support@fedo.health"] }, <sendEmailOnIncorrectBankDetailsDto>{ name: this.salesPartnerDetails?.name, message: body.message, request_id: doc[0].request_id }) })
            .catch(err => { throw new BadRequestException(err) })
      })
    )
  }

  // fetchRequestId(sales_code: string) {
  //   Logger.debug(`fetchRequestId() param: [${JSON.stringify(sales_code)}]`, APP);

  //   return this.salesPartnerRequestDb.find({ sales_code: sales_code })
  // }

  private readonly onTwilioErrorResponse = async (err) => {
    Logger.debug('onTwilioErrorResponse(), ' + err, APP);
    if (err.status === 400) throw new BadRequestException(err.message)
    if (err.status === 401) throw new UnauthorizedException(err.message);
    if (err.status === 422) throw new UnprocessableEntityException(err.message);
    if (err.status === 404) throw new NotFoundException(err.message);
    if (err.status === 409) throw new ConflictException(err.message);
    if (err.status === 429) throw new HttpException({ status: HttpStatus.TOO_MANY_REQUESTS, error: 'Please wait for a short period of time and make the request again' }, HttpStatus.TOO_MANY_REQUESTS);

    return throwError(() => err);
  };

  login(logindto: LoginDTO) {
    Logger.debug(`admin-console login() loginDTO:[${JSON.stringify(Object.keys(logindto))} values ${JSON.stringify(Object.values(logindto).length)}]`);

    logindto.fedoApp = FEDO_APP;
    logindto.password = this.encryptPassword(logindto.password)
    return this.http.post(`${AWS_COGNITO_USER_CREATION_URL_SIT}/token`, logindto).pipe(catchError(err => { return this.onAWSErrorResponse(err) }), map((res: AxiosResponse) => {
      return { jwtToken: res.data.idToken.jwtToken, refreshToken: res.data.refreshToken, accessToken: res.data.accessToken.jwtToken }
    })
    )
  }

  forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
    Logger.debug(`admin-console forgotPassword() forgotPasswordDTO:[${JSON.stringify(forgotPasswordDTO,)}]`);

    forgotPasswordDTO.fedoApp = FEDO_APP
    return this.http.post(`${AWS_COGNITO_USER_CREATION_URL_SIT}/password/otp/`, forgotPasswordDTO).pipe(catchError(err => { return this.onAWSErrorResponse(err) }), map((res: AxiosResponse) => res.data));
  }

  confirmForgotPassword(confirmForgotPasswordDTO: ConfirmForgotPasswordDTO) {
    Logger.debug(`admin-console confirmForgotPassword() confirmForgotPasswordDTO:[${JSON.stringify(confirmForgotPasswordDTO,)}]`);

    confirmForgotPasswordDTO.fedoApp = FEDO_APP
    return this.http.patch(`${AWS_COGNITO_USER_CREATION_URL_SIT}/password/otp/${confirmForgotPasswordDTO.ConfirmationCode}`, confirmForgotPasswordDTO).pipe(catchError(err => { return this.onHTTPErrorResponse(err) }), map(_res => []));
  }

  private readonly onAWSErrorResponse = async (err) => {
    Logger.debug('onAWSErrorResponse(), ' + err, APP);

    if (err.response.status === 400) throw new BadRequestException(err.response.data);
    if (err.response.status === 401) throw new UnauthorizedException(err.response.data);
    if (err.response.status === 422) throw new UnprocessableEntityException(err.response.data);
    if (err.response.status === 404) throw new NotFoundException(err.response.data);
    if (err.response.status === 409) throw new ConflictException(err.response.data);

    return throwError(() => err);
  };

  private readonly onHTTPErrorResponse = async (err) => {
    Logger.debug('onHTTPErrorResponse(), ' + err, APP);

    if (err.response.status === 400) throw new BadRequestException(err.response.data);
    if (err.response.status === 401) throw new UnauthorizedException(err.response.data.message);
    if (err.response.status === 422) throw new UnprocessableEntityException(err.response.data.message);
    if (err.response.status ===404) throw new NotFoundException(err.response.data.message);
    if (err.response.status === 409) throw new ConflictException(err.response.data.message);

    return throwError(() => err);
  };

  encryptPassword(password) {
    const NodeRSA = require('node-rsa');

    let key_public = new NodeRSA(PUBLIC_KEY)
    var encryptedString = key_public.encrypt(password, 'base64')

    return encryptedString

  }

  async updatingPaidAmount(updateAmountdto: createPaid) {

    Logger.debug(`updatePaidAmount() updateAmountdto: [${JSON.stringify(updateAmountdto)}]`, APP);
    
    updateAmountdto['data'].map(res => {
      
      return lastValueFrom(this.salesJunctionDb.find({ "sales_code": res.salesCode }).pipe(map(doc => {
        const sort_doc = Math.max(...doc.map(user => parseInt(user['id'].toString())))
        const user_doc = doc.filter(item => item['id'] == sort_doc);
        const finalRes = user_doc[0].dues
        const dueCommission = Number(finalRes) - Number(res.paid_amount)
        
        return this.salesJunctionDb.save({ sales_code: user_doc[0].sales_code, paid_amount: res.paid_amount, dues: dueCommission })
  
      })))
    })
  }

  sendCreateSalesPartnerLinkToPhoneNumber(mobileNumberDtO: MobileNumberDtO) {
    Logger.debug(`sendCreateSalesPartnerLinkToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);
    let phone_number = this.encryptPassword_(mobileNumberDtO.phoneNumber);
    let commission = this.encryptPassword_(mobileNumberDtO.commission);
    return this.client.messages
      .create({
        body: `Click on Link ${SALES_PARTNER_LINK}?mobile=${phone_number}&commission=${commission} `,
        from: '+19402908957',
        to: mobileNumberDtO.phoneNumber
      })
      .then(_res => {
        return { "status": `Link ${SALES_PARTNER_LINK}  send to  ${mobileNumberDtO.phoneNumber} number` }
      })
      .catch(err => this.onTwilioErrorResponse(err));
  }

  sendCreateSalesPartnerLinkToWhatsappNumber(mobileNumberDtO: MobileNumberDtO) {
    Logger.debug(`sendCreateSalesPartnerLinkToWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    let phone_number = this.encryptPassword_(mobileNumberDtO.phoneNumber);
    let commission = this.encryptPassword_(mobileNumberDtO.commission);

    return this.client.messages
      .create({
        body: `Click on Link ${SALES_PARTNER_LINK}?mobile=${phone_number}&commission=${commission} `,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${mobileNumberDtO.phoneNumber}`
      })
      .then(_res => {
        return { "status": `Link ${SALES_PARTNER_LINK}  send to  ${mobileNumberDtO.phoneNumber} whatsapp number` }
      })
      .catch(err => this.onTwilioErrorResponse(err));
  }

  sendCreateSalesPartnerLinkToMobileAndWhatsappNumber(mobileNumberDtO: MobileNumberDtO) {
    Logger.debug(`sendCreateSalesPartnerLinkToMobileAndWhatsappNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return from(this.sendCreateSalesPartnerLinkToPhoneNumber(mobileNumberDtO)).pipe(map(_doc => this.sendCreateSalesPartnerLinkToWhatsappNumber(mobileNumberDtO)), switchMap(doc => of({ status: "Sales Partner link sent" })))
  }

   encryptPassword_ (password)  {
    const NodeRSA = require('node-rsa');
    let key_public = new NodeRSA(PUBLIC_KEY)
    var encryptedString = key_public.encrypt(password, 'base64')
    return encryptedString
  }

  fetchCommissionReport(yearMonthDto:YearMonthDto){
    Logger.debug(`fetchCommissionReport() year: [${yearMonthDto.year}]`, APP);

    const reportData=[]
    return from(fetchmonths((yearMonthDto.year))).pipe(
      concatMap(async( month: number) => {
        return await lastValueFrom(this.salesJunctionDb.fetchCommissionReportByYear(yearMonthDto.year,month))
        .then(async salesJunctionDoc=> {
         const paid_amount=salesJunctionDoc.map(doc=>doc.paid_amount)
         const total_paid_amount=paid_amount.reduce((next,prev)=> next + prev,0)
         const due=salesJunctionDoc.map(doc=>doc.dues)
         const total_dues = due.reduce((next, prev) => Number(next)+Number(prev), 0);
         const date = salesJunctionDoc.map(doc=>{if(doc.paid_amount > 0) return doc.created_date})
         const paid_on = date.filter((res) => res)
         await this.fetchSignup(yearMonthDto.year,month)
         .then(signup => {
           reportData.push({"total_paid_amount":total_paid_amount,"month": month, "total_dues":fetchDues(salesJunctionDoc),"hsa_sing_up": signup, "paid_on": paid_on[0] })
          }).catch(error=> {throw new NotFoundException(error.message)})
         return reportData
        })
        .catch(error=> {throw new NotFoundException(error.message)})
        .then(doc => reportData)
      })
    )
  }

  fetchMonthlyReport(dateDTO: DateDTO){
    Logger.debug(`fetchMonthlyReport() date: [${JSON.stringify(dateDTO)}]`, APP);

    return this.salesDb.fetchAll().pipe(
      map(salesDb => this.fetchCommissionReportforSalesPartner(salesDb, dateDTO))
    )
  }

  fetchCommissionReportforSalesPartner(createSalesPartner:CreateSalesPartner[], dateDTO: DateDTO){
    Logger.debug(`fetchCommissionReportforSalesPartner() createSalesPartner: [${JSON.stringify(createSalesPartner)}]`, APP);
    
    let performance =[]
    return lastValueFrom(from(createSalesPartner).pipe(
      switchMap(salesDoc => lastValueFrom(this.fetchSignupforPerformace(salesDoc, dateDTO)).then(doc => performance.push(doc)))
    )).then(doc => applyPerformance(performance, averageSignup(createSalesPartner.length, performance.reduce((acc, curr) => acc += curr.signups, 0))) )

  }

  fetchSignupforPerformace(createSalesPartner: CreateSalesPartner, dateDTO: DateDTO){
    Logger.debug(`fetchSignupAndPerformace() createSalesPartner: [${JSON.stringify(createSalesPartner)}]`, APP);

    return this.salesJunctionDb.fetchByYear({columnName: "sales_code", columnvalue: createSalesPartner.sales_code, year: dateDTO.year, month: dateDTO.month}).pipe(
      switchMap(salesJunctionDoc => this.fetchSignUpsforPerformance(createSalesPartner, salesJunctionDoc, dateDTO))
    )
  }

  fetchSignUpsforPerformance(createSalesPartner: CreateSalesPartner, createSalesJunction: CreateSalesJunction[],  dateDTO: DateDTO) {
    Logger.debug(`fetchSignUpsforPerformance() createSalesJunction: [${JSON.stringify(createSalesJunction)}]`, APP);
    console.log('don', createSalesJunction[createSalesJunction.length-1]);
    return this.salesuser.fetchByYear({columnName: "sales_code", columnvalue: createSalesPartner.sales_code, year: dateDTO.year, month: dateDTO.month}).pipe(
      map(doc => makeEarningDuesFormat(createSalesPartner.name, createSalesJunction.reduce((acc, curr) => acc += curr.commission_amount, 0), !!createSalesJunction[createSalesJunction.length-1] ? 0 : createSalesJunction[createSalesJunction.length-1].dues  , doc.length)) )
    
  }

  async fetchSignup(year,month){
    Logger.debug(`fetchSignup() year: [${year}] month: [${month}]`, APP);

     return await lastValueFrom(this.salesUserJunctionDb.fetchCommissionReportByYear(year,month))
     .then(userJunctionDoc=> { return userJunctionDoc.length})
     .catch(error=>{throw new UnprocessableEntityException(error.message)})
   }
}
