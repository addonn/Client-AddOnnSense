import { Injectable } from "@angular/core";

@Injectable()
export class AppConstants {
    public static EVENT_TYPE_ORDER = 'order';
    public static EVENT_TYPE_TIMESHEET = 'timesheet';
    public static EVENT_TYPE_INCIDENT = 'incident';

    public static STORAGE_KEY_FOREMAN_PICTURE = '{ACCOUNT}_{USERNAME}_FOREMAN_PICTURE_';
    public static STORAGE_KEY_BUILDING_PICTURE = '{ACCOUNT}_{USERNAME}_BUILDING_PICTURE_';
    public static STORAGE_KEY_MASTERDATA_REASONS = '{ACCOUNT}_{USERNAME}_MASTERDATA_REASONS';
    public static STORAGE_KEY_MASTERDATA_RESULTS = '{ACCOUNT}_{USERNAME}_MASTERDATA_RESULTS';
    public static STORAGE_KEY_MASTERDATA_CHECKIN_REASONS = '{ACCOUNT}_{USERNAME}_MASTERDATA_CHECKIN_REASONS';
    public static STORAGE_KEY_MASTERDATA_RESOURCE_ACTIVITY_TYPES = '{ACCOUNT}_{USERNAME}_MASTERDATA_RESOURCE_ACTIVITY_TYPES';
    public static STORAGE_KEY_APPCONFIGURATION = '{ACCOUNT}_{USERNAME}_APPCONFIGURATION_RESULTS';
    public static STORAGE_KEY_CALENDER_EVENTS_ONDATE = '{ACCOUNT}_{USERNAME}_CALENDER_EVENTS_ONDATE_';
    public static STORAGE_KEY_VARIABLE_CALENDER_EVENTS_ONMONTH = '{ACCOUNT}_{USERNAME}_VARIABLE_CALENDER_EVENTS_ONMONTH_';
    public static STORAGE_KEY_CLEANING_EVENT_DATES = '{ACCOUNT}_{USERNAME}_CLEANING_EVENT_DATES_';
    public static STORAGE_KEY_SIGNOFF_ONDATE = '{ACCOUNT}_{USERNAME}_SIGNOFF_ONDATE_{DATE}_{ORDERPRIMARYKEY}_{TIMESTAMP}';
    public static STORAGE_KEY_DOCUMENT = '{ACCOUNT}_{USERNAME}_DOCUMENT_{DATE}_{TYPE}_{OBJECTID}_{TIMESTAMP}';
    public static STORAGE_KEY_TIMESHEET_ONDATE = '{ACCOUNT}_{USERNAME}_TIMESHEET_ONDATE_';
    public static STORAGE_KEY_LASTSYNC_DATE = '{ACCOUNT}_{USERNAME}_LASTSYNC_DATE';
    public static STORAGE_KEY_ORDERSTATUS_CHANGE = '{ACCOUNT}_{USERNAME}_ORDER_{ORDERID}_STATUS_CHANGE';
    public static STORAGE_KEY_TIMESHEET_EVENT_DATES = '{ACCOUNT}_{USERNAME}_TIMESHEET_EVENT_DATES_';
    public static LOCALSTORAGE_KEY_LOGGEDIN_USER: string = 'LOGGED_IN_USERS';
    public static LOCALSTORAGE_KEY_STARTUP_SLIDES: string = 'STARTUP_SLIDES_VIEWED';
    public static LOCALSTORAGE_KEY_APP_LANGUAGE: string = 'STARTUP_APP_LANGUAGE';
    public static LOCALSTORAGE_APP_LANGUAGE_CODE = 'STARTUP_LANGUAGE_CODE';
    public static STORAGE_ACCOUNT = 'ACCOUNT_{ACCOUNT}';
    public static STORAGE_KEY_MASTERDATA_ACTIVITY_CATEGORY = '{ACCOUNT}_{USERNAME}_MASTERDATA_ACTIVITY_CATEGORY';
    public static STORAGE_KEY_RESOURCE_ACTIVITY_ATTACHMENTS = '{ACCOUNT}_{USERNAME}_{CLIENTID}_RESOURCE_ACTIVITY_ATTACHMENTS';

