
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/Operators';
import { of } from 'rxjs/Observable/of';

import { Book } from '../models/book';
import { DataService } from './data.service';
import { BookTrackerError } from '../models/bookTrackerError';

@Injectable()
export class BooksResolverService implements Resolve<Book[] | BookTrackerError> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Book[] | BookTrackerError | Observable<Book[] | BookTrackerError> | Promise<Book[] | BookTrackerError> {
    return this.dataService.getAllBooks()
      .pipe(
      catchError(err => of(err))
      );
  }

  constructor(private dataService: DataService) {

  }

  resol


}
