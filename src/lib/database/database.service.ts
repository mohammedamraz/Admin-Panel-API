/* eslint-disable max-lines */
import { Injectable, Logger, ParseArrayPipe, Type } from '@nestjs/common';
import { Pool } from 'pg';
import { from, Observable, of } from 'rxjs';
import { DatabaseFeatureOptions, DatabaseInterface, findAllParamsandUpdate, findAndUpdateParams, findByConditionParams, findByConditionParamsAlign, findByDateParams, findByIDAndUpdateParams, findParams, InsertParams, QueryParams, findByPeriodParams, DateRangeParams, fetchByYearAndMonthParams, findByDateParamsStatistics, findByDateParamsStatisticsPerformanceChart } from './interfaces/database.interface';

const APP = "DatabaseService"
@Injectable()
export class DatabaseService<T> implements DatabaseInterface<T> {
  remarks(arg0: string, remarks: any) {
    throw new Error('Method not implemented.');
  }
  tableName: string;

  constructor(
    private readonly pool: Pool,
    readonly feature: DatabaseFeatureOptions,
  ) {
    this.tableName = feature.tableName;
  }

  private runQuery(query: string, params = []): Observable<any> {
    console.log("what is the value in pool", this.pool)
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
    const query = `SELECT * FROM ${this.tableName} WHERE ${values$} ORDER BY id ASC`;
    return this.runQuery(query, variables);
  }

