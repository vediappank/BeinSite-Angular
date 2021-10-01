export class AgentForecastModel {
    public year: string;
    public callcenterid: string;
    public forecastData:string;     
    public forecastid:string;     
    public weekid:string;     
    public forecastvalue:string;     
    public userid:string;     

    clear() {
        this.year=undefined;
        this.callcenterid= undefined
        this.weekid= undefined
        this.userid = '';
    }
}
