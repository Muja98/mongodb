import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';

@Component({
    selector: 'app-edit-news',
    templateUrl: './edit-news.component.html',
    styleUrls: ['./edit-news.component.css']
  })

export class EditNewsComponent implements OnInit {

    public  fields = ["politika", "obrazovanje", "korona virus", "sport", "zabava"];
    public news:News;
    private sub:any;
    private newsId: string;
    public tags: string;

    constructor(private newsService:NewsService, private route:ActivatedRoute, private router:Router) { }

    ngOnInit(): void {
        debugger
        console.log("OnInit method!");

        this.sub = this.route.params.subscribe(params => {
            this.newsId = params['newsId']
            this.newsService.getSpecificNews(this.newsId, 5).subscribe(result => {
              this.news = result;
              this.tags  = this.createStringFromTags(this.news.tags);
            })
          })
    }

    createStringFromTags(tags: string[]): string {
       var result: string = "";

       for(let i = 0; i < tags.length; i++)
            result += tags[i] + " ";

        return result;
    }

    
    
}
