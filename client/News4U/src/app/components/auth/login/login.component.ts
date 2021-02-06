import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public setSpinner:Boolean = false;
  public username:string = "";
  public password:string = "";
  public error ={
    username:"",
    password:"",
    login:""
  }

  constructor(public router:Router, public service:AuthenticationService) { }

  ngOnInit(): void {
  }

  handleRedirect()
  {
    if(this.username.length===0){this.error.username = "Please fill the Username input "}
    else{this.error.username = ""}
    if(this.password.length===0){this.error.password = "Please fill the Password input"} 
    else{this.error.password = ""}
    if(this.username.length===0 || this.password.length==0)return;
    this.setSpinner = true;

    this.error.login = this.service.login(this.username,this.password);
  }

  handleRedirectToRegister()
  {
    this.router.navigate(['/register'])
  }
}
