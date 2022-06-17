/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import { BadRequestException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateSalesJunction, Interval, makeEarningFormat, Period, SalesUserJunction, YearMonthDto } from './dto/create-sale.dto';
import { HttpService } from '@nestjs/axios';
import { CreateSalesPartnerModel } from 'src/lib/config/model/sales.model';
import { catchError, concatMap, from, lastValueFrom, map, of, switchMap } from 'rxjs';
import { fetchmonths } from '../admin/dto/create-admin.dto';

const APP = 'SalesCommissionService';

@Injectable()
export class SalesCommissionService {

    constructor(
        @DatabaseTable('sales_partner') private readonly db: DatabaseService<CreateSalesPartnerModel>,
        @DatabaseTable('sales_commission_junction') private readonly junctiondb: DatabaseService<CreateSalesJunction>,
        @DatabaseTable('sales_user_junction') private readonly salesUser: DatabaseService<SalesUserJunction>,
        private http: HttpService) { }


    addCommission(salesCode: string) {
        Logger.debug(`addCommission() salesCode: ${salesCode}`, APP);

        return this.fetchSalesBySalesCode(salesCode).pipe(
            switchMap(salesCommission =>
                lastValueFrom(this.junctiondb.find({ "sales_code": String(salesCode) }))
                    .then(res => { return [salesCommission, res[res.length - 1]] })),
            switchMap(async ([salesCommission, res]) => { await this.salesUser.save({ sales_code: salesCode }); return [salesCommission, res] }),
            switchMap(([salesCommission, res]) =>
                this.junctiondb.save({ sales_code: salesCode, commission_amount: salesCommission["commission"], dues: (Number(res['dues']) + Number(salesCommission["commission"])) })
            ))
    }

    fetchSalesBySalesCode(salesCode: string) {
        Logger.debug(`fetchSalesBySalesCode sales_code:${salesCode}`, APP);

        return this.db.find({ sales_code: salesCode }).pipe(
            switchMap(res => {
                if (res.length === 0) throw new NotFoundException("sales partner not found")
                return res
            }))

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

    fetchEarnigReport(yearMonthDto: YearMonthDto) {
        Logger.debug(`fetchEarnigReport() year: [${yearMonthDto.year}]`);

        const reportData = []
        return from(fetchmonths((yearMonthDto.year))).pipe(
            concatMap(async (month: number) => {
                return await lastValueFrom(this.junctiondb.fetchByYear({ columnName: 'sales_code', columnvalue: yearMonthDto.salesCode, year: yearMonthDto.year, month: month.toString() }))
                    .then(async salesJunctionDoc => {
                        const paidAmount = salesJunctionDoc.map(doc => doc.paid_amount)
                        const totalPaidAmount = paidAmount.reduce((next, prev) => next + prev, 0)
                        const date = salesJunctionDoc.map(doc => { if (doc.paid_amount > 0) return doc.created_date })
                        const paidOn = date.filter((res) => res)
                        await this.fetchSignup(yearMonthDto.year, month - 1, yearMonthDto)
                            .then(signup => {
                                if (month === fetchmonths((yearMonthDto.year))[0] && month !== 12) this.fetchSignup(yearMonthDto.year, month, yearMonthDto)
                                    .then(doc => reportData.push({ "month": month, "hsa_sign_up": doc, "dues": salesJunctionDoc.reduce((acc, pre) => acc + pre.commission_amount, 0) }))
                                if (month === 12) {
                                    lastValueFrom(this.junctiondb.fetchByYear({ columnName: 'sales_code', columnvalue: yearMonthDto.salesCode, year: (parseInt(yearMonthDto.year) + 1).toString(), month: '1' }))
                                        .then(salesJunctionDoc => {
                                            reportData.push({
                                                total_paid_amount: salesJunctionDoc.reduce((next, pre) => next + pre.paid_amount, 0),
                                                month: 12, hsa_sign_up: signup, paid_on: salesJunctionDoc.filter(doc => { if (doc.paid_amount > 0) return doc })[0]?.created_date
                                            })
                                        })
                                } if (month - 1 !== 0) reportData.push({ "total_paid_amount": totalPaidAmount, "month": month - 1, "hsa_sign_up": signup, "paid_on": paidOn[0] })
                            }).catch(error => { throw new NotFoundException(error.message) })
                        return reportData.sort((a, b) => (a.month < b.month) ? 1 : ((b.month < a.month) ? -1 : 0))
                    })
            }))
    }

    async fetchSignup(year, month, yearMonthDto: YearMonthDto) {
        Logger.debug(`fetchSignup() year: [${year}] month: [${month}] salesCode:[${yearMonthDto.salesCode}]`, APP);
        return await lastValueFrom(this.salesUser.fetchByYear({ columnName: 'sales_code', columnvalue: yearMonthDto.salesCode, year: yearMonthDto.year, month: month }))
            .then(userJunctionDoc => { return userJunctionDoc.length })
            .catch(error => { throw new UnprocessableEntityException(error.message) })
    }

}

