import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-specific-news',
  templateUrl: './specific-news.component.html',
  styleUrls: ['./specific-news.component.css']
})
export class SpecificNewsComponent implements OnInit {
  public news:News;
  private newsId:string;
  private sub:any;

  constructor(private newsService:NewsService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.newsId = params['newsId']
      this.newsService.getSpecificNews(this.newsId).subscribe(result => {
        this.news = result;
        console.log(this.news);
      })
    })
  }

}
