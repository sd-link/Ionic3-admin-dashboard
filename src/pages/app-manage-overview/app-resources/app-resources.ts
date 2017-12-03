import { Component, OnInit } from '@angular/core';

export interface resourceData {
    size?: string;
    autoScale?: number;
    replica?: any;
}

@Component({
    selector: 'app-resources',
    templateUrl: 'app-resources.html'
})

export class AppResourcesComponent implements OnInit {
    resourceData: resourceData = {};
    
    constructor() { }

    ngOnInit() {}
}