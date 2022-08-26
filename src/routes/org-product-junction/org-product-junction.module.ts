import { Module } from '@nestjs/common';
import { OrgProductJunctionService } from './org-product-junction.service';
import { OrgProductJunctionController } from './org-product-junction.controller';

@Module({
  controllers: [OrgProductJunctionController],
  providers: [OrgProductJunctionService]
})
export class OrgProductJunctionModule {}
