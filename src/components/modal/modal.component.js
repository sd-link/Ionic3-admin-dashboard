var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ModalService } from '../../services/modal.service';
var ModalComponent = (function () {
    function ModalComponent(_modal) {
        this._modal = _modal;
        this.action = new EventEmitter();
    }
    ModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscription = this._modal.subscribe(function (next) {
            return _this.dismiss(next);
        }, function (error) {
            return _this.dismiss({ show: false, error: "Some error occur" });
        }, function (complete) {
            return _this.dismiss({ show: false });
        });
    };
    ModalComponent.prototype.dismiss = function (data) {
        var _this = this;
        setTimeout(function () {
            _this.action.emit(data);
        }, 1);
    };
    ModalComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    ModalComponent.prototype.clickInside = function (e) {
        e.stopPropagation();
        this.show = true;
    };
    ModalComponent.prototype.clickOutside = function (e) {
        var _this = this;
        setTimeout(function () {
            _this.action.emit(_this.show = !_this.show);
        }, 1);
    };
    return ModalComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ModalComponent.prototype, "show", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], ModalComponent.prototype, "action", void 0);
ModalComponent = __decorate([
    Component({
        selector: 'modal',
        providers: [ModalService],
        template: "\n    <div class=\"aus-modal\" [class.show]=\"show\" (click)=\"clickOutside($event)\">\n      <div class=\"aus-modal-inner\">\n        <div class=\"aus-modal-dialog\" [class.up]=\"add\" (click)=\"clickInside($event)\">\n          <div class=\"close\" (click)=\"clickOutside($event)\">\n            <i class=\"fal fa-times fa-lg\"></i>\n          </div>\n          <ng-content></ng-content>\n        </div>\n      </div>\n    </div>\n    "
    }),
    __metadata("design:paramtypes", [ModalService])
], ModalComponent);
export { ModalComponent };
//# sourceMappingURL=modal.component.js.map