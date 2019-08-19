import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface IholidaysMProps{
    className: any,
    toggle: ()=>void,
    modal: boolean
}


class HolidayNewModal extends React.Component<IholidaysMProps> {

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.props.toggle}>Add new holiday</ModalHeader>
          <ModalBody>
            {this.props.children} 
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