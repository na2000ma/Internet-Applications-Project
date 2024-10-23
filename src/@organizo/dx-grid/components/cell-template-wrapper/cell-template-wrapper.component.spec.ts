import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CellTemplateWrapperComponent} from './cell-template-wrapper.component';

describe('CellTemplateWrapperComponent', () => {
  let component: CellTemplateWrapperComponent;
  let fixture: ComponentFixture<CellTemplateWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CellTemplateWrapperComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellTemplateWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
