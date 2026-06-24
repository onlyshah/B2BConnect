import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class StoryService {
  constructor(private apiService: ApiService) {}

  getStories(filters?: any): Observable<any[]> {
    return this.apiService.get<any[]>(API_ENDPOINTS.STORIES.GET_ALL, filters).pipe(map((r: ApiResponse) => r.data));
  }

  getStory(id: string): Observable<any> {
    return this.apiService.get(API_ENDPOINTS.STORIES.GET_BY_ID.replace(':storyId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  createStory(data: any): Observable<any> {
    return this.apiService.post(API_ENDPOINTS.STORIES.CREATE, data).pipe(map((r: ApiResponse) => r.data));
  }

  updateStory(id: string, data: any): Observable<any> {
    return this.apiService.put(API_ENDPOINTS.STORIES.UPDATE.replace(':storyId', id), data).pipe(map((r: ApiResponse) => r.data));
  }

  deleteStory(id: string): Observable<any> {
    return this.apiService.delete(API_ENDPOINTS.STORIES.DELETE.replace(':storyId', id)).pipe(map((r: ApiResponse) => r.data));
  }

  uploadMedia(id: string, files: File[]): Observable<any> {
    return this.apiService.uploadFiles(API_ENDPOINTS.STORIES.UPLOAD_MEDIA.replace(':storyId', id), files).pipe(map((r: ApiResponse) => r.data));
  }
}
