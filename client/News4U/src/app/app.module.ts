import { CreateNewsComponent } from './components/create-news/create-news.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpecificNewsComponent } from './components/specific-news/specific-news.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'

@NgModule({
  declarations: [
    AppComponent,
    SpecificNewsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'specific-news/:newsId', component: SpecificNewsComponent},
      {path: 'create-news', component: CreateNewsComponent}

    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
