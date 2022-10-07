/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
import AWS from 'aws-sdk';
import { Injectable, Logger } from '@nestjs/common';
import { EmailDTO, TypeDTO } from 'src/routes/admin/dto/template.dto'
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SES_SOURCE_EMAIL, SES_SOURCE_HELLO_FEDO_EMAIL, SES_SOURCE_NO_REPLY_EMAIL, SES_SOURCE_SUPPORT_EMAIL, SES_SOURCE_SUPPORT_EMAIL_AI, STATIC_IMAGES } from 'src/constants';
import { PasswordResetDTO, sendEmailOnCreationOfDirectSalesPartner, sendEmailOnCreationOfOrgAndUser, sendEmailOnIncorrectBankDetailsDto } from 'src/routes/admin/dto/create-admin.dto';
import { EmailOtpDto } from 'src/routes/individual-user/dto/create-individual-user.dto';

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
                             <p>Your pilot is all set. You may click the below link and sign up to view your dashboard. Note that you will be asked to set a new password for once.<br></p>
                             <p><b>Your Custom Pilot URL:</b><br><a href=${content.url}>ADMIN PANEL SIGNUP</a><br></p>
                             <p><b>First Steps After Sign In</b><br></p>
                             <ul>
                             <li>Check and ensure your organisation name is entered correctly. If not, edit it.</li>
                             <li>Your company logo is uploaded. If not, upload your company logo to brand the app.</li>
                             <li>Add users whom you would like to give access to use the app during Pilot.</li>
                             <li>You can use your Org Admin sign in credentials to sign into our app.</li>
                             <li>When you start a test, the app will ask you “Do you have an application number?”. If you are maintaining an application number for your customers, then select the option 'Yes' and enter the application number (10 characters only) in the textbox below and proceed. If not, select 'No' and continue. If you are taking a test for yourself, then you must select the option 'No' and continue.<br></li>
                             </ul>
                             <p><b>Pilot Duration</b></p>
                             <p>Your Pilot is set for ${content.pilot_duration} days.<br></p>
                             <p>For any assistance, you may write to <a>support@fedo.ai</a>.<br></p>
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
                           <p>Dear <b>${content.name}</b>, <br><br> You've been invited by <b>${content.organisation_admin_name}</b> to try ${content.fedo_app} mobile app.<br></p>
                             <p>Your pilot is all set. You may click the below link and sign up to view your dashboard. Note that you will be asked to set a new password for once.<br></p>
                             <p><b>Your Custom Pilot URL:</b><br>
                             <a href=${content.url}>ADMIN PANEL SIGNUP</a><br></p>
                             <p><b>First Steps After Sign In</b><br></p>
                             <ul>
                             <li>You will see PlayStore and iOS Store buttons. Click on the respective button and download the app.</li>
                             <li>As you continue from one screen to the other in the app, you will reach a screen where it asks you "Do you have sign in credentials?". You must click on "Yes" here and continue. It will take you to the sign in screen.</li>
                             <li>Use your dashboard sign in credentials to sign in here.</li>
                             <li>When you start a test, the app will ask you “Do you have an application number?”. If you are maintaining an application number for your customers, then select the option 'Yes' and enter the application number (10 characters only) in the textbox below and proceed. If not, select 'No' and continue. If you are taking a test for yourself, then you must select the option 'No' and continue.</li>
                             </ul>
                             <p>For any assistance, you may write to <a>support@fedo.ai</a>.<br></p>

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
                ToAddresses: [SES_SOURCE_SUPPORT_EMAIL_AI]
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
                ToAddresses: [SES_SOURCE_SUPPORT_EMAIL_AI]
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
                           <p>Dear Fedo Team, <br><br>Someone tried to sign in to the Corporate flow and app couldn’t identify the organisation. <br> <br></p>
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
                           <div style="display:grid;justify-items:center;">
                              <img src="https://fedo-file-server.s3.ap-south-1.amazonaws.com/images/logo.png"" width="25%" style="width:2%,max-width: 2%;" /> 
                           </div>
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
                           <div style="display:grid;justify-items:center;">
                              <img src="https://fedo-file-server.s3.ap-south-1.amazonaws.com/images/logo.png"" width="25%" style="width:2%,max-width: 2%;" /> 
                           </div>
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
                           <p>Hello, OTP for ${emailAndOtp.email} : <b>${emailAndOtp.otp}</b> <br><br></p>

                             <p>If the otp request attempt is not made by you, immediately report to hello@fedo.ai.</p>
                             
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
    
}
