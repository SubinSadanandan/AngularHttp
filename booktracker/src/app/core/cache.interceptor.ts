

import { Injectable } from '@angular/core';
import { HttpResponse, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs/Observable/of';


import { HttpCacheService } from './http-cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //pass along non-cacheable requests and invalidate cache
    if (req.method !== 'GET') {
      console.log(`Invalidating Cache: ${req.method} ${req.url}`);
      this.cacheService.invalidateCache();
      return next.handle(req);
    }

    //attempt to retrieve a cached response
    const cachedResponse: HttpResponse<any> = this.cacheService.get(req.url);

    //return cached response
    if (cachedResponse) {
      console.log(`Returning a cached response: ${cachedResponse.url}`);
      console.log(cachedResponse);
      return of(cachedResponse);
    }

    //send request to server and response to cache
    return next.handle(req)
      .pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log(`Adding Item to cache: ${req.url}`);
          this.cacheService.put(req.url, event);
        }
      })
      );

  }

  constructor(private cacheService: HttpCacheService) { }


}
