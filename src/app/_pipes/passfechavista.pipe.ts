import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passfechavistaTransform'
})
export class PassfechavistaPipe implements PipeTransform {

  transform(fecha: any): any {

  if(fecha!=null && fecha.length==10){
      fecha=fecha.slice(-2)+'/'+fecha.slice(-5,-3)+'/'+fecha.slice(0,4);            
  }else{
    return 'No Activa';
  }
  return fecha;
    
}

}
