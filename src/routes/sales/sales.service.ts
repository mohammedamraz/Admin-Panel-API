/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { BadRequestException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateSalesInvitationJunction, CreateSalesJunction, CreateSalesPartner, Interval, makeEarningFormat, Period, SalesUserJunction, UpdateImageDTO, UpdateSalesPartner, YearMonthDto, ZQueryParamsDto } from './dto/create-sale.dto';
import { HttpService } from '@nestjs/axios';
import { fetchUserByMobileNumber, findUserByCustomerId } from 'src/constants/helper';
import { CreateSalesPartnerModel } from 'src/lib/config/model/sales.model';
import { InvitationJunctionModel } from './dto/invitation-junction.model';
import { catchError, concatMap, from, lastValueFrom, map, of, switchMap } from 'rxjs';
import { fetchmonths } from '../admin/dto/create-admin.dto';

const APP = 'SalesService';

@Injectable()
export class SalesService {

  constructor(
    @DatabaseTable('sales_partner') private readonly db: DatabaseService<CreateSalesPartnerModel>,
    @DatabaseTable('sales_partner_invitation_junction') private readonly invitationJunctiondb: DatabaseService<CreateSalesInvitationJunction>,
    @DatabaseTable('sales_commission_junction') private readonly junctiondb: DatabaseService<CreateSalesJunction>,
    @DatabaseTable('sales_user_junction') private readonly salesUser: DatabaseService<SalesUserJunction>,
    private http: HttpService) { }

  createSalesPartner(createSalesPartner: CreateSalesPartner) {
  Logger.debug(`createSalesPartner() DTO:${JSON.stringify(createSalesPartner,)}`, APP);

  let salesId
  return this.fetchSalesPartnerByMobileNumber(createSalesPartner.mobile).pipe(
    switchMap(doc => fetchUserByMobileNumber(createSalesPartner.mobile)),
    switchMap(doc => {
      if (!doc[0]) return this.db.save({ name: createSalesPartner.name, location: createSalesPartner.location, commission: createSalesPartner.commission, mobile: createSalesPartner.mobile, email: createSalesPartner.email })
      else return this.db.save({ name: createSalesPartner.name, location: createSalesPartner.location, commission: createSalesPartner.commission, mobile: createSalesPartner.mobile, email: createSalesPartner.email, user_id: doc[0].fedo_id, is_hsa_account: true })
    }),
    switchMap(doc => { 
      const TODAYDATE = String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0')
      salesId = doc[0].id; 
      createSalesPartner.sales_code = "FEDSP" + TODAYDATE + 500 + doc[0].id;
      createSalesPartner.id = doc[0].id;
      return this.junctiondb.save({ sales_code: createSalesPartner.sales_code }).pipe(catchError(err => { throw new BadRequestException(err.message) }), map(doc => doc)) }),
    switchMap(doc => this.createInvitation(createSalesPartner, doc)),
    switchMap(doc => this.updateSalesPartner(salesId, <UpdateSalesPartner>{ sales_code: createSalesPartner.sales_code })),
    switchMap(doc => this.fetchSalesPartnerById(createSalesPartner.id.toString()))
  )
  }

  createInvitation(createSalesPartner: CreateSalesPartner, createSalesJunction: CreateSalesJunction[]) {
  Logger.debug(`createInvitation() createSalesPartner:${JSON.stringify(createSalesPartner)}  createSalesJunction:${JSON.stringify(createSalesJunction)}`, APP);

    if (createSalesPartner.refered_by) 
    return this.invitationJunctiondb.save({ sp_id: createSalesPartner.sales_code, refered_by: createSalesPartner.refered_by }).pipe(
      switchMap(_doc => this.invitationJunctiondb.find({ refered_by: createSalesPartner.refered_by })), 
      switchMap(doc => this.db.findandUpdate({ columnName: 'sales_code', columnvalue: createSalesPartner.refered_by, quries: { sales_invitation_count: doc.length } })));

    else return createSalesJunction;

  }

