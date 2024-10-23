import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseFieldComponent} from "@organizo/forms/components/fields/base-field.component";
import {isObservable, Subscription} from "rxjs";
import {get, omit} from "lodash-es";
import {SetDynamicTreeNodeIsCheckedByKeyAction} from "@app/pages/folder-structure/store/folders/folders.actions";
import {Store} from "@ngxs/store";

interface TreeFormFieldConfig {
  childrenKey: string
  hasChildrenKey: string
  isCheckedKey: string
}

@Component({
  selector: 'organizo-tree-formly-field',
  templateUrl: './tree-formly-field.component.html',
  styleUrl: './tree-formly-field.component.scss'
})
export class TreeFormlyFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy {
  subs = new Subscription();


  constructor(private store: Store) {
    super();
  }

  ngOnInit() {
    let dataSource = this.props?.treeConfig?.dataSource
    if (isObservable(dataSource)) {
      const keysConfig: TreeFormFieldConfig = {
        childrenKey: this.props?.childrenKey,
        hasChildrenKey: this.props?.hasChildrenKey,
        isCheckedKey: this.props?.isCheckedKey,
      }

      this.subs.add(
        dataSource.subscribe((value: any[]) => {
          if (value) {
            this.formControl.setValue(!!this.props?.isMultiple ? this.getCheckedOptions(value, keysConfig) : this.getCheckedOptions(value, keysConfig)[0])
          }
        })
      )
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

  private getCheckedOptions(dataSource: any[], config: TreeFormFieldConfig) {
    let isDynamic = this.props?.isDynamic || false;
    let checkedOptions: any[] = [];

    const collectCheckedOptions = (item: any) => {

      // Add check in form value
      if (this.formControl.value && !item.hasOwnProperty(config?.isCheckedKey)) {
        if (isDynamic) {
          const currentValue = this.formControl.value.slice();
          if (get(item, 'objectId') === currentValue) {
            this.store.dispatch(new SetDynamicTreeNodeIsCheckedByKeyAction(this.key + '', item, true))
          }
        } else {
          const currentValue = {...this.formControl.value};
          if (get(item, 'objectId') === get(currentValue, 'objectId')) {
            this.store.dispatch(new SetDynamicTreeNodeIsCheckedByKeyAction(this.key + '', item, true))
          }
        }
      }

      // If the current config item is checked, add its id to the list
      if (!!get(item, config.isCheckedKey)) {
        let newItem = {...omit(item, ['children', 'recordStatus', 'creationDate', 'creatorId', 'modifiedDate', 'modifierId'])}
        checkedOptions.push(isDynamic ? newItem?.objectId : {...newItem});
      }

      // Recursively collect from the children
      if (get(item, config.hasChildrenKey)) {
        if (!!get(item, config.childrenKey)) {
          get(item, config.childrenKey, []).forEach((child: any) => collectCheckedOptions(child));
        }
      }
    };

    // Iterate over the root array of config items
    dataSource.forEach((item: any) => collectCheckedOptions(item));

    return checkedOptions;
  }


}
