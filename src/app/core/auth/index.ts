// SERVICES
export { AuthService,AdminService,GadgetService,AuthCampaignService} from './_services';

export { AuthNoticeService } from './auth-notice/auth-notice.service';

// DATA SOURCERS
export { RolesDataSource } from './_data-sources/roles.datasource';
export { CCRolesDataSource } from './_data-sources/ccroles.datasource';
export { CallCentersDataSource } from './_data-sources/callcenter.datasource';
export { CCKpisDataSource } from './_data-sources/cckpi.datasource';
export { MeetingDataSource } from './_data-sources/meeting.datasource';
export { ActivitysDataSource } from './_data-sources/ccactivitys.datasource';
export { UsersDataSource } from './_data-sources/users.datasource';
export { ActionTrackerTopicConversationsDataSource } from './_data-sources/actiontrackertopicconversation.datasource';
export { ActionTrackerTopicsDataSource } from './_data-sources/actiontrackertopic.datasource';
export { ActionTrackersDataSource } from './_data-sources/actiontracker.datasource';



// ACTIONS
export {
    login,
    logout,
    register,
    userRequested,
    userLoaded,
    AuthActionTypes
} from './_actions/auth.actions';
export {
    AllPermissionsRequested,
    AllPermissionsLoaded,
    PermissionActionTypes,
    PermissionActions
} from './_actions/permission.actions';
export {
    RoleOnServerCreated,
    RoleCreated,
    RoleUpdated,
    RoleDeleted,
    RolesPageRequested,
    RolesPageLoaded,
    RolesPageCancelled,
    AllRolesLoaded,
    AllRolesRequested,
    RoleActionTypes,
    RoleActions
} from './_actions/role.actions';
export {
    CCRoleOnServerCreated,
    CCRoleCreated,
    CCRoleUpdated,
    CCRoleDeleted,
    CCRolesPageRequested,
    CCRolesPageLoaded,
    CCRolesPageCancelled,
    AllCCRolesLoaded,
    AllCCRolesRequested,
    CCRoleActionTypes,
    CCRoleActions
} from './_actions/ccrole.actions';
export {
    CallCenterOnServerCreated,
    CallCenterCreated,
    CallCenterUpdated,
    CallCenterDeleted,
    CallCentersPageRequested,
    CallCentersPageLoaded,
    CallCentersPageCancelled,
    AllCallCentersLoaded,
    AllCallCentersRequested,
    CallCenterActionTypes,
    CallCenterActions
} from './_actions/calcenter.actions';
export {
    CCKpiOnServerCreated,
    CCKpiCreated,
    CCKpiUpdated,
    CCKpiDeleted,
    CCKpisPageRequested,
    CCKpisPageLoaded,
    CCKpisPageCancelled,
    AllCCKpisLoaded,
    AllCCKpisRequested,
    CCKpiActionTypes,
    CCKpiActions
} from './_actions/cckpi.actions';
export {
    MeetingOnServerCreated,
    MeetingCreated,
    MeetingUpdated,
    MeetingDeleted,
    MeetingsPageRequested,
    MeetingsPageLoaded,
    MeetingsPageCancelled,
    AllMeetingsLoaded,
    AllMeetingsRequested,
    MeetingActionTypes,
    MeetingActions
} from './_actions/meeting.actions';
export {
    ActivityOnServerCreated,
    ActivityCreated,
    ActivityUpdated,
    ActivityDeleted,
    ActivitysPageRequested,
    ActivitysPageLoaded,
    ActivitysPageCancelled,
    AllActivitysLoaded,
    AllActivitysRequested,
    ActivityActionTypes,
    ActivityActions
} from './_actions/ccactivity.actions';
export {
    UserCreated,
    UserUpdated,
    UserDeleted,
    UserOnServerCreated,
    UsersPageLoaded,
    UsersPageCancelled,
    UsersPageToggleLoading,
    UsersPageRequested,
    UsersActionToggleLoading
} from './_actions/user.actions';

export {
    ActionTrackerCreated,
    ActionTrackerUpdated,
    ActionTrackerDeleted,
    ActionTrackerOnServerCreated,
    ActionTrackersPageLoaded,
    ActionTrackersPageCancelled,
    ActionTrackersPageToggleLoading,
    ActionTrackersPageRequested,
    ActionTrackersActionToggleLoading
} from './_actions/actiontracker.actions';


export {
    ActionTrackerTopicCreated,
    ActionTrackerTopicUpdated,
    ActionTrackerTopicDeleted,
    ActionTrackerTopicOnServerCreated,
    ActionTrackerTopicsPageLoaded,
    ActionTrackerTopicsPageCancelled,
    ActionTrackerTopicsPageToggleLoading,
    ActionTrackerTopicsPageRequested,
    ActionTrackerTopicsActionToggleLoading
} from './_actions/actiontrackertopic.actions';