    public static STORAGE_LOG_ERRORS = '{ACCOUNT}_{USERNAME}_LOG_ERRORS'
    public static STORAGE_KEY_MAPS_DATA = '{ACCOUNT}_{USERNAME}_MAPS_DATA_{FLOORPK}';
    public static STORAGE_KEY_SETTING_PREFERENCE = '{ACCOUNT}_{USERNAME}_SETTING_PREFERENCES';
    public static STORAGE_KEY_IMAGES_LASTSYNC_DATE = '{ACCOUNT}_{USERNAME}_IMAGES_LASTSYNC_DATE';
    public static STORAGE_TASK_IMAGE = '{ACCOUNT}_{USERNAME}_TASK_IMAGE_';
    public static STORAGE_TASK_IMAGES_KEYS = 'STORAGE_TASK_IMAGES_KEYS';
    public static GATEWAY_URL_GET_TASK_IMAGES = '/addonn/accounts/images';
    public static GATEWAY_URL_GET_ACCOUNT = '/addonn/accounts/{accountname}';
    public static GATEWAY_URL_LOCATION = '/foreman/{username}/buildings';

    public static SYNC_METHOD_CLEAN_ACTIVITIES = 'CLEAN_ACTIVITIES';
    public static SYNC_METHOD_TIMESHEET = 'TIMESHEET';
    public static SYNC_METHOD_SIGNOFF = 'SIGNOFF';
    public static SYNC_METHOD_GENERIC = 'GENERIC';
    public static SYNC_METHOD_DOCUMENT_ARRAY = 'DOCUMENT_ARRAY';
    public static SYNC_METHOD_REACTIVE_ORDER = 'REACTIVEORDER';
    public static SYNC_METHOD_ORDER_STATUS_CHANGE = 'ORDERSTATUSCHANGE';

    public static DOCUMENT_TYPE_SIGNOFF_SIGNATURE = 'SIGNOFF';
    public static DOCUMENT_TYPE_CHECKLISTITEM_ISSUE_PICTURE = 'CHECKLISTITEM';
    public static DOCUMENT_TYPE_CHECKIN = 'CHECKIN';
    public static DOCUMENT_TYPE_REACTIVEORDER = 'REACTIVEORDER';
    public static DOCUMENT_TYPE_SIGNOFF_CUSTOMER_SIGNATURE = "CUSTOMER_SIGNOFF";
    public static DOCUMENT_TYPE_SIGNOFF_ENGINEER_SIGNATURE = "ENGINEER_SIGNOFF";
    // public static STORAGE_CALENDER_EVENTS_ONWEEK="STORE_CALENDER_EVENTS_ONWEEK_";
    // public static STORAGE_TIMESHEET_ONWEEK="STORE_TIMESHEET_ONWEEK_";

    public static RESOURCE_ACTICITY_ATTACHMENT = 'USRATTACHMENT';
    public static KEY_TO_EXTERNAL_LINKS = "EXTERNAL_LINKS";

    public static CLEANINGACTIVITY_INPROGRESS_STATUS = 'INPROGRESS';
    public static CLEANINGACTIVITY_COMPLETION_STATUS = 'COMPLETED';
    public static CLEANINGACTIVITY_COMPLETION_WITH_OBSERVATION_STATUS = 'COMPLETED_WITHOBSERVATION';
    public static CLEANINGACTIVITY_PARTIALLY_COMPLETE_STATUS = 'PARTIALLY_COMPLETED';
    public static CLEANINGACTIVITY_CANCELLED_STATUS = 'CANCELLED';

