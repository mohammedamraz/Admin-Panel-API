import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { lastValueFrom, map } from 'rxjs';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from 'src/constants';
import { DatabaseTable } from 'src/lib/database/database.decorator';
import { DatabaseService } from 'src/lib/database/database.service';
import { UsersService } from 'src/routes/video-to-vitals/users.service';
import { ProductTestsDto } from './dto/create-product_tests.dto';
// import { DatabaseService } from 'firebase-admin/lib/database/database';
const APP = "ProductTestsService"

@Injectable()
export class ProductTestsService {
    constructor(
        @DatabaseTable('product_tests')
        private readonly productTestDB: DatabaseService<ProductTestsDto>,
        private readonly UsersService : UsersService)
{}




Paginator(items: any, page: any, per_page: any) {

  var page = page || 1,
    per_page = per_page || 10,
    offset = (page - 1) * per_page,

    paginatedItems = items.slice(offset).slice(0, per_page),
    total_pages = Math.ceil(items.length / per_page);
  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: (total_pages > page) ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems
  };
}

    async fetchTotalTestsOfOrg(params:ProductTestsDto){
    Logger.debug(`fetchTotalTestsOfOrg() params:${params}} `, APP);
    let mainData= [];

    const date = new Date(params.test_date);
    const date_onedaybefore= new Date(date.setDate(date.getDate()-1)).toISOString().split("T")[0];
    const date_twodaybefore= new Date(date.setDate(date.getDate()-1)).toISOString().split("T")[0];
    const doc = await lastValueFrom(this.productTestDB.find({org_id:params.org_id,product_id:params.product_id,test_date:params.test_date}));
    const doc_onedaybefore = await lastValueFrom(this.productTestDB.find({org_id:params.org_id,product_id:params.product_id,test_date:date_onedaybefore}));
    const doc_twodaybefore = await lastValueFrom(this.productTestDB.find({org_id:params.org_id,product_id:params.product_id,test_date:date_twodaybefore}));
    const doc_standard = await lastValueFrom(this.productTestDB.find({org_id:params.org_id,product_id:params.product_id,event_mode:false,test_date:params.test_date}));
    const doc_event = await lastValueFrom(this.productTestDB.find({org_id:params.org_id,product_id:params.product_id,event_mode:true,test_date:params.test_date}));
        if (doc.length==0) {
          const org_id = Number(params.org_id);
          const total_org_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0); 
          const total_org_tests_onedaybefore = doc_onedaybefore.reduce((pre, acc) => pre + acc['tests'], 0); 
          const total_org_tests_twodaybefore = doc_twodaybefore.reduce((pre, acc) => pre + acc['tests'], 0); 
          mainData.push({org_id, total_org_tests,total_org_tests_onedaybefore,total_org_tests_twodaybefore})
        }
        else{
          var holder = []
          doc.forEach( object => {
            const data = holder.find( doc => doc.user_id=== object.user_id)
            if(!data){
              holder.push({user_id:object.user_id,total_tests:object.tests})
            }
            else{
             data.total_tests = (data.total_tests) + (object.tests)
            }
          });
          const max_test_by_user= Math.max.apply(Math, holder.map(doc=>doc.total_tests)) 
          if  (max_test_by_user==0){        
           const org_id = Number(params.org_id)
           const total_org_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0);    
           mainData.push({org_id, total_org_tests, max_test_by_user})
          }
          else{ 
           const userData = holder.find(doc=>doc.total_tests=== max_test_by_user)
           const userDoc = await lastValueFrom(this.UsersService.fetchUserById(userData.user_id));const org_id = Number(params.org_id)
           const total_org_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0);
           const user_email = userDoc[0]?.email
           const user_name = userDoc[0]?.user_name
           const total_org_tests_standard = doc_standard.reduce((pre, acc) => pre + acc['tests'], 0); 
           const total_org_tests_event = doc_event.reduce((pre, acc) => pre + acc['tests'], 0); 
           const total_org_tests_onedaybefore = doc_onedaybefore.reduce((pre, acc) => pre + acc['tests'], 0); 
           const total_org_tests_twodaybefore = doc_twodaybefore.reduce((pre, acc) => pre + acc['tests'], 0); 
           mainData.push({org_id,total_org_tests_standard,total_org_tests_onedaybefore,total_org_tests_twodaybefore, total_org_tests_event, total_org_tests, max_test_by_user, user_email, user_name})
          }
        
        }     
        doc.sort((a: { id?: number; },b: { id?: number; })=> b.id-a.id); 
        const filteredDoc =  doc.filter((doc:any)=>doc.policy_number!==null);
        mainData[0]['data'] = this.Paginator(filteredDoc,params.page,params.per_page) ;
        return mainData

}
updateTestReportInProductTest(params :ProductTestsDto ,data:ProductTestsDto){
    Logger.debug(`updateTestReportInProductTest() addUserDTO:${JSON.stringify(data)} `, APP);

    if(!params.id){
    return this.productTestDB.save(data).pipe(map(doc=>doc))}
    else return this.productTestDB.findByIdandUpdate({id:params.id.toString(),quries:data})
  }

  updatePDFInProductTest(params :ProductTestsDto ,data:ProductTestsDto){
    Logger.debug(`updateTestReportInProductTest() addUserDTO:${JSON.stringify(data)} `, APP);

    return this.productTestDB.findandUpdate({columnName: 'vitals_id', columnvalue : params.vitals_id ,quries:{pdf_location : data.pdf_location}})
  }

  fetchProductTestUsingApplicationId(application_id:any,product_id :any){
    Logger.debug(`updateTestReportInProductTest() addUserDTO:${JSON.stringify(application_id)} `, APP);

    return this.productTestDB.find({viu_user : application_id, product_id : product_id}).pipe(
      map(doc=>doc)
    )
  }


  saveTestsToProductTests(data:ProductTestsDto){
    Logger.debug(`saveTestsToProductTests() addUserDTO:${JSON.stringify(data)} `, APP);

    return this.productTestDB.save(data).pipe(map(doc=>doc))
  }

