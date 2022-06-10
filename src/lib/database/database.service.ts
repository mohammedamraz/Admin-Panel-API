import { Injectable, Logger, Type } from '@nestjs/common';
import { Pool } from 'pg';
import { from, Observable, of } from 'rxjs';
import { DatabaseFeatureOptions, DatabaseInterface, findAllParamsandUpdate, findAndUpdateParams, findByConditionParams, findByConditionParamsAlign, findByDateParams, findByIDAndUpdateParams, findParams, InsertParams, QueryParams, findByPeriodParams, fetchByYearAndMonthParams } from './interfaces/database.interface';

const APP = "DatabaseService"
@Injectable()
export class DatabaseService<T> implements DatabaseInterface<T> {
  tableName: string;

  constructor(
    private readonly pool: Pool,
    readonly feature: DatabaseFeatureOptions,
  ) {
    this.tableName = feature.tableName;
  }

  private runQuery(query: string, params = []): Observable<any> {
    Logger.debug(`runQuery(): query ${[JSON.stringify(query), params]}`, APP);

    return from(this.pool.query(query, params).then(_ => _.rows));
  }

  private underScoreToCamelCase(
    record: Record<string, any>,
  ): Record<string, any> {
    const newObj = {};
    Object.keys(record).forEach((key) => {
      const origKey = key;
      while (key.indexOf('_') > -1) {
        const _index = key.indexOf('_');
        const nextChar = key.charAt(_index + 1);
        key = key.replace(`_${nextChar}`, nextChar.toUpperCase());
      }
      newObj[key] = record[origKey];
    });
    return newObj;
  }



  save(queryRequest: object): Observable<T[]> {
    Logger.debug(`save(): queryRequest ${[JSON.stringify(queryRequest)]}`, APP);

    const fields: Array<string> = [];
    const values: Array<string> = [];
    const userVariables: Array<string> = [];


    Object.entries(queryRequest).map((_, index) => { fields.push(_[0].replace("[", "").replace("]", "")), userVariables.push(_[1]), values.push(`$${index + 1}`) })
    const query = 'INSERT INTO ' + this.tableName + ' (' + fields + ') VALUES (' + values + ') RETURNING *;';

    return this.runQuery(query, userVariables);
  }

  // tslint:disable-next-line: no-identical-functions

