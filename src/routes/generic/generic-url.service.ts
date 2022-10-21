import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { catchError, map, switchMap } from 'rxjs';
// import { CreateProductModel } from 'src/lib/config/model/product.model';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { CreateGenericTableDto } from './dto/create-generic-table.dto';
// import { CreateProductDto } from './dto/create-product.dto';

const APP = 'GenericUrlService';
@Injectable()
export class GenericUrlService {

  constructor(@DatabaseTable('generic_table') private readonly genericDB: DatabaseService<CreateGenericTableDto>) { }

  addGenericUrl(createGenericTableDto: CreateGenericTableDto) {
    Logger.debug(`addProduct() createProductDto:${JSON.stringify(createGenericTableDto)} }`, APP);

    return this.genericDB.save(createGenericTableDto).pipe(
      map(doc => doc),
      catchError(err => { throw new BadRequestException(err.message) })
    );
  }

  fetchGenericTable() {
    Logger.debug(`fetchGenericTable() }`, APP);

    return this.genericDB.fetchAll().pipe(
      map(doc => doc)
    )
  }


}





