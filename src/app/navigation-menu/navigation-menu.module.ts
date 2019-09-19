import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NavigationMenuPage } from './navigation-menu.page';

const routes: Routes = [
  {
    path: '',
    component: NavigationMenuPage,
    children: [
      { path: 'home', loadChildren: '../home/home.module#HomePageModule' },
      { path: 'history', loadChildren: '../history/history.module#HistoryPageModule' },
      { path: 'recharge', loadChildren: '../recharge/recharge.module#RechargePageModule' },
      { path: 'settings', loadChildren: '../settings/settings.module#SettingsPageModule' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NavigationMenuPage]
})
export class NavigationMenuPageModule { }
