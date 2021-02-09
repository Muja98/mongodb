import { Router } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';
import { Paragraph } from './../../models/paragraph';
import { News } from './../../models/news';
import { Component, OnInit, ɵɵclassMapInterpolate1 } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations'; 
import { DOCUMENT } from '@angular/common';
import { HostListener, Inject } from '@angular/core';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { createConstructor } from 'typescript';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  animations:[ 
    trigger('fade',
    [ 
      state('void', style({ opacity : 0})),
      transition(':enter',[ animate(300)]),
      transition(':leave',[ animate(500)]),
    ]
)]
})
export class MainPageComponent implements OnInit {


  public newsArray: Array<News> = [];
  public news:News;
  public start:number = 0;
  public end:number = 6; 
  public oblastiArray = ["Sport","Hronika","Korona","Vremenska Prognoza"]
  public tagArray = ["Nis", "Srbija","Vukanja", "Tecin","Tebrica", "Soko Banja", "Leskovac", "Pecenjevce", "Kursumlija", "JSO", "Smoke Mardeljano"]
  public selectedTagArray = [];
  public selected:number = -1;
  public selectedText:string = ""
  public searchText = "";
  public selectedTag = -1;
  public selectedTagText = "";
  constructor(@Inject(DOCUMENT) document, public service: NewsService, public router:Router) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
     if (window.pageYOffset > 120) {
       let element = document.getElementById('navbar');
       element.classList.add('sticky');
     } else {
      let element = document.getElementById('navbar');
        element.classList.remove('sticky'); 
     }
  }

  handleSetSelected(index:number)
  {
    this.newsArray = [];
    this.selected = index;
    this.start = 0;
    this.end = 6;
    
    let selectedpom;
    if(index==-1)
      selectedpom = "";
    else
      selectedpom = this.oblastiArray[this.selected]
    
    this.selectedText = selectedpom;
    this.service.getAllNews(this.start,this.end, selectedpom,"",this.selectedTagText).subscribe((el:any)=>{
      this.newsArray = el;
   })
  }

  handleAddClick(index:number)
  {
    if(index == this.selectedTag)
    {
      this.selectedTagText = ""
      this.selectedTag=-1;
    }
    else
    {
      this.selectedTag = index;
      this.selectedTagText= this.tagArray[index];
    }
    
  }

  handleClickSearch()
  {
    this.service.getAllNews(this.start, this.end, this.selectedText, this.searchText,this.selectedTagText).subscribe((el:any)=>{
      this.newsArray = el;
   })
   this.searchText = "";

   this.selectedTagText = ""
   this.selectedTag=-1;
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

    this.service.getAllNews(this.start,this.end,selectedpom,this.searchText,this.selectedTagText).subscribe((el:any)=>{
      console.log(el)
      let pomArray = [];
      pomArray = el;
      pomArray.forEach((elpom:any)=>{
        this.newsArray.push(elpom)
      })
   })
  }
  ngOnInit(): void {
     this.service.getAllNews(this.start,this.end,"","","").subscribe((el:any)=>{
        this.newsArray = el;
     })
 
     
  } 

}
