import { AuthenticationService } from 'src/app/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user:any;
  public pomUser:any;
  public edit:boolean = true;
  public buttonVisible = [false, false, false];
  public error = {
    username:"",
    firstName:"",
    lastName:""
  }
  constructor(private aservice:AuthenticationService, private aroute:ActivatedRoute,public router:Router) { }

  ngOnInit(): void {
    this.aroute.paramMap.subscribe(url=>{
      if(url.get('editorId')===null)
      {
        this.user = this.aservice.getUserFromStorage();
        this.pomUser = this.aservice.getUserFromStorage();
      }
      else
      {
        this.edit = false;
        this.aservice.getUser(url.get('editorId')).subscribe((editor:any)=>{
          this.user = editor;
        })
      }
    })

  }

  handleEditUser(index)
  {
    if(index==0)
    {
      if(this.user.username===this.pomUser.username)
      {
        this.error.username = "Ne može isti username!"
        return;
      }
      else if(this.user.username.length==0)
      {
        this.error.username = "Username mora da sadrži barem jedan karakter!"
        return;
      }
      else
      {
        this.aservice.updateUser(this.user.id,"Username",this.user.username);
        this.router.navigate(['/login'])
      }
    }
    else if(index == 1)
    {
      if(this.user.firstName===this.pomUser.firstName)
      {
        this.error.firstName = "Ne može isto ime!"
        return;
      }
      else if(this.user.firstName.length==0)
      {
        this.error.firstName = "Ime mora da sadrži barem jedan karakter!"
        return;
      }
      else
      {
        this.aservice.updateUser(this.user.id,"FirstName",this.user.firstName);
        this.router.navigate(['/login'])
      }
    }
    else
    {
      if(this.user.lastName===this.pomUser.lastName)
      {
        this.error.lastName = "Ne može isto prezime!"
        return;
      }
      else if(this.user.lastName.length==0)
      {
        this.error.lastName = "Prezime mora da sadrži barem jedan karakter!"
        return;
      }
      else
      {
        this.aservice.updateUser(this.user.id,"LastName",this.user.lastName);
        this.router.navigate(['/login'])
      }
       
    }
  }

  enableButtonAndRestoreDefault(index:number)
  {
    this.error.username = "";
    this.error.firstName = "";
    this.error.lastName = "";

    for(let i=0; i<this.buttonVisible.length; i++)
    {
      if(index == i)
        this.buttonVisible[i]=true;
      else  
        this.buttonVisible[i]=false;
    }

    this.user.username = this.pomUser.username;
    this.user.firstName = this.pomUser.firstName
    this.user.lastName = this.pomUser.lastName;
  }

}
