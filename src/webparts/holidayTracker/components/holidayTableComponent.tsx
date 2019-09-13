import * as React from 'react';
import {Table, Button, Card} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';


type Props = {
    dates: number[],
    month: string,
    year: number,
    prev:(count:number)=>void,
    next:(count:number)=>void,
    count:number,
    handleDatePicker: (date, month,boolean?)=>void
    listValues:any
};

class HolidayTableComponent extends React.Component<Props>{
    public render(){
        return(
            
            <Table className="text-center">
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
                            <div className="resized">
                            <Card type="button" className="customCard d-inline mr-md-3" onClick={()=>this.props.handleDatePicker(1, this.props.count-1,true)}>All</Card>
                                {this.props.dates.map((chose, i)=>{
                                    return(
                                    <Card key={i} onClick={()=>this.props.handleDatePicker(chose, this.props.count-1)} type="button" className="customCard d-inline">
                                        {chose}
                                    </Card>);
                                    })
                                }
                            </div>
                        </td>
                    </tr>  
                </tbody>
            </Table>
            
        );
    }

}
export default HolidayTableComponent;