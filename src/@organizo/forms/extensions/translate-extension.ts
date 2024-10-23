import {FormlyFieldConfig} from "@ngx-formly/core";
import {TranslateService} from "@ngx-translate/core";
import {get} from "lodash-es";
import {inject} from "@organizo/injector/app-injector";

const translatedProps: string[] = ['props.label', 'props.placeholder'];

export function translateExtension(field: FormlyFieldConfig) {
  if (!field.expressions) field.expressions = {};
  for (const translatedProp of translatedProps) {
    const translatedPropVal = get(field, translatedProp);
    if (!translatedPropVal) continue;
    field.expressions[translatedProp] = inject(TranslateService).stream(translatedPropVal || '');
  }
}
