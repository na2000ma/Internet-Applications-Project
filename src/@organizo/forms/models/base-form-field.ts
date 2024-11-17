import {FormlyFieldConfig} from "@ngx-formly/core";
import {Observable} from "rxjs";
import {get, set} from "lodash-es";
import {FieldTypes} from "@organizo/forms/types/field-types";
import {FormlyAttributeEvent} from "@ngx-formly/core/lib/models";
import {TranslateService} from "@ngx-translate/core";
import {inject} from "@organizo/injector/app-injector";
import {AbstractControl, ValidationErrors} from "@angular/forms";
import {TreeDefinition} from "@organizo/tree/definition/tree-definition";


export class BaseFormField {

  fieldConfig: FormlyFieldConfig = {};
  #translateService: TranslateService = inject(TranslateService);

  constructor(type?: FieldTypes) {
    set(this.fieldConfig, 'type', type);
  }

  /** Shared with form generator **/
  /*** Field Config ***/
  key(key: string | number | string[]): BaseFormField {
    set(this.fieldConfig, 'key', key);
    return this;
  }

  defaultValue(defaultValue: any): BaseFormField {
    set(this.fieldConfig, 'defaultValue', defaultValue);
    return this;
  }

  validators(validators: {
    validation?: (string | ((control: AbstractControl, field?: FormlyFieldConfig, options?: any) => ValidationErrors) | {
      name: string,
      validation: any
    })[]
  } | {
    [validatorName: string]: {
      expression: (c: AbstractControl, field?: FormlyFieldConfig, options?: any) => boolean,
      message: string | ((error: any, field: FormlyFieldConfig) => string | Observable<string>)
    }
  }): BaseFormField {
    set(this.fieldConfig, 'validators', validators);
    return this;
  }

  hideExp(hideExp: boolean | string | ((model: any, formState: any, field?: FormlyFieldConfig) => boolean)): BaseFormField {
    set(this.fieldConfig, 'hideExpression', hideExp);
    return this;
  }

  /*** Field Props ***/
  type(type: string): BaseFormField {
    set(this.fieldConfig, 'props.type', type);
    return this;
  }

  label(label: string): BaseFormField {
    set(this.fieldConfig, 'props.label', label);
    return this;
  }

  placeholder(placeholder: string): BaseFormField {
    set(this.fieldConfig, 'props.placeholder', placeholder);
    return this;
  }

  description(description: string): BaseFormField {
    set(this.fieldConfig, 'props.description', description);
    return this;
  }

  hintEnd(hintEnd: string): BaseFormField {
    set(this.fieldConfig, 'props.hintEnd', hintEnd);
    return this;
  }

  required(required: boolean = true): BaseFormField {
    set(this.fieldConfig, 'props.required', required);
    return this;
  }

  hideRequiredMarker(hideRequiredMarker: boolean = true): BaseFormField {
    set(this.fieldConfig, 'props.hideRequiredMarker', hideRequiredMarker);
    return this;
  }

  disabled(disabled: boolean = true): BaseFormField {
    set(this.fieldConfig, 'props.disabled', disabled);
    return this;
  }

  className(value: string): BaseFormField {
    set(this.fieldConfig, 'className', value);
    return this;
  }

  readonly(readonly: boolean = true): BaseFormField {
    set(this.fieldConfig, 'props.readonly', readonly);
    return this;
  }

  hidden(hidden: boolean = true): BaseFormField {
    set(this.fieldConfig, 'hide', hidden);
    return this;
  }

  floatLabel(floatLabel: 'always' | 'auto' = 'always'): BaseFormField {
    set(this.fieldConfig, 'props.floatLabel', floatLabel);
    return this;
  }

  appearance(appearance: 'fill' | 'outline' = 'fill'): BaseFormField {
    set(this.fieldConfig, 'props.appearance', appearance);
    return this;
  }

  subscriptSizing(subscriptSizing: 'fixed' | 'dynamic'): BaseFormField {
    set(this.fieldConfig, 'props.subscriptSizing', subscriptSizing);
    return this;
  }

  color(color: 'primary' | 'accent' | 'warn' = 'primary'): BaseFormField {
    set(this.fieldConfig, 'props.color', color);
    return this;
  }

