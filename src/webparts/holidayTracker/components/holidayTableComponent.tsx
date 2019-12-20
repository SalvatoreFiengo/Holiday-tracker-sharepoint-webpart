import * as React from 'react';
import {Table, Button, Card, Row, Col} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import datesVar from '../../variables/dates';

type Props = {
    dates: number[],
    month: string,
    year: number,
    prev:(count:number)=>void,
    next:(count:number)=>void,
    count:number,
    handleDatePicker: (year, date, month,boolean?)=>void
    listValues:any,
    optionalAll:boolean,
    dayBordered:boolean
    dayFromCalendar:number
};

class HolidayTableComponent extends React.Component<Props>{
    public render(){
        return(
            
            <Table bordered className="text-center">
                <thead>
                    <tr>
                        <th>
                            <Button onClick={()=>{
                            this.props.prev(this.props.count);
                            }}
                            >Prev</Button>
                        </th><th>Holidays in {this.props.month}/{this.props.year}</th>
                        <th><Button onClick={()=>{
                            this.props.next(this.props.count);
                            }}
                            >next</Button></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={3}>
                            {this.props.optionalAll?<Row><Col md={{size:6, offset:3}}><Card type="button" className="m-1" onClick={()=>this.props.handleDatePicker(1, this.props.count-1,this.props.year,true)}>All</Card></Col></Row>:null}
                            <Row>
                                <Col md="12">
                                    <div className="mx-0">
                                        <div className="resized calendar">
                                            {datesVar.days.map(day=><Card className="calendar-item dayName bg-secondary m-1"> {day}  </Card>)}
                                        {this.props.dates.map((chose, i)=>{
                                            return(
                                            <Card 
                                                key={""+i} 
                                                onClick={()=>this.props.handleDatePicker(chose, this.props.count-1,this.props.year)} 
                                                type="button" 
                                                style={{gridColumnStart:chose==1 ?new Date(this.props.year,this.props.count-1,chose).getDay()+1:0}} 
                                                className={this.props.dayBordered && this.props.dayFromCalendar!=undefined&& this.props.dayFromCalendar==chose?"calendar-item bg-danger text-white m-1 ":"calendar-item bg-primary m-1"} >
                                                <div className="calendar-content">{chose<10?"0"+chose:chose}</div>
                                            </Card>);
                                            })
                                        }
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </td>
                    </tr>  
                </tbody>
            </Table>
            
        );
    }

}
export default HolidayTableComponent;