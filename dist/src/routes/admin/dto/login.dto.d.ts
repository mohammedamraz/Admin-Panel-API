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
export declare enum Periodicity {
    MONTH = "month",
    QUARTER = "quarter",
    YEARLY = "year"
}
export declare class PeriodRange {
    period: Periodicity;
}
export declare const PERIOD: {
    month: number;
    quarter: number;
    year: number;
};
export declare const formatDate: (date: any) => string;
export declare const fetchDAte: (date: Date, period: number) => {
    from: string;
    to: string;
};
