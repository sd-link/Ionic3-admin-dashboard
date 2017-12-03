import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CacheService } from 'ionic-cache'
import { Headers, Http, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import { Endpoint } from './endpoints'

@Injectable()

export class BaseService {


  constructor(public http: Http, public storage: Storage, public endpoint: Endpoint, public cache: CacheService) {

  }

  protected getUrl(key, namespace, context: any = ''): string {
    return this.endpoint.getUrl(key, namespace, context);
  }


  authenticated() {
    return Observable.fromPromise(this.storage.get('access_token').then(token => token));
  }

  setAuth(auth) {
    this.storage.set('access_token', auth.access_token);
  }

  requestApiOption(headers, type) {
    let options: any = { headers }
    if (type.file)
      options = { ...options, responseType: ResponseContentType.Blob }
    return new RequestOptions(options);
  }

  requestApiGet(url, type = {}) {
    return this.getAuthToken()
      .flatMap(token => {
        const headers = new Headers({ 'Authorization': token });
        const options = this.requestApiOption(headers, type)
        return this.http.get(url, options);
      })
  }

  requestApiPost(url, body, cache) {
    return this.getAuthToken()
      .flatMap(token => {
        const headers = new Headers({ 'Authorization': token });
        const options = new RequestOptions({ headers });
        this.cache.clearGroup(cache);
        return this.http.post(url, body, options);
      })
  }

  requestApiPatch(url, body, cache) {
    return this.getAuthToken()
      .flatMap(token => {
        const headers = new Headers({
          'Authorization': token,
          'Content-Type': 'application/strategic-merge-patch+json'
        });
        const options = new RequestOptions({ headers });
        this.cache.clearGroup(cache);
        return this.http.patch(url, body, options);
      })
  }


  requestApiPut(url, body, cache) {
    return this.getAuthToken()
      .flatMap(token => {
        const headers = new Headers({ 'Authorization': token });
        const options = new RequestOptions({ headers });
        this.cache.clearGroup(cache);
        return this.http.put(url, body, options);
      })
  }

  requestApiDelete(url, body?, cache?) {
    return this.getAuthToken()
      .flatMap(token => {
        const headers = new Headers({ 'Authorization': token });
        const options = new RequestOptions({ headers });
        this.cache.clearGroup(cache);
        return this.http.delete(url, options);
      })
  }

  basicApiPost(url, body) {
    const postHeader = new Headers({ "Content-Type": "application/json" });
    const postOptions = new RequestOptions({ headers: postHeader });
    return this.http.post(url, body, postOptions)
  }

  basicApiPatch(url, body) {
    const patchHeader = new Headers({ "Content-Type": "application/json" });
    const patchOptions = new RequestOptions({ headers: patchHeader });
    return this.http.patch(url, body, patchOptions)
  }

  protected getAuthToken() {
    return Observable.fromPromise(this.storage.get('access_token').then(token => {
      return 'Bearer ' + token;
    }));
  }

  protected extractData(res: Response) {
    const body = res.json();
    return body || {};
  }

  protected handleError(error: any) {
    const errMsg = JSON.parse(error._body) || 'Server Error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  protected extractResponseStatus(res: Response) {
    return res.ok;
  }
}
