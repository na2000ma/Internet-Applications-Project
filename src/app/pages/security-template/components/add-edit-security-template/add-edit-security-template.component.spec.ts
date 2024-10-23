import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSecurityTemplateComponent } from './add-edit-security-template.component';

describe('AddEditSecurityTemplateComponent', () => {
  let component: AddEditSecurityTemplateComponent;
  let fixture: ComponentFixture<AddEditSecurityTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditSecurityTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditSecurityTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
