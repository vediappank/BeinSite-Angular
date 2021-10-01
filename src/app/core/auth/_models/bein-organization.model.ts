import { BeinUser } from './bein-user.model';

export class BeinOrganization {
    public id: number;
    public name: string;
    public parentOrgId: number;
    public timeZone: string;
    public orgUsers: BeinUser[];
}
