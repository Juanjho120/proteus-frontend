import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs'; 
import { tap, catchError, retry } from 'rxjs/operators';
import { LoaderService } from '../_service/loader.service';

@Injectable({
    providedIn: 'root'
})
export class ServerErrorsInterceptor implements HttpInterceptor {

    private requests: HttpRequest<any>[] = [];

    constructor(private snackBar: MatSnackBar, private router : Router, private spinner: NgxSpinnerService, private loaderService: LoaderService) {}

    removeRequest(req: HttpRequest<any>) {
        const i = this.requests.indexOf(req);
        if (i >= 0) {
          this.requests.splice(i, 1);
    
        }
        //console.log(i, this.requests.length);
        this.loaderService.isLoading.next(this.requests.length > 0);
      }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.requests.push(request);
        this.loaderService.isLoading.next(true);

        return next.handle(request).pipe(retry(environment.REINTENTOS)).
            pipe(tap(event => {
                if (event instanceof HttpResponse) {
                    this.removeRequest(request);
                    if (event.body && event.body.error === true && event.body.errorMessage) {
                        this.spinner.hide()
                        throw new Error(event.body.errorMessage);
                    }/*else{
                        this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });    
                    }*/
                }
            })).pipe(catchError((err) => {      
                this.removeRequest(request)          
                //https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
                if (err.status === 400) {
                    this.spinner.hide()
                    this.snackBar.open(err.message, 'ERROR 400', { duration: 5000 });
                }
                else if (err.status === 404){
                    this.spinner.hide()
                    this.snackBar.open(err.error.message, 'ERROR 404', { duration: 5000 });
                }
                else if (err.status === 403) {
                    console.log(err);
                    this.spinner.hide()
                    this.snackBar.open(err.error.error_description, 'ERROR 403', { duration: 5000 });
                    //sessionStorage.clear();
                    //this.router.navigate(['/login']);
                }
                else if (err.status === 500) {
                    console.log(err);
                    this.spinner.hide()
                    this.snackBar.open(err.error.message, 'ERROR 500', { duration: 5000 });
                } else {
                    this.spinner.hide()
                    this.snackBar.open('Contacte al desarrollador', 'ERROR', { duration: 5000 });
                }
                return EMPTY;
            }));
    }
}