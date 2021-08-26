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
