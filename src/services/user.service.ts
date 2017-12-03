import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CacheService } from 'ionic-cache'
import { Http } from '@angular/http';
import { BaseService } from './BaseService'

import 'rxjs/add/operator/map';

import { Endpoint } from './endpoints'

@Injectable()
export class UserService extends BaseService {

  AUTH: String = 'access_token';


  constructor(
    public http: Http,
    public cache: CacheService,
    public _endpoint: Endpoint,
    public storage: Storage
  ) {
    super(http, storage, _endpoint, cache)
  }

  parseUrl(key, context?) {
    return this.getUrl(key, 'user', context)
  }

  login(user) {
    const bodyString = JSON.stringify(user);
    const url = this.parseUrl('login');
    return this.basicApiPost(url, bodyString)
      .map(this.extractData)
      .catch(this.handleError);
  }

  logout() {
    this.cache.clearAll();
    this.storage.clear()
  }

  getUserProfile() {
    const url = this.parseUrl('profile');
    const request = this.requestApiGet(url)
      .map(this.extractData)
      .catch(this.handleError)
    return this.cache.loadFromObservable(url, request, "userProfile");
  }

  patchUserProfile(body) {
    const url = this.parseUrl('profile');
    return this.requestApiPatch(url, body, "profile")
      .map(this.extractData)
      .catch(this.handleError);
  }

  patchUserPassword(body) {
    const url = this.parseUrl('password');
    return this.requestApiPatch(url, body, "profile")
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUserInvoices() {
    const url = this.parseUrl('invoices');
    const request = this.requestApiGet(url)
      .map(this.extractData)
      .catch(this.handleError);
    return this.cache.loadFromObservable(url, request, "userProfile");
  }

  getPricingList() {
    const url = this.parseUrl('pricing');
    const request = this.requestApiGet(url)
      .map(this.extractData)
      .catch(this.handleError);
    return this.cache.loadFromObservable(url, request, "userProfile");
  }

  getInvoicesFile(id) {
    const url = this.parseUrl('invoices') + `/${id}`;
    return this.requestApiGet(url, { file: true })
      .catch(this.handleError);
  }

  getUserUsage() {
    const url = this.parseUrl('usage');
    const request = this.requestApiGet(url)
      .map(this.extractData)
      .catch(this.handleError);
    return this.cache.loadFromObservable(url, request, "userUsage");
  }

  getBraintreeToken() {
    const url = this.parseUrl('braintreeToken');
    return this.requestApiGet(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  registerSubscription(body) {
    const url = this.parseUrl('registerSubscription');
    return this.requestApiPost(url, body, 'subscription')
      .map(this.extractData)
      .catch(this.handleError)
  }

  convertHashToEmail(hash) {
    const url = this.parseUrl('hash', { hash });
    const request = this.requestApiGet(url)
      .map(this.extractData)
      .catch(this.handleError)
    return request;
  }

  convertEmailToHash(email) {
    const url = this.parseUrl('email', { email });
    const request = this.requestApiGet(url)
      .map(this.extractData)
      .catch(this.handleError)
    return request;
  }

  register(user) {
    const bodyString = JSON.stringify(user);
    const url = this.parseUrl('register');
    return this.basicApiPost(url, bodyString)
      .map(this.extractData)
      .catch(this.handleError);
  }

  activateAccount(user) {
    const bodyString = JSON.stringify(user);
    const url = this.parseUrl('activate');
    return this.basicApiPatch(url, bodyString)
      .map(this.extractData)
      .catch(this.handleError);
  }
}