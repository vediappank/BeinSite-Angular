import { TicketCustomFields } from './ticket-custom-fields.model';
import { TicketTrblIssue } from './ticket-trbl-issue.model';
import {TicketConversation} from './ticketconversation.model';

export class TicketDetail {
    public id: number;
    public name: string;
    public email: string;
    public phone: string;
    public subject: string;
    public type: string;
    public status: number;
    public priority: number;
    public description: string;
    public description_text: string;
    public source: number;
    public group_id: number;
    public product_id: number;
    public custom_fields: TicketCustomFields;
    public fdticketconversation : TicketConversation[];
    public agent_login_id: number;
    public call_key_call_id: number;
    public call_key_prefix: number;
    public dialog_id: number;
    public responder_id: number;
    public tags: string[];
    public created_at: Date;
    public updated_at: Date;
    public requester_id: number;
    public parent_id: number;
    public resolvedStatus: boolean;
    public notResolvedReason: string;
    public twitterId: string;
    public chatRefId: string;
    public language: string;
    public ani: string;
    public callType: string;
    public connToNet: boolean;
    public notConnToNetReason: string;
    public trblIssues: TicketTrblIssue[];
    public callRating: number;
    public customerRating: number;
    public newCustomer: boolean;
    public TotalRecords : number;
    public priorityname: string;
    public statusname: string;
    public ack_at: Date;
    rep_category : string;
    rep_sub_category : string;
    rep_item : string;
    wfo_category :string;
    wfo_sub_category : string;
    wfo_item : string;
    template : string;
    
    constructor( ) {
        this.custom_fields = new TicketCustomFields();
        this.fdticketconversation = [];
        this.tags = [];
        this.trblIssues = [];
        
    }

}
