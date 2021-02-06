import { Injectable } from '@angular/core';
import URL from '../../API/api';
import {HttpClient} from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import {Router} from '@angular/router'

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {

  constructor(private http:HttpClient,private router:Router){}

   login(username,password) 
   {
      let data = {
          Username: username,
          Password: password
      }
      let bol:string;
      this.http.post(URL+'/api/editors/login', data).subscribe((result:any) => {
        if(typeof result.value !== 'undefined')
        {
          if(result.value == "Wrong password")
          {
            bol = "Wrong password";
          }
          else if (result.value == "Non-existent username")
          {
            bol = "Non-existent username";
          }
          else {
            var token:any = { accessToken: result.value }
            this.geStudentFromToken(token)
            this.router.navigate(['/'])
          }
        }
       
      });
      return bol;
   }
  
  logedIn()
  {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user)
      return true;
    else
      return false;
  }
  register(newUser)
  {
      let mess = "";
      this.http.post(URL+'/api/editors', newUser).subscribe(
        data => {
            this.router.navigate(['/login']);
        },
        error => {
            mess = "Failed to register"            
        });
      return mess;
  }
  
  logout()
  {
    localStorage.removeItem('user');
  }

  public geStudentFromToken(token:any)
  {
    const helper = new JwtHelperService()
    const decodedToken = helper.decodeToken(token['accessToken'])
    localStorage.setItem('user', JSON.stringify(decodedToken))
  }

  getStudentFromStorage()
  {
    const user = JSON.parse(localStorage.getItem('user'));
   
    if(user)
      return user;
  }



}