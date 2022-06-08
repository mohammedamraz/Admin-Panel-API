import { Pool } from 'pg';
import { Observable } from 'rxjs';
import { DatabaseFeatureOptions, DatabaseInterface, findAllParamsandUpdate, findAndUpdateParams, findByConditionParams, findByDateParams, findByIDAndUpdateParams, findParams, QueryParams, findByPeriodParams } from './interfaces/database.interface';
export declare class DatabaseService<T> implements DatabaseInterface<T> {
    private readonly pool;
    readonly feature: DatabaseFeatureOptions;
    tableName: string;
    constructor(pool: Pool, feature: DatabaseFeatureOptions);
    private runQuery;
    private underScoreToCamelCase;
    save(queryRequest: object): Observable<T[]>;
    delete(params: QueryParams): Observable<T[]>;
    findByIdAndDelete(id: string): Observable<T[]>;
    findAll(params: findParams): Observable<T[]>;
    find(condition: object): Observable<T[]>;
    findByIdandUpdate(findByIDAndupdateparams: findByIDAndUpdateParams): Observable<T[]>;
    findandUpdate(findAndupdateparams: findAndUpdateParams): Observable<T[]>;
    UpdateForeignKeyTableById(findallparamsandupdate: findAllParamsandUpdate): Observable<any>;
    saveMultiple(queryRequest: Array<object>): Observable<any>;
    sortObject(obj: object): {};
    fetchAll(): Observable<any>;
    findByCondition(id: number, findbyConditionParams: findByConditionParams): Observable<any>;
    findByAlphabet(findbyConditionParams: findByDateParams): Observable<T[]>;
    findByConditionSales(id: string, findbyConditionParams: findByDateParams): Observable<any>;
    findByDate(findbyConditionParams: findByDateParams): Observable<T[]>;
    findByPeriod(findByPeriodParams: findByPeriodParams): Observable<T[]>;
    fetchAllByPeriod(period: string): Observable<T[]>;
    fetchByMonth(month: string): Observable<T[]>;
}
