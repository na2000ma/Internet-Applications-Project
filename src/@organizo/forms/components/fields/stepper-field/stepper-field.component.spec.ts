import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StepperFieldComponent} from './stepper-field.component';

describe('StepperFieldComponent', () => {
  let component: StepperFieldComponent;
  let fixture: ComponentFixture<StepperFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StepperFieldComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StepperFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
