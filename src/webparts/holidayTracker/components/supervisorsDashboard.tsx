import * as React from 'react';
import ManageTeamForm from './manageTeamForm'
import {Row, Col,  Table, Button, Collapse, Card, CardTitle, CardBody, CardSubtitle, CardText, CardHeader, CardFooter, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Iuser from '../../interfaces/Iusers';
import userMock from '../../variables/usersMock';
import * as crud from './crudService';

interface IsupervisorsDashboard{
    usersList:any;
    selectedLob:any;
    user:any;
    getLists:(response)=>void;
    setLists:(list,res)=>void;
    context: WebPartContext;
    siteUrl:string; 
}

interface IsupervisorsDashboardState{
    manageTeam:boolean;
    toggleAccordion:boolean;
    modalNew:boolean;
    modalEditMenu:boolean;
    user:Iuser,
    isEditUser:boolean;
    editMember:boolean;
    delete:boolean;

    
}
class SupervisorsDashboard extends React.Component<IsupervisorsDashboard,IsupervisorsDashboardState>{

    constructor(props:IsupervisorsDashboard){
        super(props);
        this.state={
            manageTeam:false,
            toggleAccordion:false,
            modalNew:false,
            user:userMock,
            modalEditMenu:false,
            isEditUser:false,
            editMember:false,
            delete:false
        }

       this.backToStructure=this.backToStructure.bind(this);
       this.toggleModalNew=this.toggleModalNew.bind(this);
       this.toggleModalEditMenu=this.toggleModalEditMenu.bind(this)
       this.toggleAccordion=this.toggleAccordion.bind(this);
       this.toggleModalEditMemeber=this.toggleModalEditMemeber.bind(this)
       this.toggleDelete=this.toggleDelete.bind(this)
    }
    private handleChange= (user,deleteUser?)=> {
 
        this.setState({
            user:{
                ID:user.ID,
                agentName:user.agentName,
                agentEmail:user.agentEmail,
                supervisor:user.supervisor,
                admin:user.admin,
                role:user.role,
                lob:user.lob
            },
            editMember:true,
        },()=>{
            if(deleteUser){return this.toggleDelete();}
            else{return this.toggleModalEditMemeber();};
        });

    }

    private toggleDelete(){
        this.setState((prevState)=>({
            delete:!prevState.delete
        }))
    }

    private backToStructure() {
        this.setState(prevState=>({
          manageTeam: !prevState.manageTeam
        }));
      }
    private toggleModalNew() {
  
        this.setState(prevState=>({
            modalNew: !prevState.modalNew,
            editMember:false
 
        }));
        
    }
    private toggleModalEditMenu() {
  
        this.setState(prevState=>({
            modalEditMenu: !prevState.modalEditMenu
        }));
        
    }

    private toggleModalEditMemeber() {

            this.setState(prevState=>({
                isEditUser: !prevState.isEditUser
            }));

        
    }

    private toggleAccordion(){
        this.setState((prevState)=>({
            toggleAccordion:!prevState.toggleAccordion
        }))
 
    }
    private deleteUser(id){
        crud._deleteTeamMember("Agents",this.props.context,this.props.siteUrl,id)
        .then((res)=>this.props.setLists('Agents',res))
        .then(()=>this.toggleDelete())
    }
    public render(){
 
        return(
            <div>
                <Collapse isOpen={this.state.manageTeam}>
                    <Row>
                        <Col md="12">
                            <Card className="w-50 mx-auto mb-3">
                                <Button onClick={this.backToStructure}>Back to: Team's structure</Button>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <Card body inverse color="info">
                                <CardHeader onClick={this.toggleAccordion}>Add a Member to your Team</CardHeader>
                                <Collapse isOpen={this.state.toggleAccordion}>
                                    <CardBody>
                                        <CardText>Please be careful on selecting appropriate security hierarchy.<br></br>
                                            In general a new member should not be set as<em>supervisor</em> unless specifically requested
                                        </CardText>
                                        <Button 
                                            color="secondary" 
                                            className="btn-sm"
                                            onClick={this.toggleModalNew}>Add Member</Button>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card body inverse color="secondary">
                                <CardHeader onClick={this.toggleAccordion}>Edit Member information</CardHeader>
                                <Collapse isOpen={this.state.toggleAccordion}>
                                <CardBody>
                                    <CardText>Please be careful on selecting appropriate security hierarchy.<br></br>
                                        In general a new member should not be set as <em>supervisor</em> unless specifically requested
                                    </CardText>
                                    <Button 
                                        color="info" 
                                        className="btn-sm" 
                                        onClick={this.toggleModalEditMenu} 
                                        >Edit Member</Button>
                                </CardBody>
                                </Collapse>
                            </Card>
                        </Col>
                    </Row>

                </Collapse>   
                <Collapse isOpen={!this.state.manageTeam}>

                    <Row>
                        <Col md="12" className="text-center">
                            {this.props.selectedLob!==undefined? <h2>{this.props.selectedLob} Structure </h2>:null} 
                        </Col>    
                    </Row>
                    <Row>
                        <Col md="12">
                            <Table className="text-center">
                                <thead>
                                    <tr >
                                        <th>Agent Name</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
   
                                <tbody>
                                {this.props.usersList.filter(item=>{
                                    return item.lob==this.props.selectedLob
                                }).map(user=>{
                                return (
                                    <tr key={user.ID} className="text-center">
                                        <td>{user.agentName}</td>
                                        <td>{user.role}</td>
                                    </tr>)
                                })}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan={3}><Button onClick={this.backToStructure}>Manage team</Button></th>
                                    </tr>
                                </tfoot>   
                            </Table>
                        </Col>
                    </Row>

                </Collapse>
                <Modal isOpen={this.state.modalNew} toggle={this.toggleModalNew}>
                    <ModalHeader toggle={this.toggleModalNew}>Add new member</ModalHeader>
                    <ModalBody>
                        <ManageTeamForm 
                            toggle={this.toggleModalNew} 
                            context={this.props.context} 
                            siteUrl={this.props.siteUrl} 
                            getLists={this.props.getLists}
                            usersList={this.props.usersList} 
                            setLists={this.props.setLists}
                            edit={this.state.isEditUser}>
                        </ManageTeamForm>            
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalEditMenu} toggle={this.toggleModalEditMenu}>
                    <Collapse isOpen={!this.state.isEditUser}>
                        <ModalHeader toggle={this.toggleModalEditMenu}>Memebers List</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col md="12">
                                    <Table size="sm" bordered className="text-center">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Agent Name</th>
                                                <th>Role</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {this.props.usersList.filter(item=>{
                                            return item.lob==this.props.selectedLob
                                        }).map((user, count=0)=>{
                                        count++    
                                        return (        
                                            <tr key={user.ID} className="text-center">
                                                <th scope="row">{count.toString()}</th>
                                                <td>{user.agentName}</td>
                                                <td>{user.role}</td>
                                                <td>
                                                    <Button  
                                                        onClick={()=>this.handleChange(user)} 
                                                        className="btn-sm mr-1">Modify</Button>
                                                    <Button 
                                                        onClick={()=>this.handleChange(user,true)} 
                                                        className="btn-sm">Delete</Button>
                                                </td>
                                            </tr>)
                                        })}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th>#</th>
                                                <th>Agent Name</th>
                                                <th>Role</th>
                                                <th>Actions</th>
                                            </tr>
                                        </tfoot>   
                                    </Table>
                                </Col>
                            </Row>
                        </ModalBody>
                    </Collapse>
                    <Collapse isOpen={this.state.isEditUser}>
                        <ModalHeader toggle={this.toggleModalEditMemeber}>Edit new member</ModalHeader>
                        <ModalBody>
                            <ManageTeamForm 
                                toggle={this.toggleModalEditMemeber} 
                                context={this.props.context} 
                                siteUrl={this.props.siteUrl} 
                                getLists={this.props.getLists}
                                setLists={this.props.setLists}
                                usersList={this.props.usersList}
                                user={this.state.user} 
                                edit={this.state.isEditUser}>
                            </ManageTeamForm>
                        </ModalBody> 
                    </Collapse>  
                </Modal>
                <Modal isOpen={this.state.delete}>
                    <ModalHeader toggle={this.toggleDelete} className="text-center"><h4>Whish to <em><u className="text-danger">delete</u></em> {this.state.user.agentName}?</h4> </ModalHeader>
                    <ModalBody className="text-center">
                        <h6>Please note, this will remove the following from our database:</h6>
                        <Table borderless responsive size="sm" className="text-center">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{this.state.user.agentName}</td>
                                    <td>{this.state.user.agentEmail}</td>
                                </tr>
                                
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter className="text-center">
                        <Button 
                            onClick={()=>this.deleteUser(this.state.user.ID)}
                            className="mx-auto" 
                            color="danger">Confirm Deletion</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}export default SupervisorsDashboard;