import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'developers', pathMatch: 'full' },
  { path: 'developers', loadChildren: './pages/developers/developers.module#DevelopersPageModule' },
  { path: 'developers/:id', loadChildren: './pages/developer/developer.module#DeveloperPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
