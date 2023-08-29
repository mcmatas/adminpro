import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription, delay } from 'rxjs';

import { Usuario } from 'src/app/models/usuario.model';

import { UsuarioService } from 'src/app/services/usuario.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription;
  public desde: number = 0;
  public loading: boolean = true;

  constructor( private usuarioService: UsuarioService,
                private busquedasService: BusquedasService,
                private modalImagenService: ModalImagenService ){}

  ngOnDestroy(): void {
    // Creamos esto para que cuando cerremos o hagamos refresh no siga suscrito
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    // Nos suscribimos al observable de modal-imagen.service.ts
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        // Añadimos un delay para dar tiempo al servidor de guardar la imagen nueva
        delay(100)
      )
      .subscribe( img => this.cargarUsuarios() );
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuarioService.cargarUsuarios( this.desde )
        // Podemos poner total y usuarios porque lo hemos definido en la interface, así no hace falta sacarlo de resp 
        .subscribe( ({ total, usuarios}) => {
          this.totalUsuarios = total;
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
          this.loading = false;
        })

  }

  cambiarPagina( valor: number ) {
    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalUsuarios ) {
      this.desde -= valor; 
    }

    this.cargarUsuarios();
  }

  buscar( termino: string ) {

    if( termino.length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar( 'usuarios', termino )
        .subscribe( (resultados: Usuario[]) => {
          this.usuarios = resultados
        })

  }

  eliminarUsuario( usuario: Usuario ) {

    if( usuario.uid === this.usuarioService.uid ) {
      return Swal.fire('Error', 'No puede borrarse a si mismo');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Estás a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario( usuario ) 
          .subscribe( resp => {
            this.cargarUsuarios(),
            Swal.fire(
              'Usuario borrado',
              `${ usuario.nombre } fue eliminado correctamente`,
              'success'
            )
          });
      }
    })

  }

  cambiarRole( usuario: Usuario ) {

    this.usuarioService.guardarUsuario( usuario )
      .subscribe( resp => {
        console.log(resp)
      })

  }

  abrirModal( usuario: Usuario ) {
    this.modalImagenService.abrirModal( 'usuarios', usuario.uid, usuario.img );
  }


}
