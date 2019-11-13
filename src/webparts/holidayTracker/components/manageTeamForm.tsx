import * as React from 'react';
import * as crud from './crudService';
import { Button, Form, FormGroup, Label, Input, Col, Card } from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Iuser from '../../interfaces/Iusers';

interface IManageTeamFormProps {
  context: WebPartContext;
  siteUrl:string;
  toggle:(user?:any)=>void;
  getLists:(response)=>void;
  setLists:(list,res)=>void
  usersList:any;
  user?:Iuser;
  edit?:boolean;
  
}

interface IManageTeamFormState {
  [x:string]: string;  
}


export default class ManageTeamForm extends React.Component<IManageTeamFormProps, IManageTeamFormState> {
  public inputNode: any;
  constructor(props){
    super(props);

    this.state = {
        currentUserEmail: "",
        role:"",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  public componentDidMount(){
    if(this.props.context.pageContext !== undefined){
      this.setState({
        currentUserEmail: this.props.context.pageContext.user.email,
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

    this.setState({
      [key]:value
    });
  
    

  }


  private handleSubmit(event) {
    event.preventDefault();
      const request = {
        id: this.props.user===undefined?"":this.props.user.ID,
        agentName: event.target.agentName.value,
        email : event.target.agentEmail.value,
        lobSelect: event.target.selectLob.value,
        role: event.target.role.value,
        supervisor: this.isRoleSupervisor(event),
        admin: (event)=>event.target.admin.value==="on"?"true":"false"
      }
      if(!this.props.edit){
        let createAgent;
        createAgent = async()=>await crud._createAgent('Agents',this.props.context,this.props.siteUrl,request)
        .then((res)=>this.props.setLists('Agents',res))
        .then(()=>this.props.toggle())
        return createAgent();
      }else{
        let updateTeamMember;
        updateTeamMember= async()=> await crud._updateTeamMember('Agents',this.props.context,this.props.siteUrl,request.id,request)
        .then((res)=>this.props.setLists('Agents',res))
        .then(()=>this.props.toggle()); 
        return updateTeamMember();
      }
      

     
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
      <div>
        {this.props.user!==undefined 
          && this.props.user.agentEmail === this.state.currentUserEmail 
          && this.props.edit?
        <Card body inverse color="danger">  
          <h4 className="text-warning">Error!</h4>
          <h4 className="text-warning">cannot modify your own entries</h4>
          <Button onClick={this.props.toggle} color="secondary">Back</Button>
        </Card>:
      
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="agentName">Name</Label>
            <Input 
              type="text" 
              name="agentName" 
              id="agentName" 
              placeholder={this.props.edit?this.props.user.agentName:"Name"} 
              value={this.state.agentName} onChange={this.handleChange} requested/>
          </FormGroup>
          <FormGroup>
            <Label for="agentEmail">E-mail</Label>
            <Input 
              type="email" 
              name="email" 
              id="agentEmail" 
              placeholder={this.props.edit?this.props.user.agentEmail:"Email"}  
              value={this.state.agentEmail} 
              onChange={this.handleChange} 
              requested/>
          </FormGroup>
          <FormGroup>
              <Label for="role">Role</Label>
              <Input 
                type="select" 
                name="role" 
                id="role" 
                placeholder={this.props.edit?this.props.user.role:"Role"} 
                value={this.state.role} 
                onChange={this.handleChange}>
                  <option>Agent</option>
                  <option>Team Lead</option>
                  <option>Manager</option>
              </Input>
          </FormGroup>
          {this.props.usersList.map((item)=>{
              if(item.agentEmail===this.props.context.pageContext.user.email || 
                this.props.user!==undefined &&this.props.user.role==="Admin"){
                  if( item.role === "Admin"){
                      return(
                          <FormGroup row>
                              <Col md={2}>
                                  <Label for="admin">Admin</Label>
                              </Col>
                              <Col md="10">
                                  <FormGroup check>
                                      <Input 
                                        type="checkbox" 
                                        name="admin" 
                                        id="admin" 
                                        onChange={this.handleChange} 
                                        checked={
                                          this.state.admin==='true'}/>
                                  </FormGroup>
                              </Col>
                          </FormGroup>)}
                  }
              })}
          <FormGroup>
            <Label for="lob">Team (Line of Business)</Label>
            <Input 
              type="select" 
              name="selectLob" 
              id="lobSelect" 
              placeholder={this.props.edit?this.props.user.lob:"Team()Line of Business"} 
              value={this.state.lobSelect} 
              onChange={this.handleChange}>
              {this.props.usersList.map(item=>item.lob).reduce((accumulator,currentValue)=>{
                if(accumulator.indexOf(currentValue)===-1){
                  accumulator.push(currentValue);
                }
                return accumulator;
              },[]).map(item=>{return <option key={item.name}>{item}</option>;})}
            </Input>
          </FormGroup>
          <Button disabled={false} > Submit </Button>
        </Form>}
      </div>
    );
     
  }
  
}