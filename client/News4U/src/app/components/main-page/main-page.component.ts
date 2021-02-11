import { Router } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';
import { Paragraph } from './../../models/paragraph';
import { News } from './../../models/news';
import { Component, OnInit,  } from '@angular/core';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],

})
export class MainPageComponent implements OnInit {


  public newsArray: Array<News> = [];
  public news:News;
  public start:number = 0;
  public end:number = 6; 
  public oblastiArray = ["Sport","Hronika","Korona","Vremenska Prognoza"]
  public selectedTagArray = [];
  public selected:number = -1;
  public selectedText:string = ""
  public searchText = "";
  public selectedTag = -1;
  public selectedTagText = "";
  constructor( public service: NewsService, public router:Router) { }


 
 

  handleClickSearch()
  {
    this.service.getAllNews(this.start, this.end, this.selectedText, this.searchText,this.selectedTagText).subscribe((el:News[])=>{
      this.newsArray = el;
     
   })
  }

  handleCheckNumber(i1, i2)
  {
    if((i1%3)===i2) return true;
    else return false;
  }

  handleRedirectSpecificNews(id:string)
  {
    this.router.navigate(['/specific-news/'+id])
  }

  handleLoadMore()
  {
    this.start = this.end;
    this.end = this.end+2;

    let selectedpom;
    if(this.selected==-1)
      selectedpom = "";
    else
      selectedpom = this.oblastiArray[this.selected]

    this.service.getAllNews(this.start,this.end,selectedpom,this.searchText,this.selectedTagText).subscribe((el:News[])=>{
      if(el.length==2) return;
      el.forEach((elpom:News)=>{
        this.newsArray.push(elpom)
       
      })
   })
  }
  ngOnInit(): void {
     this.service.getAllNews(this.start,this.end,"","","").subscribe((el:News[])=>{
        this.newsArray = el;
     })
 
     
  } 

}
