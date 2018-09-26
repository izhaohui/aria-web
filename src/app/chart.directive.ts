import { Directive, ElementRef, OnInit, Input, Host } from '@angular/core';
import * as ApexCharts from 'apexcharts';

@Directive({
  selector: '[appChart]'
})
export class ChartDirective implements OnInit{

  option = null;
  instance = null;

  @Input() name:string;
  @Input() width:number;
  @Input() height:number;
  @Input() tick:number;
  @Input() tooltip:boolean;
  @Input() yaxis:boolean;
  @Input() xaxis:boolean;
  @Input() legend:boolean;

  constructor(private element: ElementRef) { }

  update(data){
    if(this.instance != null){
      this.instance.appendData([{
        'data': [data[0]]
      }, {
        'data': [data[1]]
      }]);
    }
  }

  ngOnInit(): void {
    this.option = {
      chart: {
          width: this.width,
          height: this.height,
          type: 'area',
          animations: {
              dynamicAnimation: {
                  enabled: false
              }
          },
          toolbar: {
              show: false
          }
      },
      dataLabels: {
          enabled: false
      },
      xaxis: {
          range: this.tick,
          tickAmount: this.tick
      },
      stroke: {
          curve: 'smooth',
          width: 1
      },
      grid: {show: false},
      series: [{
        "name": "Download",
        "data": []
      },{
        "name": "Upload",
        "data": []
      }]
    };
    if(typeof this.legend == "undefined" || !this.legend){
      this.option.legend = {show: false}
    }
    if(typeof this.yaxis == "undefined" || !this.yaxis){
      this.option.yaxis = {};
      this.option.yaxis.labels = {show: false};
      this.option.yaxis.tooltip = {enabled: false};
    }else{
      this.option.yaxis = {
        opposite: true,
        labels: {show: true, formatter: function(y){return y + "KB/S"}}
      }
    }
    if(typeof this.xaxis == "undefined" || !this.xaxis){
      this.option.xaxis.labels = {show: false};
      this.option.xaxis.tooltip = {enabled: false};
    }
    if(typeof this.tooltip != "undefined" && this.tooltip){
      this.option.tooltip = {
        fixed: {
          enabled: false,
          position: 'topRight'
        },
        x: { show: false },
        y: {
            formatter: function(y){return y + " KB/S"}
        },
      }
    }else{
      this.option.tooltip = {
        enabled: false
      }
    }
    const _this = this;
    setTimeout(function(){
      _this.instance = new ApexCharts(
          _this.element.nativeElement,
          _this.option
      );
      _this.instance.render();
    }, 2000);

  }



}
