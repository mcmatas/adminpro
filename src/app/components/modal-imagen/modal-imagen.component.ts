import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit {

  public ocultarModal: boolean = false;
  public imagenSubir: File;
  public imgTemp: any = '';

  constructor( public modalImagenService: ModalImagenService,
                public fileUploadService: FileUploadService ) {}

  ngOnInit() {

  }

  cerrarModal() {
    this.modalImagenService.cerrarModal();
    this.imgTemp = null;
  }

  cambiarImagen( file: File ) {
    this.imagenSubir = file;

    if( !file ) { 
      return this.imgTemp = null; 
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
          .actualizarFoto( this.imagenSubir, tipo, id )
          .then( img => {
            Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');

            this.modalImagenService.nuevaImagen.emit(img);

            this.cerrarModal();
           }).catch( err => {
            Swal.fire('Error', 'No se pudo guardar la imagen', 'error');
           });
  }

}
