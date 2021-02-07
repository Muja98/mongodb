import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpecificNewsComponent } from './components/specific-news/specific-news.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component'
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { MainPageComponent } from './components/main-page/main-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SpecificNewsComponent,
    LoadingScreenComponent,
    RegisterComponent,
    LoginComponent,
    MainPageComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forChild([
      {path: '', component:MainPageComponent},
      {path: 'specific-news/:newsId', component: SpecificNewsComponent},
      {path: 'loading', component :LoadingScreenComponent},
      {path: 'login', component :LoginComponent},
      {path: 'register', component :RegisterComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
