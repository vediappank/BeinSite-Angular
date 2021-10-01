export class AgentActivityReportVO {
  public ActivityID: number;
  public ActivityName: string;
  public Count: string;

  clear(): void {
    this.ActivityID = undefined;
    this.ActivityName = '';
    this.Count = '';
  }
}
