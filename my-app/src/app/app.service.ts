import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {

  private apiUrl = 'http://localhost:3000/getList'
  constructor(private http: Http) { }

  //make the api get call to fetch data 
  listCall() {
    return this.http.get(this.apiUrl)
    .pipe(
    map((res:Response) => (res.json()).reverse())
    )
  }
}