import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/lib/database/database.module';

@Module({
  imports: [DatabaseModule.forFeature({ tableName: 'product' }),],
  controllers: [ProductController],
  providers: [ProductService],
  exports:[ProductService]
})
export class ProductModule { }
