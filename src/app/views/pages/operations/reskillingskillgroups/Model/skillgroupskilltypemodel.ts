export class SkillGroupSkillTypeModel {
    skilltargetid: number;
    enterpricename: string;   
    changestamp: number;
    skilltype: string;
    clear() {
        this.skilltargetid= undefined;
        this.enterpricename='';
        this.skilltype = '';
        this.changestamp=undefined;
    }
}
