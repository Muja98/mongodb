import { Injectable } from '@angular/core';
import URL from '../../API/api';
import {HttpClient} from '@angular/common/http';
import { News } from '../models/news';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http:HttpClient) { }

  getSpecificNews(newsId:string) {
    return this.http.get<News>(URL + "/api/news/" + newsId);
  }

  getRelatedNews(newsId:string) {
    return this.http.get<News[]>(URL + "/api/news/" + newsId + "/related-news");
  }
}
