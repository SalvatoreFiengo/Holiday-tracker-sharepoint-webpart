import * as React from 'react';
import * as crud from './crudService';
import { Button, Form, FormGroup, Label, Input, FormText, Collapse } from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import HolidayTableComponent from './holidayTableComponent';

import dates from '../../variables/dates';

interface InewFormProps {
  createItem: (ctx, siteUrl, request)=>void,
  context: WebPartContext,
  siteUrl:string,
  dates: number[],
  month: string,
  prev:(count:number)=>void,
  next:(count:number)=>void,
  count:number,
  dateChosen:Date,
  handleDatePicker:(date, number) =>void,
  datePickerTo: boolean,
  datePickerFrom: boolean,
  toggleDataPickerTo: ()=>void,
  toggleDataPickerFrom: ()=>void
  toggle:()=>void,
}

interface IformState {
  [x:string]: string  
}


export default class HolidayForm extends React.Component<InewFormProps, IformState> {
  inputNode: any;
  constructor(props){
    super(props);

    this.state = {
        agentEmail: this.props.context.pageContext.user.email,
        agentName: this.props.context.pageContext.user.displayName,
        leaveSelect: "",
        comments: "",
        lobSelect:"",
        from:"",
        to:"", 
        dateValidity:""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange= (event)=> {
    
    let key:string = event.target.id;
    let value:string = event.target.value
    this.setState({
      [key]:value
    });

  }


  handleSubmit(event) {
    event.preventDefault();
    const request = {
      email : event.target.email.value,
      leaveSelect: event.target.selectReqType.value,
      lobSelect: event.target.selectLob.value,
      comments: event.target.comments.value,
      from : new Date(this.state.from),
      to: new Date(this.state.to)

    }
    this.props.createItem(this.props.context,this.props.siteUrl,request)
    
    this.props.toggle()
    

  }

  handleDatePickerForm=(date,month)=>{
    const selected = new Date(new Date().getFullYear(), month, date).toISOString()
    this.setState({
      from: selected
    })
  }
  handleDatePickerTo=(date,month)=>{
    const selected = new Date(new Date().getFullYear(), month, date).toISOString()
    
    this.setState({
      to: selected,
      dateValidity:this.checkDateValidity(selected, this.state.from)
    })
  }

  checkDateValidity=(from, to)=>{
    console.log(new Date(from).getDate() +" is less than "+new Date(to).getDate())
    if(from === "" || to === ""){
      return 'text-warning'
    }
    if (new Date(from).getDate()< new Date(to).getDate()){
      return 'text-danger'
    }
    else{
      return 'text-success'
    }
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label for="agentName">Agent Name</Label>
          <Input type="email" name="email" id="agentName" placeholder="name" value={this.state.agentName} onChange={this.handleChange}/>
        </FormGroup>
        <FormGroup>
          <Label for="agentEmail">Agent Requesting Holidays (E-mail)</Label>
          <Input type="email" name="email" id="agentEmail" placeholder="e-mail@domain.com" value={this.state.agentEmail} onChange={this.handleChange}/>
        </FormGroup>
        <FormGroup>
          <Label for="leaveSelect">Request Type</Label>
          <Input type="select" name="selectReqType" id="leaveSelect" value={this.state.leaveSelect} onChange={this.handleChange}>
            <option value="Sick Day">Sick Day</option>
            <option value="Annual Leave">Annual Leave</option>
            <option value="Maternity Leave">Maternity Leave</option>
            <option value="Charity Leave">Charity Leave</option>
            <option value="Study Leave">Study Leave</option>
          </Input>
        </FormGroup>    
        <FormGroup>
        <Button onClick={()=>this.props.toggleDataPickerFrom()} id="from" className="d-inline-block">From: </Button>
          <span className="d-inline-block border text-center w-50 ml-5"> <p className={this.state.dateValidity}>{this.state.from.slice(0,15)}</p></span>
          <Collapse isOpen={this.props.datePickerFrom}>
            <HolidayTableComponent prev={(count)=>this.props.prev(count)} next={this.props.next} count={this.props.count} month={this.props.month} dates={this.props.dates} handleDatePicker={this.handleDatePickerForm}></HolidayTableComponent>
         </Collapse>
        </FormGroup>
        <FormGroup>
          <Button onClick={()=>this.props.toggleDataPickerTo()} id="to" className="d-inline-block">To: </Button>
          <span className="d-inline-block border text-center w-50 ml-5"> <p className={this.state.dateValidity}>{this.state.to.slice(0,15)}</p> </span>
          <Collapse isOpen={this.props.datePickerTo}>
            <HolidayTableComponent prev={(count)=>this.props.prev(count)} next={this.props.next} count={this.props.count} month={this.props.month} dates={this.props.dates} handleDatePicker={this.handleDatePickerTo}></HolidayTableComponent>
          </Collapse>
        </FormGroup>
        <FormGroup>
          <Label for="lob">LOB</Label>
          <Input type="select" name="selectLob" id="lobSelect" value={this.state.lobSelect} onChange={this.handleChange}>
            <option>CBO</option>
            <option>MSA</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="comments">Comments</Label>
          <Input type="textarea" name="text" id="comments" value={this.state.comments} onChange={this.handleChange}/>
        </FormGroup>
        <Button disabled={false} > Submit </Button>
      </Form>
    );
     
  }
  
}