async fetchTotalTestsOfUsers(params:ProductTestsDto){
    Logger.debug(`fetchTotalTestsOfOrg() params:${params}} `, APP);
    let mainData= [];

    const date = new Date(params.test_date);
    const date_onedaybefore= new Date(date.setDate(date.getDate()-1)).toISOString().split("T")[0];
    const date_twodaybefore= new Date(date.setDate(date.getDate()-1)).toISOString().split("T")[0];
    const doc = await lastValueFrom(this.productTestDB.find({user_id:params.user_id,product_id:params.product_id,test_date:params.test_date}));
    const doc_onedaybefore = await lastValueFrom(this.productTestDB.find({user_id:params.user_id,product_id:params.product_id,test_date:date_onedaybefore}));
    const doc_twodaybefore = await lastValueFrom(this.productTestDB.find({user_id:params.user_id,product_id:params.product_id,test_date:date_twodaybefore}));
    const doc_standard = await lastValueFrom(this.productTestDB.find({user_id:params.user_id,product_id:params.product_id,event_mode:false,test_date:params.test_date}));
    const doc_event = await lastValueFrom(this.productTestDB.find({user_id:params.user_id,product_id:params.product_id,event_mode:true,test_date:params.test_date}));
        if (doc.length==0) {
          const user_id = Number(params.user_id)
          const total_user_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0); 
          const total_user_tests_onedaybefore = doc_onedaybefore.reduce((pre, acc) => pre + acc['tests'], 0); 
          const total_user_tests_twodaybefore = doc_twodaybefore.reduce((pre, acc) => pre + acc['tests'], 0); 
          mainData.push({user_id, total_user_tests,total_user_tests_onedaybefore,total_user_tests_twodaybefore})
        }
        else{
          var holder = []
          doc.forEach( object => {
            const data = holder.find( doc => doc.user_id=== object.user_id)
            if(!data){
              holder.push({user_id:object.user_id,total_tests:object.tests})
            }
            else{
             data.total_tests = (data.total_tests) + (object.tests)
            }
          });
        //   const max_test_by_user= Math.max.apply(Math, holder.map(doc=>doc.total_tests)) 
        //   if  (max_test_by_user==0){        
        //    const user_id = params.user_id
        //    const total_user_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0);    
        //    mainData.push({user_id, total_user_tests, max_test_by_user})
        //   }
        //   else{ 
        //    const userData = holder.find(doc=>doc.total_tests=== max_test_by_user)
        //    const userDoc = await lastValueFrom(this.UsersService.fetchUserById(userData.user_id));
           const user_id = Number(params.user_id)
           const total_user_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0);
        //    const user_email = userDoc[0]?.email
        //    const user_name = userDoc[0]?.user_name
           const total_user_tests_standard = doc_standard.reduce((pre, acc) => pre + acc['tests'], 0); 
           const total_user_tests_event = doc_event.reduce((pre, acc) => pre + acc['tests'], 0); 
           const total_user_tests_onedaybefore = doc_onedaybefore.reduce((pre, acc) => pre + acc['tests'], 0); 
           const total_user_tests_twodaybefore = doc_twodaybefore.reduce((pre, acc) => pre + acc['tests'], 0); 
           mainData.push({user_id,total_user_tests_standard,total_user_tests_event,total_user_tests_onedaybefore, total_user_tests_twodaybefore, total_user_tests})
        //   }
        
        }
        doc.sort((a: { id?: number; },b: { id?: number; })=> b.id-a.id);   
        const filteredDoc =  doc.filter((doc:any)=>doc.policy_number!==null);
        mainData[0]['data'] = this.Paginator(filteredDoc,params.page,params.per_page) ;
        return mainData

}

