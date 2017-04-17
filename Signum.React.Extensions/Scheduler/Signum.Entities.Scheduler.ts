//////////////////////////////////
//Auto-generated. Do NOT modify!//
//////////////////////////////////

import { MessageKey, QueryKey, Type, EnumType, registerSymbol } from '../../../Framework/Signum.React/Scripts/Reflection'
import * as Entities from '../../../Framework/Signum.React/Scripts/Signum.Entities'
import * as Basics from '../../../Framework/Signum.React/Scripts/Signum.Entities.Basics'
import * as Authorization from '../Authorization/Signum.Entities.Authorization'


export const ApplicationEventLogEntity = new Type<ApplicationEventLogEntity>("ApplicationEventLog");
export interface ApplicationEventLogEntity extends Entities.Entity {
    Type: "ApplicationEventLog";
    machineName?: string | null;
    date?: string;
    globalEvent?: TypeEvent;
}

export const HolidayCalendarEntity = new Type<HolidayCalendarEntity>("HolidayCalendar");
export interface HolidayCalendarEntity extends Entities.Entity {
    Type: "HolidayCalendar";
    name?: string | null;
    holidays: Entities.MList<HolidayEmbedded>;
}

export module HolidayCalendarOperation {
    export const Save : Entities.ExecuteSymbol<HolidayCalendarEntity> = registerSymbol("Operation", "HolidayCalendarOperation.Save");
    export const Delete : Entities.DeleteSymbol<HolidayCalendarEntity> = registerSymbol("Operation", "HolidayCalendarOperation.Delete");
}

export const HolidayEmbedded = new Type<HolidayEmbedded>("HolidayEmbedded");
export interface HolidayEmbedded extends Entities.EmbeddedEntity {
    Type: "HolidayEmbedded";
    date?: string;
    name?: string | null;
}

export interface IScheduleRuleEntity extends Entities.Entity {
}

export interface ITaskEntity extends Entities.Entity {
}

export const ScheduledTaskEntity = new Type<ScheduledTaskEntity>("ScheduledTask");
export interface ScheduledTaskEntity extends Entities.Entity {
    Type: "ScheduledTask";
    rule?: IScheduleRuleEntity | null;
    task?: ITaskEntity | null;
    suspended?: boolean;
    machineName?: string | null;
    user?: Entities.Lite<Basics.IUserEntity> | null;
    applicationName?: string | null;
}

export const ScheduledTaskLogEntity = new Type<ScheduledTaskLogEntity>("ScheduledTaskLog");
export interface ScheduledTaskLogEntity extends Entities.Entity {
    Type: "ScheduledTaskLog";
    scheduledTask?: ScheduledTaskEntity | null;
    user?: Entities.Lite<Basics.IUserEntity> | null;
    task?: ITaskEntity | null;
    startTime?: string;
    endTime?: string | null;
    machineName?: string | null;
    applicationName?: string | null;
    productEntity?: Entities.Lite<Entities.Entity> | null;
    exception?: Entities.Lite<Basics.ExceptionEntity> | null;
}

export module ScheduledTaskOperation {
    export const Save : Entities.ExecuteSymbol<ScheduledTaskEntity> = registerSymbol("Operation", "ScheduledTaskOperation.Save");
    export const Delete : Entities.DeleteSymbol<ScheduledTaskEntity> = registerSymbol("Operation", "ScheduledTaskOperation.Delete");
}

