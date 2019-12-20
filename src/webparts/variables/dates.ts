import Idates from '../interfaces/Idates';
import Iuser from '../interfaces/Iusers';

const dates:Idates={
    now: new Date(),
    yearStart: new Date(),
    yearEnd: new Date(),
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    days: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    firstLastDayOfMonth: ()=>new Date(),
    weeksByMonth: ()=>[],
    getDateObj: (date:Date,user:Iuser,arr:[[Date,Iuser]])=>{
        arr.push([date, user]);
    }
};
dates.yearStart=new Date(dates.now.getFullYear(),0,1);
dates.yearEnd=new Date(dates.now.getFullYear(),12,0);
dates.firstLastDayOfMonth=(choice?:number|undefined, month?:number,year?:number|undefined):Date=>{
    const chosenYear:number|undefined = year===undefined? dates.now.getFullYear():year;
    const day:number|undefined = choice===undefined?0:choice;
    let chosenMonth:number|undefined= month===undefined? dates.now.getMonth():month;
    
    let result:Date;
    result= new Date(chosenYear, chosenMonth, day);
    return result;
  };
dates.weeksByMonth=(dateFirst:Date, dateSecond:Date, all:boolean|undefined=false,n?:number|undefined):number[] =>{
    const end:number = dateSecond.getDate();
    let month:number[]=[];
    let week:number[]=[];
    let weeks:[number[]]=[[]];
   
      const start:number= dateFirst.getDate();
      for(let i=start; i<=end; i++){
      month.push(i);
      if(i%7!==0){
        week.push(i);
        }else{
          weeks.push(week);
          week.push(i);
          week=[];
        }
      }
      if(all){
        return month;
      }else if(typeof(n)=== "number" && n>0){

        return weeks[n];
      }else{
        n=1;
        return weeks[n];

      }
  };
export default dates;