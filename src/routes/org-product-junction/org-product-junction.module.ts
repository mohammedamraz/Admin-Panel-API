import { Module } from '@nestjs/common';
import { OrgProductJunctionService } from './org-product-junction.service';
import { OrgProductJunctionController } from './org-product-junction.controller';
import { DatabaseModule } from 'src/lib/database/database.module';

@Module({
  imports: [DatabaseModule.forFeature({ tableName: 'organization_product_junction' }),],
  controllers: [OrgProductJunctionController],
  providers: [OrgProductJunctionService],
  exports: [OrgProductJunctionService]
})
export class OrgProductJunctionModule {}
