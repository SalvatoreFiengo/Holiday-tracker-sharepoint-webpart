import Iuser from "./Iusers";

export default interface Idates{
    now:Date;
    yearStart:Date;
    yearEnd:Date;
    months:string[];
    firstLastDayOfMonth:(choice?:number, month?:number,year?:number)=>Date;
    weeksByMonth:(dateFirst:Date,dateSecond:Date,all:boolean|undefined,n?:number)=> number[];
    getDateObj:(date:Date, user:Iuser, arr:[[Date,Iuser]])=>void;
}