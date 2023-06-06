import { Subject, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Post } from '../interface/post.interface';
import { URL_FOR_PHOTO } from '../../config';
import { catchError } from 'rxjs/operators';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  baseUrl = 'http://localhost:8080/api/posts';
  filterReset: BehaviorSubject<void> = new BehaviorSubject<void>(null);

  constructor(private http: HttpClient) { }

  filterPosts(query: any): Observable<Post[]> {
    let params = new HttpParams();

    if (query.title) {
      params = params.set('title', query.title);
    }

    if (query.description) {
      params = params.set('description', query.description);
    }

    if (query.category) {
      params = params.set('category', query.category);
    }

    if (query.sortOrder) {
      params = params.set('sortOrder', query.sortOrder);
    }

    if (query.startDate) {
      params = params.set('startDate', query.startDate);
    }

    if (query.endDate) {
      params = params.set('endDate', query.endDate);
    }

    return this.http.get<Post[]>(this.baseUrl, { params }).pipe(
      map((response) => {
        return response.map((post) => {
          post.photos = post.photos.map((photo) => URL_FOR_PHOTO + photo);
          return post;
        });
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  resetFilter() {
    this.filterReset.next(null);
  }
}
