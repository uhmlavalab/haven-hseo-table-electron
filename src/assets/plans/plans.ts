import { Plan } from '../../app/core';

import { MauiPlan } from './maui/plan';
import { OahuPlan } from './oahu/plan';
// import { BigIslandPlan } from './bigisland/plan';
// import { PuertoRico } from './puertorico/plan';

export const Plans: Plan[] = [ OahuPlan, MauiPlan ];