    public static CLEANINGACTIVITY_CHECKLISTITEM_INPROGRESS_STATUS = 'INPROGRESS';
    public static CLEANINGACTIVITY_CHECKLISTITEM_COMPLETION_STATUS = 'COMPLETED';
    public static CLEANINGACTIVITY_CHECKLISTITEM_COMPLETION_WITH_OBSERVATION_STATUS = 'COMPLETED_WITHOBSERVATION';
    public static CLEANINGACTIVITY_CHECKLISTITEM_FORCEINPROGRESS_STATUS = 'FROCE_INPROGRESS';
    public static CLEANINGACTIVITY_CHECKLISTITEM_PARTIALLY_COMPLETE_STATUS = 'PARTIALLY_COMPLETED';
    public static CLEANINGACTIVITY_CHECKLISTITEM_CANCELLED_STATUS = 'CANCELLED';
    public static CLEANINGACTIVITY_CHECKLISTITEM_MODIFIEDSTATUS_ADDED = '01';
    public static CLEANINGACTIVITY_CHECKLISTITEM_MODIFIEDSTATUS_CANCELED = '03';

    public static ZONE_COMPLETION_STATUS = 'COMPLETED';
    public static ZONE_INPROGRESS_STATUS = 'INPROGRESS';
    public static ZONE_COMPLETION_WITH_OBSERVATION_STATUS = 'COMPLETED_WITHOBSERVATION';
    public static ZONE_PARTIALLY_COMPLETE_STATUS = 'PARTIALLY_COMPLETED';
    public static ZONE_CANCELLED_STATUS = 'CANCELLED';

    public static SPACE_INPROGRESS_STATUS = 'INPROGRESS';
    public static SPACE_COMPLETION_STATUS = 'COMPLETED';
    public static SPACE_COMPLETION_WITH_OBSERVATION_STATUS = 'COMPLETED_WITHOBSERVATION';
    public static SPACE_PARTIALLY_COMPLETE_STATUS = 'PARTIALLY_COMPLETED';
    public static SPACE_CANCELLED_STATUS = 'CANCELLED';

    public static CLEANING_ORDER_STATUS_CHECK_IN = 'CHECK_IN';
    public static CLEANING_ORDER_STATUS_START_SHIFT = 'START_SHIFT';
    public static CLEANING_ORDER_STATUS_INPROGRESS = 'INPROGRESS';
    public static CLEANING_ORDER_STATUS_COMPLETED = 'COMPLETED';
    public static CLEANING_ORDER_STATUS_PARTIALLY_COMPLETED = 'PARTIALLY_COMPLETED';

    public static SPACE_MODIFIED_STATUS_UPDATED = 'UPDATED';
    public static ZONE_MODIFIED_STATUS_UPDATED = 'UPDATED';


    public static REACTIVE_ORDER_STATUS_DECLINED = 'DECLINED';
    public static REACTIVE_ORDER_STATUS_ACCEPTED = 'ACCEPTED';
    public static REACTIVE_ORDER_STATUS_STARTED = 'STARTED';
    public static REACTIVE_ORDER_STATUS_INPROGRESS = 'INPROGRESS';
    public static REACTIVE_ORDER_STATUS_COMPLETED = 'COMPLETED';
    public static REACTIVE_ORDER_STATUS_PAUSED = 'PAUSED';
    // public static REACTIVE_ORDER_STATUS_CANCELLED = "CANCELLED";
    public static REACTIVE_ORDER_STATUS_INITIAL = 'INITIAL';

