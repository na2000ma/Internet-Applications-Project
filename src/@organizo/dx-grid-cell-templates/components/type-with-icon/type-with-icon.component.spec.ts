import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TypeWithIconComponent} from './type-with-icon.component';

describe('TypeWithIconComponent', () => {
  let component: TypeWithIconComponent;
  let fixture: ComponentFixture<TypeWithIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeWithIconComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TypeWithIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
