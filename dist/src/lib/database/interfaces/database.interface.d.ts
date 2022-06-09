import { Observable } from 'rxjs';
export interface DatabaseFeatureOptions {
    tableName: string;
}
export interface QueryParams {
    query: string;
    where?: string;
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
    columnValue: string;
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
export declare class findByDateParams {
    name?: string;
    date?: string;
    number_of_pages?: number;
    number_of_rows?: number;
    is_active: string;
}
export interface findByPeriodParams {
    columnName: string;
    columnvalue: string;
    period: string;
}
export interface findByConditionParams {
    created_date: string;
    endcreated_date: string;
    orderByColumnname: string;
    pageNumber: number;
    numberOfRows: number;
}
export declare const findByConditionParamsAlign: (findbyConditionParams: findByConditionParams) => findByConditionParams;
export interface MONTHYEAR {
    year: number;
    month: number;
}
export declare const fetchMonthYear: (MONTHYEAR: MONTHYEAR) => MONTHYEAR;
export interface fetchByYearAndMonthParams {
    year: string;
    month: string;
    columnName: string;
    columnvalue: string;
}
export interface DatabaseInterface<T> {
    tableName: string;
    save(queryRequest: object): Observable<T[]>;
    delete(params: QueryParams): Observable<T[]>;
    findByIdAndDelete(id: string): Observable<T[]>;
    findAll(params: findParams): Observable<T[]>;
    find(condition: object): Observable<T[]>;
    findByIdandUpdate(findByIDAndupdateparams: findByIDAndUpdateParams): Observable<T[]>;
    findandUpdate(findAndupdateparams: findAndUpdateParams): Observable<T[]>;
}
