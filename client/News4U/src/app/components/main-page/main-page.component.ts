import { Paragraph } from './../../models/paragraph';
import { News } from './../../models/news';
import { Component, OnInit, ɵɵclassMapInterpolate1 } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations'; 
import { DOCUMENT } from '@angular/common';
import { HostListener, Inject } from '@angular/core';

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
  constructor(@Inject(DOCUMENT) document) { }

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

  ngOnInit(): void {
     this.news = new News();
     this.news.title = "Velike poplave u Niš-u " ;
     
     let p1:Paragraph = new Paragraph();
     p1.text = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
     this.news.paragraphs.push(p1);
  } 

}
