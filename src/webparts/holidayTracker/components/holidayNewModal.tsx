import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import HolydayNewForm from './holidayNewForm'

interface IholidaysMProps{
    className: any,
    toggle: ()=>void,
    createItem: (ctx, siteUrl)=>void,
    context: WebPartContext,
    siteUrl: string,
    modal: boolean,
    dates: number[],
    month: string,
    prev:(count:number)=>void,
    next:(count:number)=>void,
    count:number,
    dateChosen:Date,
    handleDatePicker:(date,month,key?)=>void,
    datePickerTo:boolean,
    datePickerFrom: boolean,
    toggleDataPickerTo: ()=>void,
    toggleDataPickerFrom: ()=>void
}


class HolidayNewModal extends React.Component<IholidaysMProps> {

  render() {
    let ctx = this.props.context
    let siteUrl = this.props.siteUrl
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.props.toggle}>Add new holiday</ModalHeader>
          <ModalBody>
          <Button onClick={()=>this.props.createItem(ctx, siteUrl)}>Test</Button>
          <HolydayNewForm 
            context={this.props.context} 
            siteUrl={this.props.siteUrl} 
            createItem={this.props.createItem} 
            dates={this.props.dates} 
            month={this.props.month} 
            prev={this.props.prev} 
            next={this.props.next} 
            count={this.props.count}
            handleDatePicker = {this.props.handleDatePicker}
            dateChosen={this.props.dateChosen}
            datePickerTo={this.props.datePickerTo}
            datePickerFrom={this.props.datePickerFrom}
            toggleDataPickerTo={this.props.toggleDataPickerTo}
            toggleDataPickerFrom={this.props.toggleDataPickerFrom}
            >{this.props.children}</HolydayNewForm>
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