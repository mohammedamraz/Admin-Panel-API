"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_ROUTES = void 0;
const admin_module_1 = require("../routes/admin/admin.module");
const sales_module_1 = require("../routes/sales/sales.module");
exports.APP_ROUTES = [
    {
        path: 'admin',
        module: admin_module_1.AdminModule,
    },
    {
        path: 'sales',
        module: sales_module_1.SalesModule,
    },
];
//# sourceMappingURL=routes.js.map