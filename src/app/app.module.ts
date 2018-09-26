import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { DownloadComponent } from './download/download.component';
import { AppRoutingModule } from './app-routing.module';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { HttpClientModule } from "@angular/common/http";
import { NotifyComponent, NotifyService} from "./notify.service";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Config } from "./config";
import { ChartDirective } from './chart.directive';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    DownloadComponent,
    NotifyComponent,
    ChartDirective
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    RoundProgressModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [NotifyService, Config],
  bootstrap: [AppComponent]
})
export class AppModule { }
