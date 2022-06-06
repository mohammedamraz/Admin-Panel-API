/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
import AWS from 'aws-sdk';
import { Injectable, Logger } from '@nestjs/common';
import { EmailDTO, TypeDTO } from 'src/routes/admin/dto/template.dto'
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SES_SOURCE_EMAIL, SES_SOURCE_SUPPORT_EMAIL, STATIC_IMAGES } from 'src/constants';
import { sendEmailOnIncorrectBankDetailsDto } from 'src/routes/admin/dto/create-admin.dto';

const APP = "TemplateService";
@Injectable()
export class TemplateService {
    constructor() {
        AWS.config.update({
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            },
            region: "ap-south-1"
        });
    }

    sendTemplate(email: EmailDTO, userId: string) {
        Logger.debug(`sendTemplate(), DTO: ${JSON.stringify(email)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' })
        const params = {
            Destination: {
                ToAddresses: email.toAddresses,
                CcAddresses: email.ccAddresses,
                BccAddresses: email.bccAddresses
            },
            Source: SES_SOURCE_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"> 
                        </head> <body style="font-family:'Montserrat',sans-serif;text-align:center;"> <img src="${STATIC_IMAGES}/logo.png"" width="25%" style="width:2%,
                        max-width: 2%;" /> <p style="line-height: 160%; font-weight: 600; font-size: 33px;">Your registration is successful!  </p> <p style="font-weight: 600; 
                        font-size: 26px;"></p> <p>Dear user, 
                        Congratulations! </br>Your registration is successful and we’re excited to get you started! </br>
                        Please find below your UserID: <h1 style="color:#626594">${userId}</h1></p></br>
                        <img src="${STATIC_IMAGES}/fblogo.png" width="3%" style="margin:0 10px;" /></a> <a href="#"><img src="${STATIC_IMAGES}/iglogo.png"
                        width="3%"/></a> <a href="#"><img src="${STATIC_IMAGES}/twlogo.png" width="3%" style="margin:0 10px" /></a> 
                        </body> </html>`

                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Your registration is successful! \n
                        Dear user,\n 
                        Congratulations! Your registration is successful and we’re excited to get you started! \n
                        Please find below your UserID: \n
                        ${userId} \n
                        If you have any questions regarding your account, please contact us. We would be more than happy to assist you! \n
                        Stay in touch!  `
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: email.subject
                }
            }
        }
        return this.sendMailAsPromised(params, ses)
    }

    sendMail(email: EmailDTO, typedto: TypeDTO) {
        Logger.debug(`sendMail(), DTO: ${JSON.stringify(email)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' })
        const params = {
            Destination: {
                ToAddresses: email.toAddresses,
                CcAddresses: email.ccAddresses,
                BccAddresses: email.bccAddresses
            },
            Source: SES_SOURCE_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"> 
                        </head> <body style="font-family:'Montserrat',sans-serif;text-align:center;"> <img src="${STATIC_IMAGES}/logo.png"" width="25%" style="width:2%,
                        max-width: 2%;" /> <p style="line-height: 160%; font-weight: 400; font-size: 25px;">${typedto.message}  </p>
                        <div style="padding_top:1rem">
                        <img src="${STATIC_IMAGES}/fblogo.png" width="3%" style="margin:0 10px;" /></a> <a href="#"><img src="${STATIC_IMAGES}/iglogo.png"
                        width="3%"/></a> <a href="#"><img src="${STATIC_IMAGES}/twlogo.png" width="3%" style="margin:0 10px" /></a> </div>
                        </body> </html>`

                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `${typedto.message} \n`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: email.subject
                }
            }
        }
        return this.sendMailAsPromised(params, ses)
    }

    sendResponse(email: EmailDTO, message: string) {
        Logger.debug(`sendResponse(), DTO: ${JSON.stringify(email)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' })
        const params = {
            Destination: {
                ToAddresses: email.toAddresses,
                CcAddresses: email.ccAddresses,
                BccAddresses: email.bccAddresses
            },
            Source: SES_SOURCE_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"> 
                        </head> <body style="font-family:'Montserrat',sans-serif;text-align:center;"> <img src="${STATIC_IMAGES}/logo.png"" width="25%" style="width:2%,
                        max-width: 2%;" /> <p style="line-height: 160%; font-weight: 400; font-size: 25px;">${message}  </p>
                        <div style="padding_top:1rem">
                        <img src="${STATIC_IMAGES}/fblogo.png" width="3%" style="margin:0 10px;" /></a> <a href="#"><img src="${STATIC_IMAGES}/iglogo.png"
                        width="3%"/></a> <a href="#"><img src="${STATIC_IMAGES}/twlogo.png" width="3%" style="margin:0 10px" /></a> </div>
                        </body> </html>`

                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `${message} \n`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: email.subject
                }
            }
        }
        return this.sendMailAsPromised(params, ses)
    }

    sendEmailOnIncorrectBankDetailsToSupportEmail(email: EmailDTO, content: sendEmailOnIncorrectBankDetailsDto) {
        Logger.debug(`sendEmailOnIncorrectBankDetailsToSupportEmail(), DTO: ${JSON.stringify(email)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: email.toAddresses
            },
            Source: SES_SOURCE_SUPPORT_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display:grid;justify-items:center;">
                              <img src="https://fedo-file-server.s3.ap-south-1.amazonaws.com/images/logo.png"" width="25%" style="width:2%,max-width: 2%;" /> 
                           </div>
                           <div style="display: grid;">
                           <p>Dear ${content.name}, <br> Hope your day is going good so far?</br></p>
                             <p>This is an acknowledgment that we have received your support request. Your Support Request No. is ${content.request_id}. We will look into the matter soon and get in touch with you</p></br>
                             <p>Regards,</br>Sashikala</br>Support Team</br></p>
                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Incorrect Bank Details`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Acknowledgement - Support Request"
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendEmailOnIncorrectBankDetailsToHsaEmail(email: EmailDTO, content: sendEmailOnIncorrectBankDetailsDto) {
        Logger.debug(`sendEmailOnIncorrectBankDetailsToHsaEmail(), DTO: ${JSON.stringify(email)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: email.toAddresses
            },
            Source: SES_SOURCE_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display:grid;justify-items:center;">
                              <img src="https://fedo-file-server.s3.ap-south-1.amazonaws.com/images/logo.png"" width="25%" style="width:2%,max-width: 2%;" /> 
                           </div>
                           <div style="display:grid;">
                           <p>Hello Support Team, <br>The bank details showing up in the Bank Details page of my Sales Partner account is not mine or not created by me. Hence I’d like to change the bank details.</br></p>
                           </br><p>${content.message}</p>/<br>
                             <p>Kindly guide me through!</p></br>
                             <p>Regards,</br>${content.name}</p>
                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Incorrect Bank Details`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Support Request -${content.request_id}- from FEDO HSA Sales Partner - ${content.name}`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    private sendMailAsPromised(params: AWS.SES.SendEmailRequest, ses) {
        Logger.debug(`sendMailAsPromised(), DTO: ${JSON.stringify(params)}`, APP);

        return new Promise((resolve, reject) => {
            ses.sendEmail(params, (err, data) => {
                if (err)
                    reject(err);
                resolve(`${params.Destination.ToAddresses}`);
            });
        });
    }
}
