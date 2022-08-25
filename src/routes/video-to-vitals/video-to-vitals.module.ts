import { Module } from '@nestjs/common';
import { VideoToVitalsService } from './video-to-vitals.service';
import { VideoToVitalsController } from './video-to-vitals.controller';
import { DatabaseModule } from 'src/lib/database/database.module';
import { ProductService } from '../product/product.service';
import { UserProductJunctionService } from '../user-product-junction/user-product-junction.service';
// import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: 'organization' }),
    DatabaseModule.forFeature({ tableName: 'user_login' }),
    DatabaseModule.forFeature({ tableName: 'users' }),
    DatabaseModule.forFeature({ tableName: 'product' }),
    DatabaseModule.forFeature({ tableName: 'user_product_junction' }),
    // HttpModule.register({
    //   timeout: 10000,
    //   maxRedirects: 5
    // })
  ],
  controllers: [VideoToVitalsController],
  providers: [VideoToVitalsService, ProductService, UserProductJunctionService]
})
export class VideoToVitalsModule { }