  delete(params: QueryParams): Observable<T[]> {
    return of([]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findByIdAndDelete(id: string): Observable<T[]> {
    Logger.debug(`findByIdAndDelete(): query ${[JSON.stringify(id)]}`, APP);

    let variables: Array<string> = [];
    variables.push(id)
    const query = `DELETE FROM ${this.tableName} WHERE id=$1;`

    return this.runQuery(query, variables);
  }

  // fetches and gives all the values from the given table and related table 
  findAll(params: findParams): Observable<T[]> {
    Logger.debug(`findAll(): query ${[JSON.stringify(params)]}`, APP);

    const index: Array<string> = [];
    const values: Array<string> = [];
    const variables: Array<string> = [];
    Object.entries(params.columnValue).map((val, ind) => { index.push(`$${ind + 1}`), values.push(`=$${ind + 1}`), variables.push(val[1]) });
    const values$ = JSON.stringify(values).replace(/,/g, " AND ").replace("[", "").replace("]", "").replace(/"/g, "");
    const query = `SELECT * FROM ${this.tableName} as ft JOIN ${params.foreignKeyTableName} as st ON ft.${params.columnName}=st.${params.foreigKeyColumnName} WHERE ft.${params.columnName} ${values$}`;

    return this.runQuery(query, variables);
  }

  // fetches and gives all the values from the table
  find(condition: object): Observable<T[]> {
    Logger.debug(`find(): params ${[JSON.stringify(condition)]}`, APP);

    // example
    // condition = {id:20,email:"'fedo@fedo.ai'"}
    const index: Array<string> = [];
    const values: Array<string> = [];
    const variables: Array<string> = [];
    Object.entries(condition).map((_, index1) => { index.push(`$${index1 + 1}`), values.push((`${_[0]}=$${index1 + 1}`)), variables.push(_[1]) });

    const values$ = JSON.stringify(values).replace(/,/g, " AND ").replace("[", "").replace("]", "").replace(/"/g, "");
    const query = `SELECT * FROM ${this.tableName} WHERE ${values$}`;
    return this.runQuery(query, variables);
  }

  // find by id and update in the same table
  findByIdandUpdate(findByIDAndupdateparams: findByIDAndUpdateParams): Observable<T[]> {
    Logger.debug(`findByIdandUpdate(): params ${[JSON.stringify(findByIDAndupdateparams)]}`, APP);

    const values: Array<string> = [];
    const variables: Array<string> = [];
    Object.entries(findByIDAndupdateparams.quries).map((_, index1) => { values.push((`${_[0]}=$${index1 + 1}`)), variables.push(_[1]) });
    const values$ = JSON.stringify(values).replace("[", "").replace("]", "").replace(/"/g, "");
    const query = `UPDATE ${this.tableName} SET ${values$} WHERE id = $${values.length + 1}`;
    variables.push(findByIDAndupdateparams.id);

    // let temp = JSON.stringify(findByIDAndupdateparams.update).replace("{", "").replace("}", "").replace(/:/g, "=").replace(/"/g, "");
    return this.runQuery(query, variables);
  }

  // find and update in the same table
  findandUpdate(findAndupdateparams: findAndUpdateParams): Observable<T[]> {
    Logger.debug(`findandUpdate(): params ${[JSON.stringify(findAndupdateparams)]}`, APP);

    const values: Array<string> = [];
    const variables: Array<string> = [];
    Object.entries(findAndupdateparams.quries).map((_, index1) => { values.push((`${_[0]}=$${index1 + 1}`)), variables.push(_[1]) });
    const values$ = JSON.stringify(values).replace("[", "").replace("]", "").replace(/"/g, "");
    const query = `UPDATE ${this.tableName} SET ${values$} WHERE ${findAndupdateparams.columnName}= $${values.length + 1}`;
    variables.push(findAndupdateparams.columnvalue);

    return this.runQuery(query, variables);
  }
  UpdateForeignKeyTableById(findallparamsandupdate: findAllParamsandUpdate) {
    Logger.debug(`UpdateForeignKeyTableById(): params ${[JSON.stringify(findallparamsandupdate)]}`, APP);

    const values: Array<string> = [];
    const variables: Array<string> = [];
    Object.entries(findallparamsandupdate.query).map((_, index1) => { values.push((`${_[0]}=$${index1 + 1}`)), variables.push(_[1]) });
    const values$ = JSON.stringify(values).replace("[", "").replace("]", "").replace(/"/g, "");
    const query = `UPDATE ${findallparamsandupdate.foreignKeyTableName} SET ${values$} where ${findallparamsandupdate.foreignKeyTableName}.id =(select ${this.tableName}.${findallparamsandupdate.foreigKeyColumnName} from ${this.tableName} where ${this.tableName}.id=$${values.length + 1})`
    variables.push(findallparamsandupdate.id);

    return this.runQuery(query, variables)
    // update customers set email='zxc@gmail.com' where customers.id = (select competition.customer_id from competition where competition.id=4);
  }

  saveMultiple(queryRequest: Array<object>) {
    Logger.debug(`savemultiple queryRequest:${JSON.stringify(queryRequest)}`, APP);

    const values: Array<unknown> = [];
    const userVariables: Array<unknown> = [];
    const sortedQuery = queryRequest.map((obj) => this.sortObject(obj));
    const fields = Object.keys(sortedQuery[0]);
    const fieldsLength = fields.length;

    sortedQuery.map((_, index) => {
      let objTargetVal: Array<unknown> = [];
      let index_ = fieldsLength * index;
      console.log('index_', index_)
      Object.entries(_).map((val, index1) => {
        userVariables.push(val[1])
        objTargetVal.push(`$${(index_) + (index1 + 1)}`);
      })
      values.push(objTargetVal)
    })

    const finalValues = values.map((res: Array<string>) => JSON.stringify(res).replace('[', '(').replace(']', ')').replace(/"/g, ""));
    const query = 'INSERT INTO ' + this.tableName + ' (' + fields + ') VALUES ' + finalValues + ' RETURNING *;';
    const finalUserVariables = userVariables.map((res: Array<string>) => JSON.stringify(res).replace('[', '(').replace(']', ')').replace(/"/g, ""));

    return this.runQuery(query, finalUserVariables);
  }

  sortObject(obj: object) {
    Logger.debug(`sortObject obj:${JSON.stringify(obj)}`, APP);

    return Object.keys(obj).sort().reduce(function (result, key) {
      result[key] = obj[key];
      return result;
    }, {});

  }

  fetchAll() {
    Logger.debug(`fetchAll()}`, APP);

    const query = `SELECT * FROM ${this.tableName}`;
    return this.runQuery(query)
  }

  findByCondition(id: number, findbyConditionParams: findByConditionParams) {
    Logger.debug(`findByCondition(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let params = findByConditionParamsAlign(findbyConditionParams);
    let variables = [];
    let values = [];
    const number = params.numberOfRows * params.pageNumber
    delete params.pageNumber;
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
    console.log(values, variables);
    const query = `SELECT * FROM ${this.tableName} WHERE account_id=${id} AND created_date >= ${values[0]} AND created_date <= ${values[1]} ORDER BY ${values[2]} LIMIT  ${values[3]} OFFSET ${number} `
    return this.runQuery(query, variables)
  }

  findByAlphabet(findbyConditionParams: findByDateParams): Observable<T[]> {
    Logger.debug(`find_by_alphabet(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);


    let variables = [];
    let values = []
    let params = findbyConditionParams
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
    const query = `SELECT * FROM ${this.tableName} WHERE name like '${params.name}%' `;
    return this.runQuery(query);
  }



  findByConditionSales(id: string, findbyConditionParams: findByDateParams) {
    Logger.debug(`findByCondition(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let params = findbyConditionParams
    let variables = [];
    let values = [];
    const number = params.number_of_rows * params.number_of_pages
    delete params.number_of_pages;
    delete params.name;
    delete params.is_active
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
    const query = `SELECT * FROM ${this.tableName} WHERE refered_by='${id}' AND created_date > CURRENT_DATE - (interval '1 day' * ${values[1]})  ORDER BY created_date LIMIT  ${values[0]} OFFSET ${number}`
    return this.runQuery(query, variables)
  }

  findByDate(findbyConditionParams: findByDateParams): Observable<T[]> {
    Logger.debug(`find_by_date(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let variables = [];
    let values = []
    let params = findbyConditionParams
    const number = params.number_of_rows * params.number_of_pages
    delete params.number_of_pages;
    delete params.name;
    if (params.is_active) {
      Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
      const query = `SELECT * FROM ${this.tableName} WHERE is_active= ${values[2]} AND created_date > CURRENT_DATE - (interval '1 day' * ${values[1]})  ORDER BY created_date LIMIT  ${values[0]} OFFSET ${number}`
      return this.runQuery(query, variables);
    }
    else {
      delete params.is_active
      Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
      const query = `SELECT * FROM ${this.tableName} WHERE created_date > CURRENT_DATE - (interval '1 day' * ${values[1]})  ORDER BY created_date LIMIT  ${values[0]} OFFSET ${number}`
      return this.runQuery(query, variables);
    }
  }

  findByPeriod(findByPeriodParams: findByPeriodParams): Observable<T[]> {
    Logger.debug(`findByPeriod(): params ${[JSON.stringify(findByPeriodParams)]}`, APP);

    const query = `SELECT * FROM ${this.tableName} WHERE ${findByPeriodParams.columnName} = '${findByPeriodParams.columnvalue}' AND created_date > CURRENT_DATE - INTERVAL '${findByPeriodParams.period}'  ORDER BY ${"created_date"} DESC`;
    return this.runQuery(query);
  }

  fetchAllByPeriod(period: string): Observable<T[]> {
    Logger.debug(`fetchAllByPeriod(): params ${[JSON.stringify(period)]}`, APP);

    const query = `SELECT * FROM ${this.tableName} WHERE created_date > CURRENT_DATE - INTERVAL '${period}'`;
    return this.runQuery(query);

  }
  fetchCommissionReportByYear(year: string, month: number ){
    Logger.debug(`fetchCommissionReportByYear(): year ${year}`, APP);

    const query = `SELECT * FROM ${this.tableName} WHERE date_part('year',created_date) = ${year} AND date_part('month',created_date) = ${month}`;
    return this.runQuery(query);

  }
  fetchByYear(obj: fetchByYearAndMonthParams): Observable<T[]> {

    Logger.debug(`fetchByYear(): params ${[JSON.stringify(obj)]}`, APP);


    const query = `SELECT * FROM ${this.tableName} WHERE  ${obj.columnName} = '${obj.columnvalue}' AND date_part('year',created_date) = ${obj.year} AND date_part('month',created_date) = ${obj.month} `;

    return this.runQuery(query);

  }

  fetchSignUp(obj: fetchByYearAndMonthParams): Observable<T[]> {

    Logger.debug(`fetchByYear(): params ${[JSON.stringify(obj)]}`, APP);


    const query = `SELECT * FROM ${this.tableName} WHERE  ${obj.columnName} = '${obj.columnvalue}' AND date_part('year',created_date) = ${obj.year} AND date_part('month',created_date) = ${obj.month} `;

    return this.runQuery(query);

  }


}
