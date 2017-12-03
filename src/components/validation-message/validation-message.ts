import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from './validation.service';

@Component({
    selector: 'validation-message',
    template: `<p class="invalid" *ngIf="errorMessage !== null">{{errorMessage}}</p>`
})
export class ValidationMessage {


    @Input("control")
    control: FormControl;

    @Input("message")
    message: string;

    @Input("formSubmitted")
    formSubmitted: boolean;


    constructor() { }

    get errorMessage() {
        for (let propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName) && (this.control.touched || this.formSubmitted)) {
                return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName], this.message);
            }
        }

        return null;
    }
}

