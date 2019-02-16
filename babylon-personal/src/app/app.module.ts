import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BgCanvasComponent } from './bg-canvas/bg-canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    BgCanvasComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
