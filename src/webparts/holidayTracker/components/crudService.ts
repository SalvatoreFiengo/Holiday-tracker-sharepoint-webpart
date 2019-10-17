import { SPHttpClientResponse, SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";
import { ISPLists, ISPList } from "./HolidayTracker";

export let createSharePointList = (ctx,listloader): void => {
  const getListUrl: string = ctx.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('ooo_test')";
  ctx.spHttpClient.get(getListUrl, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
  if (response.status === 200) {
    listloader()
    return; // list already exists
  }
  if (response.status === 404) {
    const url: string = ctx.pageContext.web.absoluteUrl + "/_api/web/lists";
    const listDefinition : any = {
      "Title": "ooo_test",
      "Description": "Out Of Office Requests",
      "AllowContentTypes": true,
      "BaseTemplate": 100,
      "ContentTypesEnabled": true,
      };

    const spHttpClientOptions: ISPHttpClientOptions = {
      "body": JSON.stringify(listDefinition)
    };
    ctx.spHttpClient
      .post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
      .then((res: SPHttpClientResponse) => {
    if (res.status === 201) {


        const created = confirm("List Created");
        if(created){
          console.log("list created baby!");
        }
    } else {
      alert("Response status "+res.status+" - "+res.statusText);
      }
    });
  } else {
    alert("Something went wrong. "+response.status+" "+response.statusText);
    }
  });
}
export  let getSpLists=(response)=>{
        this.setState({
        lists: response,
        }, ()=>{console.log("list updated");});
    };

    let _getListData=(ctx, siteUrl): Promise<ISPLists> =>{
        if(ctx !== undefined){
        return ctx.spHttpClient.get(siteUrl + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
            return response.json();
            });
        }
    };

export let _getSpecificList=(list,ctx, siteUrl): Promise<ISPList>=> {
    return ctx.spHttpClient.get(siteUrl + `/_api/web/Lists/GetByTitle('`+list+`')/items`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
            return response.json();
        });
    };

export let _createItem=(list,ctx, siteUrl, request):Promise<void> =>{
    const body: string= JSON.stringify({
      '__metadata': {
        'type': 'SP.Data.Ooo_x005f_testListItem'
      },
      'Title':request.leaveSelect,
      'sykj':request.agentName,
      'email':request.email,
      'from': request.from,
      'to': request.to,
      'lob':request.lobSelect,
      'comment':request.comments
    }); 

    return ctx.spHttpClient.post(siteUrl+`/_api/web/lists/getbytitle('`+list+`')/items`,
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
    }).then(()=>_getSpecificList(list,ctx, siteUrl));
  };

  export let _updateItemApproval = (list, ctx, siteUrl, id, approval):Promise<ISPList>=>{
    const body: string= JSON.stringify({
      '__metadata': {
        'type': 'SP.Data.Ooo_x005f_testListItem'
      },
      'approved': ""+approval
    }); 
    return ctx.spHttpClient.post(siteUrl+`/_api/web/lists/getbytitle('`+list+`')/GetItemById(`+id+`)`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'Content-type': 'application/json;odata=verbose',
          'odata-version': '',
          'IF-MATCH': '*',
          'X-HTTP-Method': 'MERGE'
        },
        body:body
      }).then(()=>_getSpecificList(list, ctx, siteUrl));
  };
  export let _deleteItem = (list,ctx, siteUrl, id):Promise<ISPList>=>{

      return ctx.spHttpClient.post(siteUrl+`/_api/web/lists/getbytitle('`+list+`')/GetItemById(`+id+`)`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'Content-type': 'application/json;odata=verbose',
          'odata-version': '',
          'IF-MATCH': '*',
          'X-HTTP-Method': 'DELETE'
        },
      }).then(()=>_getSpecificList(list,ctx, siteUrl));
  };