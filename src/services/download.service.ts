import { Injectable } from '@angular/core';

@Injectable()
export class DownloadService {

    constructor( ) { }

    downloadBlob(data, fileName) {
        const el = document.createElement("a");
        document.body.appendChild(el);
        const json = data._body;
        const blob = new Blob([json], { type: "octet/stream" });
        const url = window.URL.createObjectURL(blob);
        el.href = url;
        el.download = fileName;
        el.click();
        window.URL.revokeObjectURL(url);
    }
}