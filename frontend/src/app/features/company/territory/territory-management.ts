import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TerritoryService } from '../../../services/territory.service';
import { LocationService } from '../../../services/location.service';
import { ResponseHandlerService } from '../../../services/response-handler.service';
import { AuthService } from '../../../services/auth.service';
import { UiButtonComponent } from '../../../shared/ui/components/ui-button';

interface City {
  _id?: string;
  name: string;
  areas: string[];
  newArea?: string;
  editing?: boolean;
  editName?: string;
}

interface Territory {
  id?: string;
  state: string;
  cities: City[];
  expanded: boolean;
  newCity?: string;
  editing?: boolean;
  editName?: string;
}

@Component({
  selector: 'app-territory-management',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButtonComponent],
  templateUrl: './territory-management.html',
  styleUrls: ['./territory-management.css']
})
export class TerritoryManagementComponent implements OnInit {
  territories: Territory[] = [];
  private territorySub?: Subscription;
  countries: string[] = [];
  states: string[] = [];
  cities: string[] = [];
  areas: string[] = [];
  filteredCountries: string[] = [];
  filteredStates: string[] = [];
  filteredCities: string[] = [];
  filteredAreas: string[] = [];
  selectedCountry = '';
  selectedState = '';
  selectedCity = '';
  selectedArea = '';
  countrySearch = '';
  stateSearch = '';
  citySearch = '';
  areaSearch = '';
  countryDropdownOpen = false;
  stateDropdownOpen = false;
  cityDropdownOpen = false;
  areaDropdownOpen = false;
  loading = false;
  savingTerritory = false;
  statusMessage = '';
  statusType: 'success' | 'error' | '' = '';
  validationErrors: Record<string, string> = {};

  constructor(
    private territoryService: TerritoryService,
    private locationService: LocationService,
    private responseHandler: ResponseHandlerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCountryData();
    // subscribe to BehaviorSubject so UI updates automatically when service list changes
    this.territorySub = this.territoryService.territories$.subscribe((data) => {
      this.territories = this.buildTerritories(data || []);
      this.loading = false;
    });

    this.loadTerritories();
  }

  ngOnDestroy() {
    this.territorySub?.unsubscribe();
  }

  private setStatus(message: string, type: 'success' | 'error') {
    this.statusMessage = message;
    this.statusType = type;
    setTimeout(() => {
      this.statusMessage = '';
      this.statusType = '';
    }, 5000);
  }

  private buildTerritories(data: any[]): Territory[] {
    const stateMap = new Map<string, Territory>();

    data.forEach((record) => {
      const stateName = record.location?.state || 'Unknown';
      if (!stateMap.has(stateName)) {
        stateMap.set(stateName, {
          id: record.location?.city ? undefined : record._id,
          state: stateName,
          cities: [],
          expanded: true,
          newCity: '',
          editing: false,
          editName: stateName
        });
      }

      const territory = stateMap.get(stateName)!;
      if (record.location?.city) {
        territory.cities.push({
          _id: record._id,
          name: record.location.city,
          areas: record.location.regions || [],
          newArea: '',
          editing: false,
          editName: record.location.city
        });
      }
    });

    return Array.from(stateMap.values());
  }

  private loadTerritories(suppressLoading: boolean = false) {
    if (!suppressLoading) {
      this.loading = true;
    }
    // trigger service to fetch and update the BehaviorSubject; subscription above will update UI
    this.territoryService.loadTerritories().subscribe({
      error: (err) => {
        console.error('Failed to load territories', err);
        this.setStatus('Unable to load territories.', 'error');
        if (!suppressLoading) this.loading = false;
      },
      complete: () => {
        if (!suppressLoading) {
          this.loading = false;
        }
      }
    });
  }

