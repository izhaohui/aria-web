import { Component, OnInit } from '@angular/core';
import {DownloadService} from "./download.service";
import {NotifyService} from "./notify.service";
import {Config} from "./config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Aria-Web';
  version = "";

  constructor(private downloadService: DownloadService, private notify: NotifyService, private config: Config){}

  ngOnInit(): void {
    let _this = this;
    let _rpc_ok = this.config.rpc() != null && this.config.token() != null;
    if(!_rpc_ok){
      this.notify.warning("请在设置里配置RPC URI与Token!");
    }
    this.downloadService.version().subscribe(function(data){
      _this.version = data.result.version;
    }, function (error) {
      _this.notify.warning("无法获取ARIA服务信息，请检查RPC配置是否正确。");
    });
  }
}
