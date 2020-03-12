import { PlanStateService } from '../services/plan-state.service';

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
  setupFunction(planService: PlanStateService): any | null;
  updateFunction(planService: PlanStateService): any | null;
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
