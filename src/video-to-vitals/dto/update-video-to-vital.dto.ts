import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoToVitalDto } from './create-video-to-vital.dto';

export class UpdateVideoToVitalDto extends PartialType(CreateVideoToVitalDto) {}
