import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

export interface SettingsData {
    subDomainUrl: string;
    directHttps: boolean;
    acm: boolean;
    certificate: any;
    configVariables: any;
    rollouts: string;
    continuious: string;
    healthCheck: string;
}

@Component({
    selector: 'app-create-setting',
    templateUrl: 'app-create-setting.html'
})

export class AppCreateSettingComponent implements OnInit {
    @Input() projectConfig: any;
    @Input() appConfig: any;
    @Output() submitData = new EventEmitter<any>();
    @Output() goBack = new EventEmitter<any>();
    @Input() settingsData: SettingsData;
    newVariable = {
        key: "",
        value: ""
    };

    constructor() { }

    ngOnInit() {
        this.settingsData.subDomainUrl = this.appConfig.name + '-' + this.projectConfig.data
    }

    submitForm() {
        this.submitData.emit(this.settingsData);
    }

    submitVariable() {
        const newData = this.newVariable;
        this.settingsData.configVariables = [...this.settingsData.configVariables, newData];
        this.newVariable = {
            key: "",
            value: ""
        };
    }

    removeVariable(i) {
        const arr = [...this.settingsData.configVariables]
        this.settingsData.configVariables = _.remove(arr, (configVariable, index) => {
            return index !== i;
        });
    }

    toPrevStep() {
        this.goBack.emit()
    }
}