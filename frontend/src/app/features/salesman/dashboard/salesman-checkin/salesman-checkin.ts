import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AttendanceService } from '../../../../services/attendance.service';
import { GeolocationService, GeoLocation } from '../../../../services/geolocation.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-salesman-checkin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salesman-checkin.html',
  styleUrls: ['./salesman-checkin.css']
})
export class SalesmanCheckinComponent implements OnInit, OnDestroy {
  isCheckedIn = false;
  checkedInTime: string | null = null;
  currentLocation: string | null = null;
  currentGeoLocation: GeoLocation | null = null;
  mapUrl: SafeResourceUrl | null = null;
  loading = false;
  error: string | null = null;
  attendance: any = null;
  private watchId = 0;

  constructor(
    private attendanceService: AttendanceService,
    private geolocationService: GeolocationService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTodayAttendance();
    this.watchCurrentLocation();
  }

  ngOnDestroy(): void {
    this.stopWatchingLocation();
  }

  loadTodayAttendance(): void {
    const user = this.authService.getCurrentUserSync();
    if (!user?.salesmanId) return;

    this.attendanceService.getTodayAttendance(user.salesmanId).subscribe({
      next: (attendance) => {
        if (attendance) {
          this.attendance = attendance;
          this.isCheckedIn = !!attendance.checkInTime;
          this.checkedInTime = attendance.checkInTime
            ? new Date(attendance.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            : null;
        }
      },
      error: () => {
        this.error = 'Unable to load attendance';
      }
    });
  }

  private watchCurrentLocation(): void {
    this.watchId = this.geolocationService.watchLocation(
      (location) => {
        this.currentGeoLocation = location;
        this.currentLocation = `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
        this.mapUrl = this.getMapUrl(location.latitude, location.longitude);
      },
      (error) => {
        this.error = error.message;
      }
    );
  }

  private stopWatchingLocation(): void {
    if (this.watchId) {
      this.geolocationService.stopWatchingLocation(this.watchId);
      this.watchId = 0;
    }
  }

  private getMapUrl(lat: number, lon: number): SafeResourceUrl {
    const margin = 0.005;
    const minLon = lon - margin;
    const minLat = lat - margin;
    const maxLon = lon + margin;
    const maxLat = lat + margin;
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lon}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  checkIn(): void {
    const user = this.authService.getCurrentUserSync();
    if (!user?.salesmanId) {
      this.error = 'Salesman profile not available';
      return;
    }

    this.loading = true;
    this.error = null;

    const sendLocation = (location: GeoLocation) => {
      this.currentLocation = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
      this.attendanceService.checkIn(user.salesmanId, location).subscribe({
        next: (attendance) => {
          this.attendance = attendance;
          this.isCheckedIn = true;
          this.checkedInTime = new Date(attendance.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          this.loading = false;
        },
        error: () => {
          this.error = 'Check-in failed';
          this.loading = false;
        }
      });
    };

    if (this.currentGeoLocation) {
      sendLocation(this.currentGeoLocation);
    } else {
      this.geolocationService.getCurrentLocation().subscribe({
        next: (location) => sendLocation(location),
        error: () => {
          this.error = 'Unable to get location. Please enable location services.';
          this.loading = false;
        }
      });
    }
  }

  checkOut(): void {
    const user = this.authService.getCurrentUserSync();
    if (!user?.salesmanId) {
      this.error = 'Salesman profile not available';
      return;
    }

    this.loading = true;
    this.error = null;

    const sendLocation = (location: GeoLocation) => {
      this.attendanceService.checkOut(user.salesmanId, location).subscribe({
        next: (attendance) => {
          this.attendance = attendance;
          this.isCheckedIn = false;
          this.loading = false;
        },
        error: () => {
          this.error = 'Check-out failed';
          this.loading = false;
        }
      });
    };

    if (this.currentGeoLocation) {
      sendLocation(this.currentGeoLocation);
    } else {
      this.geolocationService.getCurrentLocation().subscribe({
        next: (location) => sendLocation(location),
        error: () => {
          this.error = 'Unable to get location';
          this.loading = false;
        }
      });
    }
  }

}