  /** text - email - phone-number - password - number - textarea - slider **/
  minLength(minLength: number): BaseFormField {
    set(this.fieldConfig, 'props.minLength', minLength);
    return this;
  }

  maxLength(maxLength: number): BaseFormField {
    set(this.fieldConfig, 'props.maxLength', maxLength);
    return this;
  }

  /** checkbox - multi-checkbox - select - multi-select **/
  indeterminate(indeterminate: boolean = true): BaseFormField {
    set(this.fieldConfig, 'props.indeterminate', indeterminate);
    return this;
  }

  /** checkbox - multi-checkbox - radio - toggle **/
  labelPosition(labelPosition: 'before' | 'after' = 'before'): BaseFormField {
    set(this.fieldConfig, 'props.labelPosition', labelPosition);
    return this;
  }

  /** number - slider **/
  max(max: number | Date | string): BaseFormField {
    set(this.fieldConfig, 'props.max', max);
    return this;
  }

  min(min: number | Date | string): BaseFormField {
    set(this.fieldConfig, 'props.min', min);
    return this;
  }

  step(step: number): BaseFormField {
    set(this.fieldConfig, 'props.step', step);
    return this;
  }

  /** textarea **/
  rows(rows: number): BaseFormField {
    set(this.fieldConfig, 'props.rows', rows);
    return this;
  }

  cols(cols: number): BaseFormField {
    set(this.fieldConfig, 'props.cols', cols);
    return this;
  }

  autosizeMinRows(autosizeMinRows: number): BaseFormField {
    set(this.fieldConfig, 'props.autosizeMinRows', autosizeMinRows);
    return this;
  }

  autosizeMaxRows(autosizeMaxRows: number): BaseFormField {
    set(this.fieldConfig, 'props.autosizeMaxRows', autosizeMaxRows);
    return this;
  }

  autosize(autosize: boolean = true): BaseFormField {
    set(this.fieldConfig, 'props.autosize', autosize);
    return this;
  }

  /** select - multi-select **/
  multiple(multiple: boolean = true): BaseFormField {
    set(this.fieldConfig, 'props.multiple', multiple);
    return this;
  }

  selectAllOption(selectAllOption: string): BaseFormField {
    set(this.fieldConfig, 'props.selectAllOption', selectAllOption);
    return this;
  }

  disableOptionCentering(disableOptionCentering: boolean = true): BaseFormField {
    set(this.fieldConfig, 'props.disableOptionCentering', disableOptionCentering);
    return this;
  }

  /** datepicker **/
  datepickerOptions(datepickerOptions: {
    max?: Date;
    min?: Date;
    startAt?: Date;
    startView?: 'month' | 'year' | 'multi-year';
    datepickerTogglePosition: 'suffix' | 'prefix';
    touchUi?: boolean;
  }): BaseFormField {
    set(this.fieldConfig, 'props.datepickerOptions', datepickerOptions);
    return this;
  }

  /** radio-button - select - multi-select - checkbox - multi-checkboxes **/
  options(options: any[] | Observable<any[]>): BaseFormField {
    set(this.fieldConfig, 'props.options', options);
    return this;
  }

  labelProp(labelProp: string | Observable<string> | Function): BaseFormField {
    set(this.fieldConfig, 'props.labelProp', labelProp);
    return this;
  }

  valueProp(valueProp: string | ((params: any) => string)): BaseFormField {
    set(this.fieldConfig, 'props.valueProp', valueProp);
    return this;
  }

  /*** Repeat Section ***/
  addSectionText(addSectionText: string): BaseFormField {
    set(this.fieldConfig, 'props.addSectionText', addSectionText);
    return this;
  }

  removeSectionText(removeSectionText: string): BaseFormField {
    set(this.fieldConfig, 'props.removeSectionText', removeSectionText);
    return this;
  }


  sectionTitlePath(sectionTitlePath: string): BaseFormField {
    set(this.fieldConfig, 'props.sectionTitlePath', sectionTitlePath);
    return this;
  }

  fields(fields: FormlyFieldConfig[]) {
    set(this.fieldConfig, 'fieldArray.fieldGroup', fields);
    return this;
  }

