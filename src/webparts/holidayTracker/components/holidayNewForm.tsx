import * as React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import HolidayTableComponent from './holidayTableComponent';

interface InewFormProps {
  createItem: (ctx, siteUrl)=>void,
  context: WebPartContext,
  siteUrl:string,
  dates: number[],
  month: string,
  prev:(count:number)=>void,
  next:(count:number)=>void,
  count:number
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
      
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange= (event)=> {

    let key:string = event.target.id;
    let value:string = event.target.value
    this.setState({
      [key]:value
    })

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

  render() {
    let ctx = this.props.context
    let siteUrl = this.props.siteUrl
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
        <HolidayTableComponent prev={(count)=>this.props.prev(count)} next={this.props.next} count={this.props.count} month={this.props.month} dates={this.props.dates}></HolidayTableComponent>
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