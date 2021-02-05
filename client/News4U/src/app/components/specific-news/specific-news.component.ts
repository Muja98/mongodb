import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { News } from 'src/app/models/news';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-specific-news',
  templateUrl: './specific-news.component.html',
  styleUrls: ['./specific-news.component.css']
})
export class SpecificNewsComponent implements OnInit {
  public news:News;
  private newsId:string;
  private sub:any;
  public surveyAnswer:string = "";
  private chartMaxValue:number = 0;

  constructor(private newsService:NewsService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.newsId = params['newsId']
      this.newsService.getSpecificNews(this.newsId).subscribe(result => {
        this.news = result;
        if(this.news.survey)
          this.setChartMaxValue()
        console.log(this.news);
      })
    })
  }

  public onSurveyAnswerChange(ind:number) {
    if(ind >= 0)
      this.surveyAnswer = this.news.survey.answerValue[ind].name;
    else
      this.surveyAnswer = null;
  }

  public calculateProgressbarPercentage(value:number) {
    const ret = (100.0 / this.chartMaxValue) * value;
    return ret;
  }

  private setChartMaxValue() {
    this.news.chart.data.map(el => {
      if(this.chartMaxValue < el.value)
        this.chartMaxValue = el.value;
    })
  }
}
