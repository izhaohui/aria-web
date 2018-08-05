import { Component, OnInit } from '@angular/core';
import {DownloadService} from "../download.service";
import {NotifyService} from "../notify.service";
import {Config} from "../config";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  config = null;

  constructor(private downloadService: DownloadService, private notify: NotifyService, private c: Config) { }

  submit(){
    let param = {};
    let _this = this;
    const keys = ["max-overall-download-limit", "max-overall-upload-limit", "max-concurrent-downloads", "dht-entry-point", "bt-tracker"];
    for(let key of keys){
      param[key] = this.config[key];
    }
    this.c.update(this.config.rpc, this.config.token);
    this.downloadService.change_global_options(param).subscribe(function (data) {
      _this.notify.success("更新配置成功");
    }, function(err){
      _this.notify.danger("更新配置失败");
    })
  }

  ngOnInit() {
    let _this = this;
    this.downloadService.get_global_option().subscribe(function(data){
      let conf = new Config();
      _this.config = data.result;
      _this.config.rpc = conf.rpc();
      _this.config.token = conf.token();
    },function (error) {
      _this.config = {'rpc':'', 'token':''};
      _this.notify.danger("无法获取设置信息，请稍后重试");
    })
  }

}
