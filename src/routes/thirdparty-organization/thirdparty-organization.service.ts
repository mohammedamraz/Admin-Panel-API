import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { catchError, map, switchMap } from 'rxjs';
// import { DatabaseService } from 'firebase-admin/lib/database/database';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { ZQueryParamsDto } from '../sales/dto/create-sale.dto';
import { OrganizationService } from '../video-to-vitals/organization.service';
import { AuthAPIDto, CreateThirdPartyOrganizationDto, ParamsDto, RequestToAPIDto, UpdateThirdPartyOrganizationJunctionDto } from './dto/create-third-party.dto';
import axios from 'axios';
import { URLSearchParams } from 'url';
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

  patchThirdPartyOrganizationById(id : number , createThirdPartyOrganizationDto : CreateThirdPartyOrganizationDto){
    Logger.debug(`patchThirdPartyOrganizationById() createProductDto:${JSON.stringify(createThirdPartyOrganizationDto)} }`, APP);

    return this.tpaJunctionDB.findByIdandUpdate({id : id.toString() , quries : createThirdPartyOrganizationDto}).pipe(map(doc => doc),
    catchError(err => { throw new BadRequestException(err.message)}))
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

    let api_response : any;
    return this.tpaJunctionDB.find({ org_id: params.org_id, id: params.id }).pipe(
      switchMap(async doc => {
        if(doc[0].header){
        api_response = await axios.post(doc[0].api_url_status, body, {
          headers: doc[0].header
        });
      }
      else {
        api_response = await axios.post(doc[0].api_url_status, body);
      }
        return  { status: api_response.data, doc };
      }),
      catchError(err => {console.log("err",err); throw new BadRequestException() })
    )
  }

  fetchAPIUrlByThirdPartyOrganizationId(params: ParamsDto, body: any) {
    Logger.debug(`fetchAPIUrlByThirdPartyOrganizationId() createProductDto:${params} }`, APP);
    let api_response : any;

    return this.tpaJunctionDB.find({ org_id: params.org_id, id: params.id }).pipe(
      switchMap(async doc => {
        if(doc[0].header){
        api_response = await axios.post(doc[0].api_url_vitals, body, {
          headers: doc[0].header
        });
      }
      else {
        api_response = await axios.post(doc[0].api_url_vitals, body);
      }
        return  { status: api_response.data, doc };
      }),
      catchError(err => { throw new BadRequestException() })
    )
  }


  authUrlEncryption(org_id: number, body: AuthAPIDto) {
    Logger.debug(`authUrlEncryption() createProductDto: ${body}}`, APP);

    return this.organizationService.fetchOrganizationByIdDetails(org_id).pipe(
      switchMap(async doc => {
        const url = doc[0].auth_url.token_url;
        const secondUrl = doc[0].auth_url.callback_url;
        const username = doc[0].auth_url.username;
        const password = doc[0].auth_url.password;
        const grantType = 'client_credentials';
        const policy_number = body.policy_number;
        try {
          const params = new URLSearchParams();
          params.append('grant_type', grantType);

          const firstResponse = await axios.post(url, params.toString(), {
            headers: {
              Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          delete body.policy_number;
          const accessToken = firstResponse.data.access_token;
          const secondResponse = await axios.post(secondUrl, body, {
            headers: {
              'x-api-key': doc[0].auth_url.x_api_key,
              Authorization: `Bearer ${accessToken}`,
              'X-Aegon-Policy-Number': policy_number,
            },
          });

          return secondResponse.data;

        } catch (error) {
          throw new BadRequestException({ status: error.response.status, message: error.response.statusText })
        }
      })
    )

  }

  sampleUrlForAuth(body : RequestToAPIDto){
    Logger.debug('sampleUrlForAuth',APP);

    return {status : 'Success'}
  }

}
