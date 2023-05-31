import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Post } from '../interface/post.interface';
import { URL_FOR_PHOTO } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  baseUrl = 'http://localhost:8080/api/posts';
  filterReset: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) { }

  setSearchText(searchText: string): Observable<Post[]> {
    const params = { searchText };
    return this.http.get<Post[]>(`${this.baseUrl}/search/by_title_or_description`, { params });
  }

  sortByCreationDate(sortOrder: string): Observable<Post[]> {
    const params = new HttpParams().set('sortOrder', sortOrder);
    return this.http.get<Post[]>(`${this.baseUrl}/sort/by_creation_date`, { params });
  }

  sortByDateRangePicker(startDate: Date, endDate: Date): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/sort/by_date_range_picker`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  resetFilter() {
    this.filterReset.next();
  }

  getPhotoSrc(photo: any): string {
    return photo?.url ? URL_FOR_PHOTO + photo.url : '';
  }
}