date_array : any
period : any
quarter_one : any
quarter_one_next : any
quarter_two : any
quarter_two_next : any
quarter_three : any
quarter_three_next : any
quarter_four : any
quarter_four_next : any
start_date : any

date_arraay_org : any;
date_arraay_org_data : any = [];
quarter : any

async fetchTotalTestsOfOrgByTime(params:ProductTestsDto){
    Logger.debug(`fetchTotalTestsOfOrgByTime() params:${params}} `, APP);
    let mainData= [];
    let quarterData = [];

    if(params.period=='daily'){
      this.period = params.period
      this.date_array=[(d => new Date(d.setDate(d.getDate())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setDate(d.getDate()-1)).toISOString().split("T")[0])(new Date())]
  }
  else if(params.period=='weekly'){
    this.period = params.period
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day == 0 ? -6:1);
    const first_day = new Date(date.setDate(diff));
    this.date_array=[(new Date(first_day.setDate(first_day.getDate())).toISOString().split("T")[0]),new Date(first_day.setDate(first_day.getDate()-7)).toISOString().split("T")[0]]
   }

  else if(params.period=='monthly'){
    this.period = params.period
    this.date_array=[(d => new Date(d.setMonth(d.getMonth())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setMonth(d.getMonth()-1)).toISOString().split("T")[0])(new Date())]
   }
   else if(params.period=='quarterly'){
    this.period = params.period
    const quarter_date = Number(Math.ceil(new Date().getMonth() +1 ))
    if(quarter_date >=1 && quarter_date <= 3) {this.quarter = 1;}
    if(quarter_date >=4 && quarter_date <= 6) {this.quarter = 2;}
    if(quarter_date >=7 && quarter_date <= 9) {this.quarter = 3;}
    if(quarter_date >=10 && quarter_date <= 12) {this.quarter = 4;}
    this.date_array=[(d => new Date(d.setMonth((this.quarter*3)-3,1)).toISOString().split("T")[0])(new Date()),(d => new Date(d.setMonth(((this.quarter-1)*3)-3,1)).toISOString().split("T")[0])(new Date())]
   }
   else if(params.period=='yearly'){
    this.period = params.period
    this.date_array=[(d => new Date(d.setFullYear(d.getFullYear())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setFullYear(d.getFullYear()-1)).toISOString().split("T")[0])(new Date())]
   }
  
  for( let i = 0 ; i<= this.date_array.length-1 ; i++){
    params.test_date= this.date_array[i];
    params.period = this.period;
    if(params.period=='weekly'){      
      const date = new Date(params.test_date); 
      this.date_arraay_org = [  
      new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate())).toISOString().split("T")[0]
      ]
      this.date_arraay_org_data.length = 7;
    }
    if(params.period=='monthly'){
      const date = new Date(params.test_date);
      this.date_arraay_org = [  
      new Date(date.setDate(1)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+5)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+5)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+5)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+5)).toISOString().split("T")[0],
      new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
      new Date(date.getFullYear(),date.getMonth() + 1, 0, 23, 59, 59).toISOString().split("T")[0],
      ]
      this.date_arraay_org_data.length = 5;
    }
    if(params.period=='quarterly'){            
      const date = new Date(params.test_date);
      this.date_arraay_org = [  
      new Date(date.setMonth(date.getMonth())).toISOString().split("T")[0],
      new Date(date.getFullYear(),date.getMonth()+1, 0, 23, 59, 59).toISOString().split("T")[0],
      new Date(date.setMonth(date.getMonth()+1,1)).toISOString().split("T")[0],
      new Date(date.getFullYear(),date.getMonth()+1, 0, 23, 59, 59).toISOString().split("T")[0],
      new Date(date.setMonth(date.getMonth()+1,1)).toISOString().split("T")[0],
      new Date(date.getFullYear(),date.getMonth()+1, 0, 23, 59, 59).toISOString().split("T")[0]
      ]
      this.date_arraay_org_data.length = 3;
    }
    if(params.period=='yearly'){
      const date = new Date(params.test_date);
      this.date_arraay_org = [
      new Date(date.setMonth(0,1)).toISOString().split("T")[0],
      new Date(date.setMonth(0,31)).toISOString().split("T")[0],
      new Date(date.setMonth(1,1)).toISOString().split("T")[0],
      new Date(date.setMonth(1,28)).toISOString().split("T")[0],
      new Date(date.setMonth(2,1)).toISOString().split("T")[0],
      new Date(date.setMonth(2,31)).toISOString().split("T")[0],
      new Date(date.setMonth(3,1)).toISOString().split("T")[0],
      new Date(date.setMonth(3,30)).toISOString().split("T")[0],
      new Date(date.setMonth(4,1)).toISOString().split("T")[0],
      new Date(date.setMonth(4,31)).toISOString().split("T")[0],
      new Date(date.setMonth(5,1)).toISOString().split("T")[0],
      new Date(date.setMonth(5,30)).toISOString().split("T")[0],
      new Date(date.setMonth(6,1)).toISOString().split("T")[0],
      new Date(date.setMonth(6,31)).toISOString().split("T")[0],
      new Date(date.setMonth(7,1)).toISOString().split("T")[0],
      new Date(date.setMonth(7,31)).toISOString().split("T")[0],
      new Date(date.setMonth(8,1)).toISOString().split("T")[0],
      new Date(date.setMonth(8,30)).toISOString().split("T")[0],
      new Date(date.setMonth(9,1)).toISOString().split("T")[0],
      new Date(date.setMonth(9,31)).toISOString().split("T")[0],
      new Date(date.setMonth(10,1)).toISOString().split("T")[0],
      new Date(date.setMonth(10,30)).toISOString().split("T")[0],
      new Date(date.setMonth(11,1)).toISOString().split("T")[0],
      new Date(date.setMonth(11,31)).toISOString().split("T")[0]
      ]
      this.date_arraay_org_data.length = 12;
    }    

    const doc = await lastValueFrom(this.productTestDB.findTotalTestsByOrganizationStatistics(params));
    // const doc_quarter_one = await lastValueFrom(this.productTestDB.findOrgDataForThePerformanceChart({org_id:params.org_id,product_id:params.product_id,test_date:this.start_date,test_end_date:this.quarter_one}));
    // const doc_quarter_two = await lastValueFrom(this.productTestDB.findOrgDataForThePerformanceChart({org_id:params.org_id,product_id:params.product_id,test_date:this.quarter_one_next,test_end_date:this.quarter_two}));
    // const doc_quarter_three = await lastValueFrom(this.productTestDB.findOrgDataForThePerformanceChart({org_id:params.org_id,product_id:params.product_id,test_date:this.quarter_two_next,test_end_date:this.quarter_three}));
    // const doc_quarter_four = await lastValueFrom(this.productTestDB.findOrgDataForThePerformanceChart({org_id:params.org_id,product_id:params.product_id,test_date:this.quarter_three_next,test_end_date:this.quarter_four}));
        if (doc.length==0) {
          const org_id = params.org_id
          const total_org_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0); 
          mainData.push({org_id, total_org_tests})
        }
        else{
          var holder = []
          doc.forEach( object => {

            const data = holder.find( doc => doc.user_id=== object.user_id)
            if(!data){
              holder.push({user_id:object.user_id,total_tests:object.tests})
            }
            else{
             data.total_tests = (data.total_tests) + (object.tests)
            }
          });
          const max_test_by_user= Math.max.apply(Math, holder.map(doc=>doc.total_tests)) 
          if  (max_test_by_user==0){        
           const org_id = params.org_id
           const total_org_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0);    
           mainData.push({org_id, total_org_tests, max_test_by_user})
          }
          else{ 
           const userData = holder.find(doc=>doc.total_tests=== max_test_by_user)
           const userDoc = await lastValueFrom(this.UsersService.fetchUserById(userData.user_id));
           const org_id = params.org_id
           const total_org_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0);
           quarterData = [];

           for (let j=0 ; j <= this.date_arraay_org_data.length-1; j++){

            const doc_quarter_one = await lastValueFrom(this.productTestDB.findOrgDataForThePerformanceChart({org_id:params.org_id,product_id:params.product_id,test_date:this.date_arraay_org[j*2],test_end_date:this.date_arraay_org[j*2+1]}));
            const quarter_one_tests = doc_quarter_one.reduce((pre, acc) => pre + acc['tests'], 0);            
            quarterData.push(quarter_one_tests)
           }
          //  const quarter_one_tests = doc_quarter_one.reduce((pre, acc) => pre + acc['tests'], 0);
          //  const quarter_two_tests = doc_quarter_two.reduce((pre, acc) => pre + acc['tests'], 0);
          //  const quarter_three_tests = doc_quarter_three.reduce((pre, acc) => pre + acc['tests'], 0);
          //  const quarter_four_tests = doc_quarter_four.reduce((pre, acc) => pre + acc['tests'], 0);
           const user_email = userDoc[0]?.email
           const user_name = userDoc[0]?.user_name
           mainData.push({org_id, total_org_tests, quarterData, max_test_by_user, user_email, user_name})
          }
        
        }
        

}
let absolute_diff = mainData[0].total_org_tests-mainData[1].total_org_tests
let total_tests = mainData[0].total_org_tests+mainData[1].total_org_tests
let variance = absolute_diff/total_tests*100
mainData.push({variance : variance})

