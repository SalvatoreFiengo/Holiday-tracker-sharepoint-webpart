import * as React from 'react';

import {Navbar, NavbarBrand, Nav, NavItem, NavLink, Table,Row, Col, Card, Button} from 'reactstrap';
import './HolidayTracker.scss'
import Iuser from '../../interfaces/Iusers';
import Idates from '../../interfaces/Idates';
import  IHelloUserPart  from '../../interfaces//IwebPart';
import {IHolidayTrackerProps} from '../components/IHolidayTrackerProps'

import HolidayTableComponent from '../components/holidayTableComponent';
import HolidayNewModal from '../components/holidayNewModal';
import dates from '../../variables/dates';
import usersMock from '../../variables/usersMock';
import MockHttpClient from './mockLists';
import * as crud from './crudService'

import { WebPartContext } from '@microsoft/sp-webpart-base';
import {
  SPHttpClient,
  SPHttpClientResponse   
} from '@microsoft/sp-http';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';


export interface IState {
  context: WebPartContext,
  siteUrl: string,
  error: string,
  webPartData:IHelloUserPart["data"],
  isWDataValid:IHelloUserPart["isValid"],
  user:[Iuser],
  dates:Idates,
  weeks:number[],
  modal: boolean,
  selectedWeek: number[],
  weekIsSelected:boolean,
  selectedMonth:number,
  count:number,
  listLoaded: boolean,
  lists: [ISPList],
  list: ISPList,
  listValues: any[],
  userName:string,
  selectedDate:Date,
  from:string,
  datePickerTo: boolean,
  datePickerFrom: boolean,
  request:{},

};

export interface ISPList {
  request_type: string;
  Id: string; 
  e_mail: string;
  agent_name: string; 
  from: string;
  to: string;
  approver: string;
  Comments: string;
  lob: string;
  approved: boolean;
}
export interface ISPLists{
  value: ISPList[]
}
class HolidayTracker extends React.Component<IHolidayTrackerProps,IState> {
  
  constructor(props:IHolidayTrackerProps){
    super(props)
  
    this.state={
      context: this.props.context,
      siteUrl: this.props.siteUrl,
      error: null,
      webPartData: "loading",
      isWDataValid: false,
      user: [usersMock],
      dates: dates,
      weeks: dates.weeksByMonth(dates.firstLastDayOfMonth(1),dates.firstLastDayOfMonth(0),true),
      modal: false,
      selectedWeek: dates.weeksByMonth(dates.firstLastDayOfMonth(1,dates.now.getMonth()+1),dates.firstLastDayOfMonth(0,dates.now.getMonth()+1),true),
      weekIsSelected: false,
      selectedMonth:  dates.now.getMonth()+1,
      count:dates.now.getMonth(),
      listLoaded: false,
      lists: [
        {
        request_type:"",
        Id:"", 
        e_mail:"",
        agent_name:"",  
        to:"",
        approved: false, 
        lob:"",
        from:"",
        Comments:"",
        approver:""
      }],
      list: {
        request_type:"",
        Id:"", 
        e_mail:"",
        agent_name:"", 
        to:"",
        approved: false, 
        lob:"",
        from:"",
        Comments:"",
        approver:""
      },
      listValues: [],
      userName:"",
      selectedDate:dates.now,
      from:"",
      datePickerTo: false,
      datePickerFrom: false,
      request:{},
    }
    this.toggle = this.toggle.bind(this);
    this.checkAgainstPreviousRequests=this.checkAgainstPreviousRequests.bind(this);
    this.getSpecificList= this.getSpecificList.bind(this);
  };

  toggle() {
    this.setState(prevState=>({
      modal: !prevState.modal
    }));

  }
  toggleDataPickerTo=()=>{
    this.setState(prevState=>({
      datePickerTo: !prevState.datePickerTo
    }));
  }
  toggleDataPickerFrom=()=>{
    this.setState(prevState=>({
      datePickerFrom: !prevState.datePickerFrom
    }));
  }

