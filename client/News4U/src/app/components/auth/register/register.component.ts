import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(public router:Router, private service: AuthenticationService) { }
  public name:string = "";
  public surname:string = "";
  public username:string = "";
  public password:string = "";
  public rpassword:string = "";

  public error ={
    name:"",
    surname:"",
    username:"",
    password:"",
    rpassword:"",
    register:""
  }

  ngOnInit(): void {
  }
  handleRedirectToLogin(bol)
  {

    if(bol)
    {
      if(this.name.length===0){this.error.name = "Please fill Name input "}
      else{this.error.name = ""}
      if(this.surname.length===0){this.error.surname = "Please fill Surname input "}
      else{this.error.surname = ""}
      if(this.username.length===0){this.error.username = "Please fill Username input "}
      else{this.error.username = ""}
      if(this.password.length===0){this.error.password = "Please fill Password input"} 
      else{this.error.password = ""}
      if(this.rpassword.length===0){this.error.rpassword = "Please fill Repeat Password input"} 
      else{this.error.rpassword = ""}
      if(this.password !== this.rpassword){this.error.rpassword = "Repeated Password didn't match"} 
      else{this.error.rpassword = ""}
  
      if(this.username.length===0  || this.name.length == 0 || this.surname.length == 0 || this.password.length ==0||this.rpassword.length == 0)return;

      let user = {
        Username: this.username,
        FirstName: this.name,
        LastName:this.surname,
        Password:this.password
      }
      
      this.service.register(user);
      this.error.register = "Could not register"
    }
    else
    {
      this.router.navigate(['/login'])
    }

  }
}