return mainData

}

date_array_users : any
period_users : any
date_arraay_users_quarter : any;
date_arraay_users_data_quarter : any = [];
quarter_users : any

async fetchTotalTestsOfUsersByTime(params:ProductTestsDto){
  Logger.debug(`fetchTotalTestsOfUsersByTime() params:${params}} `, APP);
  let mainData= [];
  let quarterData = [];

  if(params.period=='daily'){
    this.period_users = params.period
    this.date_array_users=[(d => new Date(d.setDate(d.getDate())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setDate(d.getDate()-1)).toISOString().split("T")[0])(new Date())]
}
else if(params.period=='weekly'){
  this.period_users = params.period;
  const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day == 0 ? -6:1);
    const first_day = new Date(date.setDate(diff));
  this.date_array_users=[(new Date(first_day.setDate(first_day.getDate())).toISOString().split("T")[0]),new Date(first_day.setDate(first_day.getDate()-7)).toISOString().split("T")[0]]
 }

else if(params.period=='monthly'){
  this.period_users = params.period
  this.date_array_users=[(d => new Date(d.setMonth(d.getMonth())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setMonth(d.getMonth()-1)).toISOString().split("T")[0])(new Date())]
 }
 else if(params.period=='quarterly'){
  this.period_users = params.period;
  const quarter_date = Number(Math.ceil(new Date().getMonth() +1 ))
  if(quarter_date >=1 && quarter_date <= 3) {this.quarter_users = 1;}
  if(quarter_date >=4 && quarter_date <= 6) {this.quarter_users = 2;}
  if(quarter_date >=7 && quarter_date <= 9) {this.quarter_users = 3;}
  if(quarter_date >=10 && quarter_date <= 12) {this.quarter_users = 4;}
  this.date_array_users=[(d => new Date(d.setMonth((this.quarter_users*3)-3,1)).toISOString().split("T")[0])(new Date()),(d => new Date(d.setMonth(((this.quarter_users-1)*3)-3,1)).toISOString().split("T")[0])(new Date())];
 }
 else if(params.period=='yearly'){
  this.period_users = params.period
  this.date_array_users=[(d => new Date(d.setFullYear(d.getFullYear())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setFullYear(d.getFullYear()-1)).toISOString().split("T")[0])(new Date())]
 }

