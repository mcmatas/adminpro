import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit, OnDestroy{

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor( private medicoService: MedicoService,
                private modalImagenService: ModalImagenService,
                private busquedasService: BusquedasService ) { }

  ngOnDestroy(): void {
    // Creamos esto para que cuando cerremos o hagamos refresh no siga suscrito
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    // Nos suscribimos al observable de modal-imagen.service.ts
    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        // Añadimos un delay para dar tiempo al servidor de guardar la imagen nueva
        delay(100)
      )
      .subscribe( img => this.cargarMedicos() );
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe( medicos => {
          this.cargando = false;
          this.medicos = medicos;
        })
  }

  abrirModal( medico: Medico ) {
    this.modalImagenService.abrirModal( 'medicos', medico._id, medico.img );
  }

  buscar( termino: string ) {

    if( termino.length === 0 ) {
      return this.cargarMedicos();
    }

    this.busquedasService.buscar( 'medicos', termino )
        .subscribe( resultados => {
          this.medicos = resultados
        })

  }

  borrarMedico( medico: Medico ) {

    Swal.fire({
      title: '¿Borrar médico?',
      text: `Estás a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico( medico._id ) 
          .subscribe( resp => {
            this.cargarMedicos(),
            Swal.fire(
              'Medico borrado',
              `${ medico.nombre } fue eliminado correctamente`,
              'success'
            )
          });
      }
    })

  }


}
