import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface CountriesNowResponse<T = any> {
  error: boolean;
  msg: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly apiBase = 'https://countriesnow.space/api/v0.1';

  private readonly cityAreaMap: Record<string, string[]> = {
    vadodara: ['Alkapuri', 'Akota', 'Gotri', 'Nizampura', 'Race Course'],
    mumbai: ['Bandra', 'Andheri', 'Dadar', 'Borivali', 'Juhu'],
    delhi: ['Connaught Place', 'Karol Bagh', 'Saket', 'Rohini', 'Dwarka'],
    bengaluru: ['Koramangala', 'Whitefield', 'Jayanagar', 'Hebbal', 'Indiranagar'],
    chennai: ['T Nagar', 'Adyar', 'Velachery', 'Anna Nagar', 'Perungudi']
  };

  constructor(private http: HttpClient) {}

  private getLocalRequestOptions() {
    return {
      headers: new HttpHeaders({ 'x-skip-loading': 'true' })
    };
  }

  getCountries(): Observable<string[]> {
    return this.http
      .get<CountriesNowResponse<Array<{ name: string }>>>(`${this.apiBase}/countries/iso`, this.getLocalRequestOptions())
      .pipe(
        map((response) =>
          (response?.data || [])
            .map((item) => item.name)
            .sort((a, b) => a.localeCompare(b))
        ),
        catchError(() => of(['India']))
      );
  }

  getStates(country: string): Observable<string[]> {
    if (!country) {
      return of([]);
    }
    return this.http
      .post<CountriesNowResponse<{ name: string; states: Array<{ name: string }> }>>(
        `${this.apiBase}/countries/states`,
        { country },
        this.getLocalRequestOptions()
      )
      .pipe(
        map((response) =>
          (response?.data?.states || [])
            .map((item) => item.name)
            .sort((a, b) => a.localeCompare(b))
        ),
        catchError(() => of([]))
      );
  }

  getCities(country: string, state: string): Observable<string[]> {
    if (!country || !state) {
      return of([]);
    }
    return this.http
      .post<CountriesNowResponse<string[]>>(`${this.apiBase}/countries/state/cities`, {
        country,
        state
      },
      this.getLocalRequestOptions())
      .pipe(
        map((response) => (response?.data || []).sort((a, b) => a.localeCompare(b))),
        catchError(() => of([]))
      );
  }

  getAreas(city: string): Observable<string[]> {
    if (!city) {
      return of([]);
    }

    const key = city.trim().toLowerCase();
    const mappedAreas = this.cityAreaMap[key];

    if (mappedAreas?.length) {
      return of(mappedAreas);
    }

    return of([
      `${city} Central`,
      `${city} East`,
      `${city} West`,
      `${city} North`,
      `${city} South`
    ]);
  }
}