export module SchedulerMessage {
    export const Each0Hours = new MessageKey("SchedulerMessage", "Each0Hours");
    export const Each0Minutes = new MessageKey("SchedulerMessage", "Each0Minutes");
    export const ScheduleRuleDailyEntity = new MessageKey("SchedulerMessage", "ScheduleRuleDailyEntity");
    export const ScheduleRuleDailyDN_Everydayat = new MessageKey("SchedulerMessage", "ScheduleRuleDailyDN_Everydayat");
    export const ScheduleRuleDayDN_StartingOn = new MessageKey("SchedulerMessage", "ScheduleRuleDayDN_StartingOn");
    export const ScheduleRuleHourlyEntity = new MessageKey("SchedulerMessage", "ScheduleRuleHourlyEntity");
    export const ScheduleRuleMinutelyEntity = new MessageKey("SchedulerMessage", "ScheduleRuleMinutelyEntity");
    export const ScheduleRuleWeekDaysEntity = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysEntity");
    export const ScheduleRuleWeekDaysDN_AndHoliday = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_AndHoliday");
    export const ScheduleRuleWeekDaysDN_At = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_At");
    export const ScheduleRuleWeekDaysDN_ButHoliday = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_ButHoliday");
    export const ScheduleRuleWeekDaysDN_Calendar = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_Calendar");
    export const ScheduleRuleWeekDaysDN_F = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_F");
    export const ScheduleRuleWeekDaysDN_Friday = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_Friday");
    export const ScheduleRuleWeekDaysDN_Holiday = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_Holiday");
    export const ScheduleRuleWeekDaysDN_M = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_M");
    export const ScheduleRuleWeekDaysDN_Monday = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_Monday");
    export const ScheduleRuleWeekDaysDN_S = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_S");
    export const ScheduleRuleWeekDaysDN_Sa = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_Sa");
    export const ScheduleRuleWeekDaysDN_Saturday = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_Saturday");
    export const ScheduleRuleWeekDaysDN_Sunday = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_Sunday");
    export const ScheduleRuleWeekDaysDN_T = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_T");
    export const ScheduleRuleWeekDaysDN_Th = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_Th");
    export const ScheduleRuleWeekDaysDN_Thursday = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_Thursday");
    export const ScheduleRuleWeekDaysDN_Tuesday = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_Tuesday");
    export const ScheduleRuleWeekDaysDN_W = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_W");
    export const ScheduleRuleWeekDaysDN_Wednesday = new MessageKey("SchedulerMessage", "ScheduleRuleWeekDaysDN_Wednesday");
    export const ScheduleRuleWeeklyEntity = new MessageKey("SchedulerMessage", "ScheduleRuleWeeklyEntity");
    export const ScheduleRuleWeeklyDN_DayOfTheWeek = new MessageKey("SchedulerMessage", "ScheduleRuleWeeklyDN_DayOfTheWeek");
    export const Day0At1In2 = new MessageKey("SchedulerMessage", "Day0At1In2");
}

export module SchedulerPermission {
    export const ViewSchedulerPanel : Authorization.PermissionSymbol = registerSymbol("Permission", "SchedulerPermission.ViewSchedulerPanel");
}

export const ScheduleRuleMinutelyEntity = new Type<ScheduleRuleMinutelyEntity>("ScheduleRuleMinutely");
export interface ScheduleRuleMinutelyEntity extends Entities.Entity, IScheduleRuleEntity {
    Type: "ScheduleRuleMinutely";
    eachMinutes?: number;
    isAligned?: boolean;
}

export const ScheduleRuleMonthsEntity = new Type<ScheduleRuleMonthsEntity>("ScheduleRuleMonths");
export interface ScheduleRuleMonthsEntity extends Entities.Entity, IScheduleRuleEntity {
    Type: "ScheduleRuleMonths";
    startingOn?: string;
    january?: boolean;
    february?: boolean;
    march?: boolean;
    april?: boolean;
    may?: boolean;
    june?: boolean;
    july?: boolean;
    august?: boolean;
    september?: boolean;
    october?: boolean;
    november?: boolean;
    december?: boolean;
}

export const ScheduleRuleWeekDaysEntity = new Type<ScheduleRuleWeekDaysEntity>("ScheduleRuleWeekDays");
export interface ScheduleRuleWeekDaysEntity extends Entities.Entity, IScheduleRuleEntity {
    Type: "ScheduleRuleWeekDays";
    startingOn?: string;
    monday?: boolean;
    tuesday?: boolean;
    wednesday?: boolean;
    thursday?: boolean;
    friday?: boolean;
    saturday?: boolean;
    sunday?: boolean;
    calendar?: HolidayCalendarEntity | null;
    holiday?: boolean;
}

export const SimpleTaskSymbol = new Type<SimpleTaskSymbol>("SimpleTask");
export interface SimpleTaskSymbol extends Entities.Symbol, ITaskEntity {
    Type: "SimpleTask";
}

export module TaskMessage {
    export const Execute = new MessageKey("TaskMessage", "Execute");
    export const Executions = new MessageKey("TaskMessage", "Executions");
    export const LastExecution = new MessageKey("TaskMessage", "LastExecution");
}

export module TaskOperation {
    export const ExecuteSync : Entities.ConstructSymbol_From<Entities.Entity, ITaskEntity> = registerSymbol("Operation", "TaskOperation.ExecuteSync");
    export const ExecuteAsync : Entities.ExecuteSymbol<ITaskEntity> = registerSymbol("Operation", "TaskOperation.ExecuteAsync");
}

export const TypeEvent = new EnumType<TypeEvent>("TypeEvent");
export type TypeEvent =
    "Start" |
    "Stop";


