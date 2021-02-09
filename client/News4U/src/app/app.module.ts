import { CreateParagraphComponent } from './components/create-paragraph/create-paragraph.component';
import { CreateNewsComponent } from './components/create-news/create-news.component';
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
import { CommonModule } from '@angular/common'
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component'
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SpecificNewsComponent,
    LoadingScreenComponent,
    RegisterComponent,
    LoginComponent,
    CreateNewsComponent,
    CreateParagraphComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'specific-news/:newsId', component: SpecificNewsComponent},
      {path: 'create-news', component: CreateNewsComponent},
      {path: 'loading', component :LoadingScreenComponent},
      {path: 'login', component :LoginComponent},
      {path: 'register', component :RegisterComponent},
      {path: 'create-paragraph', component: CreateParagraphComponent},
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
