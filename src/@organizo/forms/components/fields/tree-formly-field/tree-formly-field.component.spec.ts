import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeFormlyFieldComponent } from './tree-formly-field.component';

describe('TreeFormlyFieldComponent', () => {
  let component: TreeFormlyFieldComponent;
  let fixture: ComponentFixture<TreeFormlyFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TreeFormlyFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreeFormlyFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
