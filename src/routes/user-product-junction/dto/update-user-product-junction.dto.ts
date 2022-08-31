import { PartialType } from '@nestjs/mapped-types';
import { CreateUserProductJunctionDto } from './create-user-product-junction.dto';

export class UpdateUserProductJunctionDto extends PartialType(CreateUserProductJunctionDto) {}
