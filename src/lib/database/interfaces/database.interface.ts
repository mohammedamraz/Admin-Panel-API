import { Type } from '@nestjs/common';
import { Observable } from 'rxjs';

export interface DatabaseFeatureOptions {
  tableName: string;
}

export interface QueryParams {
  /**
   * The query string using ? or $1 to mark parameters for a parameterized query
   */
  query: string;
  /**
   * Filtering condition on what to query for
   */
  where?: string;
  /**
   * The values to inject into the query at runtime. Helps guard against SQL Injection
   */
  variables: any[];
}

export interface InsertParams {
  query: string;
  where?: string;
  variables: any[];
}

export interface UpdateParams {
  query: string;
  where?: string;
  variables: any[];
}

// export interface UpdateManyParams {
//   query: string;
//   tableAlias: string;
//   where?: string;
//   tempTable: string;
//   variables: any[];
// }

export interface findAllParamsandUpdate {
  foreignKeyTableName: string;
  foreigKeyColumnName: string;
  id: string;
  query: object;
}

export interface findParams {
  foreignKeyTableName: string;
  foreigKeyColumnName: string;
  columnName: string;
  columnValue: string
}

export interface findAndUpdateParams {
  columnName: string;
  columnvalue: string;
  quries: object;
}

export interface findByIDAndUpdateParams {
  id: string;
  quries: object;
}

export interface QueryParamsDto {
  from: Date;
  to: Date;
  page: number;
  limit: number;
  count: number;
}

export class findByDateParams {

  name?: string;

  date?: string;

  number_of_pages?: number;

  number_of_rows?: number;

  is_active?: string;
}

export class findByDateParamsStatistics {

  period?: string;
  org_id? :string;
  product_id?:string;
  test_date? : string;
}

export class findByDateParamsStatisticsPerformanceChart {

  period?: string;
  org_id? :string;
  product_id?:string;
  test_date? : string;
  test_end_date? : string;
  version_id? : string;
  policy_number? : any;

}



export interface findByPeriodParams {
  columnName: string;
  columnvalue: string;
  period: string;
}

export interface findBycolumnParams {
  columnName: string;
  columnvalue: string;
}

export interface DateRangeParams {
  from: string;
  to: string;
}

export interface fetchByYearAndMonthParams {
  year: string;
  month: string;
  // columnName: string;
  columnvalue: string;
}
export interface findByConditionParams {
  created_date: string;
  endcreated_date: string;
  orderByColumnname: string;
  pageNumber: number;
  numberOfRows: number;
}
export const findByConditionParamsAlign = (findbyConditionParams: findByConditionParams) => {
  const params: findByConditionParams = {
    created_date: findbyConditionParams.created_date,
    endcreated_date: findbyConditionParams.endcreated_date,
    orderByColumnname: findbyConditionParams.orderByColumnname,
    pageNumber: findbyConditionParams.pageNumber,
    numberOfRows: findbyConditionParams.numberOfRows
  }
  return params
}

export interface MONTHYEAR {
  year: number;
  month: number;
}

export const fetchMonthYear = (MONTHYEAR: MONTHYEAR) => {
  const params: MONTHYEAR = {
    year: MONTHYEAR.year,
    month: MONTHYEAR.month
  }
  return params
}

export interface fetchByYearAndMonthParams {
  // columnName: string;
  columnvalue: string;
  year: string;
  month: string;

}


export interface DatabaseInterface<T> {
  tableName: string;

  /**
   * method specifically for running queries
  //  * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */
  // query(params: QueryParams, type: Type<T>): Observable<T[]>;

  /**
   * Method specifically for running inserts
   * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */
  // insert(params: QueryParams, type: Type<T>): Observable<T[]>;

  /**
   * Method specifically for running updates
   * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */
  // update(params: QueryParams, type: Type<T>): Observable<T[]>;

  /**
   * Method specifically for running deletes
   * @param params object of string and any array for what query should be run and with what parameters for SQL injection protection
   */

  /**
Method used to creat nw row in table
*/
  save(queryRequest: object): Observable<T[]>;

  delete(params: QueryParams): Observable<T[]>;
  findByIdAndDelete(id: string): Observable<T[]>;

  /**
   * Method used to get all the data including related tables for the given table name
   * @param params 
   */
  findAll(params: findParams): Observable<T[]>;

  /**
   * Fetches table and gives based on the given condition  
   */
  find(condition: object): Observable<T[]>;

  /**
   * udated the table by ID 
   */
  findByIdandUpdate(findByIDAndupdateparams: findByIDAndUpdateParams): Observable<T[]>;

  /**
   * Updated the table by given condition
   */
  findandUpdate(findAndupdateparams: findAndUpdateParams): Observable<T[]>;


}
