import {FormBuilder, FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {Subscription} from "rxjs";
import {inject} from "@organizo/injector/app-injector";


export class BaseFormDef {
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  options?: FormlyFormOptions = {};
  subs: Subscription = new Subscription();
  protected fb: FormBuilder = inject(FormBuilder);
  group: FormGroup = this.fb.group({});
}
