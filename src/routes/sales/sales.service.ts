/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { BadRequestException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateSalesInvitationJunction, CreateSalesJunction, CreateSalesPartner, Interval, makeEarningFormat, Period, SalesUserJunction, SalesYearMonth, UpdateImageDTO, UpdateSalesPartner, YearMonthDto, ZQueryParamsDto } from './dto/create-sale.dto';
import { HttpService } from '@nestjs/axios';
import { fetchAccountBySalesCode, fetchUserByMobileNumber, findUserByCustomerId } from 'src/constants/helper';
import { CreateSalesPartnerModel } from 'src/lib/config/model/sales.model';
import { InvitationJunctionModel } from './dto/invitation-junction.model';
import { catchError, from, identity, lastValueFrom, map, switchMap } from 'rxjs';

const APP = 'SalesService';

@Injectable()
export class SalesService {

  constructor(
    @DatabaseTable('sales_partner') private readonly db: DatabaseService<CreateSalesPartnerModel>,
    @DatabaseTable('sales_partner_invitation_junction') private readonly invitationJunctiondb: DatabaseService<CreateSalesInvitationJunction>,
    @DatabaseTable('sales_commission_junction') private readonly junctiondb: DatabaseService<CreateSalesJunction>,
    private http: HttpService) { }

  createSalesPartner(createSalesPartner: CreateSalesPartner) {
    Logger.debug(`createSalesPartner() DTO:${JSON.stringify(createSalesPartner,)}`, APP);

    return this.fetchSalesPartnerByMobileNumber(createSalesPartner.mobile).pipe(
      switchMap(_doc => fetchUserByMobileNumber(createSalesPartner.mobile)),
      switchMap(doc => {
        if (!doc[0]) return this.saveToDb(doc, createSalesPartner)
        else return this.saveToDb(doc[0].fedo_id, createSalesPartner)
      }),
      switchMap(doc => {
        createSalesPartner.sales_code = "FEDSP" + String(new Date().getMonth() + 1).padStart(2, '0') + String(new Date().getDate()).padStart(2, '0') + 500 + doc[0].id;
        createSalesPartner.id = doc[0].id;
        return this.junctiondb.save({ sales_code: createSalesPartner.sales_code }).pipe(catchError(err => { throw new BadRequestException(err.message) }), map(doc => doc))
      }),
      switchMap(doc => this.createInvitation(createSalesPartner, doc)),
      switchMap(doc => this.updateSalesPartner(createSalesPartner.id.toString(), <UpdateSalesPartner>{ sales_code: createSalesPartner.sales_code })),
      switchMap(doc => this.fetchSalesPartnerById(createSalesPartner.id.toString()))
    )
  }

  saveToDb(userId: any, createSalesPartner: CreateSalesPartner) {
    Logger.debug(`saveToDb() id: [${JSON.stringify(userId)}] DTO:${JSON.stringify(createSalesPartner,)}`, APP);

    if (userId?.length < 1) {
      return this.db.save({
        name: createSalesPartner.name, location: createSalesPartner.location, commission: createSalesPartner.commission,
        mobile: createSalesPartner.mobile, email: createSalesPartner.email
      }).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(res => res))
    }
    else {
      return this.db.save({
        name: createSalesPartner.name, location: createSalesPartner.location, commission: createSalesPartner.commission,
        mobile: createSalesPartner.mobile, email: createSalesPartner.email, user_id: userId, is_hsa_account: true
      }).pipe(
        catchError(err => { throw new UnprocessableEntityException(err.message) }),
        map(res => res))
    }
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

