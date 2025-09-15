import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import ApexCharts from 'apexcharts';

// Import the correct types from the ApexCharts module
type ApexOptions = ApexCharts.ApexOptions;
type ApexChart = {
  width?: string | number;
  height?: string | number;
  type?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';
  foreColor?: string;
  fontFamily?: string;
  background?: string;
  offsetX?: number;
  offsetY?: number;
  events?: {
    animationEnd?(chart: any, options?: any): void;
    beforeMount?(chart: any, options?: any): void;
    mounted?(chart: any, options?: any): void;
    updated?(chart: any, options?: any): void;
    mouseMove?(e: any, chart?: any, options?: any): void;
    mouseLeave?(e: any, chart?: any, options?: any): void;
    click?(e: any, chart?: any, options?: any): void;
    xAxisLabelClick?(e: any, chart?: any, options?: any): void;
    legendClick?(chart: any, seriesIndex?: number, options?: any): void;
    markerClick?(e: any, chart?: any, options?: any): void;
    selection?(chart: any, options?: any): void;
    dataPointSelection?(e: any, chart?: any, options?: any): void;
    dataPointMouseEnter?(e: any, chart?: any, options?: any): void;
    dataPointMouseLeave?(e: any, chart?: any, options?: any): void;
    beforeZoom?(chart: any, options?: any): void;
    beforeResetZoom?(chart: any, options?: any): void;
    zoomed?(chart: any, options?: any): void;
    scrolled?(chart: any, options?: any): void;
    brushScrolled?(chart: any, options?: any): void;
  };
  brush?: {
    enabled?: boolean;
    autoScaleYaxis?: boolean;
    target?: string;
    targets?: string[];
  };
  id?: string;
  group?: string;
  sparkline?: {
    enabled?: boolean;
  };
  stacked?: boolean;
  stackType?: 'normal' | '100%';
  toolbar?: {
    show?: boolean;
    offsetX?: number;
    offsetY?: number;
    tools?: {
      download?: boolean | string;
      selection?: boolean | string;
      zoom?: boolean | string;
      zoomin?: boolean | string;
      zoomout?: boolean | string;
      pan?: boolean | string;
      reset?: boolean | string;
    };
  };
  zoom?: {
    enabled?: boolean;
    type?: 'x' | 'y' | 'xy';
    autoScaleYaxis?: boolean;
    zoomedArea?: {
      fill?: {
        color?: string;
        opacity?: number;
      };
      stroke?: {
        color?: string;
        opacity?: number;
        width?: number;
      };
    };
  };
};

export interface ChartOptions extends ApexOptions {
  series?: any[];
  chart?: ApexChart;
}

@Component({
  selector: 'app-apex-chart',
  template: `
    <div #chartContainer class="apex-chart-container" [style.width]="width" [style.height]="height"></div>
  `,
  styles: [
    `
      .apex-chart-container {
        width: 100%;
        height: 100%;
      }
    `
  ],
  standalone: true
})
export class ApexChartComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  
  @Input() chartOptions!: ChartOptions;
  @Input() series: any[] = [];
  @Input() width: string = '100%';
  @Input() height: string = '350px';
  @Input() type: string = 'line';
  @Input() autoUpdateSeries: boolean = true;
  @Input() updateOnlyOnSeriesChange: boolean = false;
  
  @Output() chartReady = new EventEmitter<ApexCharts>();
  @Output() dataPointSelection = new EventEmitter<any>();
  @Output() legendClick = new EventEmitter<any>();
  @Output() markerClick = new EventEmitter<any>();
  @Output() xAxisLabelClick = new EventEmitter<any>();
  @Output() selection = new EventEmitter<any>();
  @Output() brushScrolled = new EventEmitter<any>();
  @Output() zoomed = new EventEmitter<any>();
  
  private chart: ApexCharts | null = null;
  private isChartReady = false;

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isChartReady) {
      if (changes['series'] && this.autoUpdateSeries) {
        this.updateSeries(this.series, true);
      } else if (changes['chartOptions'] && !this.updateOnlyOnSeriesChange) {
        this.updateOptions(this.chartOptions);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private initializeChart(): void {
    if (this.chartContainer?.nativeElement) {
      const options: ChartOptions = {
        ...this.chartOptions,
        series: this.series || this.chartOptions.series || [],
        chart: {
          ...this.chartOptions.chart,
          type: this.type as any,
          width: this.width,
          height: this.height,
          events: {
            dataPointSelection: (event, chartContext, config) => {
              this.dataPointSelection.emit({ event, chartContext, config });
            },
            legendClick: (chartContext, seriesIndex, config) => {
              this.legendClick.emit({ chartContext, seriesIndex, config });
            },
            markerClick: (event, chartContext, config) => {
              this.markerClick.emit({ event, chartContext, config });
            },
            xAxisLabelClick: (event, chartContext, config) => {
              this.xAxisLabelClick.emit({ event, chartContext, config });
            },
            selection: (chartContext, config) => {
              this.selection.emit({ chartContext, config });
            },
            brushScrolled: (chartContext, config) => {
              this.brushScrolled.emit({ chartContext, config });
            },
            zoomed: (chartContext, config) => {
              this.zoomed.emit({ chartContext, config });
            }
          }
        }
      };

      this.chart = new ApexCharts(this.chartContainer.nativeElement, options);
      this.chart.render().then(() => {
        this.isChartReady = true;
        this.chartReady.emit(this.chart!);
      });
    }
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
      this.isChartReady = false;
    }
  }

  // Public methods for chart manipulation
  public updateSeries(newSeries: any[], animate: boolean = true): void {
    if (this.chart && this.isChartReady) {
      this.chart.updateSeries(newSeries, animate);
    }
  }

  public updateOptions(newOptions: ChartOptions, redrawPaths?: boolean, animate?: boolean): void {
    if (this.chart && this.isChartReady) {
      this.chart.updateOptions(newOptions, redrawPaths, animate);
    }
  }

  public appendSeries(newSeries: any[], animate: boolean = true): void {
    if (this.chart && this.isChartReady) {
      this.chart.appendSeries(newSeries, animate);
    }
  }

  public appendData(newData: any[]): void {
    if (this.chart && this.isChartReady) {
      this.chart.appendData(newData);
    }
  }

  public toggleSeries(seriesName: string): void {
    if (this.chart && this.isChartReady) {
      this.chart.toggleSeries(seriesName);
    }
  }

  public showSeries(seriesName: string): void {
    if (this.chart && this.isChartReady) {
      this.chart.showSeries(seriesName);
    }
  }

  public hideSeries(seriesName: string): void {
    if (this.chart && this.isChartReady) {
      this.chart.hideSeries(seriesName);
    }
  }

  public resetSeries(): void {
    if (this.chart && this.isChartReady) {
      this.chart.resetSeries();
    }
  }

  public zoomX(min: number, max: number): void {
    if (this.chart && this.isChartReady) {
      this.chart.zoomX(min, max);
    }
  }

  public toggleDataPointSelection(seriesIndex: number, dataPointIndex: number): void {
    if (this.chart && this.isChartReady) {
      this.chart.toggleDataPointSelection(seriesIndex, dataPointIndex);
    }
  }

  public destroy(): void {
    this.destroyChart();
  }

  public render(): Promise<void> {
    if (this.chart) {
      return this.chart.render();
    }
    return Promise.resolve();
  }

  public getChartInstance(): ApexCharts | null {
    return this.chart;
  }
}