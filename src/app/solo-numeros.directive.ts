import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSoloNumeros]'
})
export class SoloNumerosDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const valor = this.el.nativeElement.value;
    const tieneMasDeUnPunto = valor.split('.').length > 2;
    const pattern = /^\d+(\.\d{0,2})?$/;

    if (!pattern.test(valor) || tieneMasDeUnPunto) {
      this.el.nativeElement.value = valor.replace(/[^\d.]/g, '').replace(/^(\d+\.\d{2}).*$/, '$1')
                                                                .replace(/^(\d*\.\d{0,2})\..*$/, '$1');
    }
  }

}