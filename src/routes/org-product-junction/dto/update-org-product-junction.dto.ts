import { PartialType } from '@nestjs/mapped-types';
import { CreateOrgProductJunctionDto } from './create-org-product-junction.dto';

export class UpdateOrgProductJunctionDto extends PartialType(CreateOrgProductJunctionDto) {}
