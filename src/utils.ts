import { SLSite } from './app/models';

export function objectToQueryParams(obj: Object): string {
  return Object.entries(obj)
    .map(([key, value]) => key + '=' + value)
    .join('&');
}


export function trackBySiteId(_index: number, obj: SLSite): number {
  return obj?.SiteId;
}
