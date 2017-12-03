import { Component, Input } from '@angular/core';
import { AlertController, ViewController } from 'ionic-angular';
import { DropdownOptions } from '../../models/DropdownOptions'
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'content-add-member',
  templateUrl: 'content-add-member.html',
})
export class ContentAddMemberPage {
  @Input() show: boolean;
  dropdownOptions: DropdownOptions[] = [
    { value: "admin", name: "Administrator" },
    { value: "edit", name: "Member" },
    { value: "view", name: "View Only" }
  ]
  newMember: any = {role:'admin'};
  isLoading: boolean = false;
  
  constructor(
    private _modal: ModalService,
    private _userService: UserService,    
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {}

  dismiss(){
    this._modal.next({show:false});
  }

  onRoleSelected(selected) {
    this.newMember.role = selected.value;
  }

  showAlert(message:string) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  convertEmailToHash(email) {
    return this._userService.convertEmailToHash(email);
  }

  failedConvertEmail(err) {
    this.isLoading=false;
    const errorAlert = this.alertCtrl.create({
        title: 'Failed!',
        message: err.error,
        buttons: ['Dismiss']
    });
    errorAlert.present()
  }

  submitForm() {
    this.isLoading=true;
    //Validate here
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(this.newMember.email) == false) 
    {
      this.isLoading=false;
      this.showAlert("Incorrect email.");
      return ;
    }

    if(this.newMember.role === undefined){
      this.isLoading=false;
      this.showAlert("No role selected.");      
      return;
    }

    this.convertEmailToHash(this.newMember.email).subscribe(
      res=>{
          this.isLoading=false;
          this.newMember.hash=res.id;
          this._modal.next({...this.newMember, add: true, show:false});
      },
      err=>this.failedConvertEmail(err)
    );
  }
}
