import {Directive, EventEmitter, Input, Output, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[backgroundImageLoading]',
  standalone: true
})
export class BackgroundImageLoadingDirective {

  @Output('onImageLoaded') onImageLoaded: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(private vcr: ViewContainerRef) {
  }

  @Input('backgroundImageLoading') set backgroundImageLoading(value: string | File) {
    const element = this.vcr.element.nativeElement;
    const onImageLoaded = this.onImageLoaded;
    if (!element.style.backgroundImage) {
      element.classList.add('background-image-container');
      element.classList.add('background-image-loading');
      if (typeof value === 'string') {
        let image = new Image();
        image.onload = function (event: Event) {
          element.style.backgroundImage = `url(${value})`;
          element.classList.remove('background-image-loading');
          onImageLoaded.emit(event);
        }
        image.src = value;
      } else if (value.constructor === File) {
        const reader = new FileReader();
        reader.onload = (event) => {
          element.style.backgroundImage = `url(${reader.result})`;
          element.classList.remove('background-image-loading');
          onImageLoaded.emit(event);
        }
        reader.readAsDataURL(value);
      }
    }
  }
}


/*

import {Directive, EventEmitter, Input, Output, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[backgroundImageLoading]',
  standalone: true
})
export class BackgroundImageLoadingDirective {

  @Output('onImageLoaded') onImageLoaded: EventEmitter<Event> = new EventEmitter<Event>();

  @Input('failedImage') failedImage: string;

  constructor(private vcr: ViewContainerRef) {
  }

  @Input('backgroundImageLoading') set backgroundImageLoading(value: string | File) {
    const element = this.vcr.element.nativeElement;
    const onImageLoaded = this.onImageLoaded;
    if (!element.style.backgroundImage) {
      element.classList.add('background-image-container');
      element.classList.add('background-image-loading');
      if (typeof value === 'string') {
        let image = new Image();
        image.onload = (event: Event) => {
          element.style.backgroundImage = `url(${value})`;
          element.classList.remove('background-image-loading');
          onImageLoaded.emit(event);
        }
        image.onerror = () => {
          let image = new Image();
          image.onload = (event: Event) => {
            element.style.backgroundImage = `url(${this.failedImage})`;
            element.classList.remove('background-image-loading');
            onImageLoaded.emit(event);
          }
          image.src = this.failedImage;
        }
        image.src = value;
      } else if (value.constructor === File) {
        const reader = new FileReader();
        reader.onload = (event) => {
          element.style.backgroundImage = `url(${reader.result})`;
          element.classList.remove('background-image-loading');
          onImageLoaded.emit(event);
        }
        reader.onerror = () => {
          let image = new Image();
          image.onload = (event: Event) => {
            element.style.backgroundImage = `url(${this.failedImage})`;
            element.classList.remove('background-image-loading');
            onImageLoaded.emit(event);
          }
          image.src = this.failedImage;
        }
        reader.readAsDataURL(value);
      }
    }
  }
}


 */