export {
    ActionTrackerTopicConversationCreated,
    ActionTrackerTopicConversationUpdated,
    ActionTrackerTopicConversationDeleted,
    ActionTrackerTopicConversationOnServerCreated,
    ActionTrackerTopicConversationsPageLoaded,
    ActionTrackerTopicConversationsPageCancelled,
    ActionTrackerTopicConversationsPageToggleLoading,
    ActionTrackerTopicConversationsPageRequested,
    ActionTrackerTopicConversationsActionToggleLoading
} from './_actions/actiontrackertopicconversation.actions';
// EFFECTS
export { AuthEffects } from './_effects/auth.effects';
export { PermissionEffects } from './_effects/permission.effects';
export { RoleEffects } from './_effects/role.effects';
export { CCRoleEffects } from './_effects/ccrole.effects';
export { CallCenterEffects } from './_effects/callcenter.effects';
export { CCKpiEffects } from './_effects/cckpi.effects';
export { MeetingEffects } from './_effects/meeting.effects';
export { ActivityEffects } from './_effects/ccactivity.effects';
export { UserEffects } from './_effects/user.effects';
export { ActionTrackerEffects } from './_effects/actiontracker.effects';
export { ActionTrackerTopicEffects } from './_effects/actiontrackertopic.effects';
export { ActionTrackerTopicConversationEffects } from './_effects/actiontrackertopicconversation.effects';

// REDUCERS
export { reducer, getUser } from './_reducers/auth.reducers';
export { permissionsReducer } from './_reducers/permission.reducers';
export { rolesReducer } from './_reducers/role.reducers';
export { ccrolesReducer } from './_reducers/ccrole.reducers';
export { CallCenterReducer } from './_reducers/callcenter.reducers';
export { CCkpiReducer } from './_reducers/cckpi.reducers';
export { MeetingReducer } from './_reducers/meeting.reducers';
export { activityReducer } from './_reducers/ccactivity.reducers';
export { usersReducer } from './_reducers/user.reducers';
export { ActionTrackerReducer } from './_reducers/actiontracker.reducers';
export { ActionTrackerTopicReducer } from './_reducers/actiontrackertopic.reducers';
export { ActionTrackerTopicConversationReducer } from './_reducers/actiontrackertopicconversation.reducers';

// SELECTORS
export {
    isLoggedIn,
    isLoggedOut,
    isUserLoaded,
    currentAuthToken,
    currentUser,
    currentUserRoleIds,
    currentUserPermissionsIds,
    currentUserPermissions,
    checkHasUserPermission,
    getLoggedInUser
} from './_selectors/auth.selectors';
export {
    selectPermissionById,
    selectAllPermissions,
    selectAllPermissionsIds,
    allPermissionsLoaded
} from './_selectors/permission.selectors';
export {
    selectRoleById,
    selectAllRoles,
    selectAllRolesIds,
    allRolesLoaded,
    selectLastCreatedRoleId,
    selectRolesPageLoading,
    selectQueryResult,
    selectRolesActionLoading,
    selectRolesShowInitWaitingMessage
} from './_selectors/role.selectors';
export {
    selectCCRoleById,
    selectAllCCRoles,
    selectAllCCRolesIds,
    allCCRolesLoaded,
    selectLastCreatedCCRoleId,
    selectCCRolesPageLoading,
    CCRoleselectQueryResult,
    selectCCRolesActionLoading,
    selectCCRolesShowInitWaitingMessage
} from './_selectors/ccrole.selectors';
export {
    selectCallCenterById,
    selectAllCallCenters,
    selectAllCallCentersIds,
    allCallCentersLoaded,
    selectLastCreatedCallCenterId,
    selectCallCentersPageLoading,
    selectCallCenterQueryResult,
    selectCallCentersActionLoading,
    selectCallCentersShowInitWaitingMessage
} from './_selectors/callcenter.selectors';
export {
    selectCCKpiById,
    selectAllCCKpis,
    selectAllCCKpisIds,
    allCCKpisLoaded,
    selectLastCreatedCCKpiId,
    selectCCKpisPageLoading,
    CCKpiselectQueryResult,
    selectCCKpisActionLoading,
    selectCCKpisShowInitWaitingMessage
} from './_selectors/cckpi.selectors';

export {
    selectMeetingById,
    selectAllMeetings,
    selectAllMeetingsIds,
    allMeetingsLoaded,
    selectLastCreatedMeetingId,
    selectMeetingsPageLoading,
    MeetingselectQueryResult,
    selectMeetingsActionLoading,
    selectMeetingsShowInitWaitingMessage
} from './_selectors/meeting.selectors';