  public componentDidMount(): void {
    this._renderSpecificListAsync(this.state.context, this.state.siteUrl);
  }

  checkAgainstPreviousRequests(request):boolean {
    for (let i=0; i<this.state.listValues.length;i++){
        let item = this.state.listValues[i];
        if(request.sykj === item.sykj || request.email === item.email){
          const monthFrom = new Date(request.from).getMonth();
          const monthTo= new Date(request.to).getMonth();
          const itemMonthFrom = new Date(item.from).getMonth();
          const itemMonthTo = new Date(item.to).getMonth();
          if(monthFrom>=itemMonthFrom && monthFrom<=itemMonthTo || monthTo>=itemMonthFrom && monthTo<=itemMonthTo){
            alert("Request already submitted");
            return false;
  
          }
          else{
            this.setState({
              request: request,
            })
            console.log("ok done sure!")
            return true;
          }
        }
      }
    }

  // private _getMockListData(): Promise<ISPLists> {
  //   return MockHttpClient.get()
  //     .then((data: ISPList[]) => {
  //       var listData: ISPLists = {value: data};
  //       return listData;
  //     }) as Promise<ISPLists>;
  // }
   
  // private _renderListAsync(): void {
  //   // Local environment
  //   if (Environment.type === EnvironmentType.Local) {
  //       this._getMockListData().then((response) => {
  //         this.getSpLists(response.value)
  //     }).catch(error =>this.setState({error: error, listLoaded: true}));
  //   }
  //   else if ((Environment.type == EnvironmentType.SharePoint || 
  //             Environment.type == EnvironmentType.ClassicSharePoint)) {
  //     this._getListData().then((response) => {

  //         this.getSpLists(response.value)

  //         }).catch(error =>this.setState({error: error, listLoaded: true}));    
  //   }
  // }

  getSpLists=(response)=>{
    this.setState({
      lists: response,
    }, function(){console.log("list updated")})
  }

  getSpecificList=(response)=>{
    let values=Object.keys(response.value).map(item=>response.value[item])
    this.setState({
      listValues: values 
    }, function(){console.log("listValues -- ")})
  }
  


  private _renderSpecificListAsync(ctx, siteUrl): void {
    crud._getSpecificList(ctx, siteUrl).then((res)=>{
      this.getSpecificList(res)
    })
  }

