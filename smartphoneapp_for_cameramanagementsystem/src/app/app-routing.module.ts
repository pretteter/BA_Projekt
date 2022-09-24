import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './camera/camera.component';

const routes: Routes = [
  { path: '', component: CameraComponent },
  { path: 'camera', component: CameraComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
