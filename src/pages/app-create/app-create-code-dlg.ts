
import { Component, Output, EventEmitter } from '@angular/core';
import {  NavParams, ViewController } from 'ionic-angular';


@Component({
    selector: 'app-create-code-dlg',
    templateUrl: 'app-create-code-dlg.html'
})

export class createSecretDlgComponent {
  userName : any;
  passWord: any;
  secretName: any;
  secretMode: boolean = false;
  sshKey: any;
  secretData: secretFormData ;

  @Output() submitSecret = new EventEmitter<any>();

  constructor(
     public params: NavParams,
     public viewCtrl: ViewController
    ) {
       
      this.userName = this.params.data.secretForm.username;
      this.passWord = this.params.data.secretForm.password;
    }
  
    dismiss() {
      this.viewCtrl.dismiss(false);
    }
    onSelectChange(selectedValue:any){
      this.secretMode = selectedValue==0?false:true ;
    }
    createSecretNow(){
      //TODO validate secret data 
      this.secretData = {
        ...this.secretData,
        username : this.userName,
        password: this.passWord,
        secrestname: this.secretName,
        secretmode: this.secretMode,
        sshkey: this.sshKey,      
      }
      this.submitSecret.emit(this.secretData);
      this.viewCtrl.dismiss(this.secretData);
      
    }
}
export interface secretFormData {
  username : any;
  password: any;
  secrestname: any;
  secretmode: boolean;
  sshkey: any;
}
