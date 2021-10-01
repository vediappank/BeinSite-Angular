import { AnyRecordWithTtl } from 'dns';
import { CampaignContactModel } from './campaigncontact.model';

export class CampaignRequestModel {
    CampaignID: string;
    ContactList: CampaignContactModel[];
    csvFile: FormData;
    ExpiryDay: string;
    FileName:string;  
    UserID:string;
    JobDesc:string; 
    JobConditions:string;
    isRemoveContacts : boolean;
    isRemoveSalesCallbacks : boolean;
    RemoveBy : string;
}
