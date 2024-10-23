import {FormlyFieldConfig} from '@ngx-formly/core';
import {WrapperTypes} from "@organizo/forms/types/wrapper-types";

export class ColumnConfig {
  labelClassName?: string;
  controlClassName?: string;
}

export class LayoutBuilder {
  static column(fields: FormlyFieldConfig[]) {
    return {
      wrappers: [WrapperTypes.Column],
      fieldGroup: fields
    };
  }

  static row(fields: FormlyFieldConfig[]): FormlyFieldConfig {
    return {
      wrappers: [WrapperTypes.Row],
      fieldGroup: fields,
    };
  }

  static panel(title: string, fields: FormlyFieldConfig[]): FormlyFieldConfig {
    return {
      wrappers: [WrapperTypes.Panel],
      props: {label: title || ' '},
      fieldGroup: fields
    };
  }


// // aggregates each two fields in a column wrapper
//   static column2(fields: FormlyFieldConfig[]) {
//     return chunk(fields, 2).map(i => ({
//       wrappers: [WrapperTypes.Column],
//       fieldGroup: i
//     }));
//   }
//
//   static col(fieldLayout: ColumnConfig, field) {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       (recipe.props as any).layout = fieldLayout;
//     });
//   }
//
//   static col2(field: FormlyFieldConfig): FormlyFieldConfig {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       recipe.className = 'col-sm-12 col-md-2';
//       (recipe.props as any).labelClassName = 'col-md-4 col-sm-12';
//       (recipe.props as any).controlClassName = 'col-md-8 col-sm-12';
//     });
//   }
//
//   static col3(field: FormlyFieldConfig): FormlyFieldConfig {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       recipe.className = 'col-sm-12 col-md-3';
//       (recipe.props as any).labelClassName = 'col-md-4 col-sm-12';
//       (recipe.props as any).controlClassName = 'col-md-8 col-sm-12';
//     });
//   }
//
//   static col4(field: FormlyFieldConfig): FormlyFieldConfig {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       recipe.className = 'col-sm-12 col-md-4';
//       (recipe.props as any).labelClassName = 'col-md-4 col-sm-12';
//       (recipe.props as any).controlClassName = 'col-md-8 col-sm-12';
//     });
//   }
//
//   static col5(field: FormlyFieldConfig): FormlyFieldConfig {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       recipe.className = 'col-sm-12 col-md-5';
//       (recipe.props as any).labelClassName = 'col-md-4 col-sm-12';
//       (recipe.props as any).controlClassName = 'col-md-8 col-sm-12';
//     });
//   }
//
//   static col6(field: FormlyFieldConfig): FormlyFieldConfig {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       recipe.className = 'col-sm-12 col-md-6';
//       (recipe.props as any).labelClassName = 'col-md-4 col-sm-12';
//       (recipe.props as any).controlClassName = 'col-md-8 col-sm-12';
//     });
//   }
//
//   static col7(field: FormlyFieldConfig): FormlyFieldConfig {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       recipe.className = 'col-sm-12 col-md-7';
//       (recipe.props as any).labelClassName = 'col-md-4 col-sm-12';
//       (recipe.props as any).controlClassName = 'col-md-8 col-sm-12';
//     });
//   }
//
//   static col8(field: FormlyFieldConfig): FormlyFieldConfig {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       recipe.className = 'col-sm-12 col-md-8';
//       (recipe.props as any).labelClassName = 'col-md-4 col-sm-12';
//       (recipe.props as any).controlClassName = 'col-md-8 col-sm-12';
//     });
//   }
//
//   static col9(field: FormlyFieldConfig): FormlyFieldConfig {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       recipe.className = 'col-sm-12 col-md-9';
//       (recipe.props as any).labelClassName = 'col-md-4 col-sm-12';
//       (recipe.props as any).controlClassName = 'col-md-8 col-sm-12';
//     });
//   }
//
//   static col10(field: FormlyFieldConfig): FormlyFieldConfig {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       recipe.className = 'col-sm-12 col-md-10';
//       (recipe.props as any).labelClassName = 'col-md-4 col-sm-12';
//       (recipe.props as any).controlClassName = 'col-md-8 col-sm-12';
//     });
//   }
//
//   static col11(field: FormlyFieldConfig): FormlyFieldConfig {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       recipe.className = 'col-sm-12 col-md-11';
//       (recipe.props as any).labelClassName = 'col-md-4 col-sm-12';
//       (recipe.props as any).controlClassName = 'col-md-8 col-sm-12';
//     });
//   }
//
//   static col12(field: FormlyFieldConfig): FormlyFieldConfig {
//     return produce(field, (recipe: Draft<FormlyFieldConfig>) => {
//       recipe.className = 'col-sm-12 col-md-12';
//       (recipe.props as any).labelClassName = 'col-md-2 col-sm-12';
//       (recipe.props as any).controlClassName = 'col-md-10 col-sm-12';
//     });
//   }
}
