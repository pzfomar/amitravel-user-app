import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParaMiPage } from './para-mi.page';

const routes: Routes = [
  {
    path: '',
    component: ParaMiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParaMiPageRoutingModule {}
