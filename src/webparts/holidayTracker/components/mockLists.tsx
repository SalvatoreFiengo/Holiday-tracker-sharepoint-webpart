import { ISPList } from '../components/HolidayTracker';

export default class MockHttpClient  {

    private static _items: ISPList[] = [
        {   
        Title: 'Mock List', 
        Id: '1',
        Approver:"email@email.com",
        Comments: "text",
        From: "05/05/19",
        Leave_duration:"5",
        Line_Of_Business: "LOB",
        Request_Type: "Annual leave",
        Status: "Approved",
        To: "06/05/19",
        V_dash: "email@email.com",
        Working_days: "17" 
        },
                                        ];

    public static get(): Promise<ISPList[]> {
    return new Promise<ISPList[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}