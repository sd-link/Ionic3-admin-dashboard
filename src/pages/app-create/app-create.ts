import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs/Rx';
import { ConfigMapService } from '../../services/kubernetes/configmap.service';
import { ImageStreamService } from '../../services/kubernetes/imagestream.service';
import { SecretService } from '../../services/kubernetes/secret.service';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';

import { Secret } from './../../models/Secret';
import { Configmap } from './../../models/Configmap';
import { ImageStream } from './../../models/ImageStream';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the AppCreatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-app-create',
  templateUrl: 'app-create.html',
  providers: [ConfigMapService, ImageStreamService, SecretService]
})
export class AppCreatePage {
  paramProjectId: any;
  dataConfigForm: any = {
    lang: null,
    vendor: 0,
    version: 0,
    image: null
  };
  dataCodeForm: any = {
    url: null,
    branch: 'master',
    autoDeploy: true,
    repoSource: 'generic',
    webhookSecret: null,
    secret: null,
    secretIndex: '-',
    secretForm: {
      username: null,
      password: null
    }
  };
  dataResourcesForm: any = {
    size: 'small',
    autoScale: 1,
    replica: {
      min: 0,
      max: 0
    }
  };
  dataSettingsForm: any = {
    subDomainUrl: '',
    directHttps: true,
    acm: true,
    certificate: {
      active: false,
      key: ''
    },
    configVariables: {},
    rollouts: 'rolling',
    continuious: 'deployment',
    healthCheck: ''
  };;
  dataSummaryForm: any = {};
  activeStep: number = 1;
  userSecrets: any;
  userSecretsLoading: boolean = false;
  finishedSecretloading: boolean;
  pricingList: any[] ;

  deployment: any = {
    progress: 0,
    status: null
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private _imagestreamService: ImageStreamService,
    private _secretService: SecretService,
    private _configmapService: ConfigMapService,
    private _userService: UserService,
    public atrCtrl: AlertController,
  ) {
  }

  ionViewDidLoad() {
    this.paramProjectId = this.navParams;
  }
  showAlert(title:string, content:string) {
    let alert = this.atrCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['OK']
    });
    alert.present();
  }
  createSecretList(){
    this.userSecretsLoading=true;
    this.listSecrets(this.paramProjectId.data).subscribe(res => {
      this.userSecrets = res.items;
      this.userSecretsLoading=false;
      this.finishedSecretloading=true;
      for (var v=0; v< this.userSecrets.length;v++) {
        if((this.userSecrets[v].type+'').search('ssh-auth')!=-1 || (this.userSecrets[v].type+'').search('basic-auth')!=-1) continue;
        this.userSecrets.splice(v,1);
        v--;
      }   
       
     }, () => { })
  }

  setConfiguration(event) {
     this.dataConfigForm = event;
     this.nextStep();
  }
 
  setCode(event) {
    this.dataCodeForm = event;
    this.nextStep();
  }

  setResource(event) {
    const loading = this.loadingCtrl.create({
      content: 'Setup resources please wait...'
    });
    loading.present();
    this.loadPricing().subscribe(res => {
      this.dataResourcesForm = {
        ...event,
        cost: res.applications[event.size]
      };
      loading.dismiss();
      this.nextStep();
    }, () => { })
  }
  getPricingList(){
    const loading = this.loadingCtrl.create({
      content: 'Setup resources please wait...'
    });
    loading.present();
    this.loadPricing().subscribe(res => {
      this.pricingList = new Array();
      Object.keys(res.applications).forEach(key => {
        let oneList:string[];
        oneList = new Array(key,res.applications[key].memory);
        this.pricingList.push(oneList);
      });

      loading.dismiss();
    }, () => { })
  }

  setSetting(event) {
    this.dataSettingsForm = event;
    this.nextStep();
  }

  nextStep() {
    this.activeStep = this.activeStep + 1;
  }

  prevStep() {
    this.activeStep = this.activeStep - 1;
  }

  loadPricing() {
    return this._userService.getPricingList()
  }

  listSecrets(projectId) {
    return this._secretService.listSecrets(projectId)
  }

  nextDeploymentProgress() {
    this.deployment.progress = this.deployment.progress + 1;
  }

  createSecret(projectId, appId) {
      if (!this.dataCodeForm.secretForm.username && !this.dataCodeForm.secretForm.password)
      return Observable.from([])

    const secretBody: Secret = {
      apiVersion: "v1",
      data: {
        password: window.btoa(this.dataCodeForm.secretForm.password),
        username: window.btoa(this.dataCodeForm.secretForm.username)
      },
      kind: "Secret",
      metadata: {
        annotations: {
          "generated-by": "AusNimbus"
        },
        creationTimestamp: null,
        name: appId,
        labels: {
          app: appId
        }
      },
      "type": "kubernetes.io/basic-auth"
    };
    return this._secretService.createSecret(secretBody, projectId)
  }

  createSecretX(secretData: any){
    var projectId = this.paramProjectId.data;
    var appId = this.dataConfigForm.name;
    var resultCreate:any;
    
    if (secretData.secretmode){
      const secretBody: Secret = {
        apiVersion: "v1",
        data: {
          "ssh-privatekey": window.btoa(secretData.privatekey)
        },
        kind: "Secret",
        metadata: {
          annotations: {
            "generated-by": "AusNimbus"
          },
          creationTimestamp: null,
          name: secretData.secrestname,
          labels: {
            app: appId 
          }
        },
        "type": "kubernetes.io/ssh-auth"
      };
      resultCreate = this._secretService.createSecret(secretBody, projectId)
    }else{

      const secretBody: Secret = {
        apiVersion: "v1",
        data: {
          password: window.btoa(secretData.password),
          username: window.btoa(secretData.username)
        },
        kind: "Secret",
        metadata: {
          annotations: {
            "generated-by": "AusNimbus"
          },
          creationTimestamp: null,
          name: secretData.secrestname,
          labels: {
            app: appId
          }
        },
        "type": "kubernetes.io/basic-auth"
      };
     
      resultCreate = this._secretService.createSecret(secretBody, projectId)
    }
    resultCreate.subscribe(res => {
      this.showAlert("Creating new secret","Successfully generated secrets");
    }, err => {
      this.showAlert("Creating new secret",err.message);
      console.log(err.message);
    })
    return resultCreate ;
  }
  createConfigmap(projectId, appId) {
    const configBody: Configmap = {
      apiVersion: "v1",
      data: this.dataSettingsForm.configVariables,
      kind: "ConfigMap",
      metadata: {
        annotations: {
          "generated-by": "AusNimbus"
        },
        creationTimestamp: null,
        name: appId,
        labels: {
          app: appId
        }
      }
    }
    return this._configmapService.createConfigMap(configBody, projectId)
  }

  createImageStream(projectId, appId) {
    const imageStreamBody: ImageStream = {
      apiVersion: "v1",
      kind: "ImageStream",
      metadata: {
        annotations: {
          "generated-by": "AusNimbus"
        },
        creationTimestamp: null,
        generation: 1,
        labels: {
          app: appId
        },
        name: appId
      }
    }
    return this._imagestreamService.createImageStream(imageStreamBody, projectId)
  }

  deploy() {
    const projectId = this.paramProjectId.data;
    const appId = this.dataConfigForm.name;
    const secret$ = this.createSecret(projectId, appId);
    const configMap$ = this.createConfigmap(projectId, appId);
    const imageStream$ = this.createImageStream(projectId, appId);

    Observable.combineLatest(secret$, configMap$, imageStream$)
      .subscribe(([secret, configMap, imageStream]) => {
      }, err => {
      })
  }
}
