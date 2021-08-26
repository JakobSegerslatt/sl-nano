import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent implements OnInit {
  now$ = timer(0, 1000).pipe(map(() => new Date()));

  constructor() {}

  ngOnInit(): void {}
}
