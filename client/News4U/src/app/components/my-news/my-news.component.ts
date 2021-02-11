import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private newsService:NewsService, private authService:AuthenticationService, private router:Router) { }

  ngOnInit(): void {
    this.editorId = this.authService.getUserFromStorage()["id"]
    this.newsService.getEditorsNews(this.editorId).subscribe(result => {
      this.myNews = result
      this.myClicks = new Array(this.myNews.length) 
      this.myClicks.fill(0)
      this.dataLoaded = true;
    })
  }

  handleRedirectSpecificNews(newsId:string) {
    this.router.navigate(['/specific-news/' + newsId])
  }

  clickDelete(ind:number) {
    this.myClicks.fill(0);
    this.myClicks[ind] = 1;
  }

  cancelDelete(ind:number) {
    this.myClicks[ind] = 0;
  }

  confirmDelete(ind:number) {
    this.newsService.deleteNews(this.myNews[ind].id).subscribe(() => {
      console.log("News deleted")
    })
    this.myClicks.splice(ind, 1);
    this.myNews.splice(ind, 1);
  }

}
