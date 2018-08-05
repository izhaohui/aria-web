import { Component, Injectable, OnInit } from '@angular/core';
import {trigger, state, animate, transition, style, keyframes} from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  _visible = "hide";
  _type = "";
  _important = "";
  _message = "";

  get visible(){
    return this._visible;
  }

  get important(){
    return this._important;
  }

  get message(){
    return this._message;
  }

  get type(){
    return this._type;
  }

  public dismiss(){
    this._visible = "hide";
  }

  private base(message: string, type: string, important=""){
    this._visible = "show";
    this._message = message;
    this._important = important;
    this._type = type;
    let _this = this;
    setTimeout(function(){
      _this._visible = "hide";
    }, 3000);
  }

  public success(message: string, important=""){
    this.base(message, "alert-success", important);
  }

  public danger(message: string, important=""){
    this.base(message, "alert-danger", important);
  }

  public info(message: string, important=""){
    this.base(message, "alert-info", important);
  }

  public warning(message: string, important=""){
    this.base(message, "alert-warning", important);
  }

}

@Component({
  selector: 'alert',
  template: `<div class="notify-bar alert alert-dismissible" [@onOff]="visible" [ngClass]="alert" role="alert" [style.top]="visible=='show'?'20px':'-100px'" style="font-size:24px;position: fixed;width:60%;">
    <strong *ngIf="important">{{ important }}</strong> <span>{{ message }}</span>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close" (click)="dismiss()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`,
  animations: [trigger("onOff", [
    transition('hide => show', animate(400, keyframes([
      style({top: '-100px', opacity: '0.2', offset: 0}),
      style({top: '20px',opacity: '1', offset: 1})
    ]))),
    transition('show => hide', animate(200, keyframes([
      style({top: '20px', opacity: '1', offset: 0}),
      style({top: '-100px', opacity: '0.2', offset: 1})
    ])))
  ])]
})
export class NotifyComponent implements OnInit {


  constructor(private notifyService: NotifyService) { }


  get alert(): string {
    return this.notifyService.type;
  }

  get visible(): string {
    return this.notifyService.visible;
  }

  get important(): string {
    return this.notifyService.important;
  }

  get message(): string {
    return this.notifyService.message;
  }

  dismiss() {
    this.notifyService.dismiss();
  }

  ngOnInit() {

  }

}

