"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const rxjs_1 = require("rxjs");
const database_interface_1 = require("./interfaces/database.interface");
const APP = "DatabaseService";
let DatabaseService = class DatabaseService {
    constructor(pool, feature) {
        this.pool = pool;
        this.feature = feature;
        this.tableName = feature.tableName;
    }
    runQuery(query, params = []) {
        common_1.Logger.debug(`runQuery(): query ${[JSON.stringify(query), params]}`, APP);
        return (0, rxjs_1.from)(this.pool.query(query, params).then(_ => _.rows));
    }
    underScoreToCamelCase(record) {
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
    save(queryRequest) {
        common_1.Logger.debug(`save(): queryRequest ${[JSON.stringify(queryRequest)]}`, APP);
        const fields = [];
        const values = [];
        const userVariables = [];
        Object.entries(queryRequest).map((_, index) => { fields.push(_[0].replace("[", "").replace("]", "")), userVariables.push(_[1]), values.push(`$${index + 1}`); });
        const query = 'INSERT INTO ' + this.tableName + ' (' + fields + ') VALUES (' + values + ') RETURNING *;';
        return this.runQuery(query, userVariables);
    }
    delete(params) {
        return (0, rxjs_1.of)([]);
    }
    findByIdAndDelete(id) {
        common_1.Logger.debug(`findByIdAndDelete(): query ${[JSON.stringify(id)]}`, APP);
        let variables = [];
        variables.push(id);
        const query = `DELETE FROM ${this.tableName} WHERE id=$1;`;
        return this.runQuery(query, variables);
    }
    findAll(params) {
        common_1.Logger.debug(`findAll(): query ${[JSON.stringify(params)]}`, APP);
        const index = [];
        const values = [];
        const variables = [];
        Object.entries(params.columnValue).map((val, ind) => { index.push(`$${ind + 1}`), values.push(`=$${ind + 1}`), variables.push(val[1]); });
        const values$ = JSON.stringify(values).replace(/,/g, " AND ").replace("[", "").replace("]", "").replace(/"/g, "");
        const query = `SELECT * FROM ${this.tableName} as ft JOIN ${params.foreignKeyTableName} as st ON ft.${params.columnName}=st.${params.foreigKeyColumnName} WHERE ft.${params.columnName} ${values$}`;
        return this.runQuery(query, variables);
    }
    find(condition) {
        common_1.Logger.debug(`find(): params ${[JSON.stringify(condition)]}`, APP);
        const index = [];
        const values = [];
        const variables = [];
        Object.entries(condition).map((_, index1) => { index.push(`$${index1 + 1}`), values.push((`${_[0]}=$${index1 + 1}`)), variables.push(_[1]); });
        const values$ = JSON.stringify(values).replace(/,/g, " AND ").replace("[", "").replace("]", "").replace(/"/g, "");
        const query = `SELECT * FROM ${this.tableName} WHERE ${values$}`;
        return this.runQuery(query, variables);
    }
    findByIdandUpdate(findByIDAndupdateparams) {
        common_1.Logger.debug(`findByIdandUpdate(): params ${[JSON.stringify(findByIDAndupdateparams)]}`, APP);
        const values = [];
        const variables = [];
        Object.entries(findByIDAndupdateparams.quries).map((_, index1) => { values.push((`${_[0]}=$${index1 + 1}`)), variables.push(_[1]); });
        const values$ = JSON.stringify(values).replace("[", "").replace("]", "").replace(/"/g, "");
        const query = `UPDATE ${this.tableName} SET ${values$} WHERE id = $${values.length + 1}`;
        variables.push(findByIDAndupdateparams.id);
        return this.runQuery(query, variables);
    }
    findandUpdate(findAndupdateparams) {
        common_1.Logger.debug(`findandUpdate(): params ${[JSON.stringify(findAndupdateparams)]}`, APP);
        const values = [];
        const variables = [];
        Object.entries(findAndupdateparams.quries).map((_, index1) => { values.push((`${_[0]}=$${index1 + 1}`)), variables.push(_[1]); });
        const values$ = JSON.stringify(values).replace("[", "").replace("]", "").replace(/"/g, "");
        const query = `UPDATE ${this.tableName} SET ${values$} WHERE ${findAndupdateparams.columnName}= $${values.length + 1}`;
        variables.push(findAndupdateparams.columnvalue);
        return this.runQuery(query, variables);
    }
    UpdateForeignKeyTableById(findallparamsandupdate) {
        common_1.Logger.debug(`UpdateForeignKeyTableById(): params ${[JSON.stringify(findallparamsandupdate)]}`, APP);
        const values = [];
        const variables = [];
        Object.entries(findallparamsandupdate.query).map((_, index1) => { values.push((`${_[0]}=$${index1 + 1}`)), variables.push(_[1]); });
        const values$ = JSON.stringify(values).replace("[", "").replace("]", "").replace(/"/g, "");
        const query = `UPDATE ${findallparamsandupdate.foreignKeyTableName} SET ${values$} where ${findallparamsandupdate.foreignKeyTableName}.id =(select ${this.tableName}.${findallparamsandupdate.foreigKeyColumnName} from ${this.tableName} where ${this.tableName}.id=$${values.length + 1})`;
        variables.push(findallparamsandupdate.id);
        return this.runQuery(query, variables);
    }
    saveMultiple(queryRequest) {
        common_1.Logger.debug(`savemultiple queryRequest:${JSON.stringify(queryRequest)}`, APP);
        const values = [];
        const userVariables = [];
        const sortedQuery = queryRequest.map((obj) => this.sortObject(obj));
        const fields = Object.keys(sortedQuery[0]);
        const fieldsLength = fields.length;
        sortedQuery.map((_, index) => {
            let objTargetVal = [];
            let index_ = fieldsLength * index;
            console.log('index_', index_);
            Object.entries(_).map((val, index1) => {
                userVariables.push(val[1]);
                objTargetVal.push(`$${(index_) + (index1 + 1)}`);
            });
            values.push(objTargetVal);
        });
        const finalValues = values.map((res) => JSON.stringify(res).replace('[', '(').replace(']', ')').replace(/"/g, ""));
        const query = 'INSERT INTO ' + this.tableName + ' (' + fields + ') VALUES ' + finalValues + ' RETURNING *;';
        const finalUserVariables = userVariables.map((res) => JSON.stringify(res).replace('[', '(').replace(']', ')').replace(/"/g, ""));
        return this.runQuery(query, finalUserVariables);
    }
    sortObject(obj) {
        common_1.Logger.debug(`sortObject obj:${JSON.stringify(obj)}`, APP);
        return Object.keys(obj).sort().reduce(function (result, key) {
            result[key] = obj[key];
            return result;
        }, {});
    }
    fetchAll() {
        common_1.Logger.debug(`fetchAll()}`, APP);
        const query = `SELECT * FROM ${this.tableName}`;
        return this.runQuery(query);
    }
    findByCondition(id, findbyConditionParams) {
        common_1.Logger.debug(`findByCondition(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);
        let params = (0, database_interface_1.findByConditionParamsAlign)(findbyConditionParams);
        let variables = [];
        let values = [];
        const number = params.numberOfRows * params.pageNumber;
        delete params.pageNumber;
        Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)); });
        console.log(values, variables);
        const query = `SELECT * FROM ${this.tableName} WHERE account_id=${id} AND created_date >= ${values[0]} AND created_date <= ${values[1]} ORDER BY ${values[2]} LIMIT  ${values[3]} OFFSET ${number} `;
        return this.runQuery(query, variables);
    }
    findByAlphabet(findbyConditionParams) {
        common_1.Logger.debug(`find_by_alphabet(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);
        let variables = [];
        let values = [];
        let params = findbyConditionParams;
        Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)); });
        const query = `SELECT * FROM ${this.tableName} WHERE name like '${params.name}%' `;
        return this.runQuery(query);
    }
    findByConditionSales(id, findbyConditionParams) {
        common_1.Logger.debug(`findByCondition(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);
        let params = findbyConditionParams;
        let variables = [];
        let values = [];
        const number = params.number_of_rows * params.number_of_pages;
        delete params.number_of_pages;
        delete params.name;
        delete params.is_active;
        Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)); });
        const query = `SELECT * FROM ${this.tableName} WHERE refered_id='${id}' AND created_date > CURRENT_DATE - (interval '1 day' * ${values[1]})  ORDER BY created_date LIMIT  ${values[0]} OFFSET ${number}`;
        return this.runQuery(query, variables);
    }
    findByDate(findbyConditionParams) {
        common_1.Logger.debug(`find_by_alphabet(): params ${[JSON.stringify(findbyConditionParams)]}`, APP);
        let variables = [];
        let values = [];
        let params = findbyConditionParams;
        const number = params.number_of_rows * params.number_of_pages;
        delete params.number_of_pages;
        delete params.name;
        if (params.is_active) {
            Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)); });
            const query = `SELECT * FROM ${this.tableName} WHERE is_active= ${values[2]} AND created_date > CURRENT_DATE - (interval '1 day' * ${values[1]})  ORDER BY created_date LIMIT  ${values[0]} OFFSET ${number}`;
            return this.runQuery(query, variables);
        }
        else {
            delete params.is_active;
            Object.values(params).map((params, index) => { variables.push(params), values.push((`$${index + 1}`)); });
            const query = `SELECT * FROM ${this.tableName} WHERE created_date > CURRENT_DATE - (interval '1 day' * ${values[1]})  ORDER BY created_date LIMIT  ${values[0]} OFFSET ${number}`;
            return this.runQuery(query, variables);
        }
    }
    findByPeriod(findByPeriodParams) {
        common_1.Logger.debug(`findByPeriod(): params ${[JSON.stringify(findByPeriodParams)]}`, APP);
        const query = `SELECT * FROM ${this.tableName} WHERE ${findByPeriodParams.columnName} = '${findByPeriodParams.columnvalue}' AND created_date > CURRENT_DATE - INTERVAL '${findByPeriodParams.period}'  ORDER BY ${"created_date"} DESC`;
        return this.runQuery(query);
    }
    fetchAllByPeriod(period) {
        common_1.Logger.debug(`fetchAllByPeriod(): params ${[JSON.stringify(period)]}`, APP);
        const query = `SELECT * FROM ${this.tableName} WHERE created_date > CURRENT_DATE - INTERVAL '${period}'`;
        return this.runQuery(query);
    }
    fetchCommissionReportByYear(year, month) {
        common_1.Logger.debug(`fetchCommissionReportByYear(): year ${year}`, APP);
        const query = `SELECT * FROM ${this.tableName} WHERE date_part('year',created_date) = ${year} AND date_part('month',created_date) = ${month}`;
        return this.runQuery(query);
    }
    fetchByYear(obj) {
        common_1.Logger.debug(`fetchByYear(): params ${[JSON.stringify(obj)]}`, APP);
        const query = `SELECT * FROM ${this.tableName} WHERE  ${obj.columnName} = '${obj.columnvalue}' AND date_part('year',created_date) = ${obj.year} AND date_part('month',created_date) = ${obj.month} `;
        return this.runQuery(query);
    }
};
DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof pg_1.Pool !== "undefined" && pg_1.Pool) === "function" ? _a : Object, Object])
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map