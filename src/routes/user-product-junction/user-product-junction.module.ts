import { Module } from '@nestjs/common';
import { UserProductJunctionService } from './user-product-junction.service';
import { UserProductJunctionController } from './user-product-junction.controller';
import { DatabaseModule } from 'src/lib/database/database.module';

@Module({
  imports: [DatabaseModule.forFeature({ tableName: 'user_product_junction' }),],
  controllers: [UserProductJunctionController],
  providers: [UserProductJunctionService],
  exports:[UserProductJunctionService]
})
export class UserProductJunctionModule {}
