import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endpoints } from '../../../../api/endpoints';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = Endpoints.dashboad ; // URL backend

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  
}