  fetchSalesPartnerByMobileNumber(mobile: string) {
    Logger.debug(`fetchSalesPartnerByMobileNumber() id: [${JSON.stringify(mobile)}]`, APP);

    return from(lastValueFrom(this.db.find({ mobile: mobile }).pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }),
     map((res) => {
      if (res[0] != null) throw new NotFoundException(`sales partner already present with same phone number`)
      return res
    }))));
  }

  fetchSalesPartnerByUserId(id: string) {
  Logger.debug(`fetchSalesPartnerByUserId() id: [${id}]`, APP);

    return from(lastValueFrom(this.db.find({ user_id: id }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map((res) => {
        if (res[0] !== null) throw new NotFoundException(`user already present with same phone number`);
        return res;
      }))));
  }

  fetchSalesPartnerById(id: string) {
  Logger.debug(`fetchSalesPartnerById() id: [${id}]`, APP);

    return from(lastValueFrom(this.db.find({ id: id }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }), 
      map((res) => {
        if (res[0] === null) throw new NotFoundException(`Sales Partner Not Found`);
        if (res[0].is_active === false) throw new NotFoundException(`Sales Partner Not Found`);
        return res;
    }))));
  }

  fetchSalesPartnerBySalesCode(id: string) {
  Logger.debug(`fetchSalesPartnerById() id: [${id}]`, APP);

    return from(lastValueFrom(this.db.find({ sales_code: id }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }), 
      map((res) => {
        if (res[0] === null) throw new NotFoundException(`Sales Partner Not Found`);
        if (res[0].is_active === false) throw new NotFoundException(`Sales Partner Not Found`);
        return res;
    }))));
  }


  deleteSalesPartner(id: string) {
  Logger.debug(`deleteSalesPartner id: [${id}]`, APP);

    return this.db.find({ id: id }).pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }),
    (map(res => {
      if (res[0] == null) throw new NotFoundException(`Sales Partner Not Found`)
      if (res[0].is_active.toString() == "false") throw new NotFoundException(`Sales Partner Not Found`)
      return lastValueFrom(this.db.findandUpdate({ columnName: 'id', columnvalue: id, quries: { is_active: false } }).pipe(
        catchError(err => { throw new BadRequestException() }),
       map(doc => doc )))
    })))
  }

  updateSalesPartner(id: string, updateSalesPartnerDto: UpdateSalesPartner) {
    Logger.debug(`updateSalesPartner() id: [${id}], body: [${JSON.stringify(updateSalesPartnerDto)}]`, APP,);

    return this.db.find({ id: id }).pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }),
    (map(res => {
      if (res[0] == null) throw new NotFoundException(`Sales Partner Not Found`)
      if (res[0].is_active == false) throw new NotFoundException(`Sales Partner Not Found`)
      return lastValueFrom(this.db.findByIdandUpdate({ id: String(id), quries: updateSalesPartnerDto }).pipe(
        catchError(err => { throw new BadRequestException() }),
         map(doc => doc )))
    })))
  }

  fetchAllSalesPartnersByDate(params: ZQueryParamsDto) {
  Logger.debug(`fetchAllSalesPartnersByDate() params:[${JSON.stringify(params)}] `, APP);

    if (Object.keys(params).length === 0)
    return this.db.fetchAll();
    else if (params.date === undefined) return this.db.findByAlphabet(params).pipe(map(doc => doc ))
    else return this.fetchCommissionFromJunctionDb(params).pipe(
      switchMap(_doc => this.db.findByDate(this.makeDateFormat(params))))
  }

  fetchCommissionFromJunctionDb(ZQueryParamsDto: ZQueryParamsDto) {
  Logger.debug(`fetchCommissionFromJunctionDb() params:[${JSON.stringify(ZQueryParamsDto)}] `, APP);

    let arrays = [];
    return this.junctiondb.findByDate(this.makeDateFormatJunction(ZQueryParamsDto)).pipe(
      switchMap(async (doc: any) => {
        let salesceode = [];
        for (let j = 0; j <= doc.length - 1; j++) {
          for (let i = 0; i <= arrays.length; i++) {
            if (arrays.length === 0) 
              arrays.push({ commission_amount: doc[j].commission_amount, 
                sales_code: doc[j].sales_code, 
                total_signups: 1});
            if (doc[j].sales_code === arrays[i]?.sales_code) {
              arrays[i].commission_amount = arrays[i].commission_amount + doc[j].commission_amount;
              arrays[i].total_signups = arrays[i].total_signups + 1;
            }
          }

        for (let i = 0; i <= arrays.length - 1; i++)
          salesceode.push(arrays[i]?.sales_code);

        if (!salesceode.includes(doc[j].sales_code))
          arrays.push({ commission_amount: doc[j].commission_amount, 
          sales_code: doc[j].sales_code,
          total_signups: 1 });
        }

        for (let k = 0; k <= arrays.length - 1; k++)
          await lastValueFrom(this.db.findandUpdate({ columnName: 'sales_code',
          columnvalue: arrays[k].sales_code,
          quries: { total_commission: arrays[k].commission_amount,
          total_signups: arrays[k].total_signups } }));
      }))
  }



  fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto) {
  Logger.debug(`fetchAllSalesPartnersByDate() id: [${id}] params:[${JSON.stringify(params)}] `, APP);

  let contents = [];
  let contentsParams = [];
  if (Object.keys(params).length === 0) 
    return this.invitationJunctiondb.fetchAll().pipe(
      map(async (doc, index: Number) => {
        for (let i = 0; i <= doc.length - 1; i++)
          await lastValueFrom(this.db.find({ sales_code: doc[i].sp_id }).pipe(map(res => { contents.push(res[0]) })))

        return contents
      }))
  else if (params.date == undefined) return [];
  else return this.fetchCommissionFromJunctionDb(params).pipe(
    switchMap(doc => this.invitationJunctiondb.findByConditionSales(id, this.makeDateFormat(params)).pipe(
      map(async (doc: InvitationJunctionModel[], index: Number) => {
        for (let i = 0; i <= doc.length - 1; i++)
          await lastValueFrom(this.db.find({ sales_code: doc[i].sp_id }).pipe(
            map(res => { contentsParams.push(res[0])})))
        return contentsParams
      }))))
  }

  makeDateFormat(params: any) {
  Logger.debug(`makeDateFormat() params:[${JSON.stringify(params)}] `, APP);

  let date = '';
  if (params.date === 'monthly') date = '30';
  else if (params.date === 'quarterly') date = '90';
  else if (params.date === 'weekly') date = '7';
  else if (params.date === 'yearly') date = '365';
  else if (params.date === 'daily') date = '1';
  return {

    number_of_rows: params.number_of_rows,
    number_of_pages: params.number_of_pages,
    name: params.name,
    date: date,
    is_active: params.is_active
  };
  }

  makeDateFormatJunction(params: any) {
  Logger.debug(`makeDateFormatJunction() params:[${JSON.stringify(params)}] `, APP);

  let date = '';
  if (params.date === 'monthly') date = '30';
  else if (params.date === 'quarterly') date = '90';
  else if (params.date === 'weekly') date = '7';
  else if (params.date === 'yearly') date = '365';
  else if (params.date === 'daily') date = '1';

  const modifiedParams = {
    number_of_rows: params.number_of_rows,
    number_of_pages: params.number_of_pages,
    name: params.name,
    date: date,
    is_active: params.is_active
  };
  delete modifiedParams.is_active
  return modifiedParams
  }

  uploadImage(id: string, fileName: string) {
  Logger.debug(`uploadImage(), ${fileName},`, APP);

    const imageDetails: UpdateImageDTO = {
      user_image: fileName,
    }

    return this.updateImageById(id, imageDetails);
  };

  updateImageById(id: string, updateSalesPartnerDto: object) {
  Logger.debug(`updateImageById() id: ${id} Body: ${JSON.stringify(updateSalesPartnerDto)}`, APP);

    return lastValueFrom(this.db.findByIdandUpdate({ id: id, quries: updateSalesPartnerDto }).pipe(
      map(res => res ), 
      catchError(error => { throw new BadRequestException(error.message) })))
  }

  fetchSalesBySalesCode(salesCode: string) {
  Logger.debug(`fetchSalesBySalesCode sales_code:${salesCode}`, APP);

  return this.db.find({ sales_code: salesCode }).pipe(
    switchMap(res => {
      if (res.length === 0) throw new NotFoundException("sales partner not found")
      return res
      }))

  }

  fetchCommisionBySalesCode(salesCode: string) {
  Logger.debug(`fetchCommisionBySalesCode sales_code:${salesCode}`, APP);

    return this.junctiondb.find({ sales_code: salesCode }).pipe(
      map(res => {
        if (res.length === 0) throw new NotFoundException("sales partner not found")
        return res[res.length - 1]
      }))

  }

  changeBankDetailsVerificationSatatus(id: number) {
  Logger.debug(`changeBankDetailsVerificationSatatus() id: [${id}] `, APP);

    return (this.db.find({ id: id })).pipe(
      catchError(err => { (err); throw new UnprocessableEntityException(err.message) }),
      map(res => {
        if (res.length === 0) throw new NotFoundException();
        return this.db.findByIdandUpdate({ id: String(id), quries: { 'bank_details_verification': true } });
      })
    );
  }

  fetchEarnings(salesCode: string, period: Period) {
  Logger.debug(`fetchEarnings() salesCode: ${salesCode},  period: ${JSON.stringify(period)}`, APP);

    return this.junctiondb.findByPeriod({ columnName: "sales_code", columnvalue: salesCode, period: Interval(period) }).pipe(
      map(salesjuncdoc => {
        if (salesjuncdoc.length === 0) throw new NotFoundException("no Account found");
        return makeEarningFormat(salesjuncdoc.reduce((acc, curr) => ([acc[0] += curr.commission_amount, acc[1] += curr.paid_amount]), [0, 0]))
      }))
  }

  fetchInvitationResponse(salesCode: string, period: Period) {
  Logger.debug(`fetchInvitationResponse() salesCode: ${salesCode}`, APP);

    return this.salesUser.findByPeriod({ columnName: "sales_code", columnvalue: salesCode, period: Interval(period) }).pipe(
      catchError(error => { throw new BadRequestException(error.message) }),
      map(salesuser => {
        if (salesuser.length === 0) throw new NotFoundException("no Account found");
        return { "signup": salesuser.length }
      }))
  }

  addCommission(salesCode: string) {
  Logger.debug(`addCommission() salesCode: ${salesCode}`, APP);

    return this.fetchSalesBySalesCode(salesCode).pipe(
      switchMap(salesCommission =>
        lastValueFrom(this.junctiondb.find({ "sales_code": String(salesCode)}))
          .then(res => { return [salesCommission, res[res.length - 1]] })),
      switchMap(async ([salesCommission, res]) => { await this.salesUser.save({ sales_code: salesCode }); return [salesCommission, res] }),
      switchMap(([salesCommission, res]) =>
        this.junctiondb.save({ sales_code: salesCode, commission_amount: salesCommission["commission"], dues: (Number(res['dues']) + Number(salesCommission["commission"])) })
      ))
  }

  updateUserIdInSales(id: string, updateSalesPartnerDto: UpdateSalesPartner) {
  Logger.debug(`updateSalesPartner() id: [${id}], body: [${JSON.stringify(updateSalesPartnerDto)}]`, APP,);

    return this.db.find({ id: id }).pipe(
      switchMap(res => {
        if (res.length === 0) throw new NotFoundException(`Sales Partner Not Found`);
        else return findUserByCustomerId(updateSalesPartnerDto.customer_id).pipe(map((userDoc) => {
          if (userDoc.length === 0) throw new NotFoundException("User not found");
          else if (userDoc[0].userreference_id === updateSalesPartnerDto.customer_id)
          return lastValueFrom(this.db.findByIdandUpdate({ id: id, quries: { user_id: userDoc[0].fedo_id } }).pipe(
            catchError(err => { throw new BadRequestException(err.message) }), 
            map(doc => doc)))
        }))
      }))
  }

  fetchEarnigReport(yearMonthDto: YearMonthDto) {
  Logger.debug(`fetchCommissionReport() year: [${yearMonthDto.year}]`);

  const reportData = []
  return from(fetchmonths((yearMonthDto.year))).pipe(
    concatMap(async (month: number) => await lastValueFrom(this.junctiondb.fetchByYear({ columnName: 'sales_code', columnvalue: yearMonthDto.salesCode, year: yearMonthDto.year, month: month.toString() }))
        .then(async salesJunctionDoc => {
          const paidAmount = salesJunctionDoc.map(doc => doc.paid_amount)
          const totalPaidAmount = paidAmount.reduce((next, prev) => next + prev, 0)
          const date = salesJunctionDoc.map(doc => { if (doc.paid_amount > 0) return doc.created_date })
          const paidOn = date.filter((res) => res)
          await this.fetchSignup(yearMonthDto.year, month, yearMonthDto)
            .then(signup => {
              reportData.push({ "total_paid_amount": totalPaidAmount, "month": month - 1, "hsa_sing_up": signup, "paid_on": paidOn[0], 'total_dues': Number(salesJunctionDoc[salesJunctionDoc.length - 1]?.dues) })
            }).catch(error => { throw new NotFoundException(error.message) })
          return reportData
        })))
  }

  async fetchSignup(year, month, yearMonthDto: YearMonthDto) {
    Logger.debug(`fetchSignup() year: [${year}] month: [${month}] salesCode:[${yearMonthDto.salesCode}]`, APP);

    return await lastValueFrom(this.salesUser.fetchByYear({ columnName: 'sales_code', columnvalue: yearMonthDto.salesCode, year: yearMonthDto.year, month: (month - 1).toString() }))
      .then(userJunctionDoc => { return userJunctionDoc.length })
      .catch(error => { throw new UnprocessableEntityException(error.message) })
  }
}

