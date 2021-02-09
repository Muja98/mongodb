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

  public  fields = ["sport", "politics", "education", "fun"];
  public tags: string;

  //main picture
  mainbase64textString = [];
  mainPicturePom:any;
  mainPicture:string; 

  //paragraph
  public subTitle:string;
  public text:string;
  
  //paragraph picture
  paragraphbase64textString = [];
  paragraphPicturePom:any;
  paragraphPicture:string;


  constructor(private newsService:NewsService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    console.log("onInit method");
    this.news = new News();
  }

  mainOnUploadChange(evt: any) {
    const file = evt.target.files[0];
  
    if (file) {
      this. mainbase64textString = []
      const reader = new FileReader();
  
      reader.onload = this.mainHandleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  mainHandleReaderLoaded(e) {
    let array =  [];

    array.push(btoa(e.target.result))
    this.mainPicturePom = array[0];
    
    this.mainbase64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.mainPicture = this.mainbase64textString[0];
  }

  paragraphOnUploadChange(evt: any) {
    const file = evt.target.files[0];
  
    if (file) {
      this.paragraphbase64textString = []
      const reader = new FileReader();
  
      reader.onload = this.paragraphHandleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  paragraphHandleReaderLoaded(e) {
    let array =  [];

    array.push(btoa(e.target.result))
    this.paragraphPicturePom= array[0];
    
    this.paragraphbase64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.paragraphPicture = this.paragraphbase64textString[0];
  }

  handleParagraphCreate():void {
    var paragraph;

    paragraph.subTitle = this.subTitle;
    paragraph.text = this.text;
    paragraph.picturePath = this.paragraphPicturePom;

    this.news.paragraphs.push(paragraph);

    this.subTitle = "";
    this.text = "";
    this.paragraphbase64textString = [];
    this.paragraphPicturePom = "";
    this.paragraphPicture = "";
  }

  handleCreateNews():void {
    var splittedTags = this.tags.split(" ");
    this.news.tags = splittedTags;

    this.newsService.createNews(this.news).subscribe(
      result=> {
        console.log("Created news!");
      }
    );

  }

}
