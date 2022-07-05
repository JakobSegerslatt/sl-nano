import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, startWith, switchMap, tap } from 'rxjs/operators';
import { LocalstorageService } from './local-storage.service';
import { SLSite } from './models';
import { HUDDINGE, STOCKHOLM_C } from './sites';
import { SlApiService } from './sl-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Från & Till';
  fromCtrl = new FormControl(
    this.localstorageService.getItem('SLGO_FROM') || HUDDINGE.Name
  );
  toCtrl = new FormControl(
    this.localstorageService.getItem('SLGO_TO') || STOCKHOLM_C.Name
  );
  selectedFrom: SLSite;
  selectedTo: SLSite;

  fromSites: SLSite[] = [];
  toSites: SLSite[] = [];
  fromSites$: Observable<SLSite[]>;
  toSites$: Observable<SLSite[]>;

  static isBrowser = new BehaviorSubject<boolean>(null as any);

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private localstorageService: LocalstorageService,
    private slService: SlApiService
  ) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
  }

  displayFn(site: SLSite): string {
    return site?.Name || (site as any) || '';
  }

  ngOnInit() {
    this.fromSites$ = this.fromCtrl.valueChanges
      .pipe(startWith(this.fromCtrl.value))
      .pipe(
        debounceTime(250),
        switchMap((value) => {
          // Parse it
          const place = parseInput(value);

          // Save it as the last FROM option
          this.localstorageService.setItem('SLGO_FROM', place);

          // Search for the string (free text or siteId)
          return this.slService.fetchPlaces(place).pipe(
            tap((sites) => {
              this.fromSites = sites;

              // Set first option as selected
              this.selectedFrom = sites[0];
            })
          );
        })
      );

    this.toSites$ = this.toCtrl.valueChanges
      .pipe(startWith(this.toCtrl.value))
      .pipe(
        debounceTime(250),
        switchMap((value) => {
          const place = parseInput(value);

          // Save it as the last DESTINATION option
          this.localstorageService.setItem('SLGO_TO', place);

          // Search for the string (free text or siteId)
          return this.slService.fetchPlaces(place).pipe(
            tap((sites) => {
              this.toSites = sites;

              // Set first option as selected
              this.selectedTo = sites[0];
            })
          );
        })
      );
  }

  /** Switches the places around */
  swap() {
    const originSelectedFrom = this.selectedFrom;
    const originSelectedTo = this.selectedTo;

    this.fromCtrl.setValue(originSelectedTo);
    this.toCtrl.setValue(originSelectedFrom);
  }
}

export function parseInput(value: string | SLSite): string {
  const parsed = (value as SLSite)?.SiteId
    ? ((value as SLSite).SiteId as any)
    : typeof value === 'string'
    ? value
    : '';

  // Turn number into string
  return parsed || '' + '';
}
