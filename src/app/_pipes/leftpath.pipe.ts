import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'leftpathTransform'
})
export class LeftpathPipe implements PipeTransform {

  transform(cad: any, largo?: any): any {
    let  n = cad.toString();
    if(largo != null){
      while(n.length < largo)
          n = "0" + n;
    }
       return n;
}

}
