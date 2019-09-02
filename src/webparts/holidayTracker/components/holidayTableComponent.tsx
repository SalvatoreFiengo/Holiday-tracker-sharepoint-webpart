import * as React from 'react';
import {Table, Button, Card} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';

import Iuser from '../../interfaces/Iusers';
type Props = {
    dates: number[],
    month: string,
    prev:(count:number)=>void,
    next:(count:number)=>void,
    count:number
};
class HolidayTableComponent extends React.Component<Props>{
    render(){
        return(
            
            <Table className="text-center">
                <thead>
                    <tr>
                        <th>
                            <Button onClick={()=>{
                            this.props.prev(this.props.count)
                            }}
                            >Prev</Button>
                        </th><th>Holidays in {this.props.month}</th>
                        <th><Button onClick={()=>{
                            this.props.next(this.props.count)
                            }}
                            >next</Button></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={3}>
                            <div className="resized">
                                {this.props.dates.map((chose, i)=>{
                                    return(
                                    <Card key={i} type="button" className="customCard d-inline">
                                        {chose}
                                    </Card>)
                                    })
                                }
                            </div>
                        </td>
                    </tr>  
                </tbody>
            </Table>
            
        )
    }

}
export default HolidayTableComponent;