    public static GATEWAY_URL_LOGIN: string = '/addonn/users/{username}';
    public static GATEWAY_URL_ACCOUNT: string = '/addonn/accounts/{id}';
    public static GATEWAY_URL_GET_CLEANING_ORDERS: string = '/cleanonn/users/{username}/cleaningorders';
    public static GATEWAY_URL_GET_CLEANING_EVENTS: string = '/cleanonn/users/{username}/cleaningorders/dates';
    public static GATEWAY_URL_GET_TIMESHEET: string = '/addonn/users/{username}/timesheets';
    public static GATEWAY_URL_PUT_CLEANING_ORDER_DETAILS: string = '/cleanonn/users/{username}/cleaningorders/{Id}';
    public static GATEWAY_URL_POST_CLEANING_ORDER_SIGNOFF: string = '/cleanonn/users/{username}/cleaningorders/{Id}/signoff';
    public static GATEWAY_URL_GET_DOCUMENTS: string = '/addonn/users/{username}/documents';
    public static GATEWAY_URL_GET_DOCUMENT: string = '/addonn/users/{username}/document';
    public static GATEWAY_URL_POST_DOCUMENT: string = '/addonn/users/{username}/document';
    public static GATEWAY_URL_GET_TIMESHEET_EVENTS: string = '/addonn/users/{username}/timesheets/dates';
    public static GATEWAY_URL_POST_TIMESHEET: string = '/addonn/users/{username}/timesheets';
    public static GATEWAY_URL_GET_BUILDING_IMAGE: string = '/addonn/buildings/{id}/image';
    public static GATEWAY_URL_GET_MASTERDATA: string = '/cleanonn/app/masterdata';
    public static GATEWAY_URL_GET_TRANSLATIONS: string = '/addonn/cleanonn/translations/';
    public static GATEWAY_URL_GET_USER_IMAGE = '/addonn/persons/{id}/image';
    public static GATEWAY_URL_GET_PERSON = '/addonn/persons/{id}';
    public static GATEWAY_URL_POST_INCIDENTS = '/addonn/incidents';
    public static GATEWAY_URL_POST_REACTIVEORDERS = '/addonn/reactiveorders';
    public static GATEWAY_URL_PUT_CHANGESTATUS = '/addonn/orders/{id}/status';
    public static GATEWAY_URL_PUT_DEVICEID: string = '/addonn/users/{username}/device';
    public static GATEWAY_URL_GET_MAPS = '/cleanonn/users/{username}/cleaningorders/floor/';


    public static NOTIFICATION_ACTION_MAINTENANCEACTIVITY_UNASSIGNED = 'MAINTENANCEACTIVITY_UNASSIGNED';
    public static NOTIFICATION_ACTION_MAINTENANCEACTIVITY_ASSIGNED = 'MAINTENANCEACTIVITY_ASSIGNED';
    public static NOTIFICATION_ACTION_ORDER_ASSIGNED = 'ORDER_ASSIGNED';
    public static NOTIFICATION_ACTION_ORDER_UNASSIGNED = 'ORDER_UNASSIGNED';
    public static NOTIFICATION_ACTION_ORDER_CANCELLED = 'ORDER_CANCELLED';
    public static NOTIFICATION_ACTION_ORDER_DELETED = 'ORDER_DELETED';
    public static NOTIFICATION_ACTION_FOREMAN_CHANGED = 'FOREMAN_CHANGED';
    public static NOTIFICATION_ACTION_FOREMAN_REMOVED = 'FOREMAN_REMOVED';


    public static TIMESHEET_STATUS_DELETE = 'DELETE'

    // public static ERROR_NETWORK_OFFLINE: any = {"status":502,"message":"Offline, Please come to online to make a backend call."};
    public static ERROR_NETWORK_OFFLINE_TRANSLATION_KEY = 'message.offline';
    public static KEYS_OF_THE_STORAGE_TOSYNC = 'KEYS_OF_THE_STORAGE_TOSYNC';
    // public static GALLERY_CONFIGURATION: GALLERY_CONF = {
    //     imageOffset: '0px',
    //     showDeleteControl: true,
    //     showImageTitle: false,
    //     showThumbnails: false,
    //     showCloseControl: false,
    //     inline: true,
    //     backdropColor: '#f3f5fd',
    //     showArrows: false
    // };
    constructor() {

    }


    public cleaningActivityInProgressStatus(){
        return AppConstants.CLEANINGACTIVITY_INPROGRESS_STATUS;
    }
    public cleaningActivityCompletionStatus(){
        return AppConstants.CLEANINGACTIVITY_COMPLETION_STATUS;
    }
    public cleaningActivityCompletionWithObservationStatus(){
        return AppConstants.CLEANINGACTIVITY_COMPLETION_WITH_OBSERVATION_STATUS;
    }
    public cleaningActivityPartiallyCompleteStatus(){
        return AppConstants.CLEANINGACTIVITY_PARTIALLY_COMPLETE_STATUS;
    }

