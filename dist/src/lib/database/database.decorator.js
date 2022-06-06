"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseTable = void 0;
const common_1 = require("@nestjs/common");
const database_provider_1 = require("./database.provider");
const DatabaseTable = (tableName) => {
    return (0, common_1.Inject)((0, database_provider_1.createDatabaseProviderToken)(tableName));
};
exports.DatabaseTable = DatabaseTable;
//# sourceMappingURL=database.decorator.js.map