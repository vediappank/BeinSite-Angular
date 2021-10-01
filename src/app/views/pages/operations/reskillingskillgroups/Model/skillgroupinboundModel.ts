import { SkillGroupMappingFilterModel } from './skillgroupmappingfilter';
import { SkillGroupsByAgentModel } from './skillgroupsbyagentmodel';

export class SkillGroupEditInboundUpdateModel {
      
    operation: string;   
    userid: string; 
    selectedAgents:SkillGroupsByAgentModel[]; 
    unselectedAgents:SkillGroupsByAgentModel[]; 
    inboundoutbounddisableflag: Boolean;
}
