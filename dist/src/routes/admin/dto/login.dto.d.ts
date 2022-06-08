import { Periodicity } from 'src/routes/sales/dto/create-sale.dto';
export declare class LoginDTO {
    fedoApp: string;
    username: string;
    password: string;
}
export declare class ForgotPasswordDTO {
    fedoApp: string;
    username: string;
}
export declare class ConfirmForgotPasswordDTO {
    fedoApp: string;
    ConfirmationCode: string;
    username: string;
    password: string;
}
export declare enum PeriodicityAdmin {
    MONTH = "month",
    QUARTER = "quarter",
    YEARLY = "year"
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
