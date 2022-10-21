import { Module } from '@nestjs/common';
// import { ProductService } from './product.service';
// import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/lib/database/database.module';
import { GenericUrlController } from './generic-url.controller';
import { GenericUrlService } from './generic-url.service';

@Module({
  imports: [DatabaseModule.forFeature({ tableName: 'generic_table' }),],
  controllers: [GenericUrlController],
  providers: [GenericUrlService],
  exports:[GenericUrlService]
})
export class GenericUrlModule { }
