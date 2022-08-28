import { PartialType } from '@nestjs/mapped-types';
import { CreateIndividualUserDto } from './create-individual-user.dto';

export class UpdateIndividualUserDto extends PartialType(CreateIndividualUserDto) {}
