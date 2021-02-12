import { Chart } from './../../models/chart';
import { NamedValue } from './../../models/named-value';
import { Survey } from './../../models/survey';
import { Paragraph } from './../../models/paragraph';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit {
  public news:News;

  public  fields = ["politika", "obrazovanje", "korona virus", "sport", "zabava"];
  public tags: string = "";

  //main picture
  mainbase64textString = [];
  mainPicturePom:any = "";
  mainPicture:string = ""; 

  //paragraph
  public subTitle:string = "";
  public text:string = "";
  
  //paragraph picture
  paragraphbase64textString = [];
  paragraphPicturePom:any = "";
  paragraphPicture:string = "";

  // survey
  public numberOfValues: number;
  public survey: Survey = new Survey();

  // chart
  public numberOfPoles: number;
  public chart:Chart = new Chart();

  constructor(private newsService:NewsService, private route:ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit(): void {
    console.log("onInit method");
    this.news = new News();

    alert("Poštovani, da bismo poboljšali vaše iskustvo, evo malih napomena: \n" 
          +"1. Da biste kreirali vest, ona mora sadržati makar jedan pasus. Klikom na \"Dodaj Pasus\", pasus će biti snimljen i možete nastaviti sa kreiranjem sledećeg \n"
          +"2. Ako ne budete bili zadovoljni anketom ili grafikom, možete ih poništiti klikom na \"Reset\", pri čemu neće biti snimljeni prilikom kreiranja vesti!\n"
          +"3. Ukoliko niste popunili ispravno podatke za anketu ili grafik, nećete moći kreirati vest! Poništite ova polja, ili popunite formu do kraja! \n\n"
          + "Vaš \"News4U\" Team!");
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
  }

  paragraphOnUploadChange(evt: any) {
    debugger
    const file = evt.target.files[0];
  
    if (file) {
      this.paragraphbase64textString = []
      const reader = new FileReader();
  
      reader.onload = this.paragraphHandleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  paragraphHandleReaderLoaded(e) {
    debugger
    let array =  [];

    array.push(btoa(e.target.result))
    this.paragraphPicturePom= array[0];
    
    this.paragraphbase64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.paragraphPicture = this.paragraphbase64textString[0];
  }

  handleParagraphCreate():void {
    debugger
    var paragraph: Paragraph = new Paragraph();

    paragraph.subTitle = this.subTitle;
    paragraph.text = this.text;
    paragraph.picturePath = this.paragraphPicturePom;

    this.news.paragraphs.push(paragraph);

    this.subTitle = "";
    this.text = "";
    this.paragraphbase64textString = [];
    this.paragraphPicturePom = "";
    this.paragraphPicture = "";

    this.toastr.success('Uspesno ste snimili pasus!', 'Obaveštenje:');
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
 
  handleNumberOfPoles():void {
    debugger

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

  checkNewParagraph():boolean {
    if(this.subTitle == null || this.subTitle == "" || this.text == null || this.text == "")
      return false;
    
    return true;
  }

  handleResetSurvey():void {
    this.numberOfValues = 0;
    this.survey.question = "";
    this.survey.answerValue = [];

  }

  handleResetChart():void {
    this.numberOfPoles = 0;
    this.chart.description = "";
    this.chart.data = [];
  }

  checkData(): boolean {
    if(this.news.title == null || this.news.title == "" || this.news.field == null || this.news.field == "")
    {
      return false;
    }

    if(this.news.paragraphs.length == 0)
      return false;

    if(this.numberOfValues > 0)
    {
      if(this.survey.question == null || this.survey.question == "")
        return false;

        if(this.survey.answerValue.length > 0)
        {
          let index:number = 0;
  
          for(index = 0; index < this.survey.answerValue.length; index++)
          {
            if(this.survey.answerValue[index].name == null || this.survey.answerValue[index].name == "")
              return false;
          }
        }
    }

    if(this.numberOfPoles > 0)
    {
      if(this.chart.description == null || this.chart.description == "")
        return false;

      if(this.chart.data.length > 0)
      {
        let index:number = 0;

        for(index = 0; index < this.chart.data.length; index++)
        {
          if(this.chart.data[index].name == null || this.chart.data[index].name == "")
            return false;
        }
      }
    }

    return true;
  }

  handleCreateNews():void {
    debugger

      var splittedTags = this.tags.split(" ");
      this.news.tags = splittedTags;
      this.news.mainPicturePath = this.mainPicturePom;

      if(this.numberOfValues > 0)
      {
        this.news.survey = this.survey;
      }

      if(this.numberOfPoles > 0)
      {
        this.news.chart = this.chart;
      }
  
      this.newsService.createNews(this.news).subscribe(
        result=> {
          console.log("Created news!");
        }
      );
  }

}
 