import * as React from 'react';
import { Button, Col, Table} from 'reactstrap';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import Idates from '../../interfaces/Idates';
import { ISPList } from './HolidayTracker';

interface IholidaysMProps{
  user:any;
  userEmail:any;
  list:ISPList;
  listValues:any;
  selectedDate:Date;
  dayCheck:boolean;
  checkDates:(date:string,date2:string,selectedDateToString:string,dayCheck:boolean)=>boolean;
  dates:Idates;
  deleteItem:(id:string,context?, siteUrl?)=>Promise<ISPList>;
  approveItem:(list:string, ctx, siteUrl, id, approval)=>Promise<ISPList>;
  context:any;
  siteUrl:string;
  getSpecificList:(res)=>void;
}

class DataTable extends React.Component<IholidaysMProps> {

    public render() {
      return (
        <Col md="12">

              {this.props.list!==undefined?this.props.listValues.filter(item=>{return item.email == this.props.userEmail}).map(item=>{
                if(this.props.checkDates(item.from, item.to, this.props.selectedDate.toString(), this.props.dayCheck)){
                  
                return    <div className= "table-responsive mb-5">
                            <Table className={"border-left border-bottom table table-bordered table-sm "+(item.approved?"border-success":"border-danger")}>
                              <thead>
                                <tr className={item.approved?"table-success":"table-danger"}>
                                  <th>Request:</th>
                                  <th>E-mail:</th>
                                  <th>Agent Name:</th>
                                  <th>from:</th>
                                  <th>to:</th>
                                  <th>comments:</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <p>{item.Title}</p>
                                  </td>
                                  <td>
                                    <p>{item.email}</p>
                                  </td>
                                  <td>
                                    <p>{item.sykj}</p>
                                  </td>
                                  <td>
                                    <p>{new Date(item.from).getDate()}-{this.props.dates.months[new Date(item.to).getMonth()]}</p>
                                  </td>
                                  <td>
                                    <p>{new Date(item.to).getDate()}-{this.props.dates.months[new Date(item.to).getMonth()]}</p>
                                  </td>
                                  <td><p>{item.comment}</p></td>
                                </tr>
                              </tbody>
                              <tfoot >
                                <tr >
                                  <td colSpan={3}>{item.approved?null:<Button className="btn-sm bg-warning" onClick={()=>this.props.deleteItem(this.props.context, this.props.siteUrl, item.Id).then(res=>this.props.getSpecificList(res))} >Delete</Button>}</td>
                                  <td colSpan={3}>
                                  {item.approved?<p className="text-success">Already Approved</p>:<Button className="btn-sm bg-success" onClick={()=>this.props.approveItem('ooo_test',this.props.context, this.props.siteUrl, item.Id, true).then(res=>this.props.getSpecificList(res))}>Approve</Button>} 
                                  </td>
                                </tr>
                              </tfoot>
                            </Table>
                          </div>;
                }else{return null;}
              }):<h2>No data available, please refresh</h2>}
              
            </Col>
      );
    }
  }
  
  export default DataTable;