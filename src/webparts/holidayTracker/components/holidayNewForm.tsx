import * as React from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface InewFormProps {
  createItem: (ctx, siteUrl)=>void,
  context: WebPartContext,
  siteUrl:string
}
export default class HolidayForm extends React.Component<InewFormProps> {
  constructor(props){
    super(props)
  }
  render() {
    let ctx = this.props.context
    let siteUrl = this.props.siteUrl
    return (
      <Form>
        <FormGroup>
          <Label for="agentEmail">Agent Requesting Holidays (Microsoft E-mail)</Label>
          <Input type="email" name="email" id="agentEmail" placeholder="v-dash@microsoft" />
        </FormGroup>
        <FormGroup>
          <Label for="leaveSelect">Select</Label>
          <Input type="select" name="select" id="leaveSelect">
            <option>Sick Day</option>
            <option>Annual Leave</option>
            <option>Maternity Leave</option>
            <option>Charity Leave</option>
            <option>Study Leave</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="comments">Comments</Label>
          <Input type="textarea" name="text" id="comments" />
        </FormGroup>
        <Button onClick={()=>this.props.createItem(ctx, siteUrl)}> Submit </Button>
      </Form>
    );
     
  }
  
}