for( let i = 0 ; i<= this.date_array_users.length-1 ; i++){
  params.test_date= this.date_array_users[i];
  params.period = this.period_users;
  if(params.period=='weekly'){      
    const date = new Date(params.test_date); 
    this.date_arraay_users_quarter = [  
    new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate())).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate())).toISOString().split("T")[0]
    ]
    this.date_arraay_users_data_quarter.length = 7;
  }
  if(params.period=='monthly'){
    const date = new Date(params.test_date);
    this.date_arraay_users_quarter = [  
    new Date(date.setDate(1)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+5)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+5)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+5)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+5)).toISOString().split("T")[0],
    new Date(date.setDate(date.getDate()+1)).toISOString().split("T")[0],
    new Date(date.getFullYear(),date.getMonth() + 1, 0, 23, 59, 59).toISOString().split("T")[0],
    ]
    this.date_arraay_users_data_quarter.length = 5;
  }
  if(params.period=='quarterly'){            
    const date = new Date(params.test_date);
    this.date_arraay_users_quarter = [  
    new Date(date.setMonth(date.getMonth())).toISOString().split("T")[0],
    new Date(date.getFullYear(),date.getMonth()+1, 0, 23, 59, 59).toISOString().split("T")[0],
    new Date(date.setMonth(date.getMonth()+1,1)).toISOString().split("T")[0],
    new Date(date.getFullYear(),date.getMonth()+1, 0, 23, 59, 59).toISOString().split("T")[0],
    new Date(date.setMonth(date.getMonth()+1,1)).toISOString().split("T")[0],
    new Date(date.getFullYear(),date.getMonth()+1, 0, 23, 59, 59).toISOString().split("T")[0]
    ]
    this.date_arraay_users_data_quarter.length = 3;
  }
  if(params.period=='yearly'){
    const date = new Date(params.test_date);
    this.date_arraay_users_quarter = [
    new Date(date.setMonth(0,1)).toISOString().split("T")[0],
    new Date(date.setMonth(0,31)).toISOString().split("T")[0],
    new Date(date.setMonth(1,1)).toISOString().split("T")[0],
    new Date(date.setMonth(1,28)).toISOString().split("T")[0],
    new Date(date.setMonth(2,1)).toISOString().split("T")[0],
    new Date(date.setMonth(2,31)).toISOString().split("T")[0],
    new Date(date.setMonth(3,1)).toISOString().split("T")[0],
    new Date(date.setMonth(3,30)).toISOString().split("T")[0],
    new Date(date.setMonth(4,1)).toISOString().split("T")[0],
    new Date(date.setMonth(4,31)).toISOString().split("T")[0],
    new Date(date.setMonth(5,1)).toISOString().split("T")[0],
    new Date(date.setMonth(5,30)).toISOString().split("T")[0],
    new Date(date.setMonth(6,1)).toISOString().split("T")[0],
    new Date(date.setMonth(6,31)).toISOString().split("T")[0],
    new Date(date.setMonth(7,1)).toISOString().split("T")[0],
    new Date(date.setMonth(7,31)).toISOString().split("T")[0],
    new Date(date.setMonth(8,1)).toISOString().split("T")[0],
    new Date(date.setMonth(8,30)).toISOString().split("T")[0],
    new Date(date.setMonth(9,1)).toISOString().split("T")[0],
    new Date(date.setMonth(9,31)).toISOString().split("T")[0],
    new Date(date.setMonth(10,1)).toISOString().split("T")[0],
    new Date(date.setMonth(10,30)).toISOString().split("T")[0],
    new Date(date.setMonth(11,1)).toISOString().split("T")[0],
    new Date(date.setMonth(11,31)).toISOString().split("T")[0]
    ]
    this.date_arraay_users_data_quarter.length = 12;
  }

  const doc = await lastValueFrom(this.productTestDB.findTotalTestsByUsersStatistics(params));
  // const doc_quarter_one = await lastValueFrom(this.productTestDB.findUserDataForThePerformanceChart({org_id:params.user_id,product_id:params.product_id,test_date:this.start_date,test_end_date:this.quarter_one}));
  //   const doc_quarter_two = await lastValueFrom(this.productTestDB.findUserDataForThePerformanceChart({org_id:params.user_id,product_id:params.product_id,test_date:this.quarter_one_next,test_end_date:this.quarter_two}));
  //   const doc_quarter_three = await lastValueFrom(this.productTestDB.findUserDataForThePerformanceChart({org_id:params.user_id,product_id:params.product_id,test_date:this.quarter_two_next,test_end_date:this.quarter_three}));
  //   const doc_quarter_four = await lastValueFrom(this.productTestDB.findUserDataForThePerformanceChart({org_id:params.user_id,product_id:params.product_id,test_date:this.quarter_three_next,test_end_date:this.quarter_four}));
      if (doc.length==0) {
        const user_id = params.user_id
        const total_org_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0); 
        mainData.push({user_id, total_org_tests})
      }
      else{
        var holder = []
        doc.forEach( object => {

          const data = holder.find( doc => doc.user_id=== object.user_id)
          if(!data){
            holder.push({user_id:object.user_id,total_tests:object.tests})
          }
          else{
           data.total_tests = (data.total_tests) + (object.tests)
          }
        });
        const max_test_by_user= Math.max.apply(Math, holder.map(doc=>doc.total_tests)) 
        if  (max_test_by_user==0){        
         const user_id = params.user_id
         const total_org_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0);    
         mainData.push({user_id, total_org_tests, max_test_by_user})
        }
        else{ 
         const userData = holder.find(doc=>doc.total_tests=== max_test_by_user)
         const userDoc = await lastValueFrom(this.UsersService.fetchUserById(userData.user_id));
         const user_id = params.user_id
         const total_org_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0);
         quarterData = [];

         for (let j=0 ; j <= this.date_arraay_users_data_quarter.length-1; j++){

          const doc_quarter_one = await lastValueFrom(this.productTestDB.findUserDataForThePerformanceChart({org_id:params.user_id,product_id:params.product_id,test_date:this.date_arraay_users_quarter[j*2],test_end_date:this.date_arraay_users_quarter[j*2+1]}));
          const quarter_one_tests = doc_quarter_one.reduce((pre, acc) => pre + acc['tests'], 0);            
          quarterData.push(quarter_one_tests)
         }
        //  const quarter_one_tests = doc_quarter_one.reduce((pre, acc) => pre + acc['tests'], 0);
        //    const quarter_two_tests = doc_quarter_two.reduce((pre, acc) => pre + acc['tests'], 0);
        //    const quarter_three_tests = doc_quarter_three.reduce((pre, acc) => pre + acc['tests'], 0);
        //    const quarter_four_tests = doc_quarter_four.reduce((pre, acc) => pre + acc['tests'], 0);
         const user_email = userDoc[0]?.email
         const user_name = userDoc[0]?.user_name
         mainData.push({user_id, total_org_tests, quarterData, max_test_by_user, user_email, user_name})
        }
      
      }
      

}
let absolute_diff = mainData[0].total_org_tests-mainData[1].total_org_tests
let total_tests = mainData[0].total_org_tests+mainData[1].total_org_tests
let variance = absolute_diff/total_tests*100
mainData.push({variance : variance})

