import { Survey } from './../models/survey';
import { Injectable } from '@angular/core';
import URL from '../../API/api';
import {HttpClient} from '@angular/common/http';
import { News } from '../models/news';
import { Comment } from '../models/comment';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http:HttpClient) { }

  getSpecificNews(newsId:string, commentsCount:number) {
    return this.http.get<News>(URL + "/api/news/" + newsId + "?commentsCount=" + commentsCount);
  }

  createNews(news: News) {
    debugger
    console.log(news);
    return this.http.post(URL + "/api/news/6019d9901e3c7dd5dd607002", 
    {Id: news.id, title: news.title, MainPicturePath: news.mainPicturePath, Field: news.field, EditorId: "6019d9901e3c7dd5dd607002", 
     EditorName: "Cakic Predrag", Paragraphs: news.paragraphs, Tags: news.tags, Survey: news.survey, Chart: news.chart});
  }

  deleteNews(newsId:string) {
    return this.http.delete(URL + "/api/news/" + newsId);
  }
  
  getRelatedNews(newsId:string) {
    return this.http.get<News[]>(URL + "/api/news/" + newsId + "/related-news");
  }

  getAllNews(start:number,end:number,field:string,title:string,tag:string)
  {
    return this.http.get(URL+"/api/news?from="+start+"&to="+end+"&field="+field+"&title="+title+"&tag="+tag);
  }

  getEditorsNews(editorId:string) {
    return this.http.get<News[]>(URL + "/api/news/editor/" + editorId);
  }

  addNewComment(newsId:string, { text, authorsName}) {
    return this.http.post(URL + "/api/news/" + newsId + "/comment", { text, authorsName })
  }

  loadMoreComments(newsId:string, from:number, count:number) {
    return this.http.get<Comment[]>(URL + "/api/news/" + newsId + "/get-comments?from=" + from + "&count=" + count);
  }

  getAvailableFields()
  {
    return this.http.get(URL+"/api/news/available-fields");
  }
}
