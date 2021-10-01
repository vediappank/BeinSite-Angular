import { FDGroup } from './fdgroup.model';
import { FDRole } from './fdrole.model';

export class FDAgent {
    id: number;
    name: string;
    skillTargetId: string;
    loginId: string;
    email: string;
    phone: string;
    mobile: string;
    ticketScope: number;
    type: string;
    active: boolean;
    jobTitle: string;
    language: string;

    assignedGroups: FDGroup[];
    assignedRoles: FDRole[];
}
