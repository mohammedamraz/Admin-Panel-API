import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { map, switchMap } from 'rxjs';
import { CreateProductModel } from 'src/lib/config/model/product.model';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';

const APP = 'ProductService';
@Injectable()
export class ProductService {

  constructor(@DatabaseTable('product') private readonly productDb: DatabaseService<CreateProductModel>) { }

  addProduct(createProductDto: CreateProductDto) {
    Logger.debug(`addProduct() createProductDto:${JSON.stringify(createProductDto)} }`, APP);

    return this.fetchProductByName(createProductDto.product_name).pipe(
      map(doc => {
        if (doc.length != 0) {
          throw new ConflictException('product already exist')
        }
        else {return doc}
      }),
      switchMap(doc => {
        return this.productDb.save(createProductDto).pipe(
          map(doc => doc)
        );
      })
    )
  }

  fetchProductByName(name: string) {
    Logger.debug(`fetchProductByName() name:${name} }`, APP);

    return this.productDb.find({ product_name: name }).pipe(
      map(doc => doc)
    )
  }
}


