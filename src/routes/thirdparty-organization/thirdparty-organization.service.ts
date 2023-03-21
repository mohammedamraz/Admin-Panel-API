import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { catchError, map, switchMap } from 'rxjs';
// import { DatabaseService } from 'firebase-admin/lib/database/database';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { ZQueryParamsDto } from '../sales/dto/create-sale.dto';
import { OrganizationService } from '../video-to-vitals/organization.service';
import { CreateThirdPartyOrganizationDto, ParamsDto, RequestToAPIDto, UpdateThirdPartyOrganizationJunctionDto } from './dto/create-third-party.dto';

const APP = 'ThirdpartyOrganizationService'

@Injectable()
export class ThirdpartyOrganizationService {

  constructor(

    @DatabaseTable('third_party_organization')
    private readonly tpaJunctionDB: DatabaseService<UpdateThirdPartyOrganizationJunctionDto>,

    private readonly organizationService: OrganizationService,
    private http: HttpService,

  ) {



  }

  addThirdPartyOrganization(createThirdPartyOrganizationDto: CreateThirdPartyOrganizationDto) {
    Logger.debug(`addThirdPartyOrganization() createProductDto:${JSON.stringify(createThirdPartyOrganizationDto)} }`, APP);

    return this.organizationService.fetchOrganizationByIdDetails(Number(createThirdPartyOrganizationDto.org_id)).pipe(
      switchMap(doc => {
        if (doc.length == 0) throw new NotFoundException('organization not found')
        else return this.tpaJunctionDB.save({ tpa_name: createThirdPartyOrganizationDto.tpa_name, org_id: createThirdPartyOrganizationDto.org_id }).pipe(
          map(doc => doc),
          catchError(err => { throw new BadRequestException() })
        )
      })
    )


  }


  fetchThirdPartyOrganizationOfSpecificOrg(org_id: string, params: ZQueryParamsDto) {
    Logger.debug(`fetchThirdPartyOrganizationOfSpecificOrg() createProductDto:${org_id} }`, APP);

    return this.organizationService.fetchOrganizationByIdDetails(Number(org_id)).pipe(
      switchMap(doc => {
        if (doc.length == 0) throw new NotFoundException('organization not found')
        else if (params.name == undefined) return this.tpaJunctionDB.find({ org_id: org_id })
        else return this.tpaJunctionDB.findByAlphabetForTpa(org_id, params).pipe(
          map(doc => doc),
          catchError(err => { throw new BadRequestException() })
        )
      })
    )


  }

  fetchAPIUrlByThirdPartyOrganization(params: ParamsDto, body: RequestToAPIDto) {
    Logger.debug(`fetchAPIUrlByThirdPartyOrganization() createProductDto:${params} }`, APP);

    return this.tpaJunctionDB.find({ org_id: params.org_id , id : params.id }).pipe(
          switchMap(doc => {
            return this.http.post(`${doc[0].api_url_status}`,body)
          .pipe(map(res=>{
            return {status : res.data,doc}
          }))
        }),
          catchError(err => { throw new BadRequestException() })
        )
  }

  fetchAPIUrlByThirdPartyOrganizationId(params: ParamsDto, body: any) {
    Logger.debug(`fetchAPIUrlByThirdPartyOrganizationId() createProductDto:${params} }`, APP);

    return this.tpaJunctionDB.find({ org_id: params.org_id , id : params.id }).pipe(
          switchMap(doc => {
            return this.http.post(`${doc[0].api_url_vitals}`,[body])
          .pipe(map(res=>{
            return {status : res.data,doc}
          }))
        }),
          catchError(err => { throw new BadRequestException() })
        )
  }



}