  /*** Stepper ***/
  orientation(orientation: 'horizontal' | 'vertical') {
    set(this.fieldConfig, 'props.orientation', orientation);
    return this;
  }

  headerPosition(headerPosition: 'top' | 'bottom') {
    set(this.fieldConfig, 'props.headerPosition', headerPosition);
    return this;
  }

  animationDuration(animationDuration: number = 200) {
    set(this.fieldConfig, 'props.animationDuration', animationDuration);
    return this;
  }

  disableRipple(disableRipple: boolean = true) {
    set(this.fieldConfig, 'props.disableRipple', disableRipple);
    return this;
  }

  isLinear(isLinear: boolean = true) {
    set(this.fieldConfig, 'props.isLinear', isLinear);
    return this;
  }

  previousStepText(previousStepText: string): BaseFormField {
    set(this.fieldConfig, 'props.previousStepText', previousStepText);
    return this;
  }

  nextStepText(nextStepText: string): BaseFormField {
    set(this.fieldConfig, 'props.nextStepText', nextStepText);
    return this;
  }


  /*** Field Props ***/
  pattern(pattern: string | RegExp): BaseFormField {
    set(this.fieldConfig, 'props.pattern', pattern);
    return this;
  }


  /** All Types **/
  onFocus(focus: FormlyAttributeEvent): BaseFormField {
    set(this.fieldConfig, 'props.focus', focus);
    return this;
  }

  onBlur(blur: FormlyAttributeEvent): BaseFormField {
    set(this.fieldConfig, 'props.blur', blur);
    return this;
  }

  onKeyup(keyup: FormlyAttributeEvent): BaseFormField {
    set(this.fieldConfig, 'props.keyup', keyup);
    return this;
  }

  onKeydown(keydown: FormlyAttributeEvent): BaseFormField {
    set(this.fieldConfig, 'props.keydown', keydown);
    return this;
  }

  onClick(click: FormlyAttributeEvent): BaseFormField {
    set(this.fieldConfig, 'props.click', click);
    return this;
  }

  onChange(change: FormlyAttributeEvent): BaseFormField {
    set(this.fieldConfig, 'props.change', change);
    return this;
  }

  onKeypress(keypress: FormlyAttributeEvent): BaseFormField {
    set(this.fieldConfig, 'props.keypress', keypress);
    return this;
  }


  expProp(expProp: {
    [property: string]: string | ((model: any, formState: any, field?: FormlyFieldConfig) => any) | Observable<any>
  }): BaseFormField {
    set(this.fieldConfig, 'expressionProperties', expProp);
    return this;
  }

  dragList(value: any[] | Observable<any[]>) {
    set(this.fieldConfig, 'props.dragList', value);
    return this;
  }

  dropList(value: any) {
    set(this.fieldConfig, 'props.dropList', value);
    return this;
  }

  dragLabel(value: string) {
    set(this.fieldConfig, 'props.dragLabel', value);
    return this;
  }

  dropLabel(value: string) {
    set(this.fieldConfig, 'props.dropLabel', value);
    return this;
  }

  // tree field

  treeConfig(config: TreeDefinition<any>) {
    set(this.fieldConfig, 'props.treeConfig', config);
    return this;
  }

  isCheckedKey(key: string) {
    set(this.fieldConfig, 'props.isCheckedKey', key);
    return this;
  }

  childrenKey(key: string) {
    set(this.fieldConfig, 'props.childrenKey', key);
    return this;
  }

  hasChildrenKey(key: string) {
    set(this.fieldConfig, 'props.hasChildrenKey', key);
    return this;
  }

  isMultiple(value: boolean) {
    set(this.fieldConfig, 'props.isMultiple', value);
    return this;
  }

  isDynamic(value: boolean = true) {
    set(this.fieldConfig, 'props.isDynamic', value);
    return this;
  }

  /** Return Field Config **/
  value(): FormlyFieldConfig {
    return this.fieldConfig;
  }

  private setTranslate(propertyName: string, param: any): BaseFormField {
    const expressions = get(this.fieldConfig, 'expressions') || {};
    expressions[`props.${propertyName}`] = this.#translateService.stream(param) || param;
    set(this.fieldConfig, 'expressions', expressions);
    return this;
  }
}
