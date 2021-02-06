import { Paragraph } from './../../models/paragraph';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit {
  public news:News;
  private numberOfParagraphs: number = 1;
  private paragraphs: Paragraph[] = [];
  public  fields = ["sport", "politics", "education", "fun"];

  constructor(private newsService:NewsService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    console.log("onInit method");
  }



}
