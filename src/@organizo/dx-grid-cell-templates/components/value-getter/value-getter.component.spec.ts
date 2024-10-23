import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValueGetterComponent} from './value-getter.component';

describe('ValueGetterComponent', () => {
  let component: ValueGetterComponent;
  let fixture: ComponentFixture<ValueGetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValueGetterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ValueGetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
