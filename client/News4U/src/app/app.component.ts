import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavigationStart, Router } from '@angular/router';
import { Component } from '@angular/core';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showMenu:boolean = true;
  constructor(public router:Router, public service:AuthenticationService)
  {
    router.events.forEach((event:any) => {
      if(event instanceof NavigationStart) {
          if(event.url === "/login" || event.url === "/register")
            this.showMenu = false;
          else
            this.showMenu = true;
      }
    });
  }
  
  title = 'News4U';
  private loggedIn:boolean = false;

  public getNavLinks() {
    let navLinks = [
      this.createNavLink("recent-news", "Najnovije vesti")
    ]
    if(this.service.logedIn()) {
      const moreNavLinks = [
        this.createNavLink("create-news", "Dodaj vest"),
        this.createNavLink("my-news", "Moje vesti")
      ]
      navLinks = navLinks.concat(moreNavLinks)
    }
    return navLinks;
  }

  public logText() {
    if(this.service.logedIn())
      return "Odjavite se"
    return "Prijavite se"
  }


  public logInTemp() {
    if(this.service.logedIn())
      this.service.logout();
      else
    this.router.navigate(['/login'])
   
  }

  private createNavLink(linkStr:string, textStr:string) {
    return {
      link: "/" + linkStr,
      text: textStr
    }
  }
}
