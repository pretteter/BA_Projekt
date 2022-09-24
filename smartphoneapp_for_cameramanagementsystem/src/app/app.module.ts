import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Overview } from './overview/overview.component';
import { CameraComponent } from './camera/camera.component';

// more Imports
import { MaterialModule } from './app.material.module';
import {WebcamModule} from './modules/webcam/webcam.module';
import {FormsModule} from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    Overview,
    CameraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    WebcamModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
