import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import { DownloadService } from "../download.service";
import { WrapperService } from "../wrapper.service";
import { NotifyService } from "../notify.service";
import {ChartDirective} from "../chart.directive";

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  constructor(private downloadService: DownloadService, private wrapper: WrapperService, private notify: NotifyService) { }

  active_data = [];
  stopped_data = [];

  @ViewChildren(ChartDirective) chart_instances: QueryList<ChartDirective>;

  download(url){
    const notify = this.notify;
    if(url.indexOf("http://") == 0 || url.indexOf("https://") == 0 || url.indexOf("ftp://") == 0 || url.indexOf("magnet:") == 0){
      this.downloadService.download_uri(url).subscribe(function(data){
        notify.success("成功添加下载任务");
      }, function(error){
        notify.danger("添加下载任务失败，请稍后再试");
      });
    }else{
      notify.danger("输入的链接有误，请检查后重试");
    }
  }

  torrent(file){
    if(file !== null && file.name.indexOf(".torrent") >0){
      const notify = this.notify;
      this.downloadService.download_torrent(file).subscribe(function(data){
        notify.success("成功添加BT下载任务");
      }, function(error){
        notify.danger("添加下载任务失败，请稍后再试")
      });
    }else{
      this.notify.warning("选择的文件无效，检查后重试");
    }
  }

  start(item){
    const notify = this.notify;
    this.downloadService.unpause(item.gid).subscribe(function(data){
      notify.success("成功恢复下载任务");
    }, function(err){
      notify.danger("操作失败，请稍后再试");
    });
  }

  pause(item){
    const notify = this.notify;
    this.downloadService.pause(item.gid).subscribe(function(data){
      notify.success("成功暂停下载任务，等待连接关闭中……");
    }, function(err){
      notify.danger("操作失败，请稍后再试");
    });
  }

  remove(item){
    const notify = this.notify;
    const stop = ["completed", "error", "removed", "stopped"].indexOf(item.status) >= 0;
    if(stop){
      this.downloadService.removeStop(item.gid).subscribe(function(data){
        notify.success("成功移除下载结果");
      }, function(err){
        notify.danger("操作失败，清稍后重试");
      });
    }else{
      this.downloadService.remove(item.gid).subscribe(function(data){
        notify.success("成功移除下载任务，等待连接关闭中……");
      }, function(err){
        notify.danger("操作失败，请稍后再试");
      });
    }
  }

  pauseAll(){
    const _this = this;
    this.downloadService.pause_all().subscribe(function(data){
      _this.notify.success("暂停所有任务，等待连接关闭中……");
    }, function(err){
      _this.notify.danger("暂停失败，请稍后重试！");
    });
  }

  startAll(){
    const _this = this;
    this.downloadService.unpause_all().subscribe(function(data){
      _this.notify.success("已恢复所有任务");
    }, function(err){
      _this.notify.danger("恢复失败，请稍后重试！");
    });
  }


  formatTime(date: Date){
    if(date !== null){
      let res = "";
      res += date.getHours()<10?"0" + date.getHours():date.getHours();
      res += ":";
      res += date.getMinutes()<10?"0" + date.getMinutes():date.getMinutes();
      res += ":";
      res += date.getSeconds()<10?"0" + date.getSeconds():date.getSeconds();
      return res;
    }
    return "";
  }

  formatSize(val: number){
    if(val !== null){
      return val + "KB / S"
    }
  }

  ngOnInit() {
    let _this = this;
    this.wrapper.download_data(1100).subscribe(function(data){

      //global data
      const global = data.global;
      const timestamp = _this.formatTime(new Date());


      //active data
      let download_list = data.active.concat(data.waiting).concat(data.stopped);
      download_list.forEach(function(a){
        let found = false;
        _this.active_data.forEach(function(b){
          if(a.gid === b.gid){
            found = true;
            _this.chart_instances.forEach(function(e, i){
              if(e.name == "global"){
                e.update([
                  Number((Number(global.speed_down) / 1024).toFixed(2)),
                  Number((Number(global.speed_up) / 1024).toFixed(2))
                ])
              }

              if(e.name == a.gid){
                e.update([
                  Number((Number(a.down_speed) / 1024).toFixed(2)),
                  Number((Number(a.up_speed) / 1024).toFixed(2))
                ]);
              }
            });

            for(let k in a){
              b[k] = a[k];
            }
          }
        });
        if(!found){
          a.tab = 'detail';
          a.show_tab = false;
          _this.active_data.push(a);
        }
      });
    }, function(err){
      _this.notify.danger("暂时无法获取服务器状态");
    });
  }

}
