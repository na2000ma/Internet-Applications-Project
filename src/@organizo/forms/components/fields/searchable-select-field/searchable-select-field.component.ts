import {Component, OnInit} from '@angular/core';
import {BaseFieldComponent} from "@organizo/forms/components/fields/base-field.component";
import {FormControl} from "@angular/forms";
import {isObservable, map, Observable, startWith} from "rxjs";
import {get} from "lodash-es";

@Component({
  selector: 'organizo-searchable-select-field',
  templateUrl: './searchable-select-field.component.html',
  styleUrl: './searchable-select-field.component.scss'
})
export class SearchableSelectFieldComponent extends BaseFieldComponent implements OnInit {

  myControl = new FormControl('');
  filteredOptions: Observable<any[]>;

  public readonly get = get;

  opts: any[] = [];

  constructor() {
    super();
  }


  ngOnInit() {
    if (isObservable(this.props.options)) {
      this.props.options.subscribe(value => this.opts = value)
    } else {
      this.opts = this.props.options
    }

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }


  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.opts.filter(option => (get(option, this.props?.labelProp) + '').toLowerCase().includes(filterValue));
  }
}
