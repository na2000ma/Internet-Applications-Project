import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngxs/store';
import {
  AddDefaultInstanceSecurityTemplate,
  AddSecurityTemplateAction,
  GetAllFeaturesAction,
  GetClassSecurityTemplateByIdAction,
  GetDefaultInstanceSecurityTemplateById,
  GetGroupsSecurityTemplateAction,
  GetUsersSecurityTemplateAction,
  SetIsMovedFromUserToGroupOrViceVersaAction,
  SetUsersGroupsFeaturesAction, UpdateSecurityByEntityAction
} from '../../store/class-security.action';
import {SecurityClassState} from '../../store/class-security.state';
import {UnsubscribeComponent} from '@shared/components/unsubscribe/unsubscribe.component';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatIcon} from '@angular/material/icon';
import {AsyncPipe, DOCUMENT} from '@angular/common';
import {UsersPrivilegesForm} from '../../forms/users-privileges.form';
import {AppFormsModule} from '@organizo/forms/app-forms.module';
import {FeaturesForm} from '../../forms/features.form';
import {FeaturesUsersGroupsGrid} from '../../grids/features-users-groups.grid';
import {organizoAnimations} from '@organizo/animations/organizo.animations';
import {lastValueFrom, map, Observable, of, tap} from 'rxjs';
import {get, isNumber, omit, set} from 'lodash-es';
import {GroupsPrivilegesForm} from '../../forms/groups-privileges.form';
import {GridsModule} from "@organizo/dx-grid/grids.module";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'organizo-add-edit-security-template',
  templateUrl: './add-edit-security-template.component.html',
  styleUrl: './add-edit-security-template.component.scss',
  animations: organizoAnimations,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIcon,
    MatRadioGroup,
    MatRadioButton,
    AppFormsModule,
    GridsModule,
    AsyncPipe
  ]
})
export class AddEditSecurityTemplateComponent extends UnsubscribeComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('MatRadioButton') MatRadioButton: MatRadioButton;

  usersPrivilegesForm: UsersPrivilegesForm;
  groupsPrivilegesForm: GroupsPrivilegesForm;
  featuresForm: FeaturesForm;

  gridDef: FeaturesUsersGroupsGrid = new FeaturesUsersGroupsGrid();

  usersGroupsFeatures: any[] = [];
  features: Array<any>;
  securityFeatureType: any;

  isInSecurityTemplate: boolean = true;
  viewUsers = true


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddEditSecurityTemplateComponent>,
    private store: Store,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();

    this.resetGridDataSource();
    this.getAllFeatures();
    this.getGroupsAndUsers();
    this.setMode();
    this.initializeGrids();
    this.setFeatures();

  }

  get entity() {
    return this.activatedRoute.snapshot.queryParams['classId'] ?
      'class-definition' :
      (this.activatedRoute.snapshot.queryParams['documentId'] ? 'document' : 'container')
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.MatRadioButton.checked = true
  }

  closeDialog() {
    this.dialogRef.close()
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.resetGridDataSource();
  }

  viewChange(att: boolean) {
    if (!this.MatRadioButton.checked) {
      this.MatRadioButton.checked = true;
    }
    this.store.dispatch(new SetIsMovedFromUserToGroupOrViceVersaAction(this.viewUsers !== att));
    this.viewUsers = att;
  }

  mappingUsersGroupsWithFeatures(dataGrid: any[] = []): any[] {
    return dataGrid.map((itemGrid: any) => ({
      id: get(itemGrid, 'id'),
      adObjectId: get(itemGrid, 'adObjectId'),
      adObjectType: get(itemGrid, 'adObjectType'),
      features: get(itemGrid, 'features'),
      name: this.findNameInGroupsAndUsers(get(itemGrid, 'adObjectId'))
    }));
  }

  findNameInGroupsAndUsers(id: any): string {
    if (id === null) {
      return 'creator';
    }

    const users = this.store.selectSnapshot(SecurityClassState.users);
    const groups = this.store.selectSnapshot(SecurityClassState.groups);

    const user = users.find(item => get(item, 'sid') === id);
    if (user) {
      return get(user, 'loginName', '');
    }

    const group = groups.find(item => get(item, 'sid') === id);
    return get(group, 'name', '');
  }

  resetForm() {
    this.usersPrivilegesForm.group.reset()
    this.groupsPrivilegesForm.group.reset()
    this.featuresForm.group.reset()
    this.resetUsersByMode();
    this.resetGroups();
    this.document.getElementById('grid').scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  submit() {
    const {users, groups, features} = get(this.usersPrivilegesForm, 'group.value');

    if (features && (users || groups)) {
      const targetType = this.viewUsers ? 'user' : 'group';
      const targetFeatures = this.viewUsers ? users : groups;

      this.addFeatures(targetFeatures, features, targetType);
    }

    this.resetForm();
  }

  addFeatures(userOrGroups: any, features: any, type: 'user' | 'group') {
    Object.keys(userOrGroups || {}).forEach(sIdValue => {
      if (userOrGroups[sIdValue] !== true) return;

      const foundUserOrGroup = this.usersGroupsFeatures.find(user => sIdValue === get(user, 'adObjectId'));

      if (foundUserOrGroup) {
        // Update existing user/group with new features
        const index = this.usersGroupsFeatures.findIndex(user => sIdValue === get(user, 'adObjectId'));
        this.usersGroupsFeatures[index].features = [
          ...this.usersGroupsFeatures[index].features,
          ...this.mappingFeatures(features, index)
        ];
      } else {
        // Add new user/group
        const entitySelector = type === 'user' ? SecurityClassState.users : SecurityClassState.groups;
        this.subscriptions.add(
          this.store.select(entitySelector).subscribe({
            next: (entities: any[]) => {
              const entity = entities.find(item => get(item, 'sid') === sIdValue);
              if (entity) {
                const newEntity = {
                  id: sIdValue === 'creator' ? null : get(entity, 'id'),
                  adObjectId: sIdValue === 'creator' ? null : sIdValue,
                  adObjectType: type,
                  features: this.mappingFeatures(features)
                };
                this.usersGroupsFeatures.push(newEntity);
              }
            }
          })
        );
      }
    });

    this.updateGridDataSource();
    this.usersGroupsFeatures = [];
  }

  mappingFeatures(features: any, indexUser?: number) {
    const arrayTemp: any[] = [];

    (Object.keys(features) || []).forEach(id => {
      if (features[id] !== true) return;

      if (isNumber(indexUser)) {
        const featureExists = this.usersGroupsFeatures[indexUser].features.some(
          (item: any) => id === get(item, 'id')
        );
        if (!featureExists) {
          arrayTemp.push(this.findFeature(id, this.features));
        }
      } else {
        arrayTemp.push(this.findFeature(id, this.features));
      }
    });

    return this.filterFeatures(arrayTemp);
  }

  async submitToServer() {
    let userSId = get(JSON.parse(localStorage.getItem('authUser')), 'sid')
    let userId = get(JSON.parse(localStorage.getItem('authUser')), 'id')
    this.subscriptions.add(
      this.store.select(SecurityClassState.userGroupFeature_addSecurity).subscribe(
        async (data: any[]) => {
          let payload: any = {
            creatorId: userId,
            creatorSID: userSId,
            defaultSecurityTemplateId: null,
            securityTemplate: data.map(item => {
              item = omit(item, 'name')
              if (get(item, 'id') === null) {
                return {
                  ...item,
                  id: get(JSON.parse(localStorage.getItem('authUser')), 'id'),
                  adObjectId: get(JSON.parse(localStorage.getItem('authUser')), 'sid')
                }
              }
              return item
            })
          }
          if (get(this.activatedRoute.snapshot.queryParams, 'mode') === 'securityTemplate') {
            await lastValueFrom(this.store.dispatch(new AddSecurityTemplateAction(payload)))
            this.store.select(SecurityClassState.securityIdAdded).subscribe(
              (id: any) => {
                if (id) {
                  if (get(this.getPayloadForUpdateSecurity('security', id), 'objectId')) {
                    let payload = this.getPayloadForUpdateSecurity('security', id)
                    this.store.dispatch(new UpdateSecurityByEntityAction(this.entity, payload))
                  } else {
                    this.store.dispatch(new GetClassSecurityTemplateByIdAction(id))
                  }
                }
              }
            )
          } else {
            payload = {"securityTemplate": get(payload, 'securityTemplate')}
            await lastValueFrom(this.store.dispatch(new AddDefaultInstanceSecurityTemplate(payload)))
            this.store.select(SecurityClassState.addedDefaultSecurityTemplateId).subscribe(
              (id: any) => {
                if (id) {
                  if (get(this.getPayloadForUpdateSecurity('default', id), 'objectId')) {
                    let payload = this.getPayloadForUpdateSecurity('default', id)
                    this.store.dispatch(new UpdateSecurityByEntityAction(this.entity, payload))
                  } else {
                    this.store.dispatch(new GetDefaultInstanceSecurityTemplateById(id));
                  }
                }
              }
            )
          }
        }
      )
    )
    this.closeDialog()
  }

  close() {
    this.dialogRef.close()
  }

  private deleteUsersGroupsWhoWasDeleted(arr: any[], key: any, value: any): any[] {
    return arr.filter(item => get(item, key) !== value);
  }

  private mergeAndRemoveDuplicates(data: any[]): any[] {
    const mergedData: { [key: string]: any } = {};

    data.forEach(item => {
      const {adObjectId, features} = item;
      if (!mergedData[adObjectId]) {
        // If the adObjectId does not exist, initialize it with the current item
        mergedData[adObjectId] = {...item};
      } else {
        // Merge features, avoiding duplicates
        mergedData[adObjectId].features = [
          ...mergedData[adObjectId].features,
          ...features.filter((feature: any) =>
            !mergedData[adObjectId].features.some((existingFeature: any) => existingFeature.name === feature.name)
          )
        ];
      }
    });

    return Object.values(mergedData);
  }

  private updateGridDataSource() {
    let dataSource: any[] = [];

    this.subscriptions.add(
      (this.gridDef.dataSource$ || of([])).subscribe((data: any[]) => {
        dataSource.push(...data);
      })
    );

    const updatedFeatures = this.mappingUsersGroupsWithFeatures(this.usersGroupsFeatures);
    const newDataSource = this.mergeAndRemoveDuplicates([...dataSource, ...updatedFeatures]);
    this.store.dispatch(new SetUsersGroupsFeaturesAction(newDataSource));
    this.gridDef.dataSource$ = of(newDataSource);
  }

  private setFeatures = () => {
    this.subscriptions.add(
      this.store.select(SecurityClassState.features).subscribe(features => this.features = features)
    )
  }

  private resetGridDataSource = () => {
    this.gridDef.dataSource$ = of([]);
  }

  private setMode = () => {
    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe(params => {
        if (get(params, 'mode') === 'securityTemplate') {
          this.isInSecurityTemplate = true;
        }
        if (get(params, 'mode') === 'defaultSecurityTemplate') {
          this.isInSecurityTemplate = false;
        }
      })
    )
  }

  private filterFeatures = (allFeatures: any[]) => {
    const hasFullControl = allFeatures.some(feature => feature.displayName === 'Full Control');
    if (hasFullControl) {
      return allFeatures.filter(feature => feature.displayName === 'Full Control');
    } else {
      // Handle 'View' based on other conditions
      const allowedDisplayNames = ['Modify', 'Create Instance', 'Delete', 'Fill In Folder'];
      const shouldRemoveView = allFeatures.some(feature => allowedDisplayNames.includes(feature.displayName));
      if (shouldRemoveView) {
        return allFeatures.filter(feature => feature.displayName !== 'View');
      }
    }
    return allFeatures;
  }

  private findFeature(id: any, allFeatures: any[]) {
    const feature = allFeatures.find(item => get(item, 'objectId') === id);

    if (!feature) {
      return null;
    }

    return {
      id: get(feature, 'objectId'),
      name: get(feature, 'name'),
      displayName: get(feature, 'displayName'),
      priority: get(feature, 'priority'),
      weight: get(feature, 'weight'),
      securityFeatureType: get(feature, 'securityFeatureType')
    };
  }

  private initializeGrids = () => {
    let users = this.getUsersByMode(this.store.select(SecurityClassState.users));

    this.usersPrivilegesForm = new UsersPrivilegesForm(users);
    this.groupsPrivilegesForm = new GroupsPrivilegesForm(this.store.select(SecurityClassState.groups));
    this.featuresForm = new FeaturesForm(this.store.select(SecurityClassState.features));
  }

  private resetGroups = () => {
    set(this.groupsPrivilegesForm.fields[1], 'props.options', this.store.select(SecurityClassState.groups))
  }

  private resetUsersByMode = () => {
    let users = this.getUsersByMode(this.store.select(SecurityClassState.users));
    set(this.usersPrivilegesForm.fields[1], 'props.options', users)
  }

  private getAllFeatures = () => {
    this.subscriptions.add(this.store.select(SecurityClassState.featuresTypes).subscribe(
      async (types: any[]) => {
        if (types.length > 0) {
          let securityFeatureType = get(this.activatedRoute.snapshot.queryParams, 'securityFeatureType');
          this.securityFeatureType = types.find(type => get(type, 'name') === securityFeatureType)
          await lastValueFrom(this.store.dispatch(new GetAllFeaturesAction({
              securityFeature: {securityFeatureType: get(this.securityFeatureType, 'name')}
            }
          )))
        }
      }
    ))
  }

  private getGroupsAndUsers = () => {
    if (this.data) {
      this.subscriptions.add(this.store.dispatch(new GetUsersSecurityTemplateAction()).subscribe({
        complete: () => {
          this.subscriptions.add(this.store.dispatch(new GetGroupsSecurityTemplateAction()).subscribe({
            complete: () => {
              this.setGridData();
            }
          }))
        }
      }))
    }
  }

  private setGridData = () => {
    this.gridDef.dataSource$ = of(
      this.deleteUsersGroupsWhoWasDeleted(this.mappingUsersGroupsWithFeatures(get(this.data, 'data')), 'name', '')
    )
  }

  private getUsersByMode = (users: Observable<any>) => {
    if (this.activatedRoute.snapshot.queryParams['mode'] !== 'securityTemplate') {
      const authUser = JSON.parse(localStorage.getItem('authUser'));
      return users.pipe(
        tap((data: any[]) => {
          if (!data.find(item => get(item, 'loginName') === 'creator')) {
            data.unshift({id: 'creator', sid: 'creator', loginName: 'creator'})
          }
        }),
        map(data => {
          return data.filter(item => get(item, 'id') != get(authUser, 'id'))
        })
      )
    } else {
      return this.store.select(SecurityClassState.users);
    }
  }

  private getPayloadForUpdateSecurity(mode: 'security' | 'default' = 'security', id: any) {
    const paramName = this.entity === 'class-definition' ? 'classId' : (this.entity === 'document' ? 'documentId' : 'containerId');
    return {
      objectId: this.activatedRoute.snapshot.queryParams[paramName],
      [mode === 'security' ? 'newSecurityTemplateId' : 'newDefaultInstanceSecurityId']: id
    }
  }
}
