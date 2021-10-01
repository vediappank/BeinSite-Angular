import { SkillGroupMappingFilterModel } from './skillgroupmappingfilter';
import { SkillGroupMappingModel } from './skillgroupmappingmodel';

export class SkillGroupUpdateModelFilter {
    
    skillGroupId:number;
    changeStamp: number;   
    operation: string;   
    userid: string;   
    
    selectedAgents:SkillGroupMappingModel[]; 


}
