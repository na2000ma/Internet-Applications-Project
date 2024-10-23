import {Component, OnInit} from '@angular/core';
import {BaseFieldArrayComponent} from "@organizo/forms/components/fields/base-field-array.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {get} from "lodash-es";


@Component({
  selector: 'app-repeat-section-field',
  templateUrl: './repeat-section.component.html',
  styleUrls: ['./repeat-section.component.scss']
})
export class RepeatSectionComponent extends BaseFieldArrayComponent implements OnInit {
  isExpanded: boolean[];
  repeatSectionExpanded: boolean = true;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.isExpanded = Array((this.field.fieldGroup || []).length).fill(false);
  }

  dropItem(event: CdkDragDrop<any>) {
    moveItemInArray(this.isExpanded, event.previousIndex, event.currentIndex);
    const formControls = this.formControl.controls;
    const fromIndex = event.previousIndex;
    const toIndex = event.currentIndex;
    let currentValue = null;
    if (fromIndex < toIndex) {
      for (let i = fromIndex; i < toIndex; i++) {
        currentValue = formControls[i].value;
        formControls[i].patchValue(formControls[i + 1].value);
        formControls[i + 1].patchValue(currentValue);
      }
    } else if (fromIndex > toIndex) {
      for (let i = fromIndex; i > toIndex; i--) {
        currentValue = formControls[i].value;
        formControls[i].patchValue(formControls[i - 1].value);
        formControls[i - 1].patchValue(currentValue);
      }
    }
    // const value = this.formControl.controls[event.previousIndex].value;
    // this.formControl.controls[event.previousIndex].setValue(this.formControl.controls[event.currentIndex].value);
    // this.formControl.controls[event.currentIndex].setValue(value);
  }

  addSection(event: MouseEvent) {
    this.isExpanded = Array((this.field.fieldGroup || []).length).fill(false);
    this.add();
    this.isExpanded.push(true);
    event.stopPropagation();
  }

  removeSection(i: number, event: MouseEvent) {
    this.remove(i);
    this.isExpanded = this.isExpanded.filter((_, index) => i !== index);
    event.stopPropagation();
  }

  getFieldName(fieldItem: any, i: number) {
    let name = '';
    if (this.props?.viewMode) {
      Object.keys((get(fieldItem, 'formControl.controls') || [])).forEach((key, index) => {
        name += get(fieldItem, `formControl.controls.${key}.value`)
        if (index === 0) {
          name += ' : '
        }
      })
      return name;
    }

    if (this.props?.sectionTitlePath) {
      const name = get(fieldItem, `formControl.controls.${this.props?.sectionTitlePath}.value`);
      return (name ? name : `No Name (${i})`) + ': ';
    }
    return `Unset name field`;
  }
}
