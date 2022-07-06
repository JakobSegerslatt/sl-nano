export interface SLResponse<T> {
  StatusCode: number;
  Message?: string;
  ExecutionTime: number;
  ResponseData: T;
}

export interface SLSite {
  Name: string;
  SiteId: number;
  Type: string;
  X: string;
  Y: string;
  Products?: any;
}

export interface SLRealtime {
  LatestUpdate: Date;
  DataAge: number;
  Metros: Departure[];
  Buses: Departure[];
  Trains: Departure[];
  Trams: Departure[];
  Ships: Ship[];
  StopPointDeviations: StopPointDeviation[];
}

export interface Departure {
  GroupOfLine: string;
  DisplayTime: string;
  TransportMode: string;
  LineNumber: string;
  Destination: string;
  JourneyDirection: JourneyDirection;
  StopAreaName: string;
  StopAreaNumber: number;
  StopPointNumber: number;
  StopPointDesignation: string;
  TimeTabledDateTime: Date;
  ExpectedDateTime: Date;
  JourneyNumber: number;
  Deviations?: any;
}

export interface Deviation {
  Text: string;
  Consequence: string;
  ImportanceLevel: number;
}

export enum JourneyDirection {
  SOUTH = 1,
  NORTH = 2,
}

export interface Ship {
  TransportMode: string;
  LineNumber: string;
  Destination: string;
  JourneyDirection: JourneyDirection;
  GroupOfLine: string;
  StopAreaName: string;
  StopAreaNumber: number;
  StopPointNumber: number;
  StopPointDesignation?: any;
  TimeTabledDateTime: Date;
  ExpectedDateTime: Date;
  DisplayTime: string;
  JourneyNumber: number;
  Deviations: Deviation[];
}

export interface StopInfo {
  StopAreaNumber: number;
  StopAreaName: string;
  TransportMode: string;
  GroupOfLine: string;
}

export interface StopPointDeviation {
  StopInfo: StopInfo;
  Deviation: Deviation;
}



export interface ServiceDay {
  planningPeriodBegin: string;
  planningPeriodEnd: string;
  sDaysR: string;
  sDaysB: string;
}

export interface RoutePlannerLocation {
  name: string;
  type: string;
  id: string;
  extId: string;
  lon: number;
  lat: number;
  prognosisType: string;
  time: string;
  date: string;
  track: string;
  rtTime: string;
  rtDate: string;
  hasMainMast: boolean;
  mainMastId: string;
  mainMastExtId: string;
  additional: boolean;

  // Added in frontend
  ExpectedDateTime: Date;
}

export interface JourneyDetailRef {
  ref: string;
}

export interface Product {
  name: string;
  num: string;
  line: string;
  catOut: string;
  catIn: string;
  catCode: string;
  catOutS: string;
  catOutL: string;
  operatorCode: string;
  operator: string;
  admin: string;
}

export interface Leg {
  Origin: RoutePlannerLocation;
  Destination: RoutePlannerLocation;
  JourneyDetailRef: JourneyDetailRef;
  JourneyStatus: string;
  Product: Product;
  Stops?: any;
  idx: string;
  name: string;
  number: string;
  category: string;
  type: string;
  duration?: string;
  reachable: boolean;
  redirected: boolean;
  direction: string;
}

export interface LegList {
  Leg: Leg[];
}

export interface FareItem {
  name: string;
  desc: string;
  price: number;
  cur: string;
}

export interface FareSetItem {
  fareItem: FareItem[];
  name: string;
  desc: string;
}

export interface TariffResult {
  fareSetItem: FareSetItem[];
}

export interface Trip {
  ServiceDays: ServiceDay[];
  LegList: LegList;
  TariffResult: TariffResult;
  alternative: boolean;
  valid: boolean;
  idx: number;
  tripId: string;
  ctxRecon: string;
  duration: string;
  return: boolean;
  checksum: string;
  transferCount: number;
}

export interface RoutePlannerResponse {
  Trip: Trip[];
  scrB: string;
  scrF: string;
  serverVersion: string;
  dialectVersion: string;
  requestId: string;
}
