import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'DecimalesTransform'
})
export class DecimalesPipe implements PipeTransform {
    transform(value: any): any {

        if(value != null && value != undefined){
            value=value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            value = 'S/.' + value;
          }
    
          return value;
        
    }
}