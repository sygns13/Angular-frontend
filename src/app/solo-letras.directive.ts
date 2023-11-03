import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSoloLetras]'
})
export class SoloLetrasDirective {

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z]/g, ''); // Solo se permiten letras (mayúsculas y minúsculas)
    input.value = input.value.toUpperCase();
  }

}
