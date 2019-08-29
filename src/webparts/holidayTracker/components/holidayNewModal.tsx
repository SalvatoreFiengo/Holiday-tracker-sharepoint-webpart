import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import HolydayNewForm from './holidayNewForm'

interface IholidaysMProps{
    className: any,
    toggle: ()=>void,
    createItem: ()=>void,
    context: WebPartContext,
    modal: boolean
}


class HolidayNewModal extends React.Component<IholidaysMProps> {

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.props.toggle}>Add new holiday</ModalHeader>
          <ModalBody>
          <Button onClick={()=>this.props.createItem()}>Test</Button>
          <HolydayNewForm context={this.props.context} createItem={this.props.createItem}>{this.props.children}</HolydayNewForm>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.props.toggle}>Save</Button>{' '}
            <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default HolidayNewModal;