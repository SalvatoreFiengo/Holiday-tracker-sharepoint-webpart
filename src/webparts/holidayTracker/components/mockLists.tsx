import { ISPList } from '../components/HolidayTracker';

export default class MockHttpClient  {

    private static _items: ISPList[] = [
        { 
        request_type: "Annual leave",  
        Id: '1',
        e_mail: "email@email.com",
        agent_name:"mock name",
        from: "05/05/19",
        to: "06/05/19",
        approver:"email@email.com",
        Comments: "text",
        lob: "LOB",
        approved: true
        },
                                        ];
    public static get(): Promise<ISPList[]> {
    return new Promise<ISPList[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}