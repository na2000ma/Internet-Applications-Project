import {BaseFormDef} from "@organizo/forms/models/base-form-def";
import {FieldBuilder} from "@organizo/forms/form-builders/field-builder";
import {Observable} from "rxjs";
import {inject} from "@organizo/injector/app-injector";
import {Store} from "@ngxs/store";
import {SecurityClassState} from "@app/pages/security-template/store/class-security.state";
import {get} from "lodash-es";

export class FeaturesForm extends BaseFormDef {

  store = inject(Store);
  previousValue: any = {};

  constructor(features$: Observable<Array<any>>) {
    super();
    this.fields = [
      FieldBuilder
        .multiCheckbox()
        .key('features')
        .label('securityTemplate.features')
        .labelProp('displayName')
        .valueProp('objectId')
        .options(features$)
        .onInit(field => {
          field.formControl.valueChanges.subscribe(async (data) => {
            if (data) {
              // Reset previous value if moved from group to user.
              this.subs.add(
                this.store.select(SecurityClassState.IsMovedFromUserToGroupOrViceVersa).subscribe((value) => this.previousValue = value ? {} : {...this.previousValue})
              )

              // Identify the clicked option by comparing previous and current values
              const clickedOption = this.getClickedOption(this.previousValue, data);

              const features = this.store.selectSnapshot(SecurityClassState.features);
              if (features) {
                // Find Full Control Feature
                const fullControlFeature = features.find(feature => get(feature, 'displayName') === 'Full Control');

                // Find Modify / Create Instance / Fill In Folder / Delete Feature
                const secondLevelFeatures = ['Modify', 'Create Instance', 'Fill In Folder', 'Delete']
                const secondLevelFeature = features.find(feature => get(feature, 'objectId') === clickedOption && secondLevelFeatures.includes(get(feature, 'displayName')));

                // Find View Feature
                const viewFeature = features.find(feature => get(feature, 'displayName') === 'View');

                if (get(secondLevelFeature, 'objectId') === clickedOption) {
                  let checkedItems = {};
                  if (get(data, get(secondLevelFeature, 'objectId')) === true) {
                    // Check clickedOption with view feature
                    checkedItems = {
                      [clickedOption]: true,
                      [get(fullControlFeature, 'objectId')]: false,
                      [get(viewFeature, 'objectId')]: true
                    };
                  }
                  // Set the new value and prevent further value change events
                  field.formControl.setValue(checkedItems, {emitEvent: false});
                }

                if (get(viewFeature, 'objectId') === clickedOption) {
                  let checkedItems = {};
                  if (get(data, get(viewFeature, 'objectId')) === true) {
                    // Check only the view feature
                    checkedItems = {
                      [get(viewFeature, 'objectId')]: true
                    };
                  }

                  // Set the new value and prevent further value change events
                  field.formControl.setValue(checkedItems, {emitEvent: false});
                }

                if (get(fullControlFeature, 'objectId') === clickedOption) {
                  let checkedAll = {};
                  if (get(data, get(fullControlFeature, 'objectId')) === true) {
                    // Check all options
                    features.forEach(feature => {
                      checkedAll = {
                        ...checkedAll,
                        [get(feature, 'objectId')]: true
                      };
                    });
                  }
                  // Set the new value and prevent further value change events
                  field.formControl.setValue(checkedAll, {emitEvent: false});
                }
              }

              // Update previousValue after handling the current value
              this.previousValue = {...field.formControl.value};
            }
          });
        })
        .onDestroy(() => this.subs.unsubscribe)
        .value(),
    ]
  }

  private getClickedOption(previousValue: any, currentValue: any): string | null {
    for (const key in currentValue) {
      if (this.isChecked(currentValue, previousValue, key)) {
        return key;
      }
    }
    return null;
  }

  private isChecked(currentValue: any, previousValue: any, key: string) {
    return (
      (currentValue[key] !== previousValue[key] && (previousValue[key] !== undefined || Object.keys(previousValue).length === 0)) ||
      (!previousValue.hasOwnProperty(key))
    )
  }


}
