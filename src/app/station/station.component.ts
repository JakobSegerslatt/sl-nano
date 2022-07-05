import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { differenceInMinutes } from 'date-fns';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Departure, JourneyDirection, SLRealtime, SLSite } from '../models';
import { SlApiService } from '../sl-api.service';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
})
export class StationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() from: SLSite;
  @Input() to: SLSite;
  allDepartures: SLRealtime = {} as any;
  departures: Departure[];

  stopAreaName: string;

  triggerFetch$ = new Subject<void>();

  timerSub: Subscription;
  triggerSub: Subscription;

  constructor(private slService: SlApiService) {}

  ngOnInit(): void {
    this.triggerSub = this.triggerFetch$.asObservable().pipe(
      debounceTime(100)
    ).subscribe(() => {
      this.fetch().subscribe((res) => (this.departures = res));
    });
    
    this.resetTimer();
  }

  ngOnChanges({ from }: SimpleChanges) {
    if (from && !from.isFirstChange()) {
      this.resetTimer();
    }
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
    this.triggerSub?.unsubscribe();
  }

  resetTimer() {
    this.timerSub?.unsubscribe();

    this.timerSub = timer(0, 30 * 1000)
      .subscribe(() => this.triggerFetch$.next());
  }

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
