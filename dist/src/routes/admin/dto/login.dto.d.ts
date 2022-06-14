import { Periodicity } from 'src/routes/sales/dto/create-sale.dto';
export declare class LoginDTO {
    fedoApp: string;
    username: string;
    password: string;
}
export declare class ForgotPasswordDTO {
    ClientId: string;
    username: string;
    fedoApp: string;
}
export declare class ConfirmForgotPasswordDTO {
    ClientId: string;
    ConfirmationCode: string;
    password: string;
    username: string;
    fedoApp: string;
}
export declare enum PeriodicityAdmin {
    MONTH = "monthly",
    QUARTER = "quarterly",
    YEARLY = "yearly"
}
export declare class PeriodRange {
    period: PeriodicityAdmin;
}
export declare const PERIODADMIN: {
    month: number;
    quarter: number;
    year: number;
};
export declare const formatDate: (date: any) => string;
export declare const fetchDAte: (date: Date, period: number) => {
    from: string;
    to: string;
};
export declare enum Stateness {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ALL = "all"
}
export declare const STATE: {
    active: boolean;
    inactive: boolean;
    ALL: any;
};
export declare class State {
    state: Stateness;
    period: Periodicity;
}
export declare const makeStateFormat: (state: State) => any;
export declare const makeEarningDuesFormat: (name: string, earning: number, dues: number, signup: number) => {
    name: string;
    earnings: number;
    dues: number;
    signups: number;
};
export declare const averageSignup: (totalSalesPartner: number, totalSignups: number) => number;
export declare const applyPerformance: (salesPartner: any[], signups: number) => any[];
