import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from 'src/app/constants/config';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private httpClient: HttpClient) { }

  get tokenSession() {
    return sessionStorage.getItem(config.SESSION_STORAGE.TOKEN) || '';
  }

  getSubjectLisByStudyPlan(idStudyPlan: string, enabled: string): Observable<any> {
    return this.httpClient.get(config.API_URL + '/api/asignaturas/programa/' + idStudyPlan + '?habilitada=' + enabled, {
      headers: {
        'x-token': this.tokenSession
      }
    });
  }

  getSubjectById(idSubject: string): Observable<any> {
    return this.httpClient.get(config.API_URL + '/api/asignaturas/' + idSubject, {
      headers: {
        'x-token': this.tokenSession
      }
    });
  }

  updateSubject(idSubject: string, subjectBody: {}): Observable<any> {
    return this.httpClient.put(config.API_URL + '/api/asignaturas/' + idSubject, subjectBody, {
      headers: {
        'x-token': this.tokenSession
      }
    });
  }

}
