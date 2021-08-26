import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SL_PLATSUPPSLAG_KEY, SL_REALTID_4_KEY } from 'src/KEYS';
import { LocalstorageService } from './local-storage.service';
import { SLRealtime, SLResponse, SLSite } from './models';

const SL_API_V2 = '/api2';

@Injectable({
  providedIn: 'root',
})
export class SlApiService {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalstorageService
  ) {}

  fetchPlaces(search: string): Observable<SLSite[]> {
    const url = `${SL_API_V2}/typeahead.json?key=${SL_PLATSUPPSLAG_KEY}&searchstring=${search}`;
    return this.cacheResponse(
      'SL_SITES',
      this.http.get<SLResponse<SLSite[]>>(url)
    ).pipe(map((res) => res?.ResponseData));
  }

  /**
   * Fetch realtime departures/arrivals from a place
   * @param siteId Id for the place to fetch info from
   * @param timwWindow Amount of minutes from now to include in the search, max/default is 60 minutes
   */
  fetchRealtime(
    siteId: number,
    timwWindow: number = 60
  ): Observable<SLRealtime> {
    const url = `${SL_API_V2}/realtimedeparturesV4.json?key=${SL_REALTID_4_KEY}&siteid=${siteId}&timewindow=${timwWindow}&Bus=false&Metro=false`;
    return this.cacheResponse(
      'SL_REALTIME',
      this.http.get<SLResponse<SLRealtime>>(url)
    ).pipe(map((res) => res?.ResponseData));
  }

  cacheResponse<T>(
    key: string,
    obs: Observable<SLResponse<T>>
  ): Observable<SLResponse<T>> {
    return obs.pipe(
      map((res) => {
        if (res.Message?.startsWith('Could not')) {
          return this.getCache(key);
        }
        this.setCache(key, res);
        return res;
      })
    );
  }

  getCache<T>(key: string) {
    const cached = this.localStorageService.getItem(key);
    let result;
    try {
      result = JSON.parse(cached as string);
    } catch (error) {
      return null;
    }
    return result;
  }

  setCache<T>(key: string, cache: T) {
    return this.localStorageService.setItem(key, JSON.stringify(cache));
  }
}
