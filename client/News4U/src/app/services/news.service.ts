import { Injectable } from '@angular/core';
import URL from '../../API/api';
import {HttpClient} from '@angular/common/http';
import { News } from '../models/news';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http:HttpClient) { }

  getSpecificNews(newsId:string, commentsCount:number) {
    return this.http.get<News>(URL + "/api/news/" + newsId + "?commentsCount=" + commentsCount);
  }

  getRelatedNews(newsId:string) {
    return this.http.get<News[]>(URL + "/api/news/" + newsId + "/related-news");
  }

  getAllNews(start:number,end:number,field:string,title:string,tag:string)
  {
    return this.http.get(URL+"/api/news?from="+start+"&to="+end+"&field="+field+"&title="+title+"&tag="+tag);
  }

  addNewComment(newsId:string, { text, authorsName}) {
    return this.http.post(URL + "/api/news/" + newsId + "/comment", { text, authorsName })
  }

  loadMoreComments(newsId:string, from:number, count:number) {
    return this.http.get<Comment[]>(URL + "/api/news/" + newsId + "/get-comments?from=" + from + "&count=" + count);
  }
}
