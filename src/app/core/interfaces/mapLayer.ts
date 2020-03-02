import { PlanService } from '@app/core';

export interface MapLayer {
  name: string;
  displayName: string;
  description: string;
  legendItems: LegendItem[];
  filePath: string;
  iconPath: string;
  secondScreenImagePath: string;
  secondScreenText: string;
  active: boolean;
  included: boolean;
  fillColor: string;
  borderColor: string;
  borderWidth: number;
  legendColor: string;
  parcels: Parcel[];
  setupFunction(planService: PlanService): any | null;
  updateFunction(planService: PlanService): any | null;
}

export interface Parcel {
  path: any;
  properties: any;
}

export interface LegendItem {
  name: string;
  propertyName: string;
  color: string;
}
