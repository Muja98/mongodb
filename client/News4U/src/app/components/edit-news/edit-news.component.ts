import { Survey } from './../../models/survey';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';
import { NamedValue } from 'src/app/models/named-value';
import { Paragraph } from 'src/app/models/paragraph';
import { Chart } from 'src/app/models/chart';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-edit-news',
    templateUrl: './edit-news.component.html',
    styleUrls: ['./edit-news.component.css']
  })

export class EditNewsComponent implements OnInit {

    public  fields: any;
    public news:News;
    public newsCopy:News;
    private sub:any;
    private newsId: string;
    public tags: string;

    public survey: Survey = new Survey();
    public numberOfValues: number = 0;

    public numberOfPoles: number;
    public chart:Chart = new Chart();

    mainbase64textString = [];
    mainPicturePom:any = "";
    mainPicture:string = ""; 

    paragraphbase64textString = [];
    paragraphPicturePom:any = "";
    paragraphPicture:string = "";

    public subTitle:string = "";
    public text:string = "";

    public isLoaded:boolean = false;

    constructor(private newsService:NewsService, private route:ActivatedRoute, private router:Router, private toastr: ToastrService) { }

    ngOnInit(): void {
        debugger
       
        this.sub = this.route.params.subscribe(params => {
            this.newsId = params['newsId']
            
            this.newsService.getAvailableFields().subscribe(
              result=> {
                this.fields = result;
                console.log("Fields are ready!");
              }
            );

            this.newsService.getSpecificNews(this.newsId, 5).subscribe(result => {
              this.news = result;
              debugger
              if(!this.news.tags)
                this.tags = "";
              else  this.tags  = this.createStringFromTags(this.news.tags);

              if(this.news.chart)
                this.numberOfPoles = this.news.chart.data.length;

              if(this.news.survey)
                this.numberOfValues = this.news.survey.answerValue.length;

              this.newsCopy = JSON.parse(JSON.stringify(this.news));
              this.isLoaded = true;
            })
          })

        console.log(this.news);
        console.log("OnInit method!");
    }

    createStringFromTags(tags: string[]): string {
       var result: string = "";

       for(let i = 0; i < tags.length; i++)
            result += tags[i] + " ";

        return result;
    }

