import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
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
        return mainData

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
        return mainData

}

date_array : any
period : any

async fetchTotalTestsOfOrgByTime(params:ProductTestsDto){
    Logger.debug(`fetchTotalTestsOfOrgByTime() params:${params}} `, APP);
    let mainData= [];

    if(params.period=='daily'){
      this.period = params.period
      this.date_array=[(d => new Date(d.setDate(d.getDate())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setDate(d.getDate()-1)).toISOString().split("T")[0])(new Date())]
  }
  else if(params.period=='weekly'){
    this.period = params.period
    this.date_array=[(d => new Date(d.setDate(d.getDate()-6)).toISOString().split("T")[0])(new Date()),(d => new Date(d.setDate(d.getDate()-13)).toISOString().split("T")[0])(new Date())]
   }

  else if(params.period=='monthly'){
    this.period = params.period
    this.date_array=[(d => new Date(d.setMonth(d.getMonth())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setMonth(d.getMonth()-1)).toISOString().split("T")[0])(new Date())]
   }
   else if(params.period=='quarterly'){
    this.period = params.period
    this.date_array=[(d => new Date(d.setMonth(d.getMonth()-4)).toISOString().split("T")[0])(new Date()),(d => new Date(d.setMonth(d.getMonth()-7)).toISOString().split("T")[0])(new Date())]
   }
   else if(params.period=='yearly'){
    this.period = params.period
    this.date_array=[(d => new Date(d.setFullYear(d.getFullYear())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setFullYear(d.getFullYear()-1)).toISOString().split("T")[0])(new Date())]
   }
  
  for( let i = 0 ; i<= this.date_array.length-1 ; i++){
    params.test_date= this.date_array[i];
    params.period = this.period;

    const doc = await lastValueFrom(this.productTestDB.findTotalTestsByOrganizationStatistics(params));
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
           const user_email = userDoc[0]?.email
           const user_name = userDoc[0]?.user_name
           mainData.push({org_id, total_org_tests, max_test_by_user, user_email, user_name})
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

async fetchTotalTestsOfUsersByTime(params:ProductTestsDto){
  Logger.debug(`fetchTotalTestsOfUsersByTime() params:${params}} `, APP);
  let mainData= [];

  if(params.period=='daily'){
    this.period_users = params.period
    this.date_array_users=[(d => new Date(d.setDate(d.getDate())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setDate(d.getDate()-1)).toISOString().split("T")[0])(new Date())]
}
else if(params.period=='weekly'){
  this.period_users = params.period
  this.date_array_users=[(d => new Date(d.setDate(d.getDate()-6)).toISOString().split("T")[0])(new Date()),(d => new Date(d.setDate(d.getDate()-13)).toISOString().split("T")[0])(new Date())]
 }

else if(params.period=='monthly'){
  this.period_users = params.period
  this.date_array_users=[(d => new Date(d.setMonth(d.getMonth())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setMonth(d.getMonth()-1)).toISOString().split("T")[0])(new Date())]
 }
 else if(params.period=='quarterly'){
  this.period_users = params.period
  this.date_array_users=[(d => new Date(d.setMonth(d.getMonth()-4)).toISOString().split("T")[0])(new Date()),(d => new Date(d.setMonth(d.getMonth()-7)).toISOString().split("T")[0])(new Date())]
 }
 else if(params.period=='yearly'){
  this.period_users = params.period
  this.date_array_users=[(d => new Date(d.setFullYear(d.getFullYear())).toISOString().split("T")[0])(new Date()),(d => new Date(d.setFullYear(d.getFullYear()-1)).toISOString().split("T")[0])(new Date())]
 }

for( let i = 0 ; i<= this.date_array_users.length-1 ; i++){
  params.test_date= this.date_array_users[i];
  params.period = this.period_users;

  const doc = await lastValueFrom(this.productTestDB.findTotalTestsByUsersStatistics(params));
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
         const user_email = userDoc[0]?.email
         const user_name = userDoc[0]?.user_name
         mainData.push({user_id, total_org_tests, max_test_by_user, user_email, user_name})
        }
      
      }
      

}
let absolute_diff = mainData[0].total_org_tests-mainData[1].total_org_tests
let total_tests = mainData[0].total_org_tests+mainData[1].total_org_tests
let variance = absolute_diff/total_tests*100
mainData.push({variance : variance})

return mainData

}

}
