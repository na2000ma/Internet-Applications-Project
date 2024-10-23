import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {organizoAnimations} from "@organizo/animations/organizo.animations";
import {BaseFieldComponent} from "@organizo/forms/components/fields/base-field.component";
import {MimeTypes} from "@organizo/dx-grid-cell-templates/components/type-with-icon/type-with-icon.component";
import {get} from "lodash-es";

@Component({
  selector: 'app-image-uploader-field',
  templateUrl: './file-uploader-field.component.html',
  styleUrl: './file-uploader-field.component.scss',
  animations: organizoAnimations
})
export class FileUploaderFieldComponent extends BaseFieldComponent implements OnInit {

  @ViewChild('img') imgRef: ElementRef;

  message: string;
  isImageChanged: boolean = false;

  fileType: { mimeType: string; ext: string; };
  protected readonly MimeTypes = MimeTypes;

  constructor() {
    super();
  }

  get ifStringFormControlValue() {
    return typeof this.formControl.value === 'string';
  }

  ngOnInit() {
    if (this.props?.type === 'content') {
      this.setFileType(this.formControl.value);
    }
    if (this.formControl.value) {
      this.isImageChanged = true;
    }
    this.formControl.valueChanges.subscribe(() => {
      this.isImageChanged = true;
    })
  }

  onDropFile(files: any) {
    this.getSafeImage(files, this.props?.type)
  }

  onFileChange(event: any, type: string) {
    this.getSafeImage(event.target.files, type);
  }

  getSafeImage(files: any, type: string = 'folder') {
    if (files.length === 0)
      return;

    const mimeType = files[0].type;
    this.formControl.setValue(files[0]);
    if (type === 'content') {
      this.setFileType(files[0])
    }
    if (type !== 'content' && mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    this.message = null;

    if (type !== 'content') {
      const reader = new FileReader();
      if (type == 'folder') {
        this.isImageChanged = true;
      }
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgRef.nativeElement.style['background-image'] = `url(${reader.result})`;
      }
    }
  }

  deleteImg() {
    this.formControl.setValue(null);
    this.isImageChanged = false;
    this.message = null;
  }

  isDefaultImage(src: string) {
    return src == undefined;
  }

  setFileType(value: any) {
    const mimeType: string = get(value, 'type');
    let ext: string = null;
    if (mimeType) {
      for (const type in MimeTypes) {
        if (MimeTypes[type] === mimeType) {
          ext = type;
          break;
        }
      }
    }
    this.fileType = {mimeType, ext};
  }
}
