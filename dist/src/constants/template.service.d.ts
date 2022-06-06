import { EmailDTO, TypeDTO } from 'src/routes/admin/dto/template.dto';
import { sendEmailOnIncorrectBankDetailsDto } from 'src/routes/admin/dto/create-admin.dto';
export declare class TemplateService {
    constructor();
    sendTemplate(email: EmailDTO, userId: string): Promise<unknown>;
    sendMail(email: EmailDTO, typedto: TypeDTO): Promise<unknown>;
    sendResponse(email: EmailDTO, message: string): Promise<unknown>;
    sendEmailOnIncorrectBankDetailsToSupportEmail(email: EmailDTO, content: sendEmailOnIncorrectBankDetailsDto): Promise<unknown>;
    sendEmailOnIncorrectBankDetailsToHsaEmail(email: EmailDTO, content: sendEmailOnIncorrectBankDetailsDto): Promise<unknown>;
    private sendMailAsPromised;
}
