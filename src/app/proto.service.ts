import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Config} from "./config";

export class ProtoService {

  http : HttpClient;
  config: Config;

  constructor(http: HttpClient, config: Config) {
    this.http = http;
    this.config = config;
  }

  public request(method: string, params?: any): Observable<any> {
    let data = {
      "jsonrpc": "2.0",
      "id": new Date().getTime(),
      "method": method,
      "params": ["token:" + this.config.token()]
    };
    if(typeof params !== "undefined"){
      data['params'].push(params);
    }
    const header = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.config.rpc(), data, {
      'headers': header
    });
  }

  public multicall(params: any[]): Observable<any> {
    let data = {
      "jsonrpc": "2.0",
      "id": new Date().getTime(),
      "method": "system.multicall",
      "params": [params]
    };
    const header = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.post(this.config.rpc(), data, {
      'headers': header
    });
  }
}
