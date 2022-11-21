import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Overview } from './overview/overview.component';
import { CameraComponent } from './camera/camera.component';

// more Imports
import { MaterialModule } from './app.material.module';
import { WebcamModule } from './modules/webcam/webcam.module';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AngularClientComponent } from './angular-client/angular-client.component';
import { HttpClientModule } from '@angular/common/http';

const config: SocketIoConfig = {
  url: 'http://localhost:4444',
  options: { transports: ['websocket'], path: '/app/' },
};

@NgModule({
  declarations: [
    AppComponent,
    Overview,
    CameraComponent,
    AngularClientComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    WebcamModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
