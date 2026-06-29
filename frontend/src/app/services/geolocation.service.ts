import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor() {}

  getCurrentLocation(): Observable<GeoLocation> {
    return from(
      new Promise<GeoLocation>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser.'));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            });
          },
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      })
    ).pipe(
      catchError((error) => {
        const errorMsg =
          error.code === 1
            ? 'Location permission denied'
            : error.code === 2
            ? 'Location unavailable'
            : error.code === 3
            ? 'Location request timeout'
            : error.message || 'Unknown location error';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  watchLocation(onSuccess: (location: GeoLocation) => void, onError: (error: Error) => void): number {
    if (!navigator.geolocation) {
      onError(new Error('Geolocation is not supported'));
      return 0;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        onSuccess({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        const errorMsg =
          error.code === 1
            ? 'Location permission denied'
            : error.code === 2
            ? 'Location unavailable'
            : 'Unknown location error';
        onError(new Error(errorMsg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );
  }

  stopWatchingLocation(watchId: number): void {
    if (watchId > 0) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
