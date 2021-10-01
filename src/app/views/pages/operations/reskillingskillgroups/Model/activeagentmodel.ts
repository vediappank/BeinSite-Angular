export class ActiveAgentModel {
    agentid: number;
    firstname: string;
    lastname: string;
    skill_target_id: number;
    changestamp: number;

    clear() {
        this.agentid= undefined;
        this.firstname='';
        this.lastname ='';
        this.skill_target_id =undefined;
        this.changestamp=undefined;
    }
}
