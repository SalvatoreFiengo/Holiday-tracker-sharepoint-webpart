import * as React from 'react';

import {Navbar, NavbarBrand, Nav, NavItem, NavLink, Table,Row, Col, Card, Button} from 'reactstrap';
import './HolidayTracker.scss';
import Iuser from '../../interfaces/Iusers';
import Idates from '../../interfaces/Idates';
import  IHelloUserPart  from '../../interfaces//IwebPart';
import {IHolidayTrackerProps} from '../components/IHolidayTrackerProps';

import HolidayTableComponent from '../components/holidayTableComponent';
import HolidayNewModal from '../components/holidayNewModal';
import DataTable from '../components/dataTable';
import dates from '../../variables/dates';
import usersMock from '../../variables/usersMock';
import MockHttpClient from './mockLists';
import * as crud from './crudService';

import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPComponentLoader } from '@microsoft/sp-loader';
import {
  SPHttpClient,
  SPHttpClientResponse   
} from '@microsoft/sp-http';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import { any } from 'prop-types';

export interface IState {
  context: WebPartContext;
  siteUrl: string;
  error: string;
  webPartData:IHelloUserPart["data"];
  isWDataValid:IHelloUserPart["isValid"];
  user:any;
  dates:Idates;
  weeks:number[];
  modal: boolean;
  selectedWeek: number[];
  weekIsSelected:boolean;
  selectedMonth:number;
  selectedYear:number;
  count:number;
  listLoaded: boolean;
  lists: [ISPList];
  list: ISPList;
  listValues: any;
  usersList: any;
  userName:string;
  supervisor:boolean;
  selectedDate:Date;
  from:string;
  datePickerTo: boolean;
  datePickerFrom: boolean;
  dayCheck:boolean;
  request:{};
  dataTableFilter:any;

}

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
  value: ISPList[];
}
class HolidayTracker extends React.Component<IHolidayTrackerProps,IState> {
  
