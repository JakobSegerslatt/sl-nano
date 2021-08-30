import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { differenceInMinutes } from 'date-fns';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Departure, JourneyDirection, SLRealtime, SLSite } from '../models';
import { SlApiService } from '../sl-api.service';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
})
export class StationComponent implements OnInit, OnChanges {
  @Input() from: SLSite;
  @Input() to: SLSite;
  allDepartures: SLRealtime = {} as any;
  departures$: Observable<Departure[]>;
  stopAreaName: string;

  constructor(private slService: SlApiService) {}

  ngOnInit(): void {
    this.departures$ = timer(0, 30 * 1000).pipe(switchMap(() => this.fetch()));
  }

  ngOnChanges({ from }: SimpleChanges) {
    if (from && !from.isFirstChange()) {
      this.departures$ = timer(0, 30 * 1000).pipe(
        switchMap(() => this.fetch())
      );
    }
  }

  ngOnDestroy() {}

  fetch(): Observable<Departure[]> {
    return this.slService.fetchRealtime(this.from.SiteId, 60).pipe(
      map((departures) => {
        this.allDepartures = departures;
        this.stopAreaName = departures.Trains[0].StopAreaName;
        return departures.Trains.filter(
          (t) => t.JourneyDirection === JourneyDirection.NORTH
        );
      })
    );
  }

  timeLeft(time: Date) {
    return differenceInMinutes(new Date(time), new Date());
  }
}
