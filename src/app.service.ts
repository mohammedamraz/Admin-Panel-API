import { Injectable } from '@nestjs/common';
import { APP_VERSION, APP_DOCUMENTATION, FEDO_APP } from './constants';

@Injectable()
export class AppService {
  getHello() {
    return {
      server: 'FEDO HSA Sales Server',
      version: APP_VERSION,
      documentation: APP_DOCUMENTATION,
      fedoApp: FEDO_APP,
    };
  }
}
