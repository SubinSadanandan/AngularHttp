import { Injectable } from '@angular/core';

import { allBooks, allReaders } from 'app/data';
import { LoggerService } from './logger.service';
import { Reader } from "app/models/reader";
import { Book } from "app/models/book";
import { BookTrackerError } from 'app/models/bookTrackerError';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { map, tap, catchError } from 'rxjs/Operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { OldBook } from '../models/oldBook';

@Injectable()
export class DataService {

  constructor(private loggerService: LoggerService,
    private http: HttpClient) { }

  mostPopularBook: Book = allBooks[0];

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }

  getAllReaders(): Reader[] {
    return allReaders;
  }

  getReaderById(id: number): Reader {
    return allReaders.find(reader => reader.readerID === id);
  }

  getAllBooks(): Observable<Book[] | BookTrackerError> {
    return this.http.get<Book[]>('/api/books')
      .pipe(
      catchError(err => this.handleHttpError(err))
        );
  }

  private handleHttpError(error: HttpErrorResponse): Observable<BookTrackerError> {
    let dataError = new BookTrackerError();
    dataError.errorNumber = 100;
    dataError.message = error.statusText;
    dataError.friendlyMessage = "An Error Occured Retrieving data.";
    return ErrorObservable.create(dataError);
  }

  getBookById(id: number): Observable<Book> {
    let getHeaders: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization':'my-token'
    });

    return this.http.get<Book>(`/api/books/${id}`, {
      headers: getHeaders
    });
  }

  getOldBookById(id: number): Observable<OldBook> {
    return this.http.get<Book>(`/api/books/${id}`)
      .pipe(
      map(b => <OldBook>{
        bookTitle : b.title,
        year : b.publicationYear
      }),
      tap(cb => console.log(cb))
      );
  }


  addBook(newBook: Book): Observable<Book> {
    return this.http.post<Book>('/api/books', newBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateBook(updatedBook: Book): Observable<void> {
    return this.http.put<void>(`/api/books/${updatedBook.bookID}`, updatedBook, {
      headers: new HttpHeaders({
        'Content-Type':'application/json'
      })
    });
  }

  deleteBook(bookId: number): Observable<void> {
    return this.http.delete<void>(`/api/books/${bookId}`);
  }

}
