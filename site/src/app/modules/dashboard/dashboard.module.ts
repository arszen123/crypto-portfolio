import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { ChartComponent } from './components/chart/chart.component';
import { ExchangesComponent } from './components/exchanges/exchanges.component';
import { AssetsComponent } from './components/assets/assets.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditExchangeComponent } from './components/edit-exchange/edit-exchange.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  providers: [
    EditExchangeComponent
  ],
  declarations: [
    DashboardComponent,
    ChartComponent,
    ExchangesComponent,
    AssetsComponent,
    EditExchangeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    ChartsModule,
  ]
})
export class DashboardModule { }
