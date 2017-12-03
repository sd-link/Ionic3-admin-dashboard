import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { FormatterService } from '../../services/formatter.service';
import { createSecretDlgComponent } from './app-create-code-dlg';
import * as _ from 'lodash';

export interface codeFormData {
    url: string;
    branch: string;
    autoDeploy: boolean;
    repoSource: string;
    secret: number;
    secretIndex: string;
    webhookSecret: string;
    secretForm: any;
}

@Component({
    selector: 'app-create-code',
    templateUrl: 'app-create-code.html'
})

export class AppCreateCodeComponent implements OnInit {
    @Input() projectId: any;
    @Input() dataConfigForm: any;
    @Input() codeData: codeFormData;
    @Input() userSecrets: any;
    @Input() userSecretsLoading: boolean = true;
    @Input() finishedSecretloading: boolean = false;
    @Output() submitData = new EventEmitter<any>();
    @Output() goBack = new EventEmitter<any>();
    @Output() goTop = new EventEmitter<any>();
    @Output() createSecretModal = new EventEmitter<any>();
    @Output() createSecretOne = new EventEmitter<any>();

    
    
    errors: any = {};
    toggleCreateSecret: boolean;
    checkedSecret: boolean;

    constructor(
       public modalCtrl: ModalController,
       private _userService: UserService,
       private _formatter: FormatterService
    ) {        
    }
   
    openModal() {
        
        let thismodal = this.modalCtrl.create(createSecretDlgComponent, this.codeData);
        thismodal.present();
        thismodal.onDidDismiss(data => {
            console.log(data);
            if (data){
                this.createSecretOne.emit(data);
            }
        });
    }

    ngOnInit() {
        const rand = Math.random().toString(36).substring(4);
        this.codeData = {
            ...this.codeData,
            webhookSecret: rand
        }
    }

    submitForm() {
        this.errors = {};

        if (!this.codeData.url)
            this.errors = { 
                ...this.errors, 
                url:  "This field is required."
            }

        if (!this.codeData.branch)
            this.errors = { 
                ...this.errors, 
                branch:  "This field is required."
            }
        
        if (_.isEmpty(this.errors))
            this.submitData.emit(this.codeData);
    }

    toPrevStep() {
        this.goBack.emit()
    }

    useSampleUrl(url) {
        this.codeData = {
            ...this.codeData, url
        };
    }

    changeSecrets(secretIndex) {
        this.codeData = {
            ...this.codeData,
            secret: this.userSecrets[secretIndex]
        }
    }

    createSecretToggle() {
        this.codeData = {
            ...this.codeData,
            secret: null,
            secretForm: {
                username: null,
                password: null
            },
            secretIndex: '-'
        }
        this.toggleCreateSecret = !this.toggleCreateSecret;
        this.openModal();        
        //this.createSecretModal.emit();
    }

    getSecrets(){
        this.goTop.emit();
    }    
    showGitAuth(event){
        this.goTop.emit();
        this.checkedSecret=!event.target.checked;
    }
}

