import * as React from 'react';
import ManageTeamForm from './manageTeamForm'
import {Row, Col,  Table, Button, Collapse, Card, CardTitle, CardBody, CardSubtitle, CardText, CardHeader, CardFooter, Modal, ModalHeader, ModalBody} from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';

interface IsupervisorsDashboard{
    usersList:any;
    selectedLob:any;
    user:any;
    getLists:(response)=>void;
    context: WebPartContext;
    siteUrl:string;    
}
interface IsupervisorsDashboardState{
    manageTeam:boolean;
    toggleAccordion:boolean;
    modal:boolean;
}
class SupervisorsDashboard extends React.Component<IsupervisorsDashboard,IsupervisorsDashboardState>{

    constructor(props:IsupervisorsDashboard){
        super(props);
        this.state={
            manageTeam:false,
            toggleAccordion:false,
            modal:false

        }
       this.backToStructure=this.backToStructure.bind(this)
       this.toggleModal=this.toggleModal.bind(this)
       this.toggleAccordion=this.toggleAccordion.bind(this)
    }
    private backToStructure() {
        this.setState(prevState=>({
          manageTeam: !prevState.manageTeam
        }));
      }
    private toggleModal() {
    this.setState(prevState=>({
        modal: !prevState.modal
    }));
    }
    private toggleAccordion(){
        this.setState((prevState)=>({
            toggleAccordion:!prevState.toggleAccordion
        }))
 
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
                                            onClick={this.toggleModal}>Add Member</Button>
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
                                        onClick={this.toggleModal}>Edit Member</Button>
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
                                {this.props.usersList.filter(item=>{
                                    return item.lob==this.props.selectedLob
                                }).map(user=>{
                                return (
                                <tbody>
                                    <tr className="text-center">
                                        <td>{user.agentName}</td>
                                        <td>{user.role}</td>
                                    </tr>
                                </tbody>)
                                })}
                                <tfoot>
                                    <tr>
                                        <th colSpan={3}><Button onClick={this.backToStructure}>Manage team</Button></th>
                                    </tr>
                                </tfoot>   
                            </Table>
                        </Col>
                    </Row>

                </Collapse>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Add new member</ModalHeader>
                    <ModalBody>
                        <ManageTeamForm 
                            toggle={this.toggleModal} 
                            context={this.props.context} 
                            siteUrl={this.props.siteUrl} 
                            getLists={this.props.getLists}
                            usersList={this.props.usersList} >
                        </ManageTeamForm>            
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}export default SupervisorsDashboard;