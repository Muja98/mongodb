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
  public searchText = "";
  public selectedTagText = "";
  public fieldText = "";
  public fieldIndex = -1;
  public fieldArray:string[] = [];
  constructor( public service: NewsService, public router:Router) { }

  handleClickSearch()
  {
    this.service.getAllNews(this.start, this.end,this.fieldText, this.searchText,this.selectedTagText).subscribe((el:News[])=>{
      this.newsArray = el;
     
   })
  }

  handleClickField(index:number)
  {
    if(index==-1 || index == this.fieldIndex)
    {
      this.fieldText = "";
      this.fieldIndex = -1;
    }
    else
    {
      this.fieldText = this.fieldArray[index];
      this.fieldIndex = index;
    }
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

    this.service.getAllNews(this.start,this.end,this.fieldText,this.searchText,this.selectedTagText).subscribe((el:News[])=>{
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
     
     this.service.getAvailableFields().subscribe((fields:string[])=>{
       this.fieldArray = fields;
     })
     
  } 

}
