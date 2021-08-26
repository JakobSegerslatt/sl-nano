import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { differenceInMinutes } from 'date-fns';
import { timer } from 'rxjs';
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
  info: SLRealtime = {} as any;

  departures: Departure[] = [];

  constructor(private slService: SlApiService) {}

  ngOnInit(): void {
    timer(0, 30 * 1000).subscribe(() => this.fetch());
  }

  ngOnChanges({ from }: SimpleChanges) {
    if (from && !from.isFirstChange()) {
      this.fetch();
    }
  }

  ngOnDestroy() {}

  fetch() {
    this.slService
      .fetchRealtime(this.from.SiteId, 60)
      .subscribe((departures) => {
        this.info = departures;
        this.departures = departures.Trains.filter(
          (t) => t.JourneyDirection === JourneyDirection.NORTH
        );
      });
  }

  timeLeft(time: Date) {
    return differenceInMinutes(new Date(time), new Date());
  }
}
