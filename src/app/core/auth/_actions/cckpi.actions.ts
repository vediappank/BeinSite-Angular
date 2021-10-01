// NGRX
import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
// CRUD
import { QueryParamsModel } from '../../_base/crud';
// Models
import { CCKpi } from '../_models/cckpi.model';

export enum CCKpiActionTypes {
    AllCCKpisRequested = '[CCKpis Home Page] All CCKpis Requested',
    AllCCKpisLoaded = '[CCKpis API] All CCKpis Loaded',
    CCKpiOnServerCreated = '[Edit CCKpis Dialog] CCKpis On Server Created',
    CCKpiCreated = '[Edit CCKpis Dialog] CCKpis Created',
    CCKpiUpdated = '[Edit CCKpis Dialog] CCKpis Updated',
    CCKpiDeleted = '[CCKpis List Page] CCKpis Deleted',
    CCKpisPageRequested = '[CCKpis List Page] CCKpis Page Requested',
    CCKpisPageLoaded = '[CCKpis API] CCKpis Page Loaded',
    CCKpisPageCancelled = '[CCKpis API] CCKpis Page Cancelled',
    CCKpisPageToggleLoading = '[CCKpis page] CCKpis Page Toggle Loading',
    CCKpisActionToggleLoading = '[CCKpis] CCKpis Action Toggle Loading'
}

export class CCKpiOnServerCreated implements Action {
    readonly type = CCKpiActionTypes.CCKpiOnServerCreated;
    constructor(public payload: { kpi: CCKpi }) { }
}

export class CCKpiCreated implements Action {
    readonly type = CCKpiActionTypes.CCKpiCreated;
    constructor(public payload: { kpi: CCKpi }) { }
}

export class CCKpiUpdated implements Action {
    readonly type = CCKpiActionTypes.CCKpiUpdated;
    constructor(public payload: {
        partialkpi: Update<CCKpi>,
        kpi: CCKpi
    }) { }
}

export class CCKpiDeleted implements Action {
    readonly type = CCKpiActionTypes.CCKpiDeleted;
    constructor(public payload: { Kpi_ID: number }) {}
}

export class CCKpisPageRequested implements Action {
    readonly type = CCKpiActionTypes.CCKpisPageRequested;
    constructor(public payload: { page: QueryParamsModel }) { }
}

export class CCKpisPageLoaded implements Action {
    readonly type = CCKpiActionTypes.CCKpisPageLoaded;
    constructor(public payload: { kpis: CCKpi[], totalCount: number, page: QueryParamsModel }) { }
}

export class CCKpisPageCancelled implements Action {
    readonly type = CCKpiActionTypes.CCKpisPageCancelled;
}

export class AllCCKpisRequested implements Action {
    readonly type = CCKpiActionTypes.AllCCKpisRequested;
}

export class AllCCKpisLoaded implements Action {
    readonly type = CCKpiActionTypes.AllCCKpisLoaded;
    constructor(public payload: { kpis: CCKpi[] }) { }
}

export class CCKpisPageToggleLoading implements Action {
    readonly type = CCKpiActionTypes.CCKpisPageToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export class CCKpisActionToggleLoading implements Action {
    readonly type = CCKpiActionTypes.CCKpisActionToggleLoading;
    constructor(public payload: { isLoading: boolean }) { }
}

export type CCKpiActions = CCKpiCreated
| CCKpiUpdated
| CCKpiDeleted
| CCKpisPageRequested
| CCKpisPageLoaded
| CCKpisPageCancelled
| AllCCKpisLoaded
| AllCCKpisRequested
| CCKpiOnServerCreated
| CCKpisPageToggleLoading
| CCKpisActionToggleLoading;