    handleNumberOfValues(edit: boolean):void {
      debugger

      if(!edit)
      {
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
      else
      {
          if(this.numberOfValues > this.newsCopy.survey.answerValue.length)
          {
            while (this.newsCopy.survey.answerValue.length < this.numberOfValues)
            {
              this.newsCopy.survey.answerValue.push(new NamedValue());
            }
          }
    
          if(this.numberOfValues < this.newsCopy.survey.answerValue.length)
          {
            while (this.newsCopy.survey.answerValue.length > this.numberOfValues)
            {
              this.newsCopy.survey.answerValue.pop();
            }
          }
      }
  

    }

    handleResetSurvey(edit:boolean):void {
      debugger
      if(!edit)
      {
        this.numberOfValues = 0;
        this.survey.question = "";
        this.survey.answerValue = [];
      }
      else
      {
        this.numberOfValues = this.news.survey.answerValue.length;
        this.newsCopy.survey.question = this.news.survey.question;
        this.newsCopy.survey.answerValue = JSON.parse(JSON.stringify(this.news.survey.answerValue));
      }
  
    }

    handleNumberOfPoles(edit:boolean):void {
      debugger
  
      if(edit)
      {
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
      else
      {
        if(this.numberOfPoles > this.chart.data.length)
        {
          while (this.chart.data.length < this.numberOfPoles)
          {
            this.chart.data.push(new NamedValue());
          }
        }
    
        if(this.numberOfPoles < this.chart.data.length)
        {
          while (this.chart.data.length > this.numberOfPoles)
          {
            this.chart.data.pop();
          }
        }
      }

    }

    handleResetChart(edit:boolean):void {
      debugger

      if(edit)
      {
        this.numberOfPoles = this.news.chart.data.length;
        this.newsCopy.chart.description = this.news.chart.description;
        this.newsCopy.chart.data =  JSON.parse(JSON.stringify(this.news.chart.data));
      }
      else
      {
        this.numberOfPoles = 0;
        this.chart.description = "";
        this.chart.data = [];
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

    // event handleri postojecih kontrola

    handleSaveTitle():void {
      debugger

        if(this.newsCopy.title == null || this.newsCopy.title == "")
          alert("Naslov ne sme biti prazan string!")
        else
        {
            //slanje novog naslova serveru za datu vest...
            this.newsService.stringNewsEdit(this.news.id, "Title",  this.newsCopy.title).subscribe(
            result=> {
              console.log("Title updated!");
            }
          );
            this.news.title = this.newsCopy.title; //(new String (this.newsCopy.title)).toString();
            this.toastr.success('Uspešno ste ažurirali naslov!', 'Obaveštenje:');
        }
    }

    handleResetTitle(): void {
      debugger
      this.newsCopy.title = this.news.title;
    }

    handleSaveField():void {
      debugger

        this.newsService.stringNewsEdit(this.news.id, "Field",  this.newsCopy.field).subscribe(
        result=> {
          console.log("Field updated!");
        }
      );

        this.news.field = this.newsCopy.field;
        this.toastr.success('Uspešno ste ažurirali oblast!', 'Obaveštenje:');
    }

    handleResetField():void {
      debugger
      this.newsCopy.field = this.news.field;
    }

    handleSaveTags():void {
      debugger

      var stringList;

      if(this.tags == null || this.tags == "")
      {
          this.newsCopy.tags = null;
          this.news.tags = null;
          stringList = null;
      }
      else
      {
        var splittedTags = this.tags.split(" ");
        this.news.tags = splittedTags;
        this.newsCopy.tags = splittedTags;
        stringList = splittedTags;
      }

      this.newsService.stringListNewsEdit(this.news.id, "Tags",  stringList).subscribe(
        result=> {
          console.log("Tags updated!");
        }
      );

      this.toastr.success('Uspešno ste ažurirali tagove!', 'Obaveštenje:');
    }

    handleResetTags():void {
      debugger
      this.newsCopy.tags = this.news.tags;
      this.tags  = this.createStringFromTags(this.news.tags);
    }

    handleSaveMainPicture():void {
      debugger

      this.newsService.pictureNewsEdit(this.news.id, "MainPicturePath",  this.newsCopy.mainPicturePath).subscribe(
        result=> {
          console.log("Main picture updated!");
        }
      );

      this.news.mainPicturePath = this.newsCopy.mainPicturePath;
      this.toastr.success('Uspešno ste ažurirali naslovnu fotografiju!', 'Obaveštenje:');
    }

    handleResetMainPicture(): void {
      debugger
      this.newsCopy.mainPicturePath = this.news.mainPicturePath;
    }

    handleSaveParagraphs(): void {
      debugger

      this.newsService.paragraphListNewsEdit(this.news.id, "Paragraphs",  this.newsCopy.paragraphs).subscribe(
        result=> {
          console.log("Paragraphs updated!");
        }
      );

      this.news.paragraphs = JSON.parse(JSON.stringify(this.newsCopy.paragraphs));
      this.toastr.success('Uspešno ste ažurirali pasuse!', 'Obaveštenje:');
    }

    handleResetParagraphs(): void {
      debugger
      this.newsCopy.paragraphs = JSON.parse(JSON.stringify(this.news.paragraphs));//this.news.paragraphs;
    }

    handleDeleteParagraph(ind): void {
      debugger
      if(this.newsCopy.paragraphs.length > 1)
      {
        this.newsCopy.paragraphs.splice(ind, 1);
      }
      else  this.toastr.error("Nije moguće obrisati pasus! Vest mora da sadrži najmanje jedan pasus!", "Obaveštenje!");
    }

    handleSaveSurvey(edit:boolean):void {
      debugger

      if(this.numberOfValues > 0)
      {
        if(!edit)
        {
          if(this.survey.question == null || this.survey.question == "")
          {
            alert("Popunite ispravno formu ankete")
            return;
          }
          
          if(this.survey.answerValue.length > 0)
          {
            let index:number = 0;
    
            for(index = 0; index < this.survey.answerValue.length; index++)
            {
              if(this.survey.answerValue[index].name == null || this.survey.answerValue[index].name == "")
              {
                alert("Popunite ispravno formu ankete");
                return;
              }   
            }

            this.newsService.surveyNewsEdit(this.news.id, "Survey",  this.survey).subscribe(
              result=> {
                console.log("Survey updated!");
              }
            );

            this.newsCopy.survey =  JSON.parse(JSON.stringify(this.survey));
            this.news.survey = JSON.parse(JSON.stringify(this.survey));
            this.survey.question = "";
            this.survey.answerValue = [];
            this.numberOfValues = 0;

            this.toastr.success('Uspešno ste ažurirali anketu!', 'Obaveštenje:');
          }
        }
        else
        {
          if(this.newsCopy.survey.question == null || this.newsCopy.survey.question == "")
          {
            alert("Popunite ispravno formu ankete")
            return;
          }

          if(this.newsCopy.survey.answerValue.length > 0)
          {
            let index:number = 0;
    
            for(index = 0; index < this.newsCopy.survey.answerValue.length; index++)
            {
              if(this.newsCopy.survey.answerValue[index].name == null || this.newsCopy.survey.answerValue[index].name == "")
              {
                alert("Popunite ispravno formu ankete");
                return;
              }   
            }

            this.newsService.surveyNewsEdit(this.news.id, "Survey",  this.newsCopy.survey).subscribe(
              result=> {
                console.log("Survey updated!");
              }
            );

            this.news.survey = JSON.parse(JSON.stringify(this.newsCopy.survey));
            this.toastr.success('Uspešno ste ažurirali anketu!', 'Obaveštenje:');
          }
        }
      }
      else alert("Popunite ispravno formu ankete");
    }

    handleDeleteSurvey(): void {
      debugger
      this.news.survey = null;
      this.newsCopy.survey = null;

      this.newsService.surveyNewsEdit(this.news.id, "Survey",  null).subscribe(
        result=> {
          console.log("Survey deleted!");
        }
      );

      this.toastr.success('Uspešno ste izbrisali anketu!', 'Obaveštenje:');
    }

    handleSaveChart(edit:boolean):void {
      debugger
      if(edit)
      {
        this.newsService.chartNewsEdit(this.news.id, "Chart",  this.newsCopy.chart).subscribe(
          result=> {
            console.log("Chart Updated!");
          }
        );

        this.news.chart = JSON.parse(JSON.stringify(this.newsCopy.chart));
        this.toastr.success('Uspešno ste ažurirali grafik!', 'Obaveštenje:');
      }
      else
      {
        this.newsService.chartNewsEdit(this.news.id, "Chart",  this.chart).subscribe(
          result=> {
            console.log("Chart Updated!");
          }
        );

        this.newsCopy.chart = JSON.parse(JSON.stringify(this.chart));
        this.news.chart = JSON.parse(JSON.stringify(this.chart));
        this.toastr.success('Uspesno ste ažurirali grafik!', 'Obaveštenje:');
      }
    }

    handleDeleteChart(): void {
      debugger
      this.newsCopy.chart = null;
      this.news.chart = null;

      this.numberOfPoles = 0;
      this.chart = new Chart();
      
      this.newsService.chartNewsEdit(this.news.id, "Chart",  null).subscribe(
        result=> {
          console.log("Chart Updated!");
        }
      );
      this.toastr.success('Uspešno ste obrisali grafik!', 'Obaveštenje:');
    }
  
}
