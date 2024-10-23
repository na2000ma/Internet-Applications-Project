import {Component, OnInit} from '@angular/core';
import {BaseFieldComponent} from "@organizo/forms/components/fields/base-field.component";
import {FormlyFieldConfig} from "@ngx-formly/core";

export class StepperStepModel {
  props: {
    label: string;
    class?: string;
    icon?: string;
  };
  fieldGroup: FormlyFieldConfig[] = [];
}

@Component({
  selector: 'app-stepper-field',
  templateUrl: './stepper-field.component.html',
  styleUrl: './stepper-field.component.scss'
})
export class StepperFieldComponent extends BaseFieldComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
