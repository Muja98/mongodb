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

  createNews(news: News, editorId: string) {
    debugger
    console.log(news);
    
    return this.http.post(URL + "/api/news/" + editorId, 
    {Id: news.id, title: news.title, MainPicturePath: news.mainPicturePath, Field: news.field, EditorId: editorId, 
     EditorName: news.editorName, Paragraphs: news.paragraphs, Tags: news.tags, Survey: news.survey, Chart: news.chart});
  }

  deleteNews(newsId:string) {
    return this.http.delete(URL + "/api/news/" + newsId);
  }

  deleteNewsOlderThan(editorId:string, dateTime:string) {
    return this.http.delete(URL + "/api/news/" + editorId + "/date/" + dateTime);
  }
  
  getRelatedNews(tags:string[], field:string, newsId:string) {
    let queryParams:string = "?";
    tags.forEach(tag => queryParams = queryParams.concat("tags=" + tag + "&"));
    queryParams += "field=" + field;

    return this.http.get<News[]>(URL + "/api/news/" + newsId + "/related-news/" + queryParams);
  }

  getAllNews(start:number,end:number,field:string,title:string,tag:string)
  {
    return this.http.get(URL+"/api/news?from="+start+"&to="+end+"&field="+field+"&title="+title+"&tag="+tag);
  }

  getEditorsNews(editorId:string, from:number, count:number) {
    return this.http.get<News[]>(URL + "/api/news/editor/" + editorId + "?from=" + from + "&to=" + count);
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