  render(){

    let prev=(count:number)=>{
      let counter=count;
      counter--

      if(counter==0)return
      this.setState({
        count:counter,
        selectedMonth:counter,
        selectedDate: new Date((new Date).getFullYear(), counter-1,(new Date).getDate())
      },()=>updateWeeks(0,this.state.selectedMonth))
      
    }
    let next=(count:number)=>{
      let counter=count;
      counter++
      if(counter>=12)counter=12
      this.setState({
        count:counter,
        selectedMonth:counter,
        selectedDate:new Date((new Date).getFullYear(), counter-1,(new Date).getDate())
      },()=>{
        updateWeeks(0,counter)
      })
      
    }
    let updateWeeks=(n:number,count:number)=>{
      const weeks= dates.weeksByMonth;
      const month = dates.firstLastDayOfMonth;

      if(n!==0 && count>=0){
        this.setState({
          selectedWeek:weeks(month(1,count-1),month(0,count),false,n),
          weekIsSelected:true
        })
      }else if(n===0 && count>=0){
        this.setState({
          selectedWeek:weeks(month(1,count-1),month(0,count),true),
          weekIsSelected:false
        })       
      }else{
        return 
      }
    }

    let checkDates=(from:string, to:string, selectedDate:string):boolean=>{

      const start = new Date(from).getMonth();
      const end = new Date(to).getMonth();
      const selected = new Date(selectedDate).getMonth();
      const startNumber:number = Number(start);
      const endNumber:number = Number(end);
      const selectedNumber:number = Number(selected);
      
      if(startNumber=== 0 || endNumber === 0){
        return false;
      }
      else if(startNumber<=selectedNumber && selectedNumber<=endNumber ){
        return true;
      }else{
        return false;
      }
  
    }

    let handleDatePicker=(day:number, month:number)=>{
      
      this.setState({
        selectedDate: new Date(new Date().getFullYear(), month, day)
      }) 
    }


    return (
      <div>
        <header>
          <Navbar color="light" light expand="md" className="clearfix border-bottom border-secondary">
            <div className="mh-36 pr-2 float-left border-right border-secondary ">
              <NavbarBrand className="mx-3 text-center " href="/"><h1>Holiday Tracker</h1></NavbarBrand>
                <blockquote className="blockquote">
                  <footer className="blockquote-footer text-center"> Today is {this.state.dates.now.toString().slice(0,15)}</footer>
                </blockquote>
            </div>
            <Nav className="w-50 mx-auto" navbar pills>
              <NavItem className="mx-auto">
                  <NavLink href="#">
                    <h3>HOME</h3>
                  </NavLink>
              </NavItem>
              <NavItem className="mx-auto">
                  <NavLink href="#" onClick={this.toggle}>
                     <h3>NEW</h3> 
                  </NavLink>
              </NavItem>
              <NavItem className="mx-auto">
                  <NavLink href="#">
                      <h3>CREDITS</h3>
                  </NavLink>
              </NavItem>
            </Nav>
          </Navbar>
        </header>
        <section className="mt-5">
          <Row>
            <Col md="12">
              <HolidayTableComponent prev={(count)=>prev(count)} next={next} count={this.state.selectedMonth} month={dates.months[this.state.selectedMonth-1]} dates={this.state.selectedWeek} handleDatePicker={handleDatePicker}/> 
            </Col>
          </Row>
          <Row>
            <Col md="12">
              {this.state.list!== undefined? this.state.listValues.map(item=>{
                if(checkDates(item.from, item.to, this.state.selectedDate.toString())
                && item.email === this.props.context.pageContext.user.email){
                  
                return <ul className="list">
                        <li className="listItem">
                          <div className={item.approved?"border-left border-bottom border-success list":"border-left border-bottom border-danger list"}>
                            <Table>
                              <thead>
                                <th>Request:</th>
                                <th>E-mail:</th>
                                <th>Agent Name:</th>
                                <th>from:</th>
                                <th>to:</th>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <p>{item.Title}</p>
                                  </td>
                                  <td>
                                    <p>{item.email}</p>
                                  </td>
                                  <td>
                                    <p>{item.sykj}</p>
                                  </td>
                                  <td>
                                    <p>{new Date(item.to).getDate()}-{this.state.dates.months[new Date(item.to).getMonth()]}</p>
                                  </td>
                                  <td>
                                    <p>{new Date(item.to).getDate()}-{this.state.dates.months[new Date(item.to).getMonth()]}</p>
                                  </td>
                                </tr>
                              </tbody>
                              <tfoot >
                                <tr >
                                  <td colSpan={2}><Button className="bg-warning">Delete</Button></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                
                              </tfoot>
                            </Table>
                          </div>
                          
                        </li>
                      </ul>
                }else{return null}
              }):<h2>No data available, please refresh</h2>}
              
            </Col>
          </Row>
          <HolidayNewModal 
            className="" 
            toggle={this.toggle} 
            modal={this.state.modal} 
            context={this.state.context} 
            siteUrl={this.props.siteUrl} 
            prev={(count)=>prev(count)} 
            next={next} 
            count={this.state.selectedMonth} 
            month={dates.months[this.state.selectedMonth-1]} 
            dates={this.state.selectedWeek} 
            handleDatePicker={handleDatePicker} 
            dateChosen={this.state.selectedDate} 
            datePickerTo={this.state.datePickerTo} 
            toggleDataPickerTo={this.toggleDataPickerTo} 
            datePickerFrom={this.state.datePickerFrom} 
            toggleDataPickerFrom={this.toggleDataPickerFrom}
            checkRequest={this.checkAgainstPreviousRequests}
            getLists={this.getSpecificList}
            > {this.props.children}</HolidayNewModal>
        </section>
      </div>
    );
  }
}
export default HolidayTracker;
