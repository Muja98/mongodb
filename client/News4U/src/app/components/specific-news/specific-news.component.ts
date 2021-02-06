import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NamedValue } from 'src/app/models/named-value';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';
import { SurveyService } from 'src/app/services/survey.service';

@Component({
  selector: 'app-specific-news',
  templateUrl: './specific-news.component.html',
  styleUrls: ['./specific-news.component.css']
})
export class SpecificNewsComponent implements OnInit {
  public news:News;
  public relatedNews:News[] = [];
  private newsId:string;
  private sub:any;
  public surveyAnswer:number = -1;
  private chartMaxValue:number = 0;
  private surveyMaxValue:number = 0;
  private loadedNews:boolean = false;
  private loadedRelated:boolean = false;
  public votedSurvey:boolean = false;

  constructor(
    private newsService:NewsService, private surveyService:SurveyService, 
    private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.newsId = params['newsId']
      this.newsService.getSpecificNews(this.newsId).subscribe(result => {
        this.news = result;
        if(this.news.chart)
          this.setChartMaxValue()
        this.news.dateTime = this.getProperDateTime(this.news.dateTime);
        this.loadedNews = true;
      })

      this.newsService.getRelatedNews(this.newsId).subscribe(result => {
        this.relatedNews = result;
        this.loadedRelated = true;
      })
    })
  }

  private calculateProgressbarPercentage(value:number, maxValue:number) {
    const ret = (100.0 / maxValue) * value;
    return ret;
  }

  public calculateChartProgressbarPercentage(value:number) {
    return this.calculateProgressbarPercentage(value, this.chartMaxValue);
  }

  public calculateSurveyProgressbarPercentage(value:number) {
    return this.calculateProgressbarPercentage(value, this.surveyMaxValue);
  }

  private setChartMaxValue() {
    this.chartMaxValue = this.getMaxValue(this.news.chart.data);
  }

  private setSurveyMaxValue() {
    this.surveyMaxValue = this.getMaxValue(this.news.survey.answerValue);
  }

  private getProperDateTime(dateTime:string) {
    let dateTimeObj:Date = new Date(dateTime);
    let day:string = String(dateTimeObj.getDay());
    let month:string = String(dateTimeObj.getMonth());
    let hours:string = String(dateTimeObj.getHours());
    let minutes:string = String(dateTimeObj.getMinutes());
    if(day.length < 2)
      day = "0" + day;
    if(month.length < 2)
      month = "0" + month;
    if(hours.length < 2)
      hours = "0" + hours;
    if(minutes.length < 2)
      minutes = "0" + minutes;
    
    return day + "." + month + "." + dateTimeObj.getFullYear() + ". | " + hours + ":" + minutes; 
  }

  private getMaxValue(data:NamedValue[]) {
    let maxValue:number = 0;
    data.map(el => {
      if(maxValue < el.value)
        maxValue = el.value;
    })
    return maxValue;
  }

  public handleVoteSurvey() {
    this.surveyService.voteSurvey(this.newsId, this.surveyAnswer).subscribe(() => {
      this.surveyService.getSurveyResults(this.newsId).subscribe(res => {
        this.news.survey.answerValue = res
        this.setSurveyMaxValue();
        this.votedSurvey = true
      })
    })
  }

  public handleGoToRelatedNews(newsId:string) {
    this.router.navigate(["specific-news/" + newsId]);
  }

  public isLoaded():boolean {
    return this.loadedNews && this.loadedRelated
  }
}
