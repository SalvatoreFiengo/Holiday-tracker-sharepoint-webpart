import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import HolydayNewForm from './holidayNewForm';

interface IholidaysMProps{
    className: any;
    toggle: ()=>void;
    context: WebPartContext;
    siteUrl: string;
    modal: boolean;
    dates: number[];
    month: string;
    year: number;
    prev:(count:number)=>void;
    next:(count:number)=>void;
    count:number;
    dateChosen:Date;
    handleDatePicker:(date,month,boolean?)=>void;
    datePickerTo:boolean;
    datePickerFrom: boolean;
    toggleDataPickerTo: ()=>void;
    toggleDataPickerFrom: ()=>void;
    checkRequest: (request:any)=>boolean;
    getLists: (response)=>void;
    setLists: (list,res)=>void
    listValues:any;
    usersList:any;
    dayBordered:boolean;
    dayFromCalendar:number
}


class HolidayNewModal extends React.Component<IholidaysMProps> {

  public render() {

    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle} className={this.props.className}>
          <ModalHeader toggle={this.props.toggle}>Add new holiday</ModalHeader>
          <ModalBody>
          <HolydayNewForm 
            context={this.props.context} 
            siteUrl={this.props.siteUrl} 
            dates={this.props.dates} 
            month={this.props.month} 
            year={this.props.year}
            prev={this.props.prev} 
            next={this.props.next} 
            count={this.props.count}
            handleDatePicker = {this.props.handleDatePicker}
            dateChosen={this.props.dateChosen}
            datePickerTo={this.props.datePickerTo}
            datePickerFrom={this.props.datePickerFrom}
            toggleDataPickerTo={this.props.toggleDataPickerTo}
            toggleDataPickerFrom={this.props.toggleDataPickerFrom}
            toggle={this.props.toggle}
            checkRequest={this.props.checkRequest}
            getLists={this.props.getLists}
            setLists={this.props.setLists}
            listValues={this.props.listValues}
            usersList={this.props.usersList}
            dayBordered={this.props.dayBordered}
            dayFromCalendar={this.props.dayFromCalendar}
            >{this.props.children}</HolydayNewForm>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default HolidayNewModal;