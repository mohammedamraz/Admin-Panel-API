/* eslint-disable max-lines-per-function */
import { BadRequestException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateSalesInvitationJunction, CreateSalesJunction, CreateSalesPartner, CreateWithdrawn, Interval, makeEarningFormat, Period, UpdateImageDTO, UpdateSalesPartner, ZQueryParamsDto } from './dto/create-sale.dto';
import { HttpService } from '@nestjs/axios';
import { fetchAccountBySalesCode, fetchUserByMobileNumber } from 'src/constants/helper';
import { catchError, from, lastValueFrom, map, of, switchMap } from 'rxjs';

const APP = 'SalesService';

@Injectable()
export class SalesService {
  // create(c

  constructor(
    @DatabaseTable('sales_partner') private readonly db: DatabaseService<CreateSalesPartner>,
    @DatabaseTable('sales_partner_invitation_junction') private readonly invitationJunctiondb: DatabaseService<CreateSalesInvitationJunction>,
    @DatabaseTable('sales_commission_junction') private readonly junctiondb: DatabaseService<CreateSalesJunction>,
    @DatabaseTable('sales_withdrawn_amount') private readonly withdrawndb: DatabaseService<CreateWithdrawn>,
    private http: HttpService) { }

  createSalesPartner(createSalesPartner: CreateSalesPartner) {
    Logger.debug(`createSalesPartner() DTO:${JSON.stringify(createSalesPartner,)}`, APP);

    let salesId

    var todayDate: any
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    todayDate = mm + dd


<<<<<<< HEAD
  return this.fetchSalesPartnerByMobileNumber(createSalesPartner.mobile).pipe(
    switchMap(doc => fetchUserByMobileNumber(createSalesPartner.mobile)),
    switchMap(doc => {
      if (!doc[0]) return this.db.save({ name: createSalesPartner.name, location: createSalesPartner.location, commission: createSalesPartner.commission, mobile: createSalesPartner.mobile, email: createSalesPartner.email})
      else  return this.db.save( { name: createSalesPartner.name, location: createSalesPartner.location, commission: createSalesPartner.commission, mobile: createSalesPartner.mobile, email: createSalesPartner.email, user_id: doc[0].fedo_id })
    }),
    switchMap(doc =>{ salesId = doc[0].id; createSalesPartner.sales_code = "FEDSP" + todayDate + 500 + doc[0].id ; createSalesPartner.id = doc[0].id; return this.junctiondb.save({ sales_code: "FEDSP" + todayDate + 500 + doc[0].id }).pipe(catchError(err => { throw new BadRequestException(err.message) }), map(doc => doc))} ),
    switchMap(doc => this.createInvitation(createSalesPartner, doc)),
    switchMap(doc => this.updateSalesPartner(salesId, <UpdateSalesPartner>{ sales_code: createSalesPartner.sales_code })),
    switchMap(doc =>  this.fetchSalesPartnerById(createSalesPartner.id.toString()))
  )
=======
    return this.fetchSalesPartnerByMobileNumber(createSalesPartner.mobile).pipe(
      switchMap(doc => fetchUserByMobileNumber(createSalesPartner.mobile)),
      switchMap(doc => {
        if (!doc[0]) return this.db.save(createSalesPartner)
        else return this.db.save({ name: createSalesPartner.name, location: createSalesPartner.location, commission: createSalesPartner.commission, phone_number: createSalesPartner.mobile, email: createSalesPartner.email, user_id: doc[0].fedo_id })
      }),
      switchMap(doc => { salesId = doc[0].id; createSalesPartner.sales_code = "FEDSP" + todayDate + 500 + doc[0].id; createSalesPartner.id = doc[0].id; return this.junctiondb.save({ sales_code: "FEDSP" + todayDate + 500 + doc[0].id }).pipe(catchError(err => { throw new BadRequestException(err.message) }), map(doc => doc)) }),
      switchMap(doc => this.createInvitation(createSalesPartner, doc)),
      switchMap(doc => this.updateSalesPartner(salesId, <UpdateSalesPartner>{ sales_code: createSalesPartner.sales_code })),
      switchMap(doc => this.fetchSalesPartnerById(createSalesPartner.id.toString()))
    )
>>>>>>> ed74993ff017d3475c581c82039b3b05c597ab9c

  }

