import {from, Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ProtoService } from "./proto.service";
import {Config} from "./config";

@Injectable({
  providedIn: 'root'
})
export class DownloadService extends ProtoService{

  constructor(http: HttpClient, config: Config) {
    super(http, config)
  }

  public download_uri(uri): Observable<any> {
    return this.request("aria2.addUri", [uri]);
  }

  public download_torrent(file): Observable<any> {
    let thiz = this;
    let request = this.request;
    const b64observ = new Observable(function(observer){
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => observer.next(reader.result.split(",")[1]);
      reader.onerror = error => observer.error(error);
    });
    return new Observable(function(observer){
      b64observ.subscribe(function(b64){
        request.call(thiz,"aria2.addTorrent", b64).subscribe(function(data){
          observer.next(data);
        }, function (error) {
          observer.error(error);
        });
      }, function(err){

      });
    });
  }

  public version(): Observable<any> {
    return this.request("aria2.getVersion")
  }


  public remove(gid, force = false): Observable<any> {
    if(force){
      return this.request("aria2.forceRemove", gid);
    }else{
      return this.request("aria2.remove", gid);
    }
  }

  public removeStop(gid): Observable<any> {
    return this.request("aria2.removeDownloadResult", gid);
  }

  public pause(gid, force = false): Observable<any> {
    if(force){
      return this.request("aria2.forcePause", gid);
    }else{
      return this.request("aria2.pause", gid);
    }

  }

  public pause_all(force = false): Observable<any> {
    if(force){
      return this.request("aria2.forcePauseAll");
    }else{
      return this.request("aria2.pauseAll");
    }
  }

  public unpause(gid): Observable<any> {
    return this.request("aria2.unpause", gid);
  }

  public unpause_all(): Observable<any> {
    return this.request("aria2.unpauseAll");
  }

  public tell_status(gid: string): Observable<any> {
    return this.request("aria2.tellStatus", gid);
  }

  public change_position(gid:string, pos:number, how="POS_SET"): Observable<any> {
    return this.request("aria2.changePosition", [gid, pos, how])
  }

  public get_uris(gid: string): Observable<any> {
    return this.request("aria2.getUris", gid);
  }

  public get_files(gid: string): Observable<any> {
    return this.request("aria2.getFiles", gid);
  }

  public get_peers(gid: string): Observable<any> {
    return this.request("aria2.getPeers", gid);
  }

  public get_servers(gid: string): Observable<any> {
    return this.request("aria2.getServers", gid);
  }

  public change_uri(gid: string, file_index:number, del_uris:any[], add_uris:any[]): Observable<any> {
    return this.request("aria2.changeUri", [gid, file_index, del_uris, add_uris])
  }

  public get_option(gid: string): Observable<any> {
    return this.request("aria2.getOption", gid);
  }

  public change_options(gid: string, options:any): Observable<any> {
    return this.request("aria2.changeOption", [gid, options])
  }

  public get_global_option(): Observable<any> {
    return this.request("aria2.getGlobalOption");
  }

  public change_global_options(options:any): Observable<any> {
    return this.request("aria2.changeGlobalOption", options)
  }

  public download_data(): Observable<any> {
    return this.multicall([{
      "methodName": 'aria2.getGlobalStat',
      "params":["token:" + this.config.token()]
    },{
      "methodName": 'aria2.tellActive',
      "params":["token:" + this.config.token()]
    },{
      "methodName": 'aria2.tellWaiting',
      "params":["token:" + this.config.token(), 0, 10]
    },{
      "methodName": 'aria2.tellStopped',
      "params":["token:" + this.config.token(), 0, 10]
    },{
      "methodName": 'aria2.getVersion',
      "params":["token:" + this.config.token()]
    }])
  }












}