  // find by id and update in the same table
  findByIdandUpdate(findByIDAndupdateparams: findByIDAndUpdateParams): Observable<T[]> {
    Logger.debug(`findByIdandUpdate(): params ${[JSON.stringify(findByIDAndupdateparams)]}`, APP);

    const values: Array<string> = [];
    const variables: Array<string> = [];
    Object.entries(findByIDAndupdateparams.quries).map((_, index1) => { values.push((`${_[0]}=$${index1 + 1}`)), variables.push(_[1]) });
    const values$ = JSON.stringify(values).replace("[", "").replace("]", "").replace(/"/g, "");
    const query = `UPDATE ${this.tableName} SET ${values$} WHERE id = $${values.length + 1} `;
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

  fetchAll(): Observable<T[]> {
    Logger.debug(`fetchAll()}`, APP);

    const query = `SELECT * FROM ${this.tableName}`;
    return this.runQuery(query)
  }

  fetchAllUsingId(id: string): Observable<T[]> {
    Logger.debug(`fetchAll()}`, APP);

    const query = `SELECT * FROM ${this.tableName} WHERE refered_by='${id}'`;
    return this.runQuery(query)
  }

  deleteLastRow(): Observable<T[]> {
    Logger.debug(`deleteLastRow()}`, APP);

    const query = `DELETE FROM ${this.tableName} WHERE id = (SELECT max(id) FROM ${this.tableName})`;
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
    const query = `SELECT * FROM ${this.tableName} WHERE account_id=${id} AND created_date >= ${values[0]} AND created_date <= ${values[1]} ORDER BY ${values[2]} LIMIT  ${values[3]} OFFSET ${number} `
    return this.runQuery(query, variables)
  }

  findByAlphabet(findbyConditionParams: findByDateParams): Observable<T[]> {
    Logger.debug(`find_by_alphabet(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);


    let variables = [];
    let values = []
    let params = findbyConditionParams
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
    const query = `SELECT * FROM ${this.tableName} WHERE organization_name ILIKE '${params.name}%' `;
    return this.runQuery(query);
  }

  findUserByAlphabet(findbyConditionParams: findByDateParams, org_id : any): Observable<T[]> {
    Logger.debug(`find_by_alphabet(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);


    let variables = [];
    let values = []
    let params = findbyConditionParams
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
    const query = `SELECT * FROM ${this.tableName} WHERE org_id = ${org_id} and user_name ILIKE '${params.name}%' `;
    return this.runQuery(query);
  }

  findByAlphabetForTpa(org_id:string,findbyConditionParams: findByDateParams): Observable<T[]> {
    Logger.debug(`findByAlphabetForTpa(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);


    let variables = [];
    let values = []
    let params = findbyConditionParams
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
    const query = `SELECT * FROM ${this.tableName} WHERE org_id=${org_id} AND tpa_name like '${params.name}%' `;
    return this.runQuery(query);
  }


  findByConditionSales(id: string, findbyConditionParams: findByDateParams) {
    Logger.debug(`findByConditionSales(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let params = findbyConditionParams
    let variables = [];
    let values = [];
    const number = params.number_of_rows * params.number_of_pages
    delete params.number_of_pages;
    delete params.name;
    if (this.tableName == "sales_partner_invitation_junction") {
      if (params.is_active) {
        Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
        const query = `SELECT * FROM ${this.tableName} WHERE refered_by='${id}'AND is_active= ${values[2]} AND created_date > CURRENT_DATE - (interval '1 day' * ${values[1]})  ORDER BY created_date LIMIT  ${values[0]} OFFSET ${number}`
        return this.runQuery(query, variables);
      }
      else {
        delete params.is_active
        Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
        const query = `SELECT * FROM ${this.tableName} WHERE refered_by='${id}'AND created_date > CURRENT_DATE - (interval '1 day' * ${values[1]})  ORDER BY created_date LIMIT  ${values[0]} OFFSET ${number}`
        return this.runQuery(query, variables);
      }
    }
    else {
      if (params.is_active) {
        Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
        const query = `SELECT * FROM ${this.tableName} WHERE sales_code='${id}'AND is_active= ${values[2]} AND created_date > CURRENT_DATE - (interval '1 day' * ${values[1]})  ORDER BY created_date LIMIT  ${values[0]} OFFSET ${number}`
        return this.runQuery(query, variables);
      }
      else {
        delete params.is_active
        Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
        const query = `SELECT * FROM ${this.tableName} WHERE sales_code='${id}'AND created_date > CURRENT_DATE - (interval '1 day' * ${values[1]})  ORDER BY created_date LIMIT  ${values[0]} OFFSET ${number}`
        return this.runQuery(query, variables);
      }

    }
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

  findByEndDateOfOrganization(findbyConditionParams: findByDateParams): Observable<T[]> {
    Logger.debug(`find_by_date(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let variables = [];
    let values = []
    let params = findbyConditionParams
    const number = params.number_of_rows * params.number_of_pages
    delete params.name;
    delete params.is_active
    delete params.number_of_rows
    delete params.number_of_pages
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })    
    const query = `SELECT * FROM ${this.tableName} WHERE end_date BETWEEN ${values[0]} and ${values[0]}`
    return this.runQuery(query, variables);

  }

  findOrgDataForThePerformanceChart(findbyConditionParams: findByDateParamsStatisticsPerformanceChart): Observable<T[]> {
    Logger.debug(`find_by_date(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let variables = [];
    let values = []
    let params = findbyConditionParams
    delete params.period;
    if(findbyConditionParams.policy_number){
      Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })        
      const query = `SELECT * FROM ${this.tableName} WHERE org_id = ${values[0]} AND product_id = ${values[1]} AND policy_number = ${values[2]} AND test_date BETWEEN ${values[3]} and ${values[4]}`
      return this.runQuery(query, variables);
    }
    else{
      delete findbyConditionParams.policy_number;
      Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })        
      const query = `SELECT * FROM ${this.tableName} WHERE org_id = ${values[0]} AND product_id = ${values[1]} AND test_date BETWEEN ${values[2]} and ${values[3]}`
      return this.runQuery(query, variables);
    }

  }

  findOrgDataForThePerformanceChartAllOrg(findbyConditionParams: findByDateParamsStatisticsPerformanceChart): Observable<T[]> {
    Logger.debug(`find_by_date(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let variables = [];
    let values = []
    let params = findbyConditionParams
    delete params.period;
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })        
    const query = `SELECT * FROM ${this.tableName} WHERE product_id = ${values[0]} AND test_date BETWEEN ${values[1]} and ${values[2]}`
    return this.runQuery(query, variables);

  }

  findOrgDataForThePerformanceChartAllOrgByVersionId(findbyConditionParams: findByDateParamsStatisticsPerformanceChart): Observable<T[]> {
    Logger.debug(`find_by_date(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let variables = [];
    let values = []
    let params = findbyConditionParams
    delete params.period;
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
    const query = `SELECT * FROM ${this.tableName} WHERE product_id = ${values[0]} AND version_id = ${values[1]} AND test_date BETWEEN ${values[2]} and ${values[3]}`
    return this.runQuery(query, variables);

  }

  findOrgDataForThePerformanceChartAllOrgByVersionIdAndOrgId(findbyConditionParams: findByDateParamsStatisticsPerformanceChart): Observable<T[]> {
    Logger.debug(`find_by_date(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let variables = [];
    let values = []
    let params = findbyConditionParams
    delete params.period;
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
    const query = `SELECT * FROM ${this.tableName} WHERE org_id = ${values[0]} AND product_id = ${values[1]} AND version_id = ${values[2]} AND test_date BETWEEN ${values[3]} and ${values[4]}`
    return this.runQuery(query, variables);

  }

  findUserDataForThePerformanceChartAllUserByVersionIdAndOrgId(findbyConditionParams: findByDateParamsStatisticsPerformanceChart): Observable<T[]> {
    Logger.debug(`find_by_date(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let variables = [];
    let values = []
    let params = findbyConditionParams
    delete params.period;
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
    const query = `SELECT * FROM ${this.tableName} WHERE user_id = ${values[0]} AND product_id = ${values[1]} AND version_id = ${values[2]} AND test_date BETWEEN ${values[3]} and ${values[4]}`
    return this.runQuery(query, variables);

  }


  findUserDataForThePerformanceChart(findbyConditionParams: findByDateParamsStatisticsPerformanceChart): Observable<T[]> {
    Logger.debug(`find_by_date(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let variables = [];
    let values = []
    let params = findbyConditionParams
    delete params.period;
    if(findbyConditionParams.policy_number){
      Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })        
      const query = `SELECT * FROM ${this.tableName} WHERE user_id = ${values[0]} AND product_id = ${values[1]} AND policy_number = ${values[2]} AND test_date BETWEEN ${values[3]} and ${values[4]}`
      return this.runQuery(query, variables);
    }
    else{
      Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })        
      const query = `SELECT * FROM ${this.tableName} WHERE user_id = ${values[0]} AND product_id = ${values[1]} AND test_date BETWEEN ${values[2]} and ${values[3]}`
      return this.runQuery(query, variables);
    }

  }

  findTotalTestsByOrganizationStatistics(findbyConditionParams: findByDateParamsStatistics): Observable<T[]> {
    Logger.debug(`findTotalTestsByOrganizationStatistics(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let variables = [];
    let values = []
    let params = findbyConditionParams

  if(findbyConditionParams.period=='daily'){
    delete params.period;
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
    console.log("values",variables)
    const queryDay = `SELECT * FROM ${this.tableName} WHERE org_id = ${values[0]} AND product_id = ${values[1]} AND test_date BETWEEN ${values[2]} and ${values[2]}` 
    return this.runQuery(queryDay, variables);
  }  
  else if(findbyConditionParams.period=='weekly'){
    delete params.period;
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
    const date = new Date(params.test_date);    
    const currentDate = new Date(date.setDate(date.getDate()+6)).toISOString().split("T")[0];
    const queryWeek = `SELECT * FROM ${this.tableName} WHERE org_id = ${values[0]} AND product_id = ${values[1]} AND test_date BETWEEN ${values[2]} and '${currentDate}'` 
    return this.runQuery(queryWeek, variables);
  }
  else if(findbyConditionParams.period=='monthly'){ 
     
    delete params.period
    const test_date = new Date(params.test_date).toISOString();
    delete params.test_date;
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
    console.log("values",values,variables)
    
    const query = `SELECT * FROM ${this.tableName} where org_id = ${values[0]} AND product_id = ${values[1]} AND extract(YEAR FROM test_date) = extract(YEAR FROM now()) and extract(MONTH FROM test_date) = extract(MONTH FROM Date '${test_date}')`
    return this.runQuery(query, variables);
  }
  else if(findbyConditionParams.period=='quarterly'){
    const date = new Date(params.test_date);
    delete params.period
    const test_date = new Date(date.setDate(1)).toISOString().split("T")[0];
    const currentDate = new Date(date.getFullYear(),date.getMonth()+3, 0, 23, 59, 59).toISOString().split("T")[0];
    delete params.test_date
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
    const queryQuarter = `SELECT * FROM ${this.tableName} where org_id = ${values[0]} AND product_id = ${values[1]} AND test_date BETWEEN '${test_date}' and '${currentDate}'`
    return this.runQuery(queryQuarter, variables);
  }
  else if(findbyConditionParams.period=='yearly'){
    const test_date = new Date(params.test_date).toISOString();
    delete params.period
    delete params.test_date

    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
    const queryYear = `SELECT * FROM ${this.tableName} where org_id = ${values[0]} AND product_id = ${values[1]} AND extract(YEAR FROM test_date) = extract(YEAR FROM Date '${test_date}')`
    return this.runQuery(queryYear, variables);
  }

  }

  findTotalTestsByUsersStatistics(findbyConditionParams: findByDateParamsStatistics): Observable<T[]> {
    Logger.debug(`findTotalTestsByOrganizationStatistics(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);

    let variables = [];
    let values = []
    let params = findbyConditionParams

  if(findbyConditionParams.period=='daily'){
    delete params.period;
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
    const queryDay = `SELECT * FROM ${this.tableName} WHERE user_id = ${values[0]} AND product_id = ${values[1]} AND test_date BETWEEN ${values[2]} and ${values[2]}` 
    return this.runQuery(queryDay, variables);
  }  
  else if(findbyConditionParams.period=='weekly'){
    delete params.period;
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) })
    const date = new Date(params.test_date);  
    const currentDate = new Date(date.setDate(date.getDate()+6)).toISOString().split("T")[0];
    const queryWeek = `SELECT * FROM ${this.tableName} WHERE user_id = ${values[0]} AND product_id = ${values[1]} AND test_date BETWEEN ${values[2]} and '${currentDate}'` 
    return this.runQuery(queryWeek, variables);
  }
  else if(findbyConditionParams.period=='monthly'){ 
     
    delete params.period
    const test_date = new Date(params.test_date).toISOString();
    delete params.test_date;
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
  
    const query = `SELECT * FROM ${this.tableName} where user_id = ${values[0]} AND product_id = ${values[1]} AND extract(YEAR FROM test_date) = extract(YEAR FROM now()) and extract(MONTH FROM test_date) = extract(MONTH FROM Date '${test_date}')`
    return this.runQuery(query, variables);
  }
  else if(findbyConditionParams.period=='quarterly'){
    const date = new Date(params.test_date);
    delete params.period
    const test_date = new Date(date.setDate(1)).toISOString().split("T")[0];
    const currentDate = new Date(date.getFullYear(),date.getMonth()+3, 0, 23, 59, 59).toISOString().split("T")[0];
    delete params.test_date
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
   
    const queryQuarter = `SELECT * FROM ${this.tableName} where user_id = ${values[0]} AND product_id = ${values[1]} AND test_date BETWEEN '${test_date}' and '${currentDate}'`
    return this.runQuery(queryQuarter, variables);
  }
  else if(findbyConditionParams.period=='yearly'){
    const test_date = new Date(params.test_date).toISOString();
    delete params.period
    delete params.test_date

    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
    const queryYear = `SELECT * FROM ${this.tableName} where user_id = ${values[0]} AND product_id = ${values[1]} AND extract(YEAR FROM test_date) = extract(YEAR FROM Date '${test_date}')`
    return this.runQuery(queryYear, variables);
  }

  }


  findByPeriod(findByPeriodParams: findByPeriodParams): Observable<T[]> {
    Logger.debug(`findByPeriod(): params ${[JSON.stringify(findByPeriodParams)]}`, APP);

    let variables = [];
    let values = []
    let params = findByPeriodParams
    delete findByPeriodParams.columnName
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) });
    const query = `SELECT * FROM ${this.tableName} WHERE sales_code = ${values[0]} AND created_date > CURRENT_DATE - (interval '1 day' * ${values[1]})  ORDER BY ${"created_date"} DESC`;
    return this.runQuery(query,variables);
  }

  fetchAllByPeriod(period: string): Observable<T[]> {
    Logger.debug(`fetchAllByPeriod(): params ${[JSON.stringify(period)]}`, APP);

    let variables = [];
    let values = []
    Object.values({period: period}).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) });
    const query = `SELECT * FROM ${this.tableName} WHERE created_date > CURRENT_DATE - (interval '1 day' * ${values[0]})`;
    return this.runQuery(query, variables);

  }

  fetchCommissionReportByYear(year: string, month: number): Observable<T[]> {
    Logger.debug(`fetchCommissionReportByYear(): year ${year} month ${month}`, APP);

    let variables = [];
    let values = []
    Object.values({ year: year, month: month}).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) });
    const query = `SELECT * FROM ${this.tableName} WHERE date_part('year',created_date) = ${values[0]} AND date_part('month',created_date) = ${values[1]}`;
    return this.runQuery(query, variables);
  }

  fetchByYear(obj: fetchByYearAndMonthParams): Observable<T[]> {
    Logger.debug(`fetchByYear(): params ${[JSON.stringify(obj)]}`, APP);

    let variables = [];
    let values = []
    let params = obj
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) });
    const query = `SELECT * FROM ${this.tableName} WHERE  sales_code = ${values[0]} AND date_part('year',created_date) = ${values[1]} AND date_part('month',created_date) = ${values[2]} `;
    return this.runQuery(query, variables);
  }
  
  fetchBetweenRange(date: DateRangeParams): Observable<T[]> {
    Logger.debug(`fetchBetweenRange(): date ${[JSON.stringify(date)]}`, APP);
    
    
    let variables = [];
    let values = []
    let params = date
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) });
    console.log('sadfasd', values, variables);
    const query = `SELECT * FROM ${this.tableName} WHERE ((created_date between ${values[0]} and ${values[1]}))`;
    return this.runQuery(query, variables);
  }

  fetchLatestFive(): Observable<T[]> {
    Logger.debug(`fetchLatestFive()`, APP);
    const query = `SELECT * FROM organization ORDER BY id DESC LIMIT 5 `

    return this.runQuery(query)
  }

  fetchLatestFiveUserByOrgId(org_id:number): Observable<T[]> {
    Logger.debug(`fetchLatestFive()`, APP);
    const query = `SELECT * FROM users WHERE org_id = ${org_id} ORDER BY id DESC LIMIT 5 `

    return this.runQuery(query)
  }

  fetchLatestFiveByProductId(product_id:number): Observable<T[]> {
    Logger.debug(`fetchLatestFiveByProductId()`, APP);
    const query = `SELECT * FROM organization_product_junction WHERE  product_id = ${product_id} ORDER BY id DESC LIMIT 5 `

    return this.runQuery(query)
  }

  fetchLatestFiveUserByProductIdOrgId(product_id:number, org_id:number): Observable<T[]> {
    Logger.debug(`fetchLatestFiveByProductIdOrgId()`, APP);
    const query = `SELECT * FROM users WHERE is_deleted = false and product_id = ${product_id} and org_id = ${org_id} ORDER BY id DESC LIMIT 5 `

    return this.runQuery(query)
  }

  updateColumnByCondition(): Observable<T[]>{
    Logger.debug(`updateColumnByCondition()`, APP);

    const query = `UPDATE organization_product_junction SET status = CASE WHEN CURRENT_DATE< end_date  THEN 'Active' ELSE 'Expired' END `
    return this.runQuery(query)

  }
  findByCustomerIdAndScanId(findAndUpdateParams: findAndUpdateParams): Observable<T[]> {
    // Logger.debug(`findByCustomerIdAndScanId()`, APP);
    //  const query = `SELECT * FROM ${this.tableName} WHERE scan_id="1" and customer_id="1" `
    // // const query = `SELECT * FROM vitals_table`;
    // return this.runQuery(query)
    // Logger.debug(`findByCustomerIdAndScanId(): query ${[JSON.stringify(cust_id)]}`, APP);
    // Logger.debug(`findByCustomerIdAndScanId(): query ${[JSON.stringify(scan_id)]}`, APP);
    let variables = [];
    let values = []
    let findbyConditionParams = [];
    let params = findbyConditionParams
    Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)) }) 
    const query = `UPDATE ${this.tableName} SET ${values} WHERE cust_id = ${values[0]} AND scan_id = ${values[1]}`
    return this.runQuery(query, variables);
    // const values: Array<string> = [];
    // const variables: Array<string> = [];
    // Object.entries(findByIDAndupdateparams.quries).map((_, index1) => { values.push((`${_[0]}=$${index1 + 1}`)), variables.push(_[1]) });
    // const values$ = JSON.stringify(values).replace("[", "").replace("]", "").replace(/"/g, "");
    // const query = `UPDATE ${this.tableName} SET ${values$} WHERE cust_id = $${values.length + 1} AND scan_id = $${values.length + 1}  `;
    // variables.push(findByIDAndupdateparams.id);
    // // return this.runQuery(query, variables);
    // let variables: Array<string> = [];
    // variables.push(cust_id,scan_id)
    // const query = ` UPDATE ${this.tableName} SET ${variables} WHERE scan_id="1" and customer_id="1" `;

    // return this.runQuery(query, variables);
  }

 

}
