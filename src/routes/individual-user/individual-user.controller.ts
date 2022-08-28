import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { IndividualUserService } from './individual-user.service';
import { CreateIndividualUserDto, MobileNumberAndOtpDtO, MobileNumberDtO, UpdateUserDto } from './dto/create-individual-user.dto';
import { UpdateIndividualUserDto } from './dto/update-individual-user.dto';

const APP= "IndividualUserController"
@Controller()
export class IndividualUserController {
  constructor(private readonly individualUserService: IndividualUserService) {}

  // @Post()
  // userRegistration(@Body() createIndividualUserDto: CreateIndividualUserDto) {
  //   return this.individualUserService.userRegistration(createIndividualUserDto);
  // }

  @Post('otp')
  sentOtpToPhoneNumber(@Body() mobileNumberDtO: MobileNumberDtO) {
   Logger.debug(`sentOtpToPhoneNumber() mobileNumberDtO: [${JSON.stringify(mobileNumberDtO)}]`, APP);

    return this.individualUserService.sentOtpToPhoneNumber(mobileNumberDtO);
  }

  @Post(':phoneNumber/:otp')
  verifyOtpAndRegisterUser(@Param() mobileNumberAndOtpDtO: MobileNumberAndOtpDtO, @Body() createIndividualUserDto: CreateIndividualUserDto) {
    Logger.debug(`verifyOtp() mobileNumberAndOtpDtO: [${JSON.stringify(mobileNumberAndOtpDtO)}]`, APP);

    return this.individualUserService.verifyOtpAndRegisterUser(mobileNumberAndOtpDtO,createIndividualUserDto);
  }


  @Get(':phone_number')
  fetchUserByUsingPhoneNumber(@Param('phone_number') phone_number: string) {
    return this.individualUserService.fetchUserByUsingPhoneNumber(phone_number);
  }

  @Patch(':id')
  updateUserDate(@Param('id') id: number,@Body() updateUserDto:UpdateUserDto ) {
    return this.individualUserService.updateUserDate(id,updateUserDto);
  }



  
}
