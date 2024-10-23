import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchableSelectFieldComponent} from './searchable-select-field.component';

describe('SearchableSelectFieldComponent', () => {
  let component: SearchableSelectFieldComponent;
  let fixture: ComponentFixture<SearchableSelectFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchableSelectFieldComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchableSelectFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
