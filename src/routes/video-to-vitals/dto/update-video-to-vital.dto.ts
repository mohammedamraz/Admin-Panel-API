import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-video-to-vital.dto';

export class UpdateVideoToVitalDto extends PartialType(CreateOrganizationDto) {}
