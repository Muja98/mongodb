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
        (result:any)=>  {
          if(typeof result.value !== 'undefined')
          {
            if(result.value !== 'Email taken') 
              this.router.navigate(['/login']);
          }
           
        })

      
  }

  login(username,password) 
   {
      let data = {
          Username: username,
          Password: password
      }

      let str:string = "";

       this.http.post(URL+'/api/editors/login', data).subscribe((result:any) => {
        if(typeof result.value !== 'undefined')
        {
          if(result.value.includes("Wrong"))
          {
            str = "Wrong password";
          }
          else if (result.value.includes("Non"))
          {
            str = "Non-existent username";
          }
          else {
            var token:any = { accessToken: result.value }
            this.geUserFromToken(token)
            this.router.navigate(['/'])
          }
        }
       
      });
      
      return str;

   }
  
  logout()
  {
    localStorage.removeItem('user');
  }

  public geUserFromToken(token:any)
  {
    const helper = new JwtHelperService()
    const decodedToken = helper.decodeToken(token['accessToken'])
    localStorage.setItem('user', JSON.stringify(decodedToken))
  }

  getUserFromStorage()
  {
    const user = JSON.parse(localStorage.getItem('user'));
   
    if(user)
      return user;
  }

  getUser(editorId:string)
  {
    return this.http.get(URL+'/api/editors/'+editorId);
  }

  updateUser(editorId:string, propertyName:string, propertyValue)
  {
    this.http.patch(URL+'/api/editors/'+editorId,
      {
        PropertyName:propertyName,
        PropertyValue:propertyValue
      }).subscribe((el:any)=>{})
  }


}