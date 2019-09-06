import { SPHttpClientResponse, SPHttpClient } from "@microsoft/sp-http";
import { ISPLists, ISPList } from "./HolidayTracker";

export  let getSpLists=(response)=>{
        this.setState({
        lists: response,
        }, function(){console.log("list updated")})
    }

export let getSpecificList=(response)=>{
        let values=Object.keys(response.value).map(item=>response.value[item])
        this.setState({
        listValues: values 
        }, function(){console.log("listValues -- ")})
    }
  
    let _getListData=(ctx, siteUrl): Promise<ISPLists> =>{
        if(ctx !== undefined){
        return ctx.spHttpClient.get(siteUrl + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
            return response.json()
            });
        }
    }

export let _getSpecificList=(ctx, siteUrl): Promise<ISPList>=> {
    return ctx.spHttpClient.get(siteUrl + `/_api/web/Lists/GetByTitle('ooo_test')/items`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
            return response.json()
        });
    }

export let _createItem=(ctx, siteUrl, request):Promise<void> =>{
    const body: string= JSON.stringify({
      '__metadata': {
        'type': 'SP.Data.Ooo_x005f_testListItem'
      },
      'Title':request.leaveSelect,
      'email':request.email,
      'from': request.from,
      'to': request.to,
      'lob':request.lobSelect,
      'comment':request.comments
    }) 

    return ctx.spHttpClient.post(siteUrl+`/_api/web/lists/getbytitle('ooo_test')/items`,
    SPHttpClient.configurations.v1,
    {
      headers: {
        'Accept': 'application/json;odata=nometadata',
        'Content-type': 'application/json;odata=verbose',
        'odata-version': ''
      },
      body: body
    }).then((response: SPHttpClientResponse): Promise<any>=>{
      return response.json();
    })
  }