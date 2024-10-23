import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {CellTemplateComponent} from "@organizo/dx-grid/components/cell-template/cell-template.component";


@Component({
  selector: 'app-cell-template-wrapper',
  templateUrl: './cell-template-wrapper.component.html',
  styleUrls: ['./cell-template-wrapper.component.scss']
})
export class CellTemplateWrapperComponent implements OnInit, AfterViewInit {
  @ViewChild('viewport', {read: ViewContainerRef, static: true})
  viewport: ViewContainerRef;

  @Input('component-name') componentRef;
  @Input('row-data') data;
  @Input('to') to;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.componentRef) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentRef);
      const componentRef = this.viewport.createComponent(componentFactory);
      componentRef.instance['rowData'] = this.data['data'];
      componentRef.instance['cellData'] = this.data['value']; // || this.data['column']['caption'];
      componentRef.instance['caption'] = this.data['column']['caption'];
      componentRef.instance['to'] = this.to;
    }
    if (!(this.componentRef && this.componentRef.prototype instanceof CellTemplateComponent) || !(this.componentRef)) {
      console.warn('componentRef not extending CellTemplateComponent, you will lose the access to cell and row data');
    }
  }
}
