import { Survey } from './../../models/survey';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';
import { NamedValue } from 'src/app/models/named-value';
import { Paragraph } from 'src/app/models/paragraph';

@Component({
    selector: 'app-edit-news',
    templateUrl: './edit-news.component.html',
    styleUrls: ['./edit-news.component.css']
  })

export class EditNewsComponent implements OnInit {

    public  fields = ["politika", "obrazovanje", "korona virus", "sport", "zabava"];
    public news:News;
    public newsCopy:News;
    private sub:any;
    private newsId: string;
    public tags: string;

    public survey: Survey = new Survey();
    public numberOfValues: number = 0;

    public numberOfPoles: number;

    mainbase64textString = [];
    mainPicturePom:any = "";
    mainPicture:string = ""; 

    paragraphbase64textString = [];
    paragraphPicturePom:any = "";
    paragraphPicture:string = "";

    public subTitle:string = "";
    public text:string = "";

    constructor(private newsService:NewsService, private route:ActivatedRoute, private router:Router) { }

    ngOnInit(): void {
        debugger
        console.log("OnInit method!");

        this.sub = this.route.params.subscribe(params => {
            this.newsId = params['newsId']
            this.newsService.getSpecificNews(this.newsId, 5).subscribe(result => {
              this.news = result;
              this.tags  = this.createStringFromTags(this.news.tags);
              this.newsCopy = JSON.parse(JSON.stringify(this.news));
              this.numberOfPoles = this.newsCopy.chart.data.length;
            })
          })
    }

    createStringFromTags(tags: string[]): string {
       var result: string = "";

       for(let i = 0; i < tags.length; i++)
            result += tags[i] + " ";

        return result;
    }

    handleNumberOfValues():void {
      debugger
  
        if(this.numberOfValues > this.survey.answerValue.length)
        {
          while (this.survey.answerValue.length < this.numberOfValues)
          {
            this.survey.answerValue.push(new NamedValue());
          }
        }
  
        if(this.numberOfValues < this.survey.answerValue.length)
        {
          while (this.survey.answerValue.length > this.numberOfValues)
          {
            this.survey.answerValue.pop();
          }
        }
    }

    handleResetSurvey():void {
      this.numberOfValues = 0;
      this.survey.question = "";
      this.survey.answerValue = [];
  
    }

    handleNumberOfPoles():void {
      debugger
  
      if(this.numberOfPoles > this.newsCopy.chart.data.length)
      {
        while (this.newsCopy.chart.data.length < this.numberOfPoles)
        {
          this.newsCopy.chart.data.push(new NamedValue());
        }
      }
  
      if(this.numberOfPoles < this.newsCopy.chart.data.length)
      {
        while (this.newsCopy.chart.data.length > this.numberOfPoles)
        {
          this.newsCopy.chart.data.pop();
        }
      }
    }

    handleResetChart():void {
      this.numberOfPoles = this.news.chart.data.length;
      this.newsCopy.chart.description = this.news.chart.description;
      this.newsCopy.chart.data = [];

      for(let i = 0; i < this.news.chart.data.length; i++)
      {
          var pom = new NamedValue();
          pom.name = this.news.chart.data[i].name;
          pom.value = this.news.chart.data[i].value;

          this.newsCopy.chart.data.push(pom);
      }
    }

    mainOnUploadChange(evt: any) {
      debugger
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

      this.newsCopy.mainPicturePath = this.mainPicturePom;
    }
  
    paragraphOnUploadChange(evt: any, ind, isNew) {
      debugger
      const file = evt.target.files[0];
    
      if (file) {
        this.paragraphbase64textString = []
        const reader = new FileReader();
    
        reader.onload = this.paragraphHandleReaderLoaded.bind(this, ind, isNew);
        reader.readAsBinaryString(file);
      }
    }

    paragraphHandleReaderLoaded(i, isNew, e) {
      debugger
      let array =  [];
  
      array.push(btoa(e.target.result))
      this.paragraphPicturePom= array[0];
      
      this.paragraphbase64textString.push('data:image/png;base64,' + btoa(e.target.result));
      this.paragraphPicture = this.paragraphbase64textString[0];

      if(!isNew)
      {
          this.newsCopy.paragraphs[i].picturePath = this.paragraphPicturePom;
          this.paragraphbase64textString = [];
          this.paragraphPicturePom = "";
          this.paragraphPicture = "";
      }

         
    }

    handleParagraphCreate():void {
      debugger
      var paragraph: Paragraph = new Paragraph();
  
      paragraph.subTitle = this.subTitle;
      paragraph.text = this.text;
      paragraph.picturePath = this.paragraphPicturePom;
  
      this.newsCopy.paragraphs.push(paragraph);
  
      this.subTitle = "";
      this.text = "";
      this.paragraphbase64textString = [];
      this.paragraphPicturePom = "";
      this.paragraphPicture = "";
    }

    checkNewParagraph():boolean {
      if(this.text == null || this.text == "")
        return false;
      
      return true;
    }
  
}
