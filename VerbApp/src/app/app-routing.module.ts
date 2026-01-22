import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "@auth0/auth0-angular";
import { profile } from 'console';
import { environment } from 'src/environments/environment';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'verb-tooltip',
    loadChildren: () => import('./modals/verb-tooltip/verb-tooltip.module').then( m => m.VerbTooltipPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./modals/search/search.module').then( m => m.SearchPageModule)
  },

];


// if (environment.ttsConfig.requiresAuth) {
//   routes.push({
//     path: 'login',
//   component: UserProfileComponent,
//   canActivate: [AuthGuard]   
//   });
// }

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash:true, preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