  createInvitation(createSalesPartner: CreateSalesPartner, createSalesJunction: CreateSalesJunction[]) {

    if (createSalesPartner.refered_by) return this.invitationJunctiondb.save({ sp_id: createSalesPartner.sales_code, refered_by: createSalesPartner.refered_by }).pipe(
      switchMap(_doc => this.invitationJunctiondb.find({ refered_id: createSalesPartner.refered_by })),
      switchMap(doc => this.db.findandUpdate({ columnName: 'sales_code', columnvalue: createSalesPartner.refered_by, quries: { sales_invitation_count: doc.length } })))
    else return createSalesJunction;

  }

  fetchSalesPartnerByMobileNumber(mobile: string) {
    Logger.debug(`fetchSalesPartnerByUserId() id: [${JSON.stringify(mobile)}]`, APP);

<<<<<<< HEAD
  return from(lastValueFrom(this.db.find({ mobile: mobile }).pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }), map((res) => {
    if (res[0] != null) throw new NotFoundException(`sales partner already present with same phone number`)
    return res
  }))));
}
=======
    return from(lastValueFrom(this.db.find({ phone_number: mobile }).pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }), map((res) => {
      if (res[0] != null) throw new NotFoundException(`sales partner already present with same phone number`)
      return res
    }))));
  }
>>>>>>> ed74993ff017d3475c581c82039b3b05c597ab9c


  fetchSalesPartnerByUserId(id: string) {
    Logger.debug(`fetchSalesPartnerByUserId() id: [${JSON.stringify(id)}]`, APP);

    return from(lastValueFrom(this.db.find({ user_id: id }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map((res) => {
        if (res[0] !== null) throw new NotFoundException(`user already present with same phone number`)
        return res
      }))));
  }

  fetchSalesPartnerById(id: string) {
    Logger.debug(`fetchSalesPartnerById() id: [${JSON.stringify(id)}]`, APP);

<<<<<<< HEAD
  return from(lastValueFrom(this.db.find({ id: id }).pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }), map((res) => {
    console.log('adfasdf', res)
    if (res[0] == null) throw new NotFoundException(`Sales Partner Not Found`)
    if (res[0].is_active == false) throw new NotFoundException(`Sales Partner Not Found`)
    return res
  }))));
}
=======
    return from(lastValueFrom(this.db.find({ id: id }).pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }), map((res) => {
      console.log('adfasdf', res)
      if (res[0] === null) throw new NotFoundException(`Sales Partner Not Found`)
      if (res[0].is_active === false) throw new NotFoundException(`Sales Partner Not Found`)
      return res
    }))));
  }
