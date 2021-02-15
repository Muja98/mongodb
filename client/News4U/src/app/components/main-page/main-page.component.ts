import { Router } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';
import { Paragraph } from './../../models/paragraph';
import { News } from './../../models/news';
import { Component, OnInit,  } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';


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
  private editorId:string;
  constructor( public service: NewsService, public router:Router, private authService:AuthenticationService) { }

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

  handleRedirectSpecificNews(ind:number)
  {
    if(this.newsArray[ind].editorId == this.editorId)
      this.router.navigate(['/edit-news/' + this.newsArray[ind].id])
    else
      this.router.navigate(['/specific-news/' + this.newsArray[ind].id])
  }

  handleLoadMore()
  {
    this.start = this.end;
    this.end = this.end+2;

    this.service.getAllNews(this.start,this.end,this.fieldText,this.searchText,this.selectedTagText).subscribe((el:News[])=>{
      if(el.length==2) return;
      el.forEach((elpom:News)=>{
        if(elpom.mainPicturePath === null)
          elpom.mainPicturePath = "assets\\noImage2.png";
        else
          elpom.mainPicturePath = 'data:image/png;base64,'+elpom.mainPicturePath;
        this.newsArray.push(elpom)
       
      })
   })
  }
  
  ngOnInit(): void {
    let editor = this.authService.getUserFromStorage();
    if(editor)
      this.editorId = editor['id'];
    else
      this.editorId = "";
    this.service.getAllNews(this.start,this.end,"","","").subscribe((el:News[])=>{
      el.forEach((ele)=>{
        if(ele.mainPicturePath === null)
          ele.mainPicturePath = "assets\\noImage2.png"
        else
          ele.mainPicturePath = 'data:image/png;base64,'+ele.mainPicturePath
      })
      this.newsArray = el;
    })
    
    this.service.getAvailableFields().subscribe((fields:string[])=>{
      this.fieldArray = fields;
    })
     
  } 

}
