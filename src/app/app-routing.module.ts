import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: 'landing',
    loadChildren: () => import('./sections/landing/landing.module').then(mod => mod.LandingModule),
  },
  {
    path: 'map-window',
    loadChildren: () => import('./sections/map-window/map-window.module').then(mod => mod.MapWindowModule),
  },
  {
    path: 'secondscreen-window',
    loadChildren: () => import('./sections/secondscreen-window/secondscreen-window.module').then(mod => mod.SecondScreenWindowModule),
  },
  {
    path: 'puck-window',
    loadChildren: () => import('./sections/puck-window/puck-window.module').then(mod => mod.PuckWindowModule),
  },
  {
    path: '**',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
