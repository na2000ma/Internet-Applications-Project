import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NestedMatMenuComponent} from './nested-mat-menu.component';

describe('NestedMatMenuComponent', () => {
  let component: NestedMatMenuComponent;
  let fixture: ComponentFixture<NestedMatMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedMatMenuComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NestedMatMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