    return this.db.find({ mobile: mobile }).pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map((res) => {
        if (res[0] != null) throw new NotFoundException(`sales partner already present with same phone number`);
        return res
      }));
  }

  fetchSalesPartnerById(id: string) {
    Logger.debug(`fetchSalesPartnerById() id: [${id}]`, APP);

    return from(lastValueFrom(this.db.find({ id: id }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map((res) => {
        if (res[0] == null || res[0].is_active == false) throw new NotFoundException(`Sales Partner Not Found`);
        return res;
      }))));
  }

  fetchSalesCodeByMobileNumber(mobile: string) {
    Logger.debug(`fetchSalesPartnerById() id: [${mobile}]`, APP);

    return from(lastValueFrom(this.db.find({ mobile: mobile }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map((res) => {
        if (res[0] == null || res[0].is_active == false) throw new NotFoundException(`Sales Partner Not Found`);
        return res;
      }))));
  }

  fetchSalesPartnerBySalesCode(id: string) {
    Logger.debug(`fetchSalesPartnerById() id: [${id}]`, APP);

    return from(lastValueFrom(this.db.find({ sales_code: id }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map((res) => {
        if (res[0] == null || res[0].is_active == false) throw new NotFoundException(`Sales Partner Not Found`);
        return res;
      }))));
  }

  deleteSalesPartner(id: string) {
    Logger.debug(`deleteSalesPartner id: [${id}]`, APP);

    return this.db.find({ id: id }).pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }),
      (map(res => {
        if (res[0] == null || res[0].is_active == false) throw new NotFoundException(`Sales Partner Not Found`);
        return lastValueFrom(this.db.findandUpdate({ columnName: 'id', columnvalue: id, quries: { is_active: false } }).pipe(
          catchError(err => { throw new BadRequestException(err.message) }),
          map(doc => doc)))
      })))
  }

  updateSalesPartner(id: string, updateSalesPartnerDto: UpdateSalesPartner) {
    Logger.debug(`updateSalesPartner() id: [${id}], body: [${JSON.stringify(updateSalesPartnerDto)}]`, APP,);

    return this.db.find({ id: id }).pipe(catchError(err => { throw new UnprocessableEntityException(err.message) }),
      (map(res => {
        if (res[0] == null || res[0].is_active == false) throw new NotFoundException(`Sales Partner Not Found`);
        if (updateSalesPartnerDto?.name?.length == 0) delete updateSalesPartnerDto.name
        if (updateSalesPartnerDto?.location?.length == 0) delete updateSalesPartnerDto.location
        return lastValueFrom(this.db.findByIdandUpdate({ id: id, quries: updateSalesPartnerDto }).pipe(
          catchError(err => { throw new BadRequestException(err.message) }),
          map(doc => doc)))
      })))
  }

  fetchAllSalesPartnersByDate(params: ZQueryParamsDto) {
    Logger.debug(`fetchAllSalesPartnersByDate() params:[${JSON.stringify(params)}] `, APP);

    if (Object.keys(params).length === 0) return this.db.fetchAll();
    else if (params.date === undefined) return this.db.findByAlphabet(params)
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
              arrays.push({ commission_amount: doc[j].commission_amount, sales_code: doc[j].sales_code, total_signups: 1 });
            if (doc[j].sales_code === arrays[i]?.sales_code) {
              arrays[i].commission_amount = arrays[i].commission_amount + doc[j].commission_amount;
              arrays[i].total_signups = arrays[i].total_signups + 1;
            }
          }
          for (let i = 0; i <= arrays.length - 1; i++)
            salesceode.push(arrays[i]?.sales_code);

          if (!salesceode.includes(doc[j].sales_code))
            arrays.push({ commission_amount: doc[j].commission_amount, sales_code: doc[j].sales_code, total_signups: 1 });
        }
        for (let k = 0; k <= arrays.length - 1; k++)
          await lastValueFrom(this.db.findandUpdate({
            columnName: 'sales_code',
            columnvalue: arrays[k].sales_code,
            quries: {
              total_commission: arrays[k].commission_amount,
              total_signups: arrays[k].total_signups
            }
          }).pipe(catchError(err=>{throw new UnprocessableEntityException(err.message)})));
      }))
  }

  fetchAllSalesPartnersFromJunctionByDate(id: string, params: ZQueryParamsDto) {
    Logger.debug(`fetchAllSalesPartnersByDate() id: [${id}] params:[${JSON.stringify(params)}] `, APP);

    let contents = [];
    let contentsParams = [];
    if (Object.keys(params).length === 0)
      return this.invitationJunctiondb.fetchAllUsingId(id).pipe(
        map(async (doc, index: Number) => {
          for (let i = 0; i <= doc.length - 1; i++)
            await lastValueFrom(this.db.find({ sales_code: doc[i].sp_id }).pipe(
              map(res => { contents.push(res[0]) })))
          return contents
        }))

    else if (params.date == undefined) return [];
    else return this.fetchCommissionFromJunctionDb(params).pipe(
      switchMap(doc => this.invitationJunctiondb.findByConditionSales(id, this.makeDateFormatJunction(params)).pipe(
        map(async (doc: InvitationJunctionModel[], index: Number) => {
          for (let i = 0; i <= doc.length - 1; i++)
            await lastValueFrom(this.db.findByConditionSales(doc[i].sp_id, this.makeDateFormat(params)).pipe(
              map(res => { contentsParams.push(res[0]) })))
          return contentsParams.filter(result => {
            return result !== undefined;
          });
        }),catchError(err => { throw new UnprocessableEntityException(err.message) }))))
  }

  makeDateFormatJunction(params: any) {
    Logger.debug(`makeDateFormatJunction() params:[${JSON.stringify(params)}] `, APP);

    let date = '';
    if (params.date === 'monthly') date = '30';
    else if (params.date === 'quarterly') date = '90';
    else if (params.date === 'weekly') date = '7';
    else if (params.date === 'yearly') date = '365';
    else if (params.date === 'daily') date = '1';
    else if (params.date === 'decade') date = '3650';
    const paramsForJunctionDb = this.makeParams(date, params)
    delete paramsForJunctionDb.is_active
    return paramsForJunctionDb
  }

  makeDateFormat(params: any) {
    Logger.debug(`makeDateFormat() params:[${JSON.stringify(params)}] `, APP);

    let date = '';
    if (params.date === 'monthly') date = '30';
    else if (params.date === 'quarterly') date = '90';
    else if (params.date === 'weekly') date = '7';
    else if (params.date === 'yearly') date = '365';
    else if (params.date === 'daily') date = '1';
    else if (params.date === 'decade') date = '3650';
    return this.makeParams(date, params)
  }


  makeParams(date: string, params: any) {
    Logger.debug(`makeParams() params:[${JSON.stringify(params)}] `, APP);

    return {
      number_of_rows: params.number_of_rows,
      number_of_pages: params.number_of_pages,
      name: params.name,
      date: date,
      is_active: params.is_active
    };
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

    return this.db.find({ id: id }).pipe(
      map(res => {
        if (res.length == 0) throw new NotFoundException('sales partner not found')
        return this.db.findByIdandUpdate({ id: id, quries: updateSalesPartnerDto })
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

  updateUserIdInSales(id: string, updateSalesPartnerDto: UpdateSalesPartner) {
    Logger.debug(`updateSalesPartner() id: [${id}], body: [${JSON.stringify(updateSalesPartnerDto)}]`, APP,);

    return this.db.find({ id: id }).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      switchMap(res => {
        if (res.length === 0) throw new NotFoundException(`Sales Partner Not Found`);
        else return findUserByCustomerId(updateSalesPartnerDto.customer_id).pipe(
          map((userDoc) => {
            if (userDoc.length === 0) throw new NotFoundException("User not found");
            else return lastValueFrom(this.db.findByIdandUpdate({ id: id, quries: { user_id: userDoc[0].fedo_id } }).pipe(
              catchError(err => { throw new BadRequestException(err.message) }),
              map(doc => doc)))
          }))
      }))
  }

  fetchEarnigReportByMonth(salesYearMonth: SalesYearMonth) {
    Logger.debug(`fetchEarnigReportByMonth() salesYearMonth: [${JSON.stringify(salesYearMonth)}]`, APP);

    return this.db.find({ sales_code: salesYearMonth.salesCode }).pipe(
      switchMap(doc =>{
        if(doc.length == 0) throw new NotFoundException("Sales Partner Not Record Found")
        return this.fetchAccountfromHSA(doc[0], salesYearMonth)}))
  }

  fetchAccountfromHSA(createSalesPartnerModel: CreateSalesPartnerModel, salesYearMonth: SalesYearMonth){
    Logger.debug(`fetchAccountfromHSA() createSalesPartnerModel: [${JSON.stringify(createSalesPartnerModel)}]`, APP);

    let salesUser =[];
    return fetchAccountBySalesCode(createSalesPartnerModel.sales_code).pipe(
      map(doc =>doc.map(doc => {doc['commission'] = createSalesPartnerModel.commission; return doc }) ),
      map( doc => doc.filter(doc =>{  const date = new Date(doc.date); return date.getMonth() === (parseInt(salesYearMonth.month) - 1) && date.getFullYear() === parseInt(salesYearMonth.year)}))) 

  }

}

