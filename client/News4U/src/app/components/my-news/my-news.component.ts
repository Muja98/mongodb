import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { News } from 'src/app/models/news';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-my-news',
  templateUrl: './my-news.component.html',
  styleUrls: ['./my-news.component.css']
})
export class MyNewsComponent implements OnInit {
  public myNews:News[] = [];
  private editorId:string = "";
  private myClicks:number[] = [];
  public dataLoaded:boolean = false;
  public chosenDateTime:string = new Date().toISOString().slice(0, 16);
  public canChooseDateTime:boolean = true;
  private perLoad:number = 3;
  public noMoreNews:boolean = false;

  constructor(private newsService:NewsService, private authService:AuthenticationService, private router:Router, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.editorId = this.authService.getUserFromStorage()["id"]
    this.newsService.getEditorsNews(this.editorId, 0, this.perLoad + 1).subscribe(result => {
      this.myNews = result
      if(!this.myNews || this.myNews.length <= this.perLoad) {
        this.noMoreNews = true
      }
      else
        this.myNews = this.myNews.slice(0, this.perLoad)
      this.myClicks = new Array(this.myNews.length)
      this.myClicks.fill(0)
      this.dataLoaded = true;
    })
  }

  public handleLoadMoreNews() {
    this.newsService.getEditorsNews(this.editorId, this.myNews.length, this.perLoad + 1).subscribe(result => {
      if(result.length <= this.perLoad)
        this.noMoreNews = true;
      else
        result = result.slice(0, this.perLoad);
      this.myNews = this.myNews.concat(result);
      this.myClicks = new Array(this.myNews.length);
      this.myClicks.fill(0);
    })
  }

  public handleRedirectSpecificNews(newsId:string) {
    this.router.navigate(['/specific-news/' + newsId])
  }

  public clickDelete(ind:number) {
    this.myClicks.fill(0);
    this.myClicks[ind] = 1;
  }

  public cancelDelete(ind:number) {
    this.myClicks[ind] = 0;
  }

  public confirmDelete(ind:number) {
    this.newsService.deleteNews(this.myNews[ind].id).subscribe(() => {
      console.log("News deleted");
      this.toastr.success("Vest uspešno obrisana!", "Obaveštenje:")
      this.newsService.getEditorsNews(this.editorId, this.myNews.length - 1, 2).subscribe(result => {
        this.myClicks.splice(ind, 1);
        this.myNews.splice(ind, 1);
        if(result.length <= 1) 
          this.noMoreNews = true;
        else
          result = result.slice(0, 1);
        this.myNews = this.myNews.concat(result);
      })
    })
  }

  public clickDeleteDateTime() {
    this.canChooseDateTime = false;
  }

  public cancelDeleteDateTime() {
    this.canChooseDateTime = true;
  }

  public confirmDeleteDateTime() {
    this.newsService.deleteNewsOlderThan(this.editorId, this.chosenDateTime).subscribe(() => {
      console.log("Deleted news older than")
      this.canChooseDateTime = true;
      this.toastr.success("Vesti starije od navedenog datuma su uspešno obrisane!", "Obaveštenje:")
    })
    const newsIndex = this.myNews.findIndex(news => new Date(this.chosenDateTime) > new Date(news.dateTime))
    if(newsIndex > -1) {
      this.myNews.splice(newsIndex, this.myNews.length - newsIndex + 1);
      this.myClicks.splice(newsIndex, this.myClicks.length - newsIndex + 1);
      this.noMoreNews = true;
    }
  }

  public getProperDateTime(dateTime:string) {
    let dateTimeObj:Date = new Date(dateTime);
    let day:string = String(dateTimeObj.getDate());
    let month:string = String(dateTimeObj.getMonth() + 1);
    let hours:string = String(dateTimeObj.getHours());
    let minutes:string = String(dateTimeObj.getMinutes());
    if(day.length < 2)
      day = "0" + day;
    if(month.length < 2)
      month = "0" + month;
    if(hours.length < 2)
      hours = "0" + hours;
    if(minutes.length < 2)
      minutes = "0" + minutes;
    
    return day + "." + month + "." + dateTimeObj.getFullYear() + ". | " + hours + ":" + minutes; 
  }

}
