import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'developers', pathMatch: 'full' },
  { path: 'developers', loadChildren: () => import('./pages/developers/developers.module').then(m => m.DevelopersPageModule) },
  { path: 'developers/:id', loadChildren: () => import('./pages/developer/developer.module').then(m => m.DeveloperPageModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
