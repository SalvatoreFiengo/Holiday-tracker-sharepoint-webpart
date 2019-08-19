import * as React from 'react';
import {Navbar, NavbarBrand, Nav, NavItem, NavLink, Row, Col, Card, Button} from 'reactstrap';
import './HolidayTracker.scss'
import Iuser from '../../interfaces/Iusers';
import Idates from '../../interfaces/Idates';
import  IHelloUserPart  from '../../interfaces//IwebPart';
import {IHolidayTrackerProps} from '../components/IHolidayTrackerProps'

import HolidayTableComponent from '../components/holidayTableComponent';
import HolidayNewModal from '../components/holidayNewModal';
import HolydayNewForm from '../components/holidayNewForm';
import dates from '../../variables/dates';
import usersMock from '../../variables/usersMock';
import MockHttpClient from './mockLists';

import {
  SPHttpClient,
  SPHttpClientResponse   
} from '@microsoft/sp-http';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';


export interface IState {
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
  list: ISPList
};

export interface ISPList {
  Title: string;
  Id: string;  
}
export interface ISPLists{
  value: ISPList[]
}
class HolidayTracker extends React.Component<IHolidayTrackerProps,IState> {
    
  constructor(props:IHolidayTrackerProps){
    super(props)
  
    this.state={
      error: null,
      webPartData: "loading",
      isWDataValid: false,
      user: [usersMock],
      dates: dates,
      weeks: dates.weeksByMonth(dates.firstLastDayOfMonth(1),dates.firstLastDayOfMonth(0),true),
      modal: false,
      selectedWeek: dates.weeksByMonth(dates.firstLastDayOfMonth(1,dates.now.getMonth()),dates.firstLastDayOfMonth(0,dates.now.getMonth()),true),
      weekIsSelected: false,
      selectedMonth:  dates.now.getMonth(),
      count:dates.now.getMonth(),
      listLoaded: false,
      lists: [{Title:"",Id:""}],
      list: {Title:"", Id:""}
    }
    this.toggle = this.toggle.bind(this);
  };

  toggle() {
    this.setState(prevState=>({
      modal: !prevState.modal
    }));
  }


  public componentDidMount(): void {
    this._renderListAsync();
    fetch(
        '../../_api/web/currentuser',
        {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'accept': 'application/json'
            }
        }
        ).then(response => {
            return response.json();
        }).then(json => {

            this.setState({ webPartData: json.Title, isWDataValid: true });
        }).catch(e => {
            console.log(e);
        });
  }

  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient.get()
      .then((data: ISPList[]) => {
        var listData: ISPLists = {value: data};
        return listData;
      }) as Promise<ISPLists>;
  }

  getSpLists=(response)=>{
    this.setState({
      lists: response,
    }, function(){console.log("response:"+this.state.lists[0].Title)})
  }

  _getListData(): Promise<ISPLists> {
    if(this.context !== undefined){
      return this.props.spHttpClient.get(this.props.siteUrl + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        });
    }
  }

  private _renderListAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
        this._getMockListData().then((response) => {
          this.getSpLists(response.value)
      }).catch(error =>this.setState({error: error, listLoaded: true}));
    }
    else if ((Environment.type == EnvironmentType.SharePoint || 
              Environment.type == EnvironmentType.ClassicSharePoint)) {
      this._getListData().then((response) => {

          this.getSpLists(response.value)

          }).catch(error =>this.setState({error: error, listLoaded: true}));    
    }
  }

  render(){

    let prev=(count:number)=>{
      let counter=count;
      counter--

      if(counter==0)return
      this.setState({
        count:counter,
        selectedMonth:counter
      },()=>updateWeeks(0,this.state.selectedMonth))
      
    }
    let next=(count:number)=>{
      let counter=count;
      counter++
      if(counter>=12)counter=12
      this.setState({
        count:counter,
        selectedMonth:counter
      },()=>updateWeeks(0,counter))
      
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
              <HolidayTableComponent prev={(count)=>prev(count)} next={next} count={this.state.selectedMonth} month={dates.months[this.state.selectedMonth-1]} user={this.state.user} dates={this.state.selectedWeek}/> 
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Button onClick={()=>this._renderListAsync()}>Update lists</Button>
              
              {this.state.error? <p>{this.state.error}</p>:null}
              {this.state.listLoaded? <div>...Loading</div>:
                this.state.lists.map(item=>
                <ul className="list">
                  <li className="listItem" key={item.Id}>{item.Title}</li> 
                </ul>
                )}
              
            </Col>
          </Row>
          <HolidayNewModal className="" toggle={this.toggle} modal={this.state.modal} >
            <HolydayNewForm/>
          </HolidayNewModal>
        </section>
      </div>
    );
  }
}
export default HolidayTracker;