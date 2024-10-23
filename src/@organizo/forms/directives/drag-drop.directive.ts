import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {


  @Output() dropFile = new EventEmitter<string>;

  constructor() {
  }


  @HostListener('dragover', ['$event']) onDragOver(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }


  @HostListener('dragLeave', ['$event']) onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('drop', ['$event']) onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    this.dropFile.emit(files);
  }

}
