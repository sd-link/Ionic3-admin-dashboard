import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface resourceData {
    size: string;
    autoScale: number;
    replica: any;
}

@Component({
    selector: 'app-create-resource',
    templateUrl: 'app-create-resource.html'
})

export class AppCreateResourceComponent implements OnInit {
    @Output() submitData = new EventEmitter<any>();
    @Output() goBack = new EventEmitter<any>();
    @Output() getPricingList = new EventEmitter<any>();
    @Input() pricingList:any;
    @Input() resourceData: resourceData;
    
     
    minMax: any = {lower: 3, upper: 4};
   
    constructor() { }

    ngOnInit() {
        this.getPricingList.emit();
    }

    setReplica(type, isAdd) {
        const currentValue = (type == 'min') ? this.resourceData.replica.min : this.resourceData.replica.max;
        if (type == 'min') {
            this.resourceData.replica.min = this.changeReplicaValue(currentValue, isAdd);
            this.minMax.lower = this.resourceData.replica.min;
            console.log(this.minMax.lower);
        } else {
            this.resourceData.replica.max = this.changeReplicaValue(currentValue, isAdd);
            this.minMax.upper = this.resourceData.replica.max;
            console.log(this.minMax.upper);
        }
    }

    changeReplicaValue(data, action) {
        if (action)
            return data + 1;
        return (data != 0) ? (data - 1) : data;
    }
    
    submitForm() {
        this.submitData.emit(this.resourceData);
    }

    toPrevStep() {
        this.goBack.emit()
    }
}