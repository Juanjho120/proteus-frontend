import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotaCredito } from './../../../../_model/notaCredito';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-nota-credito-adjunto-dialogo',
  templateUrl: './nota-credito-adjunto-dialogo.component.html',
  styleUrls: ['./nota-credito-adjunto-dialogo.component.css']
})
export class NotaCreditoAdjuntoDialogoComponent implements OnInit {

  notaCredito : NotaCredito;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data : NotaCredito[]
  ) { }

  ngOnInit(): void {
    this.notaCredito = new NotaCredito();
    this.notaCredito = this.data[0];
  }

}
