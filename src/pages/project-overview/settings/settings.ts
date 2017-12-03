import { ListenerService } from '../../../services/listener.service';
import { ProjectService } from '../../../services/kubernetes/project.service';
import { ModalConfirmDeletePage } from '../../modal-confirm-delete/modal-confirm-delete';
import { LoadingController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'project-settings',
    templateUrl: 'settings.html',
})


export class ProjectSettings implements OnInit {
    project: any = {};
    loading: boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        public _projectService: ProjectService,
        public _listenerService: ListenerService,
        public toastCtrl : ToastController
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        const projectId = this.navParams.data.projectId;
        
                this._projectService.getProject(projectId)
                    .subscribe(res => {
                        this.project = {
                            id: res.metadata.name,
                            displayName: res.metadata.annotations['openshift.io/display-name']
                        }
                    })
    }

    confirmDeleteModal() {
        const confirmationModal = this.modalCtrl.create(ModalConfirmDeletePage, this.project);
        confirmationModal.onDidDismiss(data => {
            if (data.delete == true)
                this.deleteProject();
        });
        confirmationModal.present();
    }

    deleteProject() {
        const loading = this.loadingCtrl.create({
            content: 'Deleting project...'
        });
        loading.present();
        this._projectService.deleteProject(this.project.id)
            .subscribe(res => {
                loading.dismiss();
                this._listenerService.triggerReload({
                    type: 'project',
                    action: 'delete'
                })
                this.navigateToRoot()
            }, () => {
                loading.dismiss();
            })
    }

    navigateToRoot() {
        setTimeout(() => {
            this.navCtrl.push('ProjectListPage');
        }, 1000);
    }
    
    submitData() {
        this.loading = true;
        this._projectService.patchProject(this.project.id, this.project)
            .subscribe(res => {
                this.loadData();
                this.loading = false;
                this.openToast('Data Updated');
                this._listenerService.triggerReload({
                    type: 'project',
                    projectId: this.project.id
                })
            },() => {
                this.loading = false;
                this.openToast('Update failed')
            })
    }
  
    openToast(value) {
        const toast = this.toastCtrl.create({
        message: value,
        duration: 3000,
        position: 'top'
        });
        toast.present();
    }
}