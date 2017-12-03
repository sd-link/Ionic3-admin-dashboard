import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'round',
  pure: false
})
export class RoundPipe implements PipeTransform {
  transform(input: number) {
    return (Math.ceil(input * 100) / 100).toFixed(2)
  }
}
