import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {

  @Output() searchEvent = new EventEmitter<any>();
  @Output() dateRangeSearchEvent = new EventEmitter<void>();
  @Output() resetFilterEvent = new EventEmitter<void>();

  title: string = '';
  description: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor() {}

  performSearch() {
    const query = {
      title: this.title,
      description: this.description
    };
    this.searchEvent.emit(query);
  }

  performDateRangeSearch() {
    this.dateRangeSearchEvent.emit();
  }

  resetFilter() {
    this.title = '';
    this.description = '';
    this.startDate = null;
    this.endDate = null;
    this.resetFilterEvent.emit();
  }
}