>>>>>>> ed74993ff017d3475c581c82039b3b05c597ab9c


  deleteSalesPartner(id: string) {
    Logger.debug(`deleteSalesPartner id: [${id}]`, APP);

    return this.db.find({ id: id }).pipe(map(res => {
      if (res[0] === null) throw new NotFoundException(`Sales Partner Not Found`)
      if (res[0].is_active.toString() === "false") throw new NotFoundException(`Sales Partner Not Found`)
      return lastValueFrom(this.db.findandUpdate({ columnName: 'id', columnvalue: id, quries: { "is_active": "false" } }).pipe(catchError(err => { throw new BadRequestException() }), map(doc => { return doc })))
    }))
  }

  updateSalesPartner(id: string, updateSalesPartnerDto: UpdateSalesPartner) {
    Logger.debug(`updateSalesPartner() id: [${id}], body: [${JSON.stringify(updateSalesPartnerDto)}]`, APP,);

    return this.db.find({ id: id }).pipe(map(res => {
      if (res[0] === null) throw new NotFoundException(`Sales Partner Not Found`)
      if (res[0].is_active === false) throw new NotFoundException(`Sales Partner Not Found`)
      return lastValueFrom(this.db.findByIdandUpdate({ id: id, quries: updateSalesPartnerDto }).pipe(catchError(err => { throw new BadRequestException() }), map(doc => { return doc })))
    }))

  }

  fetchAllSalesPartnersByDate(params: ZQueryParamsDto) {
    Logger.debug(`fetchAllSalesPartnersByDate() params:[${JSON.stringify(params)}] `, APP);

    if (Object.keys(params).length == 0) return this.db.fetchAll()
    else {
      if (params.date === undefined) return this.db.findByAlphabet(params).pipe(map(doc => { return doc }))
      else return this.db.findByDate(this.makeDateFormat(params)).pipe(map(doc => { return doc }))
    }
  }

  fetchCommissionFromJunctionDb(params: ZQueryParamsDto) {
    Logger.debug(`fetchCommissionFromJunctionDb() params:[${JSON.stringify(params)}] `, APP);
    
      if (params.date === undefined) return []
      else return this.junctiondb.findByDate(this.makeDateFormat(params)).pipe(map(doc => { 
       doc.forEach(doc=>{
         return doc
       })
       }))
    
  }

  

  fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto) {
    Logger.debug(`fetchAllSalesPartnersByDate() id: [${id}] params:[${JSON.stringify(params)}] `, APP);

    if (params.date == undefined) return []
    else return this.invitationJunctiondb.findByConditionSales(id, this.makeDateFormat(params)).pipe(map(doc => { return doc }))
  }

  makeDateFormat(params: any) {
    Logger.debug(`makeDateFormat() params:[${JSON.stringify(params)}] `, APP);

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

    return lastValueFrom(this.db.findByIdandUpdate({ id: id, quries: updateSalesPartnerDto }).pipe(map(res => { return res }), catchError(error => { throw new BadRequestException(error.message) })))

  }

  fetchSalesBySalesCode(sales_code: string) {
    Logger.debug(`fetchSalesBySalesCode sales_code:${sales_code}`, APP);

    return this.db.find({ sales_code: sales_code }).pipe(
      switchMap(res => {
        if (res.length === 0) throw new NotFoundException("sales partner not found")
        return res
      }))

  }

  fetchCommisionBySalesCode(salesCode: string) {
    Logger.debug(`fetchCommisionBySalesCode sales_code:${salesCode}`, APP);

    return this.junctiondb.find({ 'sales_code': salesCode }).pipe(
      map(res => {
        if (res.length === 0) throw new NotFoundException("sales partner not found")
        return res[res.length - 1]
      }))

  }



  paymentCalculation(salesCode: string) {
    Logger.debug(`paymentCalculation salesCode: ${salesCode}`, APP);

    let totalCommission
    let remainingCommission

    return this.fetchSalesBySalesCode(salesCode).pipe(
      switchMap(doc => { return this.fetchCommisionBySalesCode(salesCode) }),
      switchMap(doc => { console.log(doc.commission_amount); totalCommission = doc.commission_amount; return this.fetchSalesBySalesCode(salesCode).pipe(map(doc => { return doc })) }),
      switchMap(doc => this.withdrawndb.find({ 'sale_id': doc.id })),
      switchMap(doc => { console.log(doc[0].paid_amount, totalCommission); remainingCommission = totalCommission - doc[0].paid_amount; console.log(remainingCommission); return this.junctiondb.save({ sales_code: salesCode, commission_amount: remainingCommission }) })


    )


  }

  changeBankDetailsVerificationSatatus(id: number) {
    Logger.debug(`changeBankDetailsVerificationSatatus() id: [${id}] quries:{'bank_details_verification':true}`, APP);

    return (this.db.find({ id: id })).pipe(
      catchError(err => { (err); throw new UnprocessableEntityException() }),
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

  fetchInvitationResponse(salesCode: string) {
    Logger.debug(`fetchInvitationResponse() salesCode: ${salesCode}`, APP);

    return fetchAccountBySalesCode(salesCode).pipe(
      catchError(error => { throw new BadRequestException(error.message) }),
      map(accounts => {
        if (accounts.length === 0) throw new NotFoundException("no Account found");
        return { "signup": (accounts.filter(account => account.zwitch_id !== null)).length }
      }))
  }
}