  constructor(props:IHolidayTrackerProps){
    super(props);
  
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
      selectedYear: dates.now.getFullYear(),
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
      usersList: [],
      userName:"",
      selectedDate:dates.now,
      from:"",
      datePickerTo: false,
      datePickerFrom: false,
      dayCheck: false,
      request:{},
      supervisor:false,
      dataTableFilter:this.props.context.pageContext.user.email
    };
    this.toggle = this.toggle.bind(this);
    this.checkAgainstPreviousRequests=this.checkAgainstPreviousRequests.bind(this);
    this.getSpecificList= this.getSpecificList.bind(this);
    this.handleDatePicker=this.handleDatePicker.bind(this);
  }

  private toggle() {
    this.setState(prevState=>({
      modal: !prevState.modal
    }));

  }
  public handleDatePicker(day:number, month:number, all=false){
    if(all){
      this.setState({
        selectedDate: new Date(new Date().getFullYear(), month, day),
        dayCheck: false
      });
    }else{ 
      this.setState({
        selectedDate: new Date(new Date().getFullYear(), month, day),
        dayCheck: true
      }); 
    }
  };
  
  public toggleDataPickerTo=()=>{
    this.setState(prevState=>({
      datePickerTo: !prevState.datePickerTo
    }));
  }
  public toggleDataPickerFrom=()=>{
    this.setState(prevState=>({
      datePickerFrom: !prevState.datePickerFrom
    }));
  }

  public componentDidMount(): void {
    this._renderSpecificListAsync('ooo_test', this.state.context, this.state.siteUrl);
    this._renderSpecificListAsync('agents', this.state.context, this.state.siteUrl);
  }

  public checkAgainstPreviousRequests(request):boolean {
    for (let i=0; i<this.state.listValues.length;i++){
        let item = this.state.listValues[i];
        if(request.sykj === item.sykj || request.email === item.email){
          const dateFrom = new Date(request.from).getDate();
          const dateTo= new Date(request.to).getDate();
          const itemDateFrom = new Date(item.from).getDate();
          const itemDateTo = new Date(item.to).getDate();
          const dateMonthFrom = new Date(request.from).getMonth();
          const dateMonthTo= new Date(request.to).getMonth();
          const itemDateMonthFrom = new Date(item.from).getMonth();
          const itemDateMonthTo = new Date(item.to).getMonth();
          if((dateFrom>=itemDateFrom && dateFrom<=itemDateTo || dateTo>=itemDateFrom && dateTo<=itemDateTo)
          && (dateMonthFrom === itemDateMonthFrom || dateMonthTo === itemDateMonthTo)
          && (dateMonthFrom === itemDateMonthTo || dateMonthTo === itemDateMonthFrom)){
            alert("Request invaid. Please check whether you have older requests for same period");
            console.log(dateMonthFrom)
            return false;
  
          }
          else{
            console.log("else"+dateMonthFrom)
            this.setState({
              request: request,
            });
            return true;
          }
        }
      }
    }

  public checkDates=(from:string, to:string, selectedDate:string, dayCheck=false):boolean=>{

    const startDateDay = new Date(from).getDate();
    const endDateDay = new Date(to).getDate();
    const selectedDateDay= new Date(selectedDate).getDate();

    const startDateMonth = new Date(from).getMonth();
    const endDateMonth = new Date(to).getMonth();
    const selectedDateMonth = new Date(selectedDate).getMonth();

    const startDateYear = new Date(from).getFullYear();
    const endDateYear = new Date(to).getFullYear();
    const selectedDateYear = new Date(selectedDate).getFullYear();
    if(dayCheck){
      if((startDateDay<=selectedDateDay && selectedDateDay<=endDateDay) 
        && (startDateMonth === selectedDateMonth || endDateMonth === selectedDateMonth)
        && (startDateYear === selectedDateYear || endDateYear === selectedDateYear)){
          //->list In State of dates --> reflected on caledar with colours?
        return true;
      }else{
        return false;
      }
    }
    else if((startDateMonth===selectedDateMonth && selectedDateMonth===endDateMonth) 
      && (startDateYear===selectedDateYear || endDateYear === selectedDateYear)){

        return true;
    }
    else{
      return false;
    }

  };


  private getSpLists=(response)=>{
    this.setState({
      lists: response,
    }, ()=>{console.log("list updated");});
  }

  public getSpecificList=(response)=>{
    let values=Object.keys(response.value).map(item=>response.value[item]);
    return values
  }
  
  private approveItem = (list, ctx, siteUrl, id, approval):Promise<ISPList>=>{

    return crud._updateItemApproval('ooo_test',ctx, siteUrl, id, approval);
  }

  private deleteItem=(ctx, siteUrl, id):Promise<ISPList>=>{

    return crud._deleteItem('ooo_test',ctx, siteUrl, id);
  }

  public _renderSpecificListAsync(list,ctx, siteUrl) {
    crud._getSpecificList(list,ctx, siteUrl).then((res)=>{
      if(list === 'ooo_test'){
        this.setState({
          listValues: this.getSpecificList(res)
        });
      }else if(list === 'agents'){
        this.setState({
          usersList: this.getSpecificList(res)
        },()=>{console.log(this.state.usersList[this.props.context.pageContext.user.email])})
      } 
    }).then(()=>{
      this.state.usersList.map(item=>{
        if(item.agentEmail == this.props.context.pageContext.user.email){
        this.setState({
          user:item
        });
        }else{
          return
        }
      })
    })
  }

  public render(){

    let prev=(count:number)=>{
      let counter=count;
      counter--;
      let selectedYear = this.state.selectedYear;
      if(counter==0){
        counter=12;
        selectedYear--;
      };
      this.setState({
        count:counter,
        selectedYear: selectedYear,
        selectedMonth:counter,
        selectedDate: new Date(selectedYear, counter-1,(new Date).getDate())
      },()=>updateWeeks(0,this.state.selectedMonth));
      
    };
    let next=(count:number)=>{
      let counter=count;
      let selectedYear = this.state.selectedYear
      counter++;
      if(counter>12){
        counter=1;
        selectedYear++;
      };
      this.setState({
        count:counter,
        selectedYear: selectedYear,
        selectedMonth:counter,
        selectedDate:new Date(selectedYear, counter-1,(new Date).getDate())
      },()=>{
        updateWeeks(0,counter);
      });
      
    };
    let updateWeeks=(n:number,count:number)=>{
      const weeks= dates.weeksByMonth;
      const month = dates.firstLastDayOfMonth;
      const year = this.state.selectedYear

      if(n!==0 && count>=0){
        this.setState({
          selectedWeek:weeks(month(1,count-1,year),month(0,count,year),false,n),
          weekIsSelected:true
        });
      }else if(n===0 && count>=0){
        this.setState({
          selectedWeek:weeks(month(1,count-1,year),month(0,count,year),true),
          weekIsSelected:false
        });       
      }else{
        return; 
      }
    };

    let checkDates=(from:string, to:string, selectedDate:string, dayCheck=false):boolean=>{

      const startDateDay = new Date(from).getDate();
      const endDateDay = new Date(to).getDate();
      const selectedDateDay= new Date(selectedDate).getDate();

      const startDateMonth = new Date(from).getMonth();
      const endDateMonth = new Date(to).getMonth();
      const selectedDateMonth = new Date(selectedDate).getMonth();

      const startDateYear = new Date(from).getFullYear();
      const endDateYear = new Date(to).getFullYear();
      const selectedDateYear = new Date(selectedDate).getFullYear();
      if(dayCheck){
        if((startDateDay<=selectedDateDay && selectedDateDay<=endDateDay) 
          && (startDateMonth === selectedDateMonth || endDateMonth === selectedDateMonth)
          && (startDateYear === selectedDateYear || endDateYear === selectedDateYear)){
            //->list In State of dates --> reflected on caledar with colours?
          return true;
        }else{
          return false;
        }
      }
      else if((startDateMonth===selectedDateMonth && selectedDateMonth===endDateMonth) 
        && (startDateYear===selectedDateYear || endDateYear === selectedDateYear)){

          return true;
      }
      else{
        return false;
      }
  
    };

    return (
      <div>
        <header>
          <Navbar color="light" light expand="md" className="clearfix border-bottom border-secondary">
            <div className="mh-36 pr-2 float-left border-right border-secondary ">
              <NavbarBrand className="mx-3 text-center " href="/"><h1>Holiday Tracker</h1></NavbarBrand>
                <blockquote className="blockquote">
                  <footer className="blockquote-footer text-center"> Today is {this.state.dates.now.getDate()}-{dates.months[this.state.dates.now.getMonth()]}-{this.state.dates.now.getFullYear()}</footer>
                </blockquote>
            </div>
              <Nav className="w-50 mx-auto text-center" navbar pills>
                <NavItem className="mx-auto">
                    <NavLink href="#" onClick={this.toggle}>
                      <h3>Add Holiday</h3> 
                    </NavLink>
                </NavItem>
                {this.state.usersList.map((item)=>{
                  if(item.agentEmail===this.props.context.pageContext.user.email && item.admin || 
                    item.agentEmail===this.props.context.pageContext.user.email && item.supervisor){
                      return (<NavItem className="mx-auto">
                                <NavLink href="#">
                                    <h3>Supervisor Area</h3> 
                                </NavLink>
                              </NavItem>)
                  }
                })
                }
              </Nav>
          </Navbar>
        </header>
        <section className="mt-5">
          <Row className="mb-5">
            <Col md="12">
              <HolidayTableComponent 
                prev={(count)=>prev(count)} 
                next={next} count={this.state.selectedMonth} 
                month={dates.months[this.state.selectedMonth-1]} 
                year={this.state.selectedYear} 
                dates={this.state.selectedWeek} 
                handleDatePicker={this.handleDatePicker}
                listValues={this.state.listValues}
                optionalAll={true}/> 
            </Col>
          </Row>
          <Row>
            <Col md={{size: 6, offset: 3}}>
              {this.state.dataTableFilter!==this.props.context.pageContext.user.email?<h4>List below is filtered by {this.state.user.lob}</h4>:<h4>List below is filtered by your email address</h4>}
              {this.state.supervisor?<h4>List below is not filtered</h4>:null}
            </Col>
          </Row>
          <Row>
            <DataTable 
              dates={this.state.dates} 
              list={this.state.list}
              userEmail={this.state.dataTableFilter} 
              listValues={this.state.listValues} 
              selectedDate={this.state.selectedDate} 
              dayCheck={this.state.dayCheck} 
              checkDates={checkDates} 
              deleteItem={this.deleteItem} 
              approveItem={this.approveItem}
              getSpecificList={this.getSpecificList}
              context={this.state.context}
              siteUrl={this.state.siteUrl}
              user={this.state.user}>
            </DataTable>
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
            year={this.state.selectedYear}
            dates={this.state.selectedWeek} 
            handleDatePicker={this.handleDatePicker} 
            dateChosen={this.state.selectedDate} 
            datePickerTo={this.state.datePickerTo} 
            toggleDataPickerTo={this.toggleDataPickerTo} 
            datePickerFrom={this.state.datePickerFrom} 
            toggleDataPickerFrom={this.toggleDataPickerFrom}
            checkRequest={this.checkAgainstPreviousRequests}
            getLists={this.getSpecificList}
            listValues={this.state.listValues}
            > {this.props.children}</HolidayNewModal>
        </section>
      </div>
    );
  }
}
export default HolidayTracker;
