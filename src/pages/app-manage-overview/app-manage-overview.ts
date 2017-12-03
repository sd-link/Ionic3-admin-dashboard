/**
TODO:

WATCH /oapi/v1/namespaces/{projectId}/deploymentconfigs?labelSelector=app={appId}
WATCH /oapi/v1/namespaces/{projectId}/builds?labelSelector=app={appId}
WATCH /aapi/v1/namespaces/{projectId}/repplicaioncontrollers?labelSelector=app={appId}
*/


import { PodsService } from '../../services/kubernetes/pods.service';
import { FormatterService } from '../../services/formatter.service';
import { Observable } from 'rxjs/Rx';
import { DeploymentConfigService } from "../../services/kubernetes/deploymentconfig.service";
import { HawkularService } from '../../services/hawkular.service';
import { Component, ElementRef, OnChanges } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import Chart from 'chart.js';
import * as _ from 'lodash';

const BUCKETS = 30;
const START = "-30mn";

/**
 * Generated class for the AppManageOverviewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-app-manage-overview',
  templateUrl: 'app-manage-overview.html',
  styles: ['.box-app-deploy-history { padding: 0 0 10px 0}'],
  providers: [DeploymentConfigService, PodsService, HawkularService]
})
export class AppManageOverviewPage implements OnChanges {
  section: 'overview' | 'code' | 'resources' | 'metrics' | 'logs' | 'advanced' | 'settings' = 'overview';
  app: any;
  blankslate: boolean;

  tabMenus: any = [
    { name: 'overview', value: 'Overview', component: 'AppManageOverviewPage', icon: 'fa-bars'},
    { name: 'code', value: 'Code', component: 'AppManageCodePage' , icon: 'fa-code'},
    { name: 'resources', value: 'Resources', component: 'AppManageResourcesPage' , icon: 'fa-database'},
    { name: 'metrics', value: 'Metrics', component: 'AppManageMetricsPage' , icon: 'fa-chart-area'},
    { name: 'logs', value: 'Logs', component: 'AppManageLogsPage' , icon: 'fa-terminal'},
    { name: 'advanced', value: 'Advanced', component: 'AppManageAdvancedPage' , icon: 'fa-ellipsis-h'},
    { name: 'settings', value: 'Settings', component: 'AppManageSettingsPage' , icon: 'fa-cog'}
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _deploymentconfigService: DeploymentConfigService,
    private _podsService: PodsService,
    private _hawkularService: HawkularService,
    private _formatterService: FormatterService,
    public loadingCtrl: LoadingController,
    private _el: ElementRef,
  ) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  ngOnChanges() {
    this.loadData();
  }

  loadData() {
    const appParam = this.navParams.data;

    const deploymentConfig$ = this._deploymentconfigService.getDeploymentConfig(appParam.namespace, appParam.name);
    /*
      overview metrics we can take -15mn and duration 1mn

    */

    const buckets = 24;
    const chart$ = this.queryMetrics(appParam.namespace, appParam.name, buckets);

    deploymentConfig$.subscribe(app => {
      this.app = {
        ...app
      };
    },() => {});

    Observable.combineLatest(deploymentConfig$, chart$).subscribe(([app, chart]) => {
      if (!chart) {
        this.blankslate = true;
        return false
      } else {
        this.blankslate = false;
      }
      const datasets = {
        cpu: this.parseArrayInt(chart.cpu.datasets),
        memory: this.parseArrayInt(chart.memory.datasets),
        tx: this.parseArrayInt(chart.tx.datasets),
        rx: this.parseArrayInt(chart.rx.datasets),
      }
      const limit: any = {
        cpu: this.formatByteToNumber(chart.resources[0].limits.cpu),
        memory: this.formatByteToNumber(chart.resources[0].limits.memory),
        tx: chart.tx.datasets[(BUCKETS - 1)],
        rx: chart.rx.datasets[(BUCKETS - 1)]
      }
      const lastDataset: any = {
        cpu: datasets.cpu[BUCKETS - 1],
        memory: datasets.memory[BUCKETS - 1],
        tx: chart.tx.datasets[BUCKETS - 1],
        rx: chart.rx.datasets[BUCKETS - 1]
      }
      this.initChart({
        title: "MEMORY",
        selector: "#chart-memory",
        color: "31, 140, 235",
        max: limit.memory
      }, datasets.memory, chart.memory.labels);
      this.initChart({
        title: "CPU",
        selector: "#chart-cpu",
        color: "109, 209, 35"
      }, datasets.cpu, chart.memory.labels);
      this.initChart({
        title: "NETWORK",
        selector: "#chart-network",
        color: "119, 209, 35"
      }, datasets.tx, chart.tx.labels);
      this.app = {
        ...this.app,
        memoryUsage: (limit.memory == 0) ? '0' : (this.calcPercentage(lastDataset.memory, limit.memory)).toFixed(0) + '%',
        cpuUsage: (limit.cpu == 0) ? '0' : (this.calcPercentage(lastDataset.cpu, limit.cpu)).toFixed(0) + '%',
        networkUsage: (limit.tx == 0) ? '0' : (this.calcPercentage(lastDataset.memory, limit.memory)).toFixed(0)
      };
    },() => {
      this.blankslate = true;
      this.app = {
        ...this.app,
        memoryUsage: '0%',
        cpuUsage: '0%',
        networkUsage: '0%'
      };
    });
  }

  initAllChart() {
    
  }

  parseArrayInt(arr) {
    return arr.map(item => {
      return parseInt(parseInt(item).toFixed(0))
    })
  }

  calcPercentage(value: number, limit: number) {
    return (value / limit) * 100
  }

  formatByteToNumber(byte): number {
    // TODO: update the formatter for support return like '92m'
    return parseInt(byte.toLowerCase().replace(/([a-z]*)/g, ''));
  }

  initChart(option, datasets, labels) {
    const chartElement = this._el.nativeElement.querySelector(option.selector);
    const min = 0;
    const max = option.max ? option.max : Math.max(...datasets);
    new Chart(chartElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: option.title,
          //steppedLine: 'after',
          data: datasets,
          backgroundColor: `rgba(${option.color}, 0.2)`,
          borderColor: `rgba(${option.color}, 1)`,
          pointBorderWidth: 1,
          borderWidth: 1,
          pointBackgroundColor: 'rgba(255,255,255,0.2)',
          pointHoverBorderColor: 'rgba(109,209,35,0.2)',
          fill: true,
          pointHoverRadius: 1
        }]
      },
      options: {
        responsive: true,
        elements: {
          point: { radius: 0 }
        },
        tooltips: {
          enabled: true,
          position: 'nearest'
        },
        hover: {
          mode: 'nearest'
        },
        scales: {
          yAxes: [{
            display: false,
            gridLines: {
              display: false,
              drawBorder: false,
            },
            scaleLabel: {
              display: false
            },
            ticks: {
              display: false,
              min: min,
              max: max + 1,
              padding: 0
            }
          }],
          xAxes: [{
            display: false,
            gridLines: {
              display: false,
              drawBorder: false
            },
            scaleLabel: {
              display: false
            },
            ticks: {
              display: false,
              padding: 0
            }
          }]
        },
        legend: {
          display: false
        }
      }
    });
  }

  populatePods(res) {
    const uids = _.join(res.items.map(item => {
      return (item) ? item.metadata.uid : false
    }), '|');
    const resources = res.items.map(item => {
      return _.flatten(item.spec.containers)
    }).map(container => {
      return container.map(item => item.resources)
    });
    return [uids, _.flattenDeep(resources)]
  }

  queryMetrics(projectId, appId, buckets) {
    const params = `?labelSelector=app=${appId}`
    let memory = {
      key: 'memory/usage',
      items: []
    };
    let cpu = {
      key: 'cpu/usage_rate',
      items: []
    };
    let tx = {
      key: 'network/tx_rate',
      items: []
    };
    let rx = {
      key: 'network/rx_rate',
      items: []
    };
    return this._podsService.getPods(projectId, params)
      .map(res => {
        return this.populatePods(res);
      })
      .flatMap(([uids, resources]) => {
        const body = {
          "tags": `descriptor_name:network/tx_rate|network/rx_rate|memory/usage|cpu/usage_rate,type:pod,pod_id:${uids}`,
          "buckets": BUCKETS,
          "start": START
        }
        return this._hawkularService.queryMetrics(body, projectId)
          .map(hawkularChart => {
            return [hawkularChart, resources]
          })
      })
      .map(([res, resources]) => {
        if (!res)
          return false
        const gauge = res.gauge ? res.gauge : {};
        Object.keys(gauge).map(key => {
          if (_.includes(key, memory.key))
            memory.items = [...memory.items, gauge[key]];
          if (_.includes(key, cpu.key))
            cpu.items = [...cpu.items, gauge[key]];
          if (_.includes(key, tx.key))
            tx.items = [...tx.items, gauge[key]];
          if (_.includes(key, rx.key))
            rx.items = [...rx.items, gauge[key]];
        });
        return {
          resources,
          memory: {
            ...memory,
            items: this.mergeStats(memory.items),
            datasets: this.populatedDatasets(memory.items),
            labels: this.populatedLabels(memory.items)
          },
          cpu: {
            ...cpu,
            items: this.mergeStats(cpu.items),
            datasets: this.populatedDatasets(cpu.items),
            labels: this.populatedLabels(cpu.items)
          },
          tx: {
            ...tx,
            items: this.mergeStats(tx.items),
            datasets: this.populatedDatasets(tx.items),
            labels: this.populatedLabels(tx.items)
          },
          rx: {
            ...rx,
            items: this.mergeStats(rx.items),
            datasets: this.populatedDatasets(rx.items),
            labels: this.populatedLabels(rx.items)
          }
        }
      });
  }

  populatedDatasets(arr) {
    return this.mergeStats(arr).map(item => {
      //TODO if cpu: (item.avg * 100) / limits.cpu
      return (item.avg) ? (item.avg / (1000 * 1000)).toFixed(2) : 0;
    });
  }

  populatedLabels(arr) {
    return this.mergeStats(arr).map(item => item.startDisplay);
  }

  mergeStats(arr) {
    let populatedArr = [];
    _.flatMap(arr).map(item => {
      const existArr = populatedArr.filter(key => key.start == item.start);
      if (existArr.length) {
        const idx = populatedArr.indexOf(existArr[0])
        populatedArr[idx] = _.assign(populatedArr[idx], item)
      } else {
        populatedArr = [...populatedArr, item]
      }
    });
    return populatedArr.map(item => {
      return {
        ...item,
        startDisplay: this._formatterService.getUnixToDate(item.start)
      }
    });
  }

  backToProject() {
    this.navCtrl.push('ProjectOverviewPage', { projectId: this.navParams.data.namespace, component: 'apps' })
  }

  openPage(component) {
    this.navCtrl.push(component, this.navParams.data)
  }
}