return mainData

}

async upload(file) {
  const { originalname } = file;
  const bucketS3 = 'fedo-vitals';
  await this.uploadS3(file.buffer, bucketS3, originalname);
}

async uploadS3(file, bucket, name) {
  const s3 = this.getS3();

  const params = {
    Bucket: bucket,
    Key: String(name),
    Body: file,
    acl: 'public',


  };


  return new Promise((resolve, reject) => {
  s3.upload(params, (err, data) => {
      if (err) {
        Logger.error(err);
        reject(err.message);
      }
      else{
      const url = s3.getSignedUrl('getObject', {
        Bucket: 'fedo-vitals',
        Key: String(name)
      })

      resolve(url);
    }
    });
  }).then((next) => {
   throw new ConflictException({url:next})
  },
  (error) => {
   throw new NotFoundException(error)
  });
}

getS3() {
  return new S3({
    accessKeyId: AWS_ACCESS_KEY_ID,

    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  });
}




async fetchTotalTestsOfOrgDateRange(params:ProductTestsDto){
  Logger.debug(`fetchTotalTestsOfOrgDateRange() params:${params}} `, APP);
  let mainData= [];

  const params_data = {
    org_id : params.org_id,
    product_id : params.product_id,
    test_date : params.test_date,
    test_end_date : params.test_end_date
  }
  const doc = await lastValueFrom(this.productTestDB.findOrgDataForThePerformanceChart(params_data));
  if (doc.length==0) {
        const org_id = params.org_id
        const total_org_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0); 
        mainData.push({org_id, total_org_tests})
      }
      else{
        var holder = []
        doc.forEach( object => {

          const data = holder.find( doc => doc.user_id=== object.user_id)
          if(!data){
            holder.push({user_id:object.user_id,total_tests:object.tests})
          }
          else{
           data.total_tests = (data.total_tests) + (object.tests)
          }
        });
         const org_id = params.org_id
         const total_org_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0);
         mainData.push({org_id, total_org_tests})      
      }
      doc.sort((a: { id?: number; },b: { id?: number; })=> b.id-a.id);   
        const filteredDoc =  doc.filter((doc:any)=>doc.policy_number!==null);
        mainData[0]['data'] = this.Paginator(filteredDoc,params.page,params.per_page) ;
        return mainData

}

