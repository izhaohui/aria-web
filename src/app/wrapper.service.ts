import { Injectable } from '@angular/core';
import { DownloadService } from "./download.service";
import { Observable, interval } from "rxjs";
import {sp} from "@angular/core/src/render3";

@Injectable({
  providedIn: 'root'
})
export class WrapperService {

  constructor(private downloadService: DownloadService) { }

  public download_data(delay:number): Observable<any> {
    const downloadService = this.downloadService;
    const processDownload = WrapperService.process_download;
    return Observable.create(function(observer){
      interval(delay).subscribe(function(i){
        downloadService.download_data().subscribe(function(data){
          let res = data.result;
          let global = res[0][0];
          let active = res[1][0];
          let waiting = res[2][0];
          let stopped = res[3][0];
          let version = res[4][0];
          let result = {
            active: processDownload(active, "active"),
            waiting: processDownload(waiting, "waiting"),
            stopped: processDownload(stopped, "stopped"),
            global: {
              'id': new Date().getTime(),
              'version': version.version,
              'speed_up': Number(global.uploadSpeed),
              'speed_down': Number(global.downloadSpeed),
              'active': Number(global.numActive),
              'waiting': Number(global.numWaiting),
              'stopped': Number(global.numStopped)
            }
          };
          observer.next(result);
        })
      });
    });
  }

  public static process_download(active: any[], status: string): any[] {
    let res = [];
    const humanSize = WrapperService.human_size;
    const fileName = WrapperService.file_name;
    const remainTime = WrapperService.remain_time;
    active.forEach(function(value, index){
      let item = {};
      item['gid'] = value.gid;
      item['status'] = status;
      item['upload'] = humanSize(value.uploadLength);
      item['completed'] = humanSize(value.completedLength);
      item['length'] = humanSize(value.totalLength);
      item['up_speed'] = Number(value.uploadSpeed);
      item['down_speed'] = Number(value.downloadSpeed);
      item['up_speed_human'] = humanSize(value.uploadSpeed, "", " / S");
      item['down_speed_human'] = humanSize(value.downloadSpeed, "", " / S");
      item['connections'] = Number(value.connections);
      item['percent'] = value.completedLength / value.totalLength * 100;
      item['file_completed'] = 0;
      item['dir'] = value.dir;
      if(typeof value.bittorrent !== "undefined" && typeof value.bittorrent.info !== "undefined"){
        item['name'] = value.bittorrent.info.name;
      }else{
        item['name'] = null;
      }
      item['remain'] = remainTime(value.totalLength - value.completedLength, value.downloadSpeed);
      item['files'] = [];
      if(typeof value.bitfield !== "undefined" && value.bitfield !== null){
        item['bitfield'] = value.bitfield.split('');
      }else{
        item['bitfield'] = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000".split("");
      }
      value.files.forEach(function(file, f_index){
        item['files'].push({
          'index': file.index,
          'selected': file.selected,
          'path': file.path,
          'name': fileName(file.path),
          'uris': file.uris,
          'completed': humanSize(file.completedLength),
          'length': humanSize(file.length),
          'percent': file.length > 0?(file.completedLength / file.length * 100).toFixed(2): "0.0%"
        });
        file.uris.forEach(function(uri, u_index){
          if(u_index === 0){
            item['uri'] = uri.uri;
          }
        });
        if(f_index === 0 && item['name'] == null){
          item['name'] = fileName(file.path);
        }
        if(file.completedLength === file.length){
          item['file_completed'] += 1;
        }
      });
      res.push(item);
    });
    return res;
  }


  public static human_size(size:any, prefix="", suffix=""): string{
    if(typeof size !== "undefined" && size !== null){
      size = Number(size);
      if(size / 1024 / 1024 / 1024 > 1){
        return prefix + (size / 1024 / 1024 / 1024).toFixed(2) + " GB" + suffix;
      }else if(size / 1024 / 1024 > 1){
        return prefix + (size / 1024 / 1024).toFixed(2) + " MB" + suffix;
      }else if(size / 1024 > 1){
        return prefix + (size / 1024).toFixed(2) + " KB" + suffix;
      }else{
        return prefix + size + " B" + suffix
      }
    }
    return "";
  }

  public static remain_time(size, speed){
    if(size && size > 0 && speed && speed > 0){
      let res = "";
      let mins = size / speed / 60;
      if(mins > 60 * 24){
        res = (mins / 60 / 24).toFixed(2) + " 天剩余";
      }else if(mins > 60){
        res = (mins / 60).toFixed(2) + " 小时剩余";
      }else if(mins > 1){
        res = mins.toFixed(2) + " 分剩余"
      }else{
        res = "马上完成";
      }
      return res;

    }
    return "无法估算"
  }

  public static file_name(full_path): string {
    if(typeof full_path !== "undefined" && full_path !== null){
      let nodes = null;
      if(full_path.indexOf('/') >= 0){
        nodes = full_path.split('/');
      }else{
        nodes = full_path.split('\\');
      }
      if(nodes.length > 0){
        return nodes[nodes.length - 1];
      }
    }
    return "";
  }

}
