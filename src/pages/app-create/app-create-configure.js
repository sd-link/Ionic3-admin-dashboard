var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Observable } from 'rxjs/Rx';
import { ImageStreamService } from '../../services/kubernetes/imagestream.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';
var AppCreateConfigureComponent = (function () {
    function AppCreateConfigureComponent(_imagestreamService) {
        this._imagestreamService = _imagestreamService;
        this.submitData = new EventEmitter();
        this.errors = {};
    }
    AppCreateConfigureComponent.prototype.ngOnChanges = function () {
        if (this.projectId)
            this.loadVendorImageStreams(this.projectId);
        if (this.activeConfig)
            this.appName = this.activeConfig.name;
    };
    AppCreateConfigureComponent.prototype.loadVendorImageStreams = function (projectId) {
        var _this = this;
        var ausnimbusImages$ = this._imagestreamService.listImageStreams('ausnimbus');
        var openshiftImages$ = this._imagestreamService.listImageStreams('openshift');
        Observable.combineLatest(ausnimbusImages$, openshiftImages$).subscribe(function (_a) {
            var ausnimbusImage = _a[0], openshiftImage = _a[1];
            var imageStream = ausnimbusImage.items.concat(openshiftImage.items);
            var populatedImage = imageStream.filter(function (item) {
                return (item.metadata.annotations) ? _.includes(item.metadata.annotations['ausnimbus/tags'], 'builder') : null;
            });
            var groupImage = _.reduce(populatedImage, function (result, images) {
                var tags = images.metadata.annotations['ausnimbus/support'];
                var annotations = images.metadata.annotations;
                (result[tags] || (result[tags] = [])).push({
                    description: annotations['ausnimbus/description'],
                    docUrl: annotations['ausnimbus/documentation-url'],
                    providerName: annotations['ausnimbus/provider-display-name'],
                    support: annotations['ausnimbus/support'],
                    supportUrl: annotations['ausnimbus/support-url'],
                    displayName: annotations['openshift.io/display-name'],
                    images: images
                });
                return result;
            }, {});
            _this.vendorImage = Object.keys(groupImage).map(function (key, index) {
                var item = groupImage[key];
                return {
                    name: item[0].displayName,
                    support: item[0].support,
                    description: item[0].description,
                    items: item
                };
            });
            if (_this.activeConfig.lang)
                _this.changeSelectedLang(_this.activeConfig.lang, _this.activeConfig.vendor, _this.activeConfig.version.index);
        });
    };
    AppCreateConfigureComponent.prototype.icoClass = function (lang) {
        return (lang == 'go') ? 'go-gopher' : lang;
    };
    AppCreateConfigureComponent.prototype.selectLangIco = function (image) {
        if (this.activeConfig) {
            this.activeConfig = __assign({}, this.activeConfig, { image: image, lang: image.support });
            this.changeSelectedLang(image.support);
        }
    };
    AppCreateConfigureComponent.prototype.changeSelectedLang = function (lang, vendorIndex, versionIndex) {
        if (vendorIndex === void 0) { vendorIndex = 0; }
        if (versionIndex === void 0) { versionIndex = 0; }
        this.selectedLang = this.vendorImage.filter(function (item) { return item.support == lang; })[0];
        this.activeConfig.vendor = vendorIndex;
        this.changeSelectedVendor(vendorIndex, versionIndex);
    };
    AppCreateConfigureComponent.prototype.changeSelectedVendor = function (val, versionIndex) {
        if (val === void 0) { val = 0; }
        if (versionIndex === void 0) { versionIndex = 0; }
        this.selectedVendor = this.selectedLang.items[val];
        this.activeConfig.version = versionIndex;
        this.changeSelectedVersion(versionIndex);
    };
    AppCreateConfigureComponent.prototype.changeSelectedVersion = function (val) {
        if (val === void 0) { val = 0; }
        var selectedVersion = this.selectedVendor.images.spec.tags[val];
        var lang = selectedVersion.annotations.supports.split(',')[0];
        this.selectedVersion = __assign({}, selectedVersion, { lang: lang, index: val });
    };
    AppCreateConfigureComponent.prototype.submitForm = function () {
        var configureData = __assign({}, this.activeConfig, { name: this.appName ? this.appName : this.populateName(), version: this.selectedVersion });
        if (_.isEmpty(this.errors))
            this.submitData.emit(configureData);
    };
    AppCreateConfigureComponent.prototype.nameValidation = function (event) {
        var letters = /[^0-9a-zA-Z(\-)]/g;
        if (event.match(letters)) {
            this.errors.name = true;
        }
        else {
            this.errors = {};
        }
    };
    AppCreateConfigureComponent.prototype.populateName = function () {
        var rand = Math.random().toString(36).substring(7);
        return 'app' + rand;
    };
    AppCreateConfigureComponent.prototype.backStep = function () {
        this.activeConfig.lang = false;
    };
    AppCreateConfigureComponent.prototype.nextStep = function () {
        this.activeConfig.lang = true;
    };
    return AppCreateConfigureComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], AppCreateConfigureComponent.prototype, "projectId", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AppCreateConfigureComponent.prototype, "activeConfig", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], AppCreateConfigureComponent.prototype, "submitData", void 0);
AppCreateConfigureComponent = __decorate([
    Component({
        selector: 'app-create-configure',
        templateUrl: 'app-create-configure.html',
        providers: [ImageStreamService]
    }),
    __metadata("design:paramtypes", [ImageStreamService])
], AppCreateConfigureComponent);
export { AppCreateConfigureComponent };
//# sourceMappingURL=app-create-configure.js.map