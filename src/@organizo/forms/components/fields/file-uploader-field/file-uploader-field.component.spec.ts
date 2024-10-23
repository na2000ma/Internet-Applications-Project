import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FileUploaderFieldComponent} from './file-uploader-field.component';

describe('FileUploaderFieldComponent', () => {
  let component: FileUploaderFieldComponent;
  let fixture: ComponentFixture<FileUploaderFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileUploaderFieldComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FileUploaderFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
