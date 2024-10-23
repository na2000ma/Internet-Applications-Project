import {AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {isObservable, Observable, of} from 'rxjs';
import {BaseColumnConfiguration} from '../../models/base-column';
import {BaseGridConfiguration} from '../../models/base-grid-config';
import {get, isFunction} from 'lodash-es';
import {exportDataGrid} from 'devextreme/excel_exporter';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver';
import {OrganizoConfigService} from "@organizo/services/config/config.service";
import {DOCUMENT} from "@angular/common";
import {ObjectUtilsService} from "@organizo/services/utils/object-utils.service";

@Component({
  selector: 'organizo-grid-wrapper',
  templateUrl: './grid-wrapper.component.html',
  styleUrls: ['./grid-wrapper.component.scss'],
})
export class GridWrapperComponent implements OnInit, AfterViewInit {
  dataSrc$: Observable<any[]>;
  templateColumn = [];
  colConfig: BaseColumnConfiguration[];
  stopClick = false;
  themeName = 'light';
  @Input('config') config: BaseGridConfiguration;
  @ViewChild('grid', {static: true}) grid: any;

  constructor(
    private organizoConfigService: OrganizoConfigService,
    private objectUtilsService: ObjectUtilsService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.organizoConfigService.config$.subscribe(
      () => {
        this.themeName = this.document.getElementsByTagName('body')[0].classList.contains('light') ? 'light' : 'dark';
        this.cdr.markForCheck();
      }
    )
  }

  @Input('data-source') set dataSrc(data: Observable<any[]> | any[]) {
    if (isObservable(data)) {
      this.dataSrc$ = data;
    } else {
      this.dataSrc$ = of(data);
    }
  }

  @Input('column-config') set _colConfig(config: BaseColumnConfiguration[]) {
    this.colConfig = config;
  }

  get paginationLength() {
    return +localStorage.getItem('paginationLength');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const templateDef = this.config.templateDef;
    this.templateColumn =
      (this.colConfig || [])
        .map((cc) => ({
          name: cc.cellTemplate,
          headerLabel: cc.dataField,
          headerName: cc.headerTemplate,
          componentRef: templateDef[cc.cellTemplate],
          templateOptions: cc.templateOptions,
          headerRef: templateDef[cc.headerTemplate]
        }))/* the templates without templateRef will
be excluded and will show up only rhe template name*/.filter(ele => ele.name ? ele.componentRef && (ele.headerName ? ele.headerRef : true) : ele.headerName ? ele.headerRef : true)
    // other approach: })).filter(ele => ele.name && ele.headerName ? ele.componentRef && ele.headerRef : ele.name ?  ele.componentRef : ele.headerName ? ele.headerRef : false);
    this.cdr.detectChanges();
  }

  getDataField(dataField: string | Observable<string>) {
    return isObservable(dataField) ? dataField : of(dataField);
  }

  onRowClick(event: any) {
    this.stopClick = false;
    if (isFunction(this.config.onRowClick)) {
      if (isFunction(this.config.onRowDblClick)) {
        const delay = 500;
        setTimeout(() => {
          if (!this.stopClick) {
            this.config.onRowClick(event)
          }
        }, delay)
      } else {
        this.config.onRowClick(event);
      }
    }
  }

  onRowDblClick(event: any) {
    if (isFunction(this.config.onRowDblClick)) {
      this.stopClick = true;
      this.config.onRowDblClick(event);
    }
  }

  onExportingGrid(event: any) {
    const fileName = this.config?.excelFileName + '.xlsx';
    const excel = this.config?.customizeWorkbookForExcel ? this.config?.customizeWorkbookForExcel() : this.defaultWorkbookFunction();
    exportDataGrid({
      component: event.component,
      worksheet: excel?.worksheet,
      keepColumnWidths: false,
      topLeftCell: {row: 1, column: 1},
      customizeCell: ({gridCell, excelCell}) => {
        if (this.config.customizeCellForExport) {
          this.config.customizeCellForExport({gridCell, excelCell})
        } else {
          this.defaultExportFunction(excelCell)
        }
      }
    }).then(function () {
      excel?.workbook.xlsx.writeBuffer()
        .then(function (buffer: BlobPart) {
          saveAs(new Blob([buffer], {type: 'application/octet-stream'}), fileName);
        });
    });
  }

  onGridReady(event: any) {
    if (isFunction(this.config.onGridReady)) {
      this.config.onGridReady(event);
    }
  }

  onPageChange(event: any) {
    let payload = {
      start: +get(event, 'pageIndex'),
      size: +get(event, 'pageSize')
    }
    this.config?.paginationOptions.onPageChange(payload);
  }

  private defaultExportFunction(excelCell: any) {
    excelCell.font = {name: 'Arial', size: 16};
    excelCell.alignment = {horizontal: 'center'};
  }

  private defaultWorkbookFunction() {
    const workbook = new Workbook();
    return {
      workbook: workbook,
      worksheet: workbook.addWorksheet('Main sheet')
    }
  }
}
