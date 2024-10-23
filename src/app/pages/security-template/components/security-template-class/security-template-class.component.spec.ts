import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityTemplateClassComponent } from './security-template-class.component';

describe('SecurityTemplateClassComponent', () => {
  let component: SecurityTemplateClassComponent;
  let fixture: ComponentFixture<SecurityTemplateClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityTemplateClassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecurityTemplateClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
