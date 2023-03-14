/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
import AWS, { SES } from 'aws-sdk';
import { Injectable, Logger } from '@nestjs/common';
import { EmailDTO, TypeDTO } from 'src/routes/admin/dto/template.dto'
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SES_SOURCE_DEV_SUPPORT_FEDO_EMAIL, SES_SOURCE_EMAIL, SES_SOURCE_HELLO_FEDO_EMAIL, SES_SOURCE_NO_REPLY_EMAIL, SES_SOURCE_SUPPORT_EMAIL, SES_SOURCE_SUPPORT_EMAIL_AI, STATIC_IMAGES } from 'src/constants';
import { PasswordResetDTO, sendEmailOnCreationOfDirectSalesPartner, sendEmailOnCreationOfOrgAndUser, sendEmailOnIncorrectBankDetailsDto } from 'src/routes/admin/dto/create-admin.dto';
import { EmailOtpDto } from 'src/routes/individual-user/dto/create-individual-user.dto';

const APP = "TemplateService";
@Injectable()
export class TemplateService {
    private readonly ses : SES
    constructor(
        
    ) {
        this.ses = new SES;
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

    sendEmailOnCreationOfDirectSalesPartner( content: sendEmailOnCreationOfDirectSalesPartner) {
        Logger.debug(`sendEmailOnCreationOfDirectSalesPartner(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.toAddresses]
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
                           <p>Dear Admin, <br><br><b>${content.name}</b> has signed up directly from the Sales Partner application.<br></p>
                             <p>You may review the details and approve/reject the sign up.</p><br>
                             <p>When you approve, do not forget to set commission for the new comer.</p><br>
                             <p>Regards,<br>Team Fedo<br></p>
                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Sales Partner: Direct Sign Up by ${content.name}`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendEmailOnGreivanceRegressal( content: sendEmailOnCreationOfDirectSalesPartner) {
        Logger.debug(`sendEmailOnCreationOfDirectSalesPartner(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.toAddresses]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
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
                           <p>Dear Admin, <br><br><b>${content.name}</b> has filled a grievance regression application.<br></p>
  
                             name :  <b>${content.name} </b><br>
                             mobile :  <b>${content.mobile}</b><br>
                             email :  <b>${content.email}</b><br>
                             city :  <b>${content.city}</b><br>
                             message :  <b>${content.message}</b><br>
                             existing customer :  <b>${content.existingcustomer}</b><br>
                             </p><br>
                             <p>Regards,<br>Team Fedo<br></p>
                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Grievance Regression data from ${content.name}`
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

    sendEmailOnOrgCreation( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailOnOrgCreation(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.email]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear <b>${content.organisation_admin_name}</b>, <br><br> Thank you so much for showing interest in ${content.fedo_app}.<br> <br></p>
                             <p>You may click the below link and <b>“Sign Up”</b> to view your dashboard. Note that you will be asked to set a new password for once.<br></p>
                             <p><b>Sign Up URL:</b><br>
                             <a href=${content.url}>ADMIN PANEL SIGNUP</a><br></p>
                             <p>For any assistance, you may write to <a>hello@fedo.ai</a>.<br></p>
                             <p>Great Day!<br></p>
                             <p><b>Team Fedo</b><br></p>

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `${content.fedo_app}: Pilot Invitation`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendEmailOnCreateOrgUser( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailOnOrgCreation(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.email]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear <b>${content.name}</b>, <br><br> <b>${content.organisation_name}</b> has specially invited you to use <b>${content.fedo_app}</b> mobile app.<br></p>
                             <p>You may click the below link and <b>“Sign Up”</b> to view your dashboard. Note that you will be asked to set a new password for once.<br></p>
                             <p><b>Sign Up URL:</b><br>
                             <a href=${content.url}>ADMIN PANEL SIGNUP</a><br></p>
                             <p>For any assistance, you may write to <a>hello@fedo.ai</a>.<br></p>

                             <p>Great Day!<br></p>
                             <p><b>Team Fedo</b></p>

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `${content.fedo_app}: Pilot Invitation`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }


    sendEmailOnPilotExpire( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailOnPilotExpire(), DTO: ${JSON.stringify(content)}`, APP);

        // content.email=SES_SOURCE_HELLO_SUPPORT__EMAIL;
        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [SES_SOURCE_HELLO_FEDO_EMAIL]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear Fedo Team, <br><br>The pilot of <b>${content.fedo_app}</b> product for <b>${content.organisation_name}</b> has expired. They would like to extend the pilot for some more time. <br> <br></p>
                             <p>You may talk to the Org Admin and take necessary steps.</p>
                             <p><b>Quick Info</b><br></p>
                            
                             <p>1. <b>Organisation: ${content.organisation_name}</b></p>
                             <p>2. <b>Org Admin: ${content.organisation_admin_name}</b></p>
                             <p>3. <b>Email: ${content.organisation_admin_email}</b></p>
                             <p>4. <b>Mobile: ${content.organisation_admin_mobile}</b><br></p>
                             <p>Good Day!<br></p>
                             

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Request for extension of Pilot`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }


    sendEmailOnNotAbleToIdentifyOrganisation( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailOnNotAbleToIdentifyOrganisation(), DTO: ${JSON.stringify(content)}`, APP);

        // content.email=SES_SOURCE_HELLO_SUPPORT__EMAIL;
        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [SES_SOURCE_HELLO_FEDO_EMAIL]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear Fedo Team, <br><br>Someone used this email ${content.email} to sign in to the Corporate flow and app couldn’t identify the organisation. Hence the sign in attempt was unsuccessful. <br> <br></p>
                             <p>You may take necessary steps to check the attempt.</p>
                             
                             <p>Good Day!<br></p>
                             

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `No Org record Sign In Attempt`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }


    sendEmailOnOrgAdminExpiredAndLoggedOut( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailOnOrgAdminExpiredAndLoggedOut(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [SES_SOURCE_HELLO_FEDO_EMAIL]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear Fedo Team, <br><br>The Org Admin of <b>${content.organisation_name}</b> tried to login to the Admin Panel on ${content.expired_date}. <br><br>Since the pilot has expired, you may contact them to discuss the association going forward. They seems to be interested. </p>
                            
                           <p><b>Org Admin Details</b></p>
                            <ol>
                             <li>Org Admin Name: ${content.organisation_admin_name}</li>
                             <li>Email: ${content.organisation_admin_email}</li>
                             <li>Mobile: ${content.organisation_admin_mobile}</li>
                             <li>Designation: ${content.designation}</li>
                             </ol>
                             <p>System generated email.<br></p>
                             

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Pilot Expired Sign In Attempt to Admin Panel by ${content.organisation_name}`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendEmailOnOrgAdminInactiveAndLoggedOut( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailOnOrgAdminInactiveAndLoggedOut(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [SES_SOURCE_HELLO_FEDO_EMAIL]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear Fedo Team, <br><br>The Org Admin of <b>${content.organisation_name}</b> tried to login to the Admin Panel on ${content.expired_date}. <br><br>Since the organisation is inactive, they have send a notification to you. You may activate their account if possible.</p>
                            
                           <p><b>Org Admin Details</b></p>
                            <ol>
                             <li>Org Admin Name: ${content.organisation_admin_name}</li>
                             <li>Email: ${content.organisation_admin_email}</li>
                             <li>Mobile: ${content.organisation_admin_mobile}</li>
                             <li>Designation: ${content.designation}</li>
                             </ol>
                             <p>System generated email.<br></p>
                             

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Inactive Org ${content.organisation_name} Sign In Attempt to Admin Panel. `
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }


    sendEmailToIncreaseTestsForIndividuals( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailToIncreaseTestsForIndividuals(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [SES_SOURCE_HELLO_FEDO_EMAIL]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear Fedo Team, <br><br>Please enable additional tests for me. <br> <br></p>
                            
                             <p><b>My Details</b><br></p>
                            
                             <p>1. <b>Name</b>: ${content.name}</p>
                             <p>2. <b>Email</b>: ${content.email}</p>
                             <p>3. <b>Mobile</b>: ${content.mobile}</p>
                             <p>4. <b>Gender</b>: ${content.gender}<br></p>
                             <p>5. <b>Age</b>: ${content.age}<br></p>
                             <p>Great Day!<br></p>
                             

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Vitals: Individual User - Request for Additional Tests`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }



    sendEmailToResetUsersPassword( content: PasswordResetDTO) {
        Logger.debug(`sendEmailToResetUsersPassword (), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.email]
            },
            Source: SES_SOURCE_SUPPORT_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear <b>${content.user_name}</b>, <br><br>You had requested for password change on your Fedo Account. You may click on the below link and follow the instructions to change password. <br> <br></p>
                            
                             <p><b>${content.url}</b><br></p>
                            
                             <p>If the password change attempt is not made by you, immediately report to hello@fedo.ai.</p>
                             
                             <p>Great Day!<br></p>
                             <p><b>Team Fedo</b><br></p>
                             

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Fedo Account: Change Password Request`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendOtpToEmail( emailAndOtp: EmailOtpDto) {
        Logger.debug(`sendOtpToEmail (), DTO: ${JSON.stringify(emailAndOtp)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [emailAndOtp.email]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
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
                           <p>Hello,<br><br> OTP for ${emailAndOtp.name} is <b>${emailAndOtp.otp}</b>. <br><br></p>

                             <p>You need to enter this OTP in the email verification screen of the Fedo Vitals app.</p>
                             <p>If this request attempt was not made by you, immediately report to hello@fedo.ai.</p>
                             
                             <p>Great Day!<br></p>
                             <p><b>Team Fedo</b><br></p>
                             
                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Fedo Vitals: Email Verification`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }


    sendEmailOnVitalsWebAppAccess( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailOnOrgCreation(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.email]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear <b>${content.organisation_admin_name}</b>, <br><br> Vitals Web Application has been enabled for <b>${content.organisation_name}</b>.</p>
                             <p>Here's the URL<br><a href=${content.url}>VITALS WEB APP</a><br></p>
                             <p><b>Two ways to use the Web App</b></p>
                             <ol>
                             <li> Share the link to anyone so they can click the link, fill in the details in the screen, record 14 seconds video and get to know their Vitals.</li>
                             <ul>
                             <li><b>Note</b>: Every test (we call them <b>scans</b>) performed by anyone from this URL will be saved as a scan record of your organisation. The report will be made available to you at frequent intervals till the 'Report Module' is made available in your dashboard.</li>
                             </ul>
                             <li>If your company is having an in-house ERP,CRM or any Web Application to manage your customers data, you can integrate 'Vitals Web App' with your in-house application.</li>
                             <ul>
                             <li>Your Tech Team can place the above link into your in-house application (Example: As a button or link).</li>
                             <li>When your customer (who will be your policy holder) clicks on the button/link, pass the unique ID of the customer along with the URL. Our app identifies there is a unique ID associated with the URL and hence it skips the first screen and directly takes the customer to the video recording screen.</li>

                             <li>The app will keep track of the unique ID through the process till it's complete.</li>
                             <li>When the customer completes their video recording, a 'Thank you' screen is displayed which they can close and exit. And the data will be saved against your organisation with the Unique ID of the customer so you can identify which customer's scan data it is.</li>

                             <li>All scan records will be sent to you at frequent intervals till the 'Report Module' is made available in your dashboard.<br></li>
                             </ul>
                             </ol>

                             <p>If you have any clarifications or would like to know more, you may write to <a>support@fedo.ai</a> or call us. </p>
                        
                             <p>Good Day!<br></p>
                             <p><b>Team Fedo</b></p>

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Fedo Vitals: Web Application Details`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }


    sendEmailOnceOrgIsCreated( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailOnceOrgIsCreated(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.email]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear <b>${content.organisation_admin_name}</b>, <br><br> Welcome!<br> <br></p>
                             <p>You have successfully signed up for Fedo Vitals. Your Pilot is set for <b>${content.pilot_duration}</b> days.<br></p>
                             <p><b>App Download</b></p>
                             <p>Now that you have signed up, you may click the below link to download the Fedo Vitals App.<br></p>
                             <p><a href="https://play.google.com/store/apps/details?id=com.vtotvisioncamera">App Download Link - Google Play</a><br></p>
                             <p>You can use your Admin Panel sign in credentials to sign into Fedo Vitals app.</p>
                             <p><b>Admin Panel</b></p>
                             <p>To access your Admin Panel dashboard and manage activities, below is the link.<br></p>
                             <p><a href="https://fedo.ai/admin/orgLogin">Admin Panel Login</a><br></p>
                             <p><b>First Steps when you login to Admin Panel</b></p>
                             <ul>
                             <li>Check and ensure your organisation name is entered correctly. If not, edit it.</li>
                             <li>Your company logo is uploaded. If not, upload your company logo to brand the app.</li>
                             <li>Add users whom you would like to give access to use the app during Pilot. You may click on “+” icon in the 'Recent 5 Users' table to create Users.</li>
                             </ul>
                             
                             <p>For any assistance, you may write to <a>hello@fedo.ai</a>.<br></p>
                             <p>Great Day!<br></p>
                             <p><b>Team Fedo</b><br></p>

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Welcome to Fedo Vitals`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendEmailOnceUserIsCreated( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailOnceUserIsCreated(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.email]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear <b>${content.name}</b>, <br><br> Welcome!<br> <br></p>
                             <p>You have successfully signed up for Fedo Vitals.<br></p>
                             <p><b>App Download</b></p>
                             <p>Now that you have signed up, you may click the below link to download the Fedo Vitals App.<br></p>
                             <p><a href="https://play.google.com/store/apps/details?id=com.vtotvisioncamera">App Download Link - Google Play</a><br></p>
                             <p>You can use your Admin Panel sign in credentials to sign into Fedo Vitals app.</p>
                             <p><b>Admin Panel</b></p>
                             <p>To access your Admin Panel dashboard and manage activities, below is the link.<br></p>
                             <p><a href="https://fedo.ai/admin/orgLogin">Admin Panel Login</a><br></p>
                             <p>For any assistance, you may write to <a>hello@fedo.ai</a>.<br></p>

                             <p>Great Day!<br></p>
                             <p><b>Team Fedo</b></p>

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Welcome to Fedo Vitals`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }


    SendEmailOnceUserIsBackActive( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`SendEmailOnceUserIsBackActive(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.email]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear <b>${content.name}</b>, <br><br> Your account is <b>activated!</b><br> <br></p>
                             <p>You should now be able to sign in to your <a href="https://fedo.ai/admin/orgLogin">Admin Panel</a> and also to <a href="https://play.google.com/store/apps/details?id=com.vtotvisioncamera">Fedo Vitals App</a> with your sign in credentials. If you have uninstalled Fedo Vitals App from your phone, you may click the below link and download the app.<br></p>
                             <p><a href="https://play.google.com/store/apps/details?id=com.vtotvisioncamera">App Download Link - Google Play</a><br></p>
                             <p>Your Sign In Username is <b>${content.email}</b></p>
                             <p>If you do not remember your password, you may go to <a href="https://fedo.ai/admin/recover-password">Forgot Password</a> page and reset your password. </p>
                             <p>For any assistance, you may write to <a>hello@fedo.ai</a>.<br></p>

                             <p>Good Day!<br></p>

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Fedo Vitals: User Account Activated`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    SendEmailOnceOrgIsBackActive( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`SendEmailOnceOrgIsBackActive(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.email]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear <b>${content.organisation_admin_name}</b>, <br><br> Your account is <b>activated!</b><br> <br></p>
                             <p>You should now be able to sign in to your <a href="https://fedo.ai/admin/orgLogin">Admin Panel</a> and also to <a href="https://play.google.com/store/apps/details?id=com.vtotvisioncamera">Fedo Vitals App</a> with your sign in credentials. If you have uninstalled Fedo Vitals App from your phone, you may click the below link and download the app.<br></p>
                             <p><a href="https://play.google.com/store/apps/details?id=com.vtotvisioncamera">App Download Link - Google Play</a><br></p>
                             <p>Your Sign In Username is <b>${content.organisation_admin_email}</b></p>
                             <p>If you do not remember your password, you may go to <a href="https://fedo.ai/admin/recover-password">Forgot Password</a> page and reset your password. </p>
                             <p>For any assistance, you may write to <a>hello@fedo.ai</a>.<br></p>

                             <p>Good Day!<br></p>

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Fedo Vitals: Organisation Account Activated`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }


    sendFinalEmailOncePilotIsExpired( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendFinalEmailOncePilotIsExpired(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.email],
                CcAddresses: [SES_SOURCE_HELLO_FEDO_EMAIL],
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear <b>${content.organisation_admin_name}</b>, <br><br>Your pilot has expired on ${content.expired_date}. You will not be able to access the ${content.product_name} App or Admin Panel. <br> <br></p>
                             <p>You may get in touch with Fedo at <a>hello@fedo.ai</a> or call us at +91 8904494455 to discuss if you would like to continue using <b>Vitals</b>.<br></p>
                             
                             <p>Good Day!<br></p>
                             <p>Regards</p>
                             <p>Team Fedo</p>
                             

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `${content.organisation_name}'s ${content.product_name} Pilot Expired`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendFinalEmailWhenDaysLeftToPilotExpire( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendFinalEmailWhenDaysLeftToPilotExpire(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.email],
                CcAddresses: [SES_SOURCE_HELLO_FEDO_EMAIL],
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear <b>${content.organisation_admin_name}</b>, <br><br>Your pilot will be expiring in the next ${content.expired_date} days. Once expired, you will not be able to access the ${content.product_name} App or Admin Panel. <br> <br></p>
                             <p>You may get in touch with Fedo at <a>hello@fedo.ai</a> or call us at +91 8904494455 to discuss if you would like to continue using <b>Vitals</b>.<br></p>
                             
                             <p>Good Day!<br></p>
                             <p>Regards</p>
                             <p>Team Fedo</p>
                             

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `${content.organisation_name}'s ${content.product_name} Pilot Expiring in ${content.expired_date} days`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendEmailToFedoOnceOrgCreatedInWeb( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailToFedoOnceOrgCreatedInWeb(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [SES_SOURCE_HELLO_FEDO_EMAIL]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear Super Admin, <br><br><b>${content.organisation_name}</b> has signed up for 14 day FREE Trial through <a href="https://fedo.ai/">Fedo.AI</a>.</p>
                            
                           <p><b>Pilot Sign-Up Summary</b></p>
                            <ol>
                             <li><b>Contact Person</b>: ${content.organisation_admin_name}</li>
                             <li><b>Email</b>: ${content.organisation_admin_email}</li>
                             <li><b>Mobile</b>: ${content.organisation_admin_mobile}</li>
                             <li><b>City</b>: ${content.city}</li>
                             <li><b>State</b>: ${content.state}</li>
                             </ol>
                             <p>Regards,<br>
                             Team Fedo</p>
                             

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `New ${content.fedo_app} Pilot Sign-Up through Website. `
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }



    sendInstructionEmailOnOrgCreationOnWeb( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendInstructionEmailOnOrgCreationOnWeb(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [content.organisation_admin_email]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `<html lang="en"> 
                        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
                        <body style="font-family:'Montserrat',sans-serif;">
                           <div style="display: grid;">
                           <p>Dear <b>${content.organisation_admin_name}</b>, <br><br> Welcome to <b>${content.fedo_app}</b> 14 days FREE Trial!</p>
                           <p>Below is your User Credentials for signing in.</p>
                           <p><b>Username</b>: ${content.organisation_admin_email}<br><b>Password</b>: Test@123</p>

                             <p>You can change the password anytime by <a href="https://fedo.ai/admin/recover-password">clicking here.</a><br></p>
                             <br>
                            <h2>Next Steps</h2>
                             <ul>
                             <li><a href="https://play.google.com/store/apps/details?id=com.vtotvisioncamera">Download App from PlayStore</a></li>
                             <li>Once app is installed on your phone</li>
                             <ul>
                             <li>Open the app</li>
                             <li>Allow permissions when asked</li>
                             <li>Sign in using the user credentials given above</li>
                             </ul>

                             <li>You can perform scans once you are signed in.</li>
                             </ul>
                             <br>
                            <h2>View / Download Reports</h2>
                             <ul>
                             <li><a href="https://fedo.ai/admin/orgLogin">Sign in to Admin Panel.</a></li>
                             <ul>
                             <li>Use the same credentials given above to sign in.</li>
                             </ul>
                             <li>In the ‘Left Navigation’, click on “Vitals” and then “Dashboard”.</li>
                             <li>You can see a section named “Daily Scan Report” in the page.</li>
                             <li>To View Report</li>
                             <ul>
                             <li>Click on the icon with ‘3 dots’ and select “View Report”.</li>
                             <li>You can select a date from the Date Picker to view scans of that particular date.</li>
                             </ul>

                             <li>To Download Excel Report</li>
                             <ul>
                             <li>Select the date from the date picker.</li>
                             <li>Then click on “Download Excel Report”.</li>
                             </ul>
                             </ul>

                             <h2>To Invite your colleagues to use the app</h2>
                             <ul>
                             <li><a href="https://fedo.ai/admin/orgLogin">Sign in to Admin Panel.</a></li>
                             <li>You can see the section 'Recent 5 Users' in the page.</li>
                             <ul>
                             <li>Click on the “+” icon to the right of this section.</li>
                             <li>It will open a popup to enter details of the colleague whom you want to invite.</li>
                             <li>Follow the instructions and submit the form.</li>
                             <li>It will send an invitation email to your colleague.</li>
                             <li>Once they accept the invitation, they can use the credentials to sign into the app.</li>
                             </ul>
                             </ul>

                             <p>For any clarifications or assistance, you may write to <a>hello@fedo.ai</a> or call us. </p>
                        
                             <p>Regards,<br></p>
                             <p><b>Team Fedo</b></p>

                           </div>
                          </body> 
                        </html>`
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `${content.fedo_app}: Welcome Email with Instructions`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendEmailToFedoOnVitalsBatchProcessFailed( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendInstructionEmailOnOrgCreationOnWeb(), DTO: ${JSON.stringify(content)}`, APP);

        var scan_data = (new Function("return [" + content.content+ "];")());
        let bodyhtml = `
        <html lang="en"> 
        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
        <body style="font-family:'Montserrat',sans-serif;">
           <div style="display: grid;">
           <p>Hello Dev Team,<br><br> Data push from Fedo server to <b>${content.organisation_name}</b> API failed on ${content.test_date} Details below.</p>
           <p>Total Scans in the batch: ${scan_data.length}</p>
           </div>
          </body> 
        </html>`

        for (let i = 0; i < scan_data.length; i++) {
          bodyhtml += `<ul style="font-family:'Montserrat',sans-serif;">` + 'SCAN ID : ' + scan_data[i]?.scan_id;
          bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'ORG ID : ' + scan_data[i]?.org_id; + '</li>';
          bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'CUST ID : ' + scan_data[i]?.cust_id; + '</li>';
          bodyhtml += '</ul>';
          }
          bodyhtml += `<p style="font-family:'Montserrat',sans-serif;">You may check and do the needful at the earliest. </p>
          <p style="font-family:'Montserrat',sans-serif;">Regards,<br></p>
          <p style="font-family:'Montserrat',sans-serif;"><b>Team Fedo</b></p>`
        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [SES_SOURCE_DEV_SUPPORT_FEDO_EMAIL, SES_SOURCE_HELLO_FEDO_EMAIL]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: bodyhtml },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Batch Process Failure: Vitals Computation`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendEmailToFedoAndPilotOnVitalsAPIProcessFailed( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailToFedoAndPilotOnVitalsAPIProcessFailed(), DTO: ${JSON.stringify(content)}`, APP);

        var scan_data = (new Function("return [" + content.content+ "];")());
        let bodyhtml = `
        <html lang="en"> 
        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
        <body style="font-family:'Montserrat',sans-serif;">
           <div style="display: grid;">
           <p>Hello Dev Team,<br><br> Data push from Fedo server to <b>${content.organisation_name}</b> API failed on ${content.test_date} Details below.</p>
           <p>Total Scans in the batch: ${scan_data.length}</p>
           <p>Batch ID: ${content.batch_id}</p>
           </div>
          </body> 
        </html>`

        for (let i = 0; i < scan_data.length; i++) {
          bodyhtml += `<ul style="font-family:'Montserrat',sans-serif;">` + `SCAN ID's` ;
          bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + scan_data[i]?.scan_id + '</li>';
          bodyhtml += '</ul>';
          }
          bodyhtml += `<p style="font-family:'Montserrat',sans-serif;">You may check and do the needful at the earliest. </p>
          <p style="font-family:'Montserrat',sans-serif;">Regards,<br></p>
          <p style="font-family:'Montserrat',sans-serif;"><b>Team Fedo</b></p>`
        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [SES_SOURCE_DEV_SUPPORT_FEDO_EMAIL, SES_SOURCE_HELLO_FEDO_EMAIL,'anurag.gothi@getvisitapp.com']
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: bodyhtml },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Batch Process Failure: Data Push to ${content.organisation_name}`
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendEmailToFedoAndPilotOnDataPurge( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailToFedoAndPilotOnVitalsAPIProcessFailed(), DTO: ${JSON.stringify(content)}`, APP);
        
        var scan_data = (new Function("return [" + content.content+ "];")());
        let bodyhtml = `
        <html lang="en"> 
        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
        <body style="font-family:'Montserrat',sans-serif;">
           <div style="display: grid;">
           <p>Hello Dev Team,<br><br> The purging of some of the videos after vital computation failed on ${content.test_date}. Details below.</p>
           <p>Total Scans: ${scan_data.length}</p>
           </div>
          </body> 
        </html>`
        for (let i = 0; i < scan_data.length ; i++) {
          bodyhtml += `<p style="font-family:'Montserrat',sans-serif;">` + `SCAN ID: ` + scan_data[i]?.scan_id + `</p>`;
          bodyhtml += `<p style="font-family:'Montserrat',sans-serif;">` + `Video File Name: ` + scan_data[i]?.video_file_name; + '</p>';
          }
          bodyhtml += `<p style="font-family:'Montserrat',sans-serif;">You may check and do the needful at the earliest. </p>
          <p style="font-family:'Montserrat',sans-serif;">Regards,<br></p>
          <p style="font-family:'Montserrat',sans-serif;"><b>Team Fedo</b></p>`
        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        const params = {
            Destination: {
                ToAddresses: [SES_SOURCE_DEV_SUPPORT_FEDO_EMAIL, SES_SOURCE_HELLO_FEDO_EMAIL ]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: bodyhtml },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Batch Process Failure: Data Purge

                    `
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    sendEmailWithVitalsData( content: sendEmailOnCreationOfOrgAndUser) {
        Logger.debug(`sendEmailWithVitalsData(), DTO: ${JSON.stringify(content)}`, APP);

        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
        var scan_data = (new Function("return [" + content.content+ "];")());
        var fedoscore_data = (new Function("return [" + content.fedoscore_content+ "];")());
        var riskclassification_data = (new Function("return [" + content.riskclassification_content+ "];")());
        var diseaserisk_data = (new Function("return [" + content.diseaserisk_content+ "];")());
        let bodyhtml = `<html lang="en"> 
        <head> <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet" type="text/css"></head> 
        <body style="font-family:'Montserrat',sans-serif;">
           <div style="display: grid;">
           <p>Dear <b>${content.organisation_admin_name.split(" ", 2)[0]}</b>, <br><br> Please find your Health Report below.</p>
           <p><b>Personal Information</b></p>
           <p><b>Username</b>: ${content.organisation_admin_name}<br><b>Email</b>: ${content.organisation_admin_email}</p>
           </div>
          </body> 
        </html>`
        for (let i = 0; i < fedoscore_data.length ; i++) {
            bodyhtml += `<p style="font-family:'Montserrat',sans-serif;">` + `<b>Fedo Score</b> <br> ` + fedoscore_data[i]?.fedo_score + `<br>`+ fedoscore_data[i]?.condition + `</p>`;
            // bodyhtml += `<p style="font-family:'Montserrat',sans-serif;">`  + fedoscore_data[i]?.condition; + '</p>';
        }
        for (let i = 0; i < riskclassification_data.length ; i++) {
            bodyhtml += `<p style="font-family:'Montserrat',sans-serif;">` + `<b>Overall Health Classification</b> <br> ` + riskclassification_data[i]?.condition + `<br>`+ riskclassification_data[i]?.details + `</p>`;
            // bodyhtml += `<p style="font-family:'Montserrat',sans-serif;">`  + riskclassification_data[i]?.details; + '</p>';
        }
        for (let i = 0; i < diseaserisk_data.length; i++) {
            bodyhtml += `<ul style="font-family:'Montserrat',sans-serif;">` + '<b>Diseases Risks</b>' ;
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Diabetes : ' + diseaserisk_data[i]?.diabetes; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Hypertension : ' + diseaserisk_data[i]?.hypertension; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Respiratory : ' + diseaserisk_data[i]?.respiratory; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'CHD : ' + diseaserisk_data[i]?.chd; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'CVD : ' + diseaserisk_data[i]?.cvd; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Kidney : ' + diseaserisk_data[i]?.kidney; + '</li>';
            bodyhtml += '</ul>';
        }
        for (let i = 0; i < scan_data.length; i++) {
            bodyhtml += `<ul style="font-family:'Montserrat',sans-serif;">` + '<b>Vital Parameters</b>' ;
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Heart Rate : ' + scan_data[i]?.heart_rate; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Blood Pressure : ' + scan_data[i]?.bp; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'BMI : ' + scan_data[i]?.bmi; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Smoking (Beta) : ' + scan_data[i]?.smoking; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Stress : ' + scan_data[i]?.stress; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'HRV-SDNN : ' + scan_data[i]?.hrv; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Respiration Rate : ' + scan_data[i]?.respiration; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Blood Oxygen : ' + scan_data[i]?.blood_oxygen; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Random Blood Sugar (Beta) : ' + scan_data[i]?.rbs; + '</li>';
            bodyhtml += `<li style="font-family:'Montserrat',sans-serif;">` + 'Haemoglobin (Beta) : ' + scan_data[i]?.hb; + '</li>';
            bodyhtml += '</ul>';
        }

        bodyhtml += `<p style="font-family:'Montserrat',sans-serif;"><b>Disclaimer</b> </p>
        <p style="font-family:'Montserrat',sans-serif; font-size : larger">THIS IS NOT A MEDICAL DIAGNOSTIC DEVICE OR A REPLACEMENT FOR MEDICAL DIAGNOSTIC DEVICES.<br><br>

        We do not share your personal information with any third parties for commercial use or revenue generation. Personal Information provided by You is used by Us to improve our Products, Platforms and/or Services or for your information purposes only.<br><br>
        
        The data collected and the analysis must only be considered as indicators and/or as early warnings. You must always seek advice of an experienced and qualified doctor or your family doctor or other qualified healthcare provider/practitioner regarding your health and/or medical condition or treatment, before undertaking any new healthcare systems or methods. You must not disregard professional medical advice or delay in seeking medical consultation from qualified health professionals because of any Information received during this process.<br><br>
        
        By accessing or using our products, platforms and/or services, You have authorized Us to collect, store, process, handle and use all such information about you, in accordance with our Privacy Policy and any other terms and conditions of use (as amended from time to time).
        </p>
          <p style="font-family:'Montserrat',sans-serif;">Regards,<br></p>
          <p style="font-family:'Montserrat',sans-serif;"><b>Team Fedo</b></p>`

            
        const params = {
            Destination: {
                ToAddresses: [content.organisation_admin_email]
            },
            Source: SES_SOURCE_NO_REPLY_EMAIL,
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: bodyhtml
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: `Direct Sign Up`
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Your Health Report from Fedo Vitals

                    `
                }
            }
        };
        return this.sendMailAsPromised(params, ses)
    }

    async sendEmail(toAddress: string, attachments?: any): Promise<SES.SendEmailResponse> {
        const params: SES.SendRawEmailRequest = {
          RawMessage: {
            Data: this.createRawEmail( toAddress, attachments)
          }
        };
    
        return this.ses.sendRawEmail(params).promise();
      }


      private createRawEmail(toAddress: string, attachments?: any): string {
        const boundary = 'boundary_' + Date.now().toString();
        const messageParts = [
          `From: noreply@fedo.ai`,
          `To: ${attachments.toAddress}`,
          `Subject: The video file`,
          `MIME-Version: 1.0`,
          `Content-Type: multipart/mixed; boundary="${boundary}"`,
          '',
          `--${boundary}`,
          `Content-Type: text/html; charset=utf-8`,
          `Content-Transfer-Encoding: base64`,
          '',
          `Video file is below`
        ];
        console.log("here")
    
        if (attachments) {
        //   attachments.forEach((attachment) => {
            messageParts.push(
              `--${boundary}`,
              `Content-Type: application/pdf`,
              `Content-Disposition: attachments; filename="${attachments.originalname}"`,
              `Content-Transfer-Encoding: base64`,
              '',
              `${attachments.buffer.toString('base64')}`
            );
        //   });
        }
    
        messageParts.push(`--${boundary}--`, '');
    
        return messageParts.join('\r\n');
      }
    
    
}

interface Attachment {
    filename: string;
  content: Buffer;
  }
