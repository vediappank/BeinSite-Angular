import { CalendarEvent } from 'angular-calendar';
  export interface SalesCallBackTaskEvent extends CalendarEvent {
      Name? : string;
      SmartCardNo? : string;
      ContactNo? : string;
      AltContactNo? : string;
      SourceTicketId? :string;
      AssignedTo? : number;
      Status? :number;
      CompletionDateTime? : Date;
      CompletionTicketId? :string;
      Comments? :string;
  }
  