  private loadCountryData() {
    this.locationService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.filteredCountries = [...countries];
        if (!this.selectedCountry && countries.length) {
          this.selectedCountry = countries.includes('India') ? 'India' : countries[0];
          this.onCountryChange();
        }
      },
      error: () => {
        this.countries = [];
        this.filteredCountries = [];
      }
    });
  }

  toggleCountryDropdown() {
    this.closeDropdowns();
    this.countryDropdownOpen = !this.countryDropdownOpen;
  }

  toggleStateDropdown() {
    if (!this.states.length) {
      return;
    }
    this.closeDropdowns();
    this.stateDropdownOpen = !this.stateDropdownOpen;
  }

  toggleCityDropdown() {
    if (!this.cities.length) {
      return;
    }
    this.closeDropdowns();
    this.cityDropdownOpen = !this.cityDropdownOpen;
  }

  toggleAreaDropdown() {
    if (!this.areas.length) {
      return;
    }
    this.closeDropdowns();
    this.areaDropdownOpen = !this.areaDropdownOpen;
  }

  closeDropdowns() {
    this.countryDropdownOpen = false;
    this.stateDropdownOpen = false;
    this.cityDropdownOpen = false;
    this.areaDropdownOpen = false;
  }

  selectCountry(country: string) {
    this.selectedCountry = country;
    this.countrySearch = '';
    this.filteredCountries = [...this.countries];
    this.closeDropdowns();
    this.onCountryChange();
    delete this.validationErrors.country;
  }

  selectState(state: string) {
    this.selectedState = state;
    this.stateSearch = '';
    this.filteredStates = [...this.states];
    this.closeDropdowns();
    this.onStateChange();
    delete this.validationErrors.state;
  }

  selectCity(city: string) {
    this.selectedCity = city;
    this.citySearch = '';
    this.filteredCities = [...this.cities];
    this.closeDropdowns();
    this.onCityChange();
    delete this.validationErrors.city;
  }

  selectArea(area: string) {
    this.selectedArea = area;
    this.areaSearch = '';
    this.filteredAreas = [...this.areas];
    this.closeDropdowns();
    delete this.validationErrors.area;
  }

  filterCountries() {
    const query = this.countrySearch.trim().toLowerCase();
    this.filteredCountries = this.countries.filter((country) => country.toLowerCase().includes(query));
  }

  filterStates() {
    const query = this.stateSearch.trim().toLowerCase();
    this.filteredStates = this.states.filter((state) => state.toLowerCase().includes(query));
  }

  filterCities() {
    const query = this.citySearch.trim().toLowerCase();
    this.filteredCities = this.cities.filter((city) => city.toLowerCase().includes(query));
  }

  filterAreas() {
    const query = this.areaSearch.trim().toLowerCase();
    this.filteredAreas = this.areas.filter((area) => area.toLowerCase().includes(query));
  }

  onCountryChange() {
    this.states = [];
    this.cities = [];
    this.areas = [];
    this.selectedState = '';
    this.selectedCity = '';
    this.selectedArea = '';

    if (!this.selectedCountry) {
      return;
    }

    this.locationService.getStates(this.selectedCountry).subscribe((states) => {
      this.states = states;
      this.filteredStates = [...states];
    });
  }

  onStateChange() {
    this.cities = [];
    this.areas = [];
    this.selectedCity = '';
    this.selectedArea = '';

    if (!this.selectedCountry || !this.selectedState) {
      return;
    }

    this.locationService.getCities(this.selectedCountry, this.selectedState).subscribe((cities) => {
      this.cities = cities;
      this.filteredCities = [...cities];
    });
  }

  onCityChange() {
    this.areas = [];
    this.selectedArea = '';

    if (!this.selectedCity) {
      return;
    }

    this.locationService.getAreas(this.selectedCity).subscribe((areas) => {
      this.areas = areas;
      this.filteredAreas = [...areas];
    });
  }

  addTerritory() {
    // client-side validation
    this.validationErrors = {};
    if (!this.selectedCountry) this.validationErrors.country = 'Select country';
    if (!this.selectedState) this.validationErrors.state = 'Select state';
    if (!this.selectedCity) this.validationErrors.city = 'Select city';
    if (!this.selectedArea) this.validationErrors.area = 'Select area';

    if (Object.keys(this.validationErrors).length) {
      this.setStatus('Please select Country, State, City and Area before saving.', 'error');
      return;
    }

    const targetState = this.territories.find((item) => item.state === this.selectedState);
    const territoryName = this.selectedCity ? `${this.selectedState} - ${this.selectedCity}` : this.selectedState;
    const currentUser = this.authService.getCurrentUserSync();
    const addPayload: any = {
      tenantId: currentUser?.tenantId,
      // Only include companyId when the current user actually has one.
      // Previously we fell back to tenantId which caused server-side filtering to miss the newly created territory.
      ...(currentUser?.companyId ? { companyId: currentUser.companyId } : {}),
      country: this.selectedCountry,
      state: this.selectedState,
      city: this.selectedCity,
      name: territoryName,
      area: this.selectedArea,
      regions: [this.selectedArea]
    };
    console.debug('Add territory payload:', addPayload);

    if (targetState) {
      const existingCity = targetState.cities.find((city) => city.name === this.selectedCity);
      if (existingCity) {
        if (existingCity.areas.includes(this.selectedArea)) {
          this.setStatus('Selected area already exists for this city.', 'error');
          return;
        }
        existingCity.areas.push(this.selectedArea);

        if (!existingCity._id) {
          this.setStatus('Unable to update existing territory city.', 'error');
          return;
        }

        this.savingTerritory = true;
        this.territoryService.updateTerritory(existingCity._id, { regions: existingCity.areas })
          .pipe(finalize(() => {
            this.savingTerritory = false;
          }))
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.responseHandler.showSuccess(response.message || 'Territory area added successfully.');
                this.selectedArea = '';
                this.loadTerritories(true);
              } else {
                this.responseHandler.showError(response.message || 'Failed to add territory area.');
              }
            },
            error: (err) => {
              console.error('Failed to add area to existing city', err);
              this.responseHandler.handleApiError(err);
            }
          });
        return;
      }
    }

    this.savingTerritory = true;
    this.territoryService.createTerritory(addPayload)
      .pipe(finalize(() => {
        this.savingTerritory = false;
      }))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // refresh canonical list from server (service will update territories$)
            this.responseHandler.showSuccess(response.message || 'Territory created successfully.');
            this.selectedArea = '';
            this.loadTerritories(true);
          } else {
            this.responseHandler.showError(response.message || 'Failed to create territory.');
          }
        },
        error: (err) => {
          console.error('Failed to create territory', err);
          this.responseHandler.handleApiError(err);
        }
      });
  }

  toggleState(item: Territory) {
    item.expanded = !item.expanded;
  }

  addArea(city: City) {
    const value = city.newArea?.trim();
    if (!value) {
      return;
    }

    city.areas.push(value);
    city.newArea = '';

    if (city._id) {
      this.loading = true;
      this.territoryService.updateTerritory(city._id, { regions: city.areas }).subscribe({
        next: () => this.setStatus('Area added successfully.', 'success'),
        error: (err) => {
          console.error('Add area failed', err);
          this.setStatus('Failed to add area.', 'error');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  startEditState(state: Territory) {
    state.editing = true;
    state.editName = state.state;
  }

  saveStateName(state: Territory) {
    if (!state.editName?.trim()) {
      return;
    }
    const previousState = state.state;
    state.state = state.editName.trim();
    state.editing = false;

    if (this.selectedState === previousState) {
      this.selectedState = state.state;
    }

    const updatePayload = { state: state.state };
    const updateTasks = [];

    if (state.id) {
      updateTasks.push(this.territoryService.updateTerritory(state.id, updatePayload));
    }

    state.cities.forEach((city) => {
      if (city._id) {
        updateTasks.push(this.territoryService.updateTerritory(city._id, { ...updatePayload, city: city.name, regions: city.areas }));
      }
    });

    if (!updateTasks.length) {
      return;
    }

    this.loading = true;
    forkJoin(updateTasks).subscribe({
      next: () => this.setStatus('Territory state updated successfully.', 'success'),
      error: (err) => {
        console.error('Update state failed', err);
        this.setStatus('Failed to update state.', 'error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  cancelEditState(state: Territory) {
    state.editing = false;
    state.editName = state.state;
  }

  startEditCity(city: City) {
    city.editing = true;
    city.editName = city.name;
  }

  saveCityName(city: City) {
    if (!city.editName?.trim()) {
      return;
    }

    city.name = city.editName.trim();
    city.editing = false;

    if (city._id) {
      this.loading = true;
      this.territoryService.updateTerritory(city._id, { city: city.name, regions: city.areas }).subscribe({
        next: () => this.setStatus('City name updated successfully.', 'success'),
        error: (err) => {
          console.error('Update city failed', err);
          this.setStatus('Failed to update city.', 'error');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  cancelEditCity(city: City) {
    city.editing = false;
    city.editName = city.name;
  }

  removeState(state: Territory) {
    const deleteRequests = [] as any[];
    if (state.id) {
      deleteRequests.push(this.territoryService.deleteTerritory(state.id));
    }
    state.cities.forEach((city) => {
      if (city._id) {
        deleteRequests.push(this.territoryService.deleteTerritory(city._id));
      }
    });

    if (deleteRequests.length) {
      this.loading = true;
      forkJoin(deleteRequests).subscribe({
        next: () => this.setStatus('State territory deleted successfully.', 'success'),
        error: (err) => {
          console.error('Delete state territory failed', err);
          this.setStatus('Failed to delete state.', 'error');
        },
        complete: () => {
          this.loading = false;
        }
      });
    }

    this.territories = this.territories.filter((item) => item !== state);
    if (this.selectedState === state.state) {
      this.selectedState = '';
    }
  }

  removeCity(state: Territory, city: City) {
    if (!city._id) {
      state.cities = state.cities.filter((item) => item !== city);
      return;
    }

    this.loading = true;
    this.territoryService.deleteTerritory(city._id).subscribe({
      next: () => {
        state.cities = state.cities.filter((item) => item !== city);
        this.setStatus('City deleted successfully.', 'success');
      },
      error: (err) => {
        console.error('Delete city failed', err);
        this.setStatus('Failed to delete city.', 'error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  get territoryRows() {
    if (!Array.isArray(this.territories) || !this.territories.length) {
      return [];
    }

    return this.territories.flatMap((state) =>
      Array.isArray(state.cities)
        ? state.cities.map((city) => ({ state, city, areas: city.areas || [] }))
        : []
    );
  }

  removeArea(city: City, areaIndex: number) {
    city.areas.splice(areaIndex, 1);

    if (!city._id) {
      return;
    }

    this.loading = true;
    this.territoryService.updateTerritory(city._id, { regions: city.areas }).subscribe({
      next: () => this.setStatus('Area deleted successfully.', 'success'),
      error: (err) => {
        console.error('Delete area failed', err);
        this.setStatus('Failed to delete area.', 'error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
