import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

// Un pipe me sirve para transformar de forma visual como recibo la información.
// Se usa en el HTML con | para transformar
@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: 'usuarios'|'hospitales'|'medicos'): string {
    if( !img ) {
      return `${ base_url }/upload/${ tipo }/no-image`;
    } else if( img.includes('https') ) {
      return img;
    } else if( img ) {
      return `${ base_url }/upload/${ tipo }/${ img }`;
    } else {
      return `${ base_url }/upload/${ tipo }/no-image`;
    }
  }

}
