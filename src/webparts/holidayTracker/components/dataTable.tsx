import * as React from 'react';
import { Button, Col, Table} from 'reactstrap';
import Idates from '../../interfaces/Idates';
import { ISPList } from './HolidayTracker';

interface IholidaysMProps{
  user:any;
  userEmail:string;
  dataTableFilter:any;
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
  lobIsSelected:boolean;
  lob:any;
}

class DataTable extends React.Component<IholidaysMProps> {

    public render() {
      
      return (
        <Col md="12">

          <div className= "table-responsive mb-5">
              <Table className="border-left border-bottom table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>Lob:</th>
                    <th>Request:</th>
                    <th>E-mail:</th>
                    <th>Agent Name:</th>
                    <th>From:</th>
                    <th>To:</th>
                    <th>Comments:</th>
                    <th>Status:</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.list!==undefined?this.props.listValues.filter(item=>{
                    if(this.props.lobIsSelected && this.props.lob){

                      return item.lob==this.props.lob

                    }else if(this.props.dataTableFilter == this.props.userEmail){
                        return item.email == this.props.dataTableFilter;
                    }else if (this.props.dataTableFilter == this.props.user.lob){
                      
                      return item.lob == this.props.dataTableFilter;
                    }
                  }).map(item=>{
          if(this.props.checkDates(item.from, item.to, this.props.selectedDate.toString(), this.props.dayCheck)){
            return  <tr >
                      <td>
                        <p>{item.lob}</p>
                      </td>
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
                        <p>{new Date(item.from).getDate()}-{this.props.dates.months[new Date(item.from).getMonth()]}</p>
                      </td>
                      <td>
                        <p>{new Date(item.to).getDate()}-{this.props.dates.months[new Date(item.to).getMonth()]}</p>
                      </td>
                      <td><p>{item.comment}</p></td>

                      <td className={"border "+(item.approved?"border-success":"border-danger")}>
                          <div className={"text-center "+(item.approved?"d-none":"")}>
                            <Button className="btn-sm bg-warning w-100 my-1" onClick={()=>this.props.deleteItem(this.props.context, this.props.siteUrl, item.Id).then(res=>this.props.getSpecificList(res))} >Delete</Button>
                          </div>
                          <div className="text-center">
                            {item.approved?<p className="text-success">Already Approved</p>:null}
                            {item.approved == false
                            && item.rejected == false
                            && (this.props.user.admin || this.props.user.supervisor) 
                            && (this.props.user.agentEmail != item.email)?<Button className="btn-sm bg-success w-100 my-1" onClick={()=>this.props.approveItem('ooo_test',this.props.context, this.props.siteUrl, item.Id, true).then(res=>this.props.getSpecificList(res))}>Approve</Button>:null} 
                            {item.approved == false
                            && item.rejected == false 
                            && (this.props.user.admin == false && this.props.user.supervisor==false)?<p className="text-warning">Awaiting approval</p>:null}
                          </div>
                      </td>

                    </tr>}else{return null;}
                  }):<h2>No data available, please refresh</h2>}
                  </tbody>
                </Table>
              </div>
        </Col>
      );
    }
  }
  
  export default DataTable;