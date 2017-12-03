import { ResourcesService } from '../../../services/kubernetes/resources.service';
import { FormatterService } from '../../../services/formatter.service';
import { UserService } from '../../../services/user.service';
import { Component, Input, OnChanges } from '@angular/core';
import { AlertController } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
    selector: 'project-resources',
    templateUrl: 'resources.html',
    providers: [ResourcesService]
})


export class ProjectResources implements OnChanges {
    @Input() name: string;
    resource: any = {};
    computeResource: any;
    pricing: any = {};
    usage: string;
    loading: boolean =false;
    isShowDetail: boolean = false;

    constructor(
        private _formatter: FormatterService,
        private _userService: UserService,
        private _resourcesService: ResourcesService,
        private _alertCtrl: AlertController
    ) { }

    ngOnChanges() {
        this.loading = true;
        this.getResources();
        this.getPricing();
    }

    onResourceChange(e){
        var value = parseInt(e);
        if(isNaN(value)){
            value=0;
        }
        this.resource.computeResource = value;
        this.resource.deploymentResource = this._formatter.formatBytes(this._formatter.parseByteCount(value+"Mi"));
        this.calculate();
    }

    toggleDetail(){
        this.isShowDetail = !this.isShowDetail;
    }

    getResources() {
        this._resourcesService.getResources(this.name)
            .map(res => {
                const computeResourceUsed = this._formatter.formatBytesToMib(this._formatter.parseByteCount(res.items[0].status.used["limits.memory"]));
                const computeResource = this._formatter.formatBytesToMib(this._formatter.parseByteCount(res.items[0].status.hard["limits.memory"]));

                const deploymentResourceUsed = res.items[1].status.used["limits.memory"];
                const deploymentResource = res.items[1].status.hard["limits.memory"];

                const presistentStorageUsed = res.items[2].status.used['requests.storage'];
                const presistentStorage = res.items[2].status.hard['requests.storage'];
                
                const podsUsed = res.items[0].status.used["pods"];
                const pods = res.items[0].status.hard["pods"];

                const persistentVolumeCountUsed = res.items[2].status.used["persistentvolumeclaims"];
                const persistentVolumeCount = res.items[2].status.hard["persistentvolumeclaims"];

                return { computeResource, computeResourceUsed, deploymentResource, deploymentResourceUsed,
                    presistentStorage, presistentStorageUsed, pods, podsUsed, 
                    persistentVolumeCount, persistentVolumeCountUsed }
            }).subscribe(
                res => {
                    this.computeResource = res.computeResource;
                    this.resource = res;
                    this.calculate();
                },
                err => {
                    this.failed("Get Resource",err.message);
                }
            )
    }

    getPricing() {
        this._userService.getPricingList().map(res=> {
            const computePrice = res.price_compute.monthly;
            const diskPrice = res.price_disk.monthly;
            const diskObjectPrice = res.price_object_disk.monthly;

            return { computePrice, diskPrice, diskObjectPrice }
        })
        .subscribe(
            res=>{
                this.pricing = res;
                this.calculate();
            },
            err => {
                this.failed("Get Pricing",err.message);
            }
        )
    }

    calculate(){
        if(_.isEmpty(this.resource) || _.isEmpty(this.pricing)){
            this.usage = "$ 0";
            return;
        }
        //Get and convert to MiB resource
        const computeResource = this._formatter.formatBytesToMib(this._formatter.parseByteCount(this.resource.computeResource+"MiB"));
        const computeResourceUsed = this._formatter.formatBytesToMib(this._formatter.parseByteCount(this.resource.computeResourceUsed+"MiB"));
        const deploymentResource = this._formatter.formatBytesToMib(this._formatter.parseByteCount(this.resource.deploymentResource));
        const deploymentResourceUsed = this._formatter.formatBytesToMib(this._formatter.parseByteCount(this.resource.deploymentResourceUsed));
        const presistentStorage = this._formatter.formatBytesToMib(this._formatter.parseByteCount(this.resource.presistentStorage));
        const presistentStorageUsed = this._formatter.formatBytesToMib(this._formatter.parseByteCount(this.resource.presistentStorageUsed));
        const persistentVolumeCount = this.resource.persistentVolumeCount;
        const persistentVolumeCountUsed = this.resource.persistentVolumeCountUsed;
        //Get Pricing
        const computePrice = this.pricing.computePrice;
        const diskPrice = this.pricing.diskPrice;
        const diskObjectPrice = this.pricing.diskObjectPrice;
        //Calculate
        const usageUsed = ((computeResourceUsed + deploymentResourceUsed) * computePrice) + 
            (presistentStorageUsed * diskPrice) + (persistentVolumeCountUsed * diskObjectPrice);
        const usage = ((computeResource + deploymentResource) * computePrice) + 
            (presistentStorage * diskPrice) + (persistentVolumeCount * diskObjectPrice);
        this.usage = "$ " + usageUsed.toFixed(2) + " to $" + usage.toFixed(2);
        this.loading = false;
    }
    
    onUpdate() {
        this.loading=true;
        if(this.resource.computeResource<1024){
            this.resource.computeResource = this.computeResource; //to revert back the value
            this.failed("Update","The limit compute must be between 1024 and 20480.");
            return;
        }
        this._resourcesService.updateCompute(this.name,{limits_compute: this.resource.computeResource})
        .subscribe(
            res=>{
                this.getResources();
            },
            (err) => {
                this.resource.computeResource = this.computeResource; //to revert back the value
                if (typeof err["error"] !== 'undefined') {
                    this.failed("Update",err.error)
                }else if(typeof err["limits_compute"] !== 'undefined'){
                    this.failed("Update",err.limits_compute[0]);
                }
            }
        )
    }

    failed(title,err) {
        this.loading = false;
        const loadingError = this._alertCtrl.create({
            title: title + ' Failed!',
            message: err,
            buttons: ['Dismiss']
        });
        loadingError.present()
    }

}

