import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription, delay } from 'rxjs';

import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';


@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor( private hospitalService: HospitalService,
                private modalImagenService: ModalImagenService,
                private busquedasService: BusquedasService,) {}

  ngOnDestroy(): void {
    // Creamos esto para que cuando cerremos o hagamos refresh no siga suscrito
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    // Nos suscribimos al observable de modal-imagen.service.ts
    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        // Añadimos un delay para dar tiempo al servidor de guardar la imagen nueva
        delay(100)
      )
      .subscribe( img => this.cargarHospitales() );
  }

  buscar( termino: string ) {

    if( termino.length === 0 ) {
      return this.cargarHospitales();
    }

    this.busquedasService.buscar( 'hospitales', termino )
        .subscribe( resultados => {
          this.hospitales = resultados
        })

  }

  cargarHospitales() {

    this.cargando = true;
    // Para que se dispare tengo que usar subscribe
    this.hospitalService.cargarHospitales()
        .subscribe( hospitales => {
          this.cargando = false;
          this.hospitales = hospitales;
        })
  }

  guardarCambios( hospital: Hospital ) {

    this.hospitalService.actualizarHospital( hospital._id, hospital.nombre )
        .subscribe( resp => {
          Swal.fire( 'Actualizado', hospital.nombre, 'success');
        })
  }

  eliminarHospital( hospital: Hospital ) {

    this.hospitalService.borrarHospital( hospital._id )
        .subscribe( resp => {
          this.cargarHospitales();
          Swal.fire( 'Borrado', hospital.nombre, 'success');
        })
  }

  async abrirSweetAlert() {
    // Desestructuramos el objeto que devuelve, es decir, en lugar de crear una variable data 
    // y luego recoger el valor con data.value lo recogemos directamente en la respuesta { value }
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo Hospital',
      input: 'text',
      showCancelButton: true,
      inputPlaceholder: 'Nombre del Hospital'
    })

    if( value.trim().length > 0 ){
      this.hospitalService.crearHospital( value )
          .subscribe( (resp: any) => {
            this.hospitales.push( resp.hospital );
          })
    }
  }

  abrirModal( hospital: Hospital ) {
    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img );
  }

}