    public cleaningActivityCheckListItemInProgressStatus(){
        return AppConstants.CLEANINGACTIVITY_CHECKLISTITEM_INPROGRESS_STATUS;
    }
    public cleaningActivityCheckListItemCompletionStatus(){
        return AppConstants.CLEANINGACTIVITY_CHECKLISTITEM_COMPLETION_STATUS;
    }
    public cleaningActivityCheckListItemCompletionWithObservationStatus(){
        return AppConstants.CLEANINGACTIVITY_CHECKLISTITEM_COMPLETION_WITH_OBSERVATION_STATUS;
    }
    public cleaningActivityCheckListItemForceInProgressStatus(){
        return AppConstants.CLEANINGACTIVITY_CHECKLISTITEM_FORCEINPROGRESS_STATUS;
    }
    public cleaningActivityCheckListItemPartiallyCompleteStatus(){
        return AppConstants.CLEANINGACTIVITY_CHECKLISTITEM_PARTIALLY_COMPLETE_STATUS;
    }

    public zoneCompletionStatus() {
        return AppConstants.ZONE_COMPLETION_STATUS;
    }
    public zoneCompletionWithObservationStatus() {
        return AppConstants.ZONE_COMPLETION_WITH_OBSERVATION_STATUS;
    }
    public zoneInProgressStatus() {
        return AppConstants.ZONE_INPROGRESS_STATUS;
    }
    public zonePartiallyCompleteStatus() {
        return AppConstants.ZONE_PARTIALLY_COMPLETE_STATUS;
    }

    public spaceCompletionStatus() {
        return AppConstants.SPACE_COMPLETION_STATUS;
    }
    public spaceCompletionWithObservationStatus() {
        return AppConstants.SPACE_COMPLETION_WITH_OBSERVATION_STATUS;
    }
    public spaceInProgressStatus() {
        return AppConstants.SPACE_INPROGRESS_STATUS;
    }
    public spacePartiallyCompleteStatus() {
        return AppConstants.SPACE_PARTIALLY_COMPLETE_STATUS;
    }

    public cleaningOrderStatusCheckIn(): string {
        return AppConstants.CLEANING_ORDER_STATUS_CHECK_IN;
    }

    public cleaningOrderStatusStartShift(): string {
        return AppConstants.CLEANING_ORDER_STATUS_START_SHIFT;
    }

    public cleaningOrderStatusInProgress(): string {
        return AppConstants.CLEANING_ORDER_STATUS_INPROGRESS;
    }

    public cleaningOrderStatusCompleted(): string {
        return AppConstants.CLEANING_ORDER_STATUS_COMPLETED;
    }

    public cleaningOrderStatusPartiallyCompleted(): string {
        return AppConstants.CLEANING_ORDER_STATUS_PARTIALLY_COMPLETED;
    }

    public reactiveOrderStatusDeclined(): string {
        return AppConstants.REACTIVE_ORDER_STATUS_DECLINED;
    }

    public reactiveOrderStatusAccepted(): string {
        return AppConstants.REACTIVE_ORDER_STATUS_ACCEPTED;
    }

    public reactiveOrderStatusStarted(): string {
        return AppConstants.REACTIVE_ORDER_STATUS_STARTED;
    }
    public reactiveOrderStatusInProgress(): string {
        return AppConstants.REACTIVE_ORDER_STATUS_INPROGRESS;
    }

    public reactiveOrderStatusCompleted(): string {
        return AppConstants.REACTIVE_ORDER_STATUS_COMPLETED;
    }
    public reactiveOrderStatusPaused(): string {
        return AppConstants.REACTIVE_ORDER_STATUS_PAUSED;
    }

    public reactiveOrderStatusInitial(): string {
        return AppConstants.REACTIVE_ORDER_STATUS_INITIAL;
    }
}