import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'OnlyDecimalesTransform'
})
export class OnlydecimalesPipe implements PipeTransform {
    transform(value: any): any {

        if(value != null && value != undefined){
            value = parseFloat(value);
            value=value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
    
          return value;
        
    }
}