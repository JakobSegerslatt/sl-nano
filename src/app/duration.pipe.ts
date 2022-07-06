import { Pipe, PipeTransform } from '@angular/core';
import * as duration from 'duration-fns';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: string | undefined): string | null {
    if (!value) return null;
    const parsed = duration.parse(value);
    let time = '';

    if(parsed.hours) {
      time += `${parsed.hours} timmar `
    }
    if(parsed.minutes) {
      time += `${parsed.minutes} min `
    }
    return time;
  }

}
