import {Component, OnInit} from '@angular/core';
import {CellTemplateComponent} from "@organizo/dx-grid/components/cell-template/cell-template.component";
import {MatIcon} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {isFunction} from "lodash-es";
import {MatTooltip} from "@angular/material/tooltip";


export interface GridTypeWithIconModel {
  type: 'folder' | 'subFolder' | 'group' | 'user' | 'document' | ((rowData: any) => any);
  fileType?: (rowData: any) => string;
  label?: string;
  class?: string;
}


export enum MimeTypes {
  Word = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  Excel = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PDF = 'application/pdf',
  Text = 'text/plain',
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  BMP = 'image/bmp',
  TIFF = 'image/tiff',
  SVG = 'image/svg+xml',
}

@Component({
  selector: 'organizo-type-with-icon',
  standalone: true,
  imports: [
    MatIcon,
    TranslateModule,
    MatTooltip
  ],
  templateUrl: './type-with-icon.component.html',
  styleUrl: './type-with-icon.component.scss'
})
export class TypeWithIconComponent extends CellTemplateComponent implements OnInit {

  public readonly MimeTypes = MimeTypes;
  type: string;
  fileType: { mimeType: string; ext: string; };

  constructor() {
    super();
  }

  ngOnInit() {
    if (isFunction(this.to?.type)) {
      this.type = this.to?.type(this.rowData);
    } else {
      this.type = this.to?.type;
    }

    if (isFunction(this.to?.fileType)) {
      const mimeType: string = this.to?.fileType(this.rowData);
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

  getMatTooltipClass(mimeType: string) {
    if (mimeType === MimeTypes.PDF) return '!bg-red-600';
    if (mimeType === MimeTypes.Word) return '!bg-blue-600';
    if (mimeType === MimeTypes.Excel) return '!bg-green-600';
    if (mimeType === MimeTypes.Text) return '!bg-gray-600';
    if (this.isImage(mimeType)) return '!bg-amber-600';
    return '!bg-black-600'
  }

  isImage(mimeType: string) {
    return mimeType === MimeTypes.BMP ||
      mimeType === MimeTypes.PNG ||
      mimeType === MimeTypes.SVG ||
      mimeType === MimeTypes.GIF ||
      mimeType === MimeTypes.TIFF ||
      mimeType === MimeTypes.JPEG
  }
}


