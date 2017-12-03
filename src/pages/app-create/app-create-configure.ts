import { Observable } from 'rxjs/Rx';
import { ImageStreamService } from '../../services/kubernetes/imagestream.service';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'app-create-configure',
    templateUrl: 'app-create-configure.html',
    providers: [ImageStreamService]
})
export class AppCreateConfigureComponent implements OnChanges{
    @Input() projectId: any;
    @Input() activeConfig: any;
    @Output() submitData = new EventEmitter<any>();
    errors: any = {};
    appName: string;
    vendorImage: any;
    selectedLang: any;
    selectedVendor: any;
    selectedVersion: any;

    constructor(
        private _imagestreamService: ImageStreamService
    ) {
    }

    ngOnChanges() {
        if (this.projectId)
            this.loadVendorImageStreams(this.projectId);
        if (this.activeConfig)
            this.appName = this.activeConfig.name;
    }

    loadVendorImageStreams(projectId) {
        const ausnimbusImages$ = this._imagestreamService.listImageStreams('ausnimbus');
        const openshiftImages$ = this._imagestreamService.listImageStreams('openshift');

        Observable.combineLatest(ausnimbusImages$, openshiftImages$).subscribe(([ausnimbusImage, openshiftImage]) => {
            const imageStream = [...ausnimbusImage.items, ...openshiftImage.items];

            const populatedImage = imageStream.filter(item => {
                return (item.metadata.annotations) ? _.includes(item.metadata.annotations['ausnimbus/tags'], 'builder') : null;
            })

            const groupImage = _.reduce(populatedImage, (result, images) => {
                const tags = images.metadata.annotations['ausnimbus/support'];
                const annotations = images.metadata.annotations;
                (result[tags] || (result[tags] = [])).push({
                    description: annotations['ausnimbus/description'],
                    docUrl: annotations['ausnimbus/documentation-url'],
                    providerName: annotations['ausnimbus/provider-display-name'],
                    support: annotations['ausnimbus/support'],
                    supportUrl: annotations['ausnimbus/support-url'],
                    displayName: annotations['openshift.io/display-name'],
                    images: images
                });
                return result
            }, {})

            this.vendorImage = Object.keys(groupImage).map(function (key, index) {
                const item = groupImage[key];
                return {
                    name: item[0].displayName,
                    support: item[0].support,
                    description: item[0].description,
                    items: item
                }
            });

            if (this.activeConfig.lang)
                this.changeSelectedLang(this.activeConfig.lang, this.activeConfig.vendor, this.activeConfig.version.index);
        })
    }

    icoClass(lang) {
        return (lang == 'go') ? 'go-gopher' : lang;
    }

    selectLangIco(image) {

        if (!this.appName){
            this.errors = { 
                ...this.errors, 
                name:  "This field is required."
            }
            return ;
        }

        if (this.activeConfig) {
            this.activeConfig = {
                ...this.activeConfig,
                image,
                lang: image.support
            };
            this.changeSelectedLang(image.support);
        }
    }

    changeSelectedLang(lang, vendorIndex: number = 0, versionIndex: number = 0) {
        this.selectedLang = this.vendorImage.filter(item => item.support == lang)[0];
        this.activeConfig.vendor = vendorIndex;
        this.changeSelectedVendor(vendorIndex, versionIndex);
    }

    changeSelectedVendor(val: number = 0, versionIndex: number = 0) {
        this.selectedVendor = this.selectedLang.items[val];
        this.activeConfig.version = versionIndex;
        this.changeSelectedVersion(versionIndex);
    }

    changeSelectedVersion(val: number = 0) {
        const selectedVersion = this.selectedVendor.images.spec.tags[val];
        const lang = selectedVersion.annotations.supports.split(',')[0];
        this.selectedVersion = {
            ...selectedVersion, lang, index: val
        }

        var codeTag = document.getElementsByTagName('code');
        for(var i=0;i<codeTag.length;i++) {
            codeTag[i].style.color=(codeTag[i].innerText == this.selectedVersion.name)?'red':'';
        }       
    }

    submitForm() {
        const configureData = {
            ...this.activeConfig,
            name: this.appName ? this.appName : this.populateName(),
            version: this.selectedVersion
        };
        if (_.isEmpty(this.errors))
            this.submitData.emit(configureData);
    }

    nameValidation(event) {
        var letters = /[^0-9a-zA-Z(\-)]/g;
        if (event.match(letters)) {
            this.errors.name = true;
        } else {
            this.errors = {};
        }
    }

    populateName() {
        const rand = Math.random().toString(36).substring(7);
        return 'app' + rand;
    }

    backStep() {
      this.activeConfig.lang = false
    }

    nextStep() {
      this.activeConfig.lang = true
    }

    isSelectedLang(){
        if (this.activeConfig.lang==false) return '' ;
        return 1 ;
    }
}
