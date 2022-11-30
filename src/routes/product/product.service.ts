import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { catchError, map, switchMap } from 'rxjs';
// import { CreateProductModel } from 'src/lib/config/model/product.model';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';

const APP = 'ProductService';
@Injectable()
export class ProductService {

  constructor(@DatabaseTable('product') private readonly productDb: DatabaseService<CreateProductDto>) { }

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
          map(doc => doc),
          catchError(err=>{throw new BadRequestException(err.message)})
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

  fetchAllProducts() {
    Logger.debug(`fetchAllProducts() `, APP);

    return this.productDb.find({is_active:true}).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      map(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('No Products Found')
        }
        else {
          return doc
        }
      }),
    );
  }

  fetchProductById(id: number) {
    Logger.debug(`fetchProductById() id:${id}`, APP);
    return this.productDb.find({id:id}).pipe(
      catchError(err => { throw new UnprocessableEntityException(err.message) }),
      switchMap(doc => {
        if (doc.length == 0) {
          throw new NotFoundException('No Products Found')
        }
        else {
          return doc
        }
      }),
    );
  }
}





