export class SkillGroupModel {
    skilltargetid: number;
    enterpricename: string;   
    changestamp: number;

    clear() {
        this.skilltargetid= undefined;
        this.enterpricename='';
        
        this.changestamp=undefined;
    }
}
