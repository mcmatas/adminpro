import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
 
export const canMatch: CanMatchFn = () => {
  const router = inject(Router);
  return inject(UsuarioService).validarToken()
    .pipe(
      tap( isAuthenticated => {
        if ( !isAuthenticated ) router.navigateByUrl('/login');
      })
    )
}
 
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(UsuarioService).validarToken()
    .pipe(
      tap( isAuthenticated => {
        if ( !isAuthenticated ) router.navigateByUrl('/login');
      })
    )
};