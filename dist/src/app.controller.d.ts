import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): {
        server: string;
        version: string;
        documentation: string;
        fedoApp: string;
    };
}