async fetchTotalTestsOfUserDateRange(params:ProductTestsDto){
  Logger.debug(`fetchTotalTestsOfUserDateRange() params:${params}} `, APP);
  let mainData= [];

  const params_data = {
    user_id : params.user_id,
    product_id : params.product_id,
    test_date : params.test_date,
    test_end_date : params.test_end_date
  }
  const doc = await lastValueFrom(this.productTestDB.findUserDataForThePerformanceChart(params_data));
  if (doc.length==0) {
        const user_id = params.user_id
        const total_user_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0); 
        mainData.push({user_id, total_user_tests})
      }
      else{
        var holder = []
        doc.forEach( object => {

          const data = holder.find( doc => doc.user_id=== object.user_id)
          if(!data){
            holder.push({user_id:object.user_id,total_tests:object.tests})
          }
          else{
           data.total_tests = (data.total_tests) + (object.tests)
          }
        });
         const user_id = params.user_id
         const total_user_tests = doc.reduce((pre, acc) => pre + acc['tests'], 0);
         mainData.push({user_id, total_user_tests})      
      }
      doc.sort((a: { id?: number; },b: { id?: number; })=> b.id-a.id);   
        const filteredDoc =  doc.filter((doc:any)=>doc.policy_number!==null);
        mainData[0]['data'] = this.Paginator(filteredDoc,params.page,params.per_page) ;
        return mainData

}


}
