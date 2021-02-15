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
      if(this.name.length===0){this.error.name = "Morate uneti ime"}
      else{this.error.name = ""}
      if(this.surname.length===0){this.error.surname = "Morate uneti prezime"}
      else{this.error.surname = ""}
      if(this.username.length===0){this.error.username = "Morate uneti korisničko ime"}
      else{this.error.username = ""}
      if(this.password.length===0){this.error.password = "Morate uneti lozinku"} 
      else{this.error.password = ""}
      if(this.rpassword.length===0){this.error.rpassword = "Morate ponoviti lozinka"} 
      else{this.error.rpassword = ""}
      if(this.password !== this.rpassword){this.error.rpassword = "Noedgovarajuća ponovljena lozinka"} 
      else{this.error.rpassword = ""}
  
      if(this.username.length===0  || this.name.length == 0 || this.surname.length == 0 || this.password.length ==0||this.rpassword.length == 0)return;
      if(this.error.name.length > 0 || this.error.surname.length > 0 || this.error.username.length > 0 || this.error.password.length > 0 || this.error.rpassword.length > 0) return;

      let user = {
        Username: this.username,
        FirstName: this.name,
        LastName:this.surname,
        Password:this.password
      }
      
      let mess = this.service.register(user);
      this.error.register = "Korisničko ime je zauzeto"
    }
    else
    {
      this.router.navigate(['/login'])
    }

  }
}
