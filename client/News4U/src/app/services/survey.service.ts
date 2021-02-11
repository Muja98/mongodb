import { Injectable } from '@angular/core';
import URL from '../../API/api';
import {HttpClient} from '@angular/common/http';
import { NamedValue } from '../models/named-value';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private http:HttpClient) { }

  getSurveyResults(newsId:string) {
    return this.http.get<NamedValue[]>(URL + "/api/news/" + newsId + "/survey");
  }

  voteSurvey(newsId:string, surveyAnswer:string) {
    return this.http.patch(URL + "/api/news/" + newsId + "/survey/" + surveyAnswer, {});
  }
}
