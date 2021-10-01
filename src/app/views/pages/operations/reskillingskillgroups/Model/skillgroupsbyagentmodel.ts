export class SkillGroupsByAgentModel {
    agent_skill_target_id: string;
    skill_group_skill_target_id_or_type: string;
    active_flag: Boolean;
    name: string;
    activity_type: string;
    skill_group_change_stamp: string;
    agent_change_stamp: string;
    peripheralnumber:string;

    clear() {
        this.agent_skill_target_id = '';
        this.skill_group_skill_target_id_or_type = '';
        this.active_flag = false;
        this.name = '';
        this.activity_type = '';
        this.peripheralnumber ='';
    }
}