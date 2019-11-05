import * as React from 'react';
import * as crud from './crudService';
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IManageTeamFormProps {
  context: WebPartContext;
  siteUrl:string;
  toggle:()=>void;
  getLists:(response)=>void;
  usersList:any;
}

interface IManageTeamFormState {
  [x:string]: string;  
}


export default class ManageTeamForm extends React.Component<IManageTeamFormProps, IManageTeamFormState> {
  public inputNode: any;
  constructor(props){
    super(props);

    this.state = {
        currentUser: "",
        role:""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  public componentDidMount(){
    if(this.props.context.pageContext !== undefined){
      this.setState({
        currentUser: this.props.context.pageContext.user.email,
        role: this.checkCurrentUserRole()
      });
    }
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this)
  }
  
  private checkCurrentUserRole=()=>{
      let role= this.props.usersList.map((item)=>{if(item.agentEmail===this.props.context.pageContext.user.email){return item.role}})
      return role.toString()
  }
  private handleChange= (event)=> {
    
    let key:string = event.target.id;
    let value:string = event.target.value;
    console.log(key+" is "+value);
    this.setState({
      [key]:value
    });

  }

  private handleSubmit(event) {
    event.preventDefault();

    const request = {
      agentName: event.target.agentName.value,
      email : event.target.agentEmail.value,
      lobSelect: event.target.selectLob.value,
      role: event.target.role.value,
      supervisor: this.isRoleSupervisor(event),
      admin: ""
    };

    crud
        ._createAgent('agents',this.props.context,this.props.siteUrl,request)
        .then(res=>this.props.getLists(res));

    this.props.toggle();

  
  }
  private isRoleSupervisor=(event)=>{
    if(event.target.role.value==="Team Lead"||event.target.role.value==="Manager"){
        return "true";
    }else{
        return "false";
    }
  }
  public render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label for="agentName">Name </Label>
          <Input type="text" name="agentName" id="agentName" placeholder="name" value={this.state.agentName} onChange={this.handleChange} requested/>
        </FormGroup>
        <FormGroup>
          <Label for="agentEmail">E-mail</Label>
          <Input type="email" name="email" id="agentEmail" placeholder="e-mail@domain.com" value={this.state.agentEmail} onChange={this.handleChange} requested/>
        </FormGroup>
        <FormGroup>
            <Label for="role">Role</Label>
            <Input type="select" name="role" id="role" placeholder="role" onChange={this.handleChange}>
                <option>Agent</option>
                <option>Team Lead</option>
                <option>Manager</option>
            </Input>
        </FormGroup>
        {this.props.usersList.map((item)=>{
            if(item.agentEmail===this.props.context.pageContext.user.email){
                if( item.role === "Admin"){
                    return(
                        <FormGroup row>
                            <Col md={2}>
                                <Label for="admin">Admin</Label>
                            </Col>
                            <Col md="10">
                                <FormGroup check>
                                    <Input type="checkbox" name="admin" id="admin" onChange={this.handleChange}/>
                                </FormGroup>
                            </Col>
                        </FormGroup>)}
                }
            })}
        <FormGroup>
          <Label for="lob">Team (Line of Business)</Label>
          <Input type="select" name="selectLob" id="lobSelect" value={this.state.lobSelect} onChange={this.handleChange}>
            {this.props.usersList.map(item=>item.lob).reduce((accumulator,currentValue)=>{
              if(accumulator.indexOf(currentValue)===-1){
                accumulator.push(currentValue);
              }
              return accumulator;
            },[]).map(item=>{return <option>{item}</option>;})}
          </Input>
        </FormGroup>
        <Button disabled={false} > Submit </Button>
      </Form>
    );
     
  }
  
}