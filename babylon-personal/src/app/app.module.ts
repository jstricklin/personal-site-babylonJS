import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BgCanvasComponent } from './bg-canvas/bg-canvas.component';
import { NavbarComponent } from './navbar/navbar.component';
// import { DendriteExport } from '../assets/blender-babylon/dendrite_export_01.d';

@NgModule({
  declarations: [
    AppComponent,
    BgCanvasComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule
  ],
  // providers: [ DendriteExport ],
    providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