export {
    selectActionTrackerTopicConversationById,
    selectAllActionTrackerTopicConversations,
    selectAllActionTrackerTopicConversationsIds,
    allActionTrackerTopicConversationsLoaded,
    selectLastCreatedActionTrackerTopicConversationId,
    selectActionTrackerTopicConversationsPageLoading,
    selectActionTrackerTopicConversationQueryResult,
    selectActionTrackerTopicConversationsActionLoading,
    selectActionTrackerTopicConversationsShowInitWaitingMessage
} from './_selectors/actiontrackertopicconversation.selectors';


export {
    selectActionTrackerTopicById,
    selectAllActionTrackerTopics,
    selectAllActionTrackerTopicsIds,
    allActionTrackerTopicsLoaded,
    selectLastCreatedActionTrackerTopicId,
    selectActionTrackerTopicsPageLoading,
    selectActionTrackerTopicQueryResult,
    selectActionTrackerTopicsActionLoading,
    selectActionTrackerTopicsShowInitWaitingMessage
} from './_selectors/actiontrackertopic.selectors';


export {
    selectActionTrackerById,
    selectAllActionTrackers,
    selectAllActionTrackersIds,
    allActionTrackersLoaded,
    selectLastCreatedActionTrackerId,
    selectActionTrackersPageLoading,
    selectActionTrackerQueryResult,
    selectActionTrackersActionLoading,
    selectActionTrackersShowInitWaitingMessage
} from './_selectors/actiontracker.selectors';

export {
    selectActivityById,
    selectAllActivitys,
    selectAllActivitysIds,
    allActivitysLoaded,
    selectLastCreatedActivityId,
    selectActivitysPageLoading,
    selectActivityQueryResult,
    selectActivitysActionLoading,
    selectActivitysShowInitWaitingMessage
} from './_selectors/ccactivity.selectors';
export {
    selectUserById,
    selectUsersPageLoading,
    selectLastCreatedUserId,
    selectUsersInStore,
    selectHasUsersInStore,
    selectUsersPageLastQuery,
    selectUsersActionLoading,
    selectUsersShowInitWaitingMessage
} from './_selectors/user.selectors';

// GUARDS
export { AuthGuard } from './_guards/auth.guard';
export { ModuleGuard } from './_guards/module.guard';

// MODELS
export { User } from './_models/user.model';
export { ActionTrackerTopicOwner } from './_models/actiontrackertopicowner.model';
export { ActionTrackerTopicNames } from './_models/actiontrackertopicnames.model';
export { ActionTrackerTopicStatus } from './_models/actiontrackertopicstatus.model';
export { ActionTracker } from './_models/actiontracker.model';
export { ActionTrackerTopic } from './_models/actiontrackertopic.model';
export { ActionTrackerTopicPriority } from './_models/actiontrackertopicpriority.model';
export { ActionTrackerTopicConversation } from './_models/actiontrackertopicconversation.model'
export { Permission } from './_models/permission.model';
export { Role } from './_models/role.model';
export { CCRole } from './_models/ccrole.model';
export { CallCenter } from './_models/callcenter.model';
export { CCKpi } from './_models/cckpi.model';
export { MeetingModel } from './_models/meeting.model';
export { CCActivity } from './_models/ccactivity.model';
export { Address } from './_models/address.model';
export { SocialNetworks } from './_models/social-networks.model';
export { CalendarTask } from './_models/calendartask.model';
export {SaleCallBackTaskFilter} from './_models/salescallbacktaskfilter.model';
export {SalesCallBackTaskStatus} from './_models/salescallbacktaskstatus.model';
export {SalesCallBackTaskUsers} from './_models/salescallbacktaskusers.model';
export {SaleCallBackTaskActivity} from './_models/salescallbacktaskactivity.model';
export {SalesCallBackTaskEvent} from './_models/salescallbacktaskevent.model';
export { AuthNotice } from './auth-notice/auth-notice.interface';


export {FDAgent} from './_models/fdagent.model';
export {FDGroup} from './_models/fdgroup.model';
export {FDRole} from './_models/fdrole.model';
export {AWDBAgent} from './_models/awdbagent.model';
export { TicketCustomFields } from './_models/ticket-custom-fields.model';
export { TicketTrblIssue } from './_models/ticket-trbl-issue.model';

export {TicketDetail} from './_models/ticket-detail.model';
export {BeinUser} from './_models/bein-user.model';
export {BeinOrganization} from './_models/bein-organization.model';
export {AniInfo} from './_models/ani-info.model';
export {FDContact} from './_models/fdcontact.model';
export {AlertMessage} from './_models/alert-message.model';
export {ReportingTicketFilter} from './_models/reportingticketfilter.model';
export {TicketConversation} from './_models/ticketconversation.model';
// export { AuthDataContext } from './_server/auth.data-context';
