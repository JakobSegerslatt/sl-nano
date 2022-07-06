import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SLSite, Trip } from '../models';
import { SlApiService } from '../sl-api.service';

@Component({
  selector: 'app-route-planner',
  templateUrl: './route-planner.component.html',
  styleUrls: ['./route-planner.component.scss'],
})
export class RoutePlannerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() from: SLSite;
  @Input() to: SLSite;

  trips: Trip[] = [];

  stopAreaName: string;

  triggerFetch$ = new Subject<void>();

  timerSub: Subscription;
  triggerSub: Subscription;

  constructor(private slService: SlApiService) {}

  ngOnInit(): void {
    this.triggerSub = this.triggerFetch$
      .asObservable()
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.fetch().subscribe((res) => (this.trips = res));
      });

    this.resetTimer();
  }

  ngOnChanges({ from }: SimpleChanges) {
    if (from && !from.isFirstChange()) {
      this.trips = [];
      this.resetTimer();
    }
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
    this.triggerSub?.unsubscribe();
  }

  resetTimer() {
    this.timerSub?.unsubscribe();

    this.timerSub = timer(0, 30 * 1000).subscribe(() =>
      this.triggerFetch$.next()
    );
  }

  fetch(): Observable<Trip[]> {
    return this.slService.fetchRoutePlanner(this.from.SiteId, this.to.SiteId);
  }

  minutesLeft(time: Date) {
    return differenceInMinutes(new Date(time), new Date());
  }
  
  secondsLeft(time: Date) {
    return differenceInSeconds(new Date(time), new Date()) % 60;
  }
}
