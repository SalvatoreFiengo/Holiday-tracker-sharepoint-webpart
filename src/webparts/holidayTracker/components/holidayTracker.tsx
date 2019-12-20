import * as React from 'react';

import {
  Navbar, 
  NavbarBrand, 
  Nav, 
  NavItem, 
  NavLink, 
  Form,Row, 
  Col, 
  FormGroup, 
  Input,Label, 
  Button, 
  Collapse, 
  Modal, 
  ModalBody, 
  ModalHeader,
  CardGroup,
  Card,
  CardHeader,
  CardBody,
  CardText,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import './HolidayTracker.scss';

import Idates from '../../interfaces/Idates';
import  IHelloUserPart  from '../../interfaces//IwebPart';
import {IHolidayTrackerProps} from '../components/IHolidayTrackerProps';

import HolidayTableComponent from '../components/holidayTableComponent';
import HolidayNewModal from '../components/holidayNewModal';
import SupervsorsDashboard from '../components/supervisorsDashboard';
import DataTable from '../components/dataTable';
import dates from '../../variables/dates';
import usersMock from '../../variables/usersMock';

import * as crud from './crudService';

import { WebPartContext } from '@microsoft/sp-webpart-base';


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
  selectedLob:any;
  lobIsSelected:boolean;
  teamStructure:boolean;
  supervisorArea:boolean;
  dropdownOpen:boolean;
  dayBordered:boolean;
  dayFromCalendar:number;
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
      dataTableFilter:this.props.context.pageContext.user.email,
      selectedLob:[],
      lobIsSelected:false,
      teamStructure:false,
      supervisorArea:false,
      dropdownOpen:false,
      dayBordered:false,
      dayFromCalendar:undefined
    };
    this.toggle = this.toggle.bind(this);
    this.checkAgainstPreviousRequests=this.checkAgainstPreviousRequests.bind(this);
    this.getSpecificList= this.getSpecificList.bind(this);
    this.handleDatePicker=this.handleDatePicker.bind(this);
    this.selectHandleSubmit = this.selectHandleSubmit.bind(this);
    this.setLists= this.setLists.bind(this)
    this.toggleSupervisorsArea=this.toggleSupervisorsArea.bind(this);
    this.toggleDropDown=this.toggleDropDown.bind(this)
  }
  
  private toggleDropDown = () => this.setState((prevState) => ({dropdownOpen:!prevState.dropdownOpen}));

  private selectHandleSubmit(event){
    
    let option;
    option= event.target.value;
    if(option==="None"){
        this.setState({
          selectedLob: this.state.user.lob,
          lobIsSelected: false,
          teamStructure: false
        },()=>console.log("selected lobs: "+this.state.selectedLob))
    }
    else{
      this.setState({
          selectedLob: option,
          lobIsSelected: true
        },()=>console.log("selected lobs: "+this.state.selectedLob))
      }
  }
  private toggle() {
    this.setState(prevState=>({
      modal: !prevState.modal,
      dayFromCalendar: undefined
    }));
  }
  public toggleSupervisorsArea(){
    this.setState((prevState)=>({
      supervisorArea:!prevState.supervisorArea
    }))
  }
  public handleDatePicker(day:number, month:number, year:number, all=false){
    if(all){
      this.setState({
        selectedDate: new Date(year, month, day),
        dayCheck: false,
        dayBordered: false,
        dayFromCalendar:undefined 
      });
    }else{ 
      this.setState({
        selectedDate: new Date(year, month, day),
        dayCheck: true,
        dayBordered: true,
        dayFromCalendar:day
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
    this._renderSpecificListAsync('Agents', this.state.context, this.state.siteUrl);
    this.setState({
      selectedLob:this.state.user.lob
    })

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
          const dateYearFrom = new Date(request.from).getFullYear();
          const itemDateYearFrom = new Date(item.from).getFullYear();
          const dateYearTo = new Date(request.to).getFullYear();
          const itemDateYearTo = new Date(item.to).getFullYear();
          if((dateFrom>=itemDateFrom 
          && dateFrom<=itemDateTo 
          || dateTo>=itemDateFrom)
          && (dateMonthFrom === itemDateMonthFrom || dateMonthTo === itemDateMonthTo)
          && (dateMonthFrom === itemDateMonthTo || dateMonthTo === itemDateMonthFrom)
          && (dateYearFrom === itemDateYearTo || dateYearTo === itemDateYearFrom)){
            alert("Request invaid. Please check whether you have older requests for same period");
            
            return false;
  
          }
          else{
           
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
        && (startDateMonth===selectedDateMonth || selectedDateMonth===endDateMonth )
        && (startDateYear===selectedDateYear || endDateYear===selectedDateYear)){
          //->list In State of dates --> reflected on caledar with colours?
          
        return true;
      }else{
        
        return false;
      }
    }
    else if((startDateMonth===selectedDateMonth || selectedDateMonth===endDateMonth) 
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
  private setLists=(list,res)=>{
    if(list === 'ooo_test'){
      return this.setState({
        listValues: this.getSpecificList(res)
      });
    }else if(list === 'Agents'){
      return this.setState({
        usersList: this.getSpecificList(res)
      },()=>console.log("list update? "+this.state.usersList[0].agentName));
    } 
  }
  public _renderSpecificListAsync(list,ctx, siteUrl) {
    crud._getSpecificList(list,ctx, siteUrl)
    .then((res)=>this.setLists(list,res))
    .then(()=>{
      this.state.usersList.map(item=>{
        
        if(item.agentEmail == this.props.context.pageContext.user.email){
        return this.setState({
          user:item
        });
        }else{
          return
        }
      })
    })
  }

  public filteredTeamText(){
    if(this.state.lobIsSelected){
      return <h6>(Data filtered by <em>{this.state.selectedLob}</em>)</h6>;
    }else if(this.state.dataTableFilter==this.state.user.lob){
      return <h6>(Data filtered by <em>{this.state.user.lob}</em>)</h6>;
    }else if(this.state.dataTableFilter==this.props.context.pageContext.user.email && this.state.lobIsSelected===false){
      return <h6>(Data filtered by your email address)</h6>;
    }else{
      return null;
    }
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



    return (
      <div>
        <header>
          <Row>
            <Col md="12">
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
                          <h3>New Leave Request</h3> 
                        </NavLink>
                    </NavItem>
                    {this.state.usersList.map((item)=>{
                      if(item.agentEmail===this.props.context.pageContext.user.email && item.admin || 
                        item.agentEmail===this.props.context.pageContext.user.email && item.supervisor){
                          return (<NavItem className="mx-auto">
                                    <NavLink href="#" onClick={this.toggleSupervisorsArea}>
                                        <h3>Supervisor Area</h3> 
                                    </NavLink>
                                  </NavItem>)
                        }
                      })
                    }
                  </Nav>
              </Navbar>
            </Col>
          </Row>
          {this.state.supervisorArea?
          <Row>
            <Col md="12" className="mt-3">
              <Row>
                <Col md="4">
                <Card body inverse color="primary" className="ml-3">
                  <CardHeader className="customPointer" onClick={()=>this.setState({
                            dataTableFilter: this.props.context.pageContext.user.email,
                            lobIsSelected:false,
                            teamStructure:false
                        })}>My Leave Requests</CardHeader>
                </Card>
                </Col>
                <Col md="4">
                  <Card body inverse color="info">
                    <CardHeader className="h-100 customPointer" onClick={()=>this.setState({
                              dataTableFilter: this.state.user.lob,
                              lobIsSelected:false,
                              selectedLob:this.state.user.lob
                          })}>{this.state.user.lob} Leave Requests</CardHeader>
                  </Card>
                </Col>
                <Col md="4" >
 
                  <Card body inverse color="success" className="mr-3">
                    <CardHeader >
                     <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                        <DropdownToggle className="bg-transparent border-0 p-0 customDropMenu" caret>
                          Line of Buisness
                        </DropdownToggle>
                        <DropdownMenu>
                          {this.state.usersList
                                .reduce((acc,item)=>acc.includes(item)?acc:[...acc,item], [])
                                .map(item=>[...item.lob])
                                .reduce((acc,lob)=>acc.includes(lob)?acc:[...acc,lob], [])
                                .map(lob=>{return <DropdownItem className="text-center customDropDown" key={lob.name} onClick={()=>this.selectHandleSubmit(event)} value={lob}>{lob}</DropdownItem>})
                              }
                        </DropdownMenu>
                      </Dropdown>
                    </CardHeader>
                  </Card> 
                </Col> 
              </Row>
              <Row>
                <Col md="12">
                {this.state.lobIsSelected || this.state.dataTableFilter==this.state.user.lob?
                  <Card body inverse color={this.state.lobIsSelected==false?"info":"success"} className="w-100 mt-3 mb-3 text-center">
                    <CardHeader >{this.state.dataTableFilter} Leave Requests</CardHeader>
                    <CardBody>

                        <Button 
                            className={this.state.lobIsSelected==false?"btn-sm bg-secondary text-white":"btn-sm bg-white text-dark"}
                            onClick={()=>{
                            this.setState((prevState)=>({
                              teamStructure:!prevState.teamStructure
                            }))}}>Go To: <em>{this.state.selectedLob?this.state.selectedLob:this.state.dataTableFilter}</em> {this.state.teamStructure?"Leave Requests":"Structure"}</Button>
                    </CardBody>
                  </Card>:null}
                </Col>
              </Row>
            </Col>
          </Row>:null} 
        </header>
        <section className="mt-5 container-fluid">

          <Row>
            <Col md="12">
              {this.state.lobIsSelected || this.state.dataTableFilter==this.state.user.lob?
              <Collapse isOpen={this.state.teamStructure}>
                <SupervsorsDashboard 
                  user={this.state.user} 
                  usersList={this.state.usersList} 
                  selectedLob= {this.state.selectedLob?this.state.selectedLob:this.state.dataTableFilter}
                  getLists={this.getSpecificList}
                  setLists={this.setLists}
                  context={this.state.context} 
                  siteUrl={this.props.siteUrl}>
                </SupervsorsDashboard>
              </Collapse>:null}
            </Col>
          </Row>
          <Collapse isOpen={!this.state.teamStructure}>
            <Row className="mb-5"> 
                <Col md="12">
                  <HolidayTableComponent 
                    prev={(count)=>prev(count)} 
                    next={next} 
                    count={this.state.selectedMonth} 
                    month={dates.months[this.state.selectedMonth-1]} 
                    year={this.state.selectedYear} 
                    dates={this.state.selectedWeek} 
                    handleDatePicker={this.handleDatePicker}
                    listValues={this.state.listValues}
                    optionalAll={true}
                    dayBordered={this.state.dayBordered}
                    dayFromCalendar={this.state.dayFromCalendar}/> 
                </Col>
            </Row>
            <Row>
              <Col md={{size: 6, offset: 3}} className="text-center">
                {this.filteredTeamText()}
              </Col>
            </Row>
            <Row>
              <DataTable 
                dates={this.state.dates} 
                list={this.state.list}
                dataTableFilter={this.state.dataTableFilter} 
                listValues={this.state.listValues} 
                selectedDate={this.state.selectedDate} 
                dayCheck={this.state.dayCheck} 
                checkDates={this.checkDates} 
                deleteItem={this.deleteItem} 
                approveItem={this.approveItem}
                getSpecificList={this.getSpecificList}
                context={this.state.context}
                siteUrl={this.state.siteUrl}
                userEmail={this.props.context.pageContext.user.email}
                user={this.state.user}
                lobIsSelected={this.state.lobIsSelected}
                lob={this.state.selectedLob}>
              </DataTable>
            </Row> 
          </Collapse>

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
            setLists={this.setLists}
            listValues={this.state.listValues}
            usersList={this.state.usersList}
            dayBordered={this.state.dayBordered}
            dayFromCalendar={this.state.dayFromCalendar}
          > {this.props.children}</HolidayNewModal>
        </section>
      </div>
    );
  }
}
export default HolidayTracker;
