import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'News4U';
  private loggedIn:boolean = false;

  public getNavLinks() {
    let navLinks = [
      this.createNavLink("recent-news", "Najnovije vesti")
    ]
    if(this.loggedIn) {
      const moreNavLinks = [
        this.createNavLink("create-news", "Dodaj vest"),
        this.createNavLink("my-news", "Moje vesti")
      ]
      navLinks = navLinks.concat(moreNavLinks)
    }
    return navLinks;
  }

  public logText() {
    if(this.loggedIn)
      return "Odjavite se"
    return "Prijavite se"
  }

  public logInTemp() {
    this.loggedIn = !this.loggedIn;
  }

  private createNavLink(linkStr:string, textStr:string) {
    return {
      link: "/" + linkStr,
      text: textStr
    }
  }
}
