import * as React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Collapse } from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import HolidayTableComponent from './holidayTableComponent';

import dates from '../../variables/dates';

interface InewFormProps {
  createItem: (ctx, siteUrl)=>void,
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
}

interface IformState {
  [x:string]: string  
}


export default class HolidayForm extends React.Component<InewFormProps, IformState> {
  inputNode: any;
  constructor(props){
    super(props);

    this.state = {
        agentEmail: "agent email",
        leaveSelect: "",
        comments: "",
        lobSelect:"",
        from:"",
        to:"", 
 
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
    const request = {
      email : event.target.email.value,
      leaveSelect: event.target.leaveSelect.value,
      lobSelect: event.target.lobselect.value,
      comments: event.target.comments.value

    }
    console.log("onSubmit: "+request.email+" "+request.leaveSelect)
    
    event.preventDefault();
  }

  handleDatePickerForm=(date,month)=>{
    const selected = new Date(new Date().getFullYear(), month, date).toString().slice(0,15)
    this.setState({
      from: selected
    })
  }
  handleDatePickerTo=(date,month)=>{
    const selected = new Date(new Date().getFullYear(), month, date).toString().slice(0,15)
    this.setState({
      to: selected
    })
  }
  render() {

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label for="agentEmail">Agent Requesting Holidays (E-mail)</Label>
          <Input type="email" name="email" id="agentEmail" placeholder="e-mail@domain.com" value={this.state.agentEmail} onChange={this.handleChange}/>
        </FormGroup>
        <FormGroup>
          <Label for="leaveSelect">Request Type</Label>
          <Input type="select" name="selectReqType" id="leaveSelect" value={this.state.leaveSelect} onChange={this.handleChange}>
            <option>Sick Day</option>
            <option>Annual Leave</option>
            <option>Maternity Leave</option>
            <option>Charity Leave</option>
            <option>Study Leave</option>
          </Input>
        </FormGroup>    
        <FormGroup>
        <Button onClick={()=>this.props.toggleDataPickerFrom()} id="from" className="d-inline-block">From: </Button>
          <span className="d-block border text-center w-50 mx-auto">{this.state.from}</span>
          <Collapse isOpen={this.props.datePickerFrom}>
            <HolidayTableComponent prev={(count)=>this.props.prev(count)} next={this.props.next} count={this.props.count} month={this.props.month} dates={this.props.dates} handleDatePicker={this.handleDatePickerForm}></HolidayTableComponent>
         </Collapse>
        </FormGroup>
        <FormGroup>
          <Button onClick={()=>this.props.toggleDataPickerTo()} id="to" className="d-inline-block">To: </Button>
          <span className="d-inline-block border text-center w-50 mx-auto">{this.state.to}</span>
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
        <Button  > Submit </Button>
      </Form>
    );
     
  }
  
}