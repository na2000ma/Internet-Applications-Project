import {Component, OnInit, Optional} from '@angular/core';
import {Store} from '@ngxs/store';
import {MatDialog} from '@angular/material/dialog';
import {combineLatest, map, Observable, of, switchMap, take} from "rxjs";
import {get, set} from "lodash-es";
import {UnsubscribeComponent} from "@shared/components/unsubscribe/unsubscribe.component";
import {
  GetFeaturesTypesAction,
  GetGroupsSecurityTemplateAction,
  GetUsersSecurityTemplateAction,
  SetClassSecurityTemplateAction,
  SetDefaultSecurityTemplateDataSource,
  SetSecurityTemplateDataSource
} from '@app/pages/security-template/store/class-security.action';
import {SecurityClassState} from '@app/pages/security-template/store/class-security.state';
import {
  AddEditSecurityTemplateComponent
} from '@app/pages/security-template/components/add-edit-security-template/add-edit-security-template.component';
import {ActivatedRoute} from "@angular/router";
import {SecurityTemplateClassGrid} from '../../grids/security-template-class.grid';
import {GridsModule} from "@organizo/dx-grid/grids.module";
import {SharedModule} from "@shared/shared.module";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'organizo-security-template-class',
  templateUrl: './security-template-class.component.html',
  styleUrl: './security-template-class.component.scss',
  standalone: true,
  imports: [
    GridsModule,
    SharedModule,
    MatIcon,
    MatButton
  ]
})
export class SecurityTemplateClassComponent extends UnsubscribeComponent implements OnInit {

  gridDef: SecurityTemplateClassGrid = new SecurityTemplateClassGrid([]);
  classSecurityTemplate$: Observable<any>;
  classSecurityTemplate: any[];


  constructor(
    @Optional() private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private store: Store) {
    super();
  }


  ngOnInit(): void {
    this.getAllAPIs();
    this.setDataToDefault();
    this.initializeSecurityTemplateObservable();
  }

  addSecurityTemplate() {
    this.dialog.open(AddEditSecurityTemplateComponent, {
      data: {
        data: this.classSecurityTemplate,
        mode: this.activatedRoute.snapshot.queryParams['mode']
      },
      width: '1000px',
      height: 'fit-content',
      enterAnimationDuration: '0.4s',
      exitAnimationDuration: '200ms',
      direction: 'ltr',
    })
  }

  private initializeSecurityTemplateObservable() {
    this.subscriptions.add(
      this.activatedRoute.queryParams.pipe(
        map(params => get(params, 'mode')),
        switchMap(mode => {
          if (mode) {
            let securityTemplate$: any = of([]);

            if (mode === 'securityTemplate') {
              securityTemplate$ = this.store.select(SecurityClassState.classSecurityTemplate).pipe(
                map(item => get(item, 'securityTemplateDecrypted.securityTemplate') || get(item, 'defaultSecurityTemplateDecrypted.securityTemplate'))
              );
            } else if (mode === 'defaultSecurityTemplate') {
              securityTemplate$ = this.store.select(SecurityClassState.defaultSecurityTemplate).pipe(
                map(item => get(item, 'defaultSecurityTemplateDecrypted.securityTemplate'))
              );
            }
            return securityTemplate$;
          }
          return [];
        })
      ).subscribe(data => {
        this.classSecurityTemplate$ = of(data);
        this.customizeDataSource();
      })
    );
  }

  private customizeDataSource() {
    // Combine observables for users and groups
    const users$ = this.store.select(SecurityClassState.users).pipe(
      take(1)
    );

    const groups$ = this.store.select(SecurityClassState.groups).pipe(
      take(1)
    );

    this.subscriptions.add(
      combineLatest([this.classSecurityTemplate$, users$, groups$]).pipe(
        map(([data, users, groups]) => {
          if (!data) {
            this.gridDef = new SecurityTemplateClassGrid([]);
            this.classSecurityTemplate = [];
            return;
          }

          this.classSecurityTemplate = [...data];

          if (this.classSecurityTemplate.length === 0) {
            this.store.dispatch(new SetClassSecurityTemplateAction([]));
            this.gridDef = new SecurityTemplateClassGrid([]);
            return;
          }

          // Process new data
          let newData = data.map((item: any) => {
            const adObjectId = get(item, 'adObjectId');
            const adObjectType = get(item, 'adObjectType');

            if (adObjectType === 'user') {
              if (get(item, 'id') === null && this.activatedRoute.snapshot.queryParams['mode'] === 'defaultSecurityTemplate') {
                set(item, 'name', 'creator');
              } else {
                const userinfo = users.find(user => get(user, 'sid') === adObjectId);
                set(item, 'name', get(userinfo, 'loginName') || 'was-deleted');
              }
            } else {
              const groupInfo = groups.find(group => get(group, 'sid') === adObjectId);
              set(item, 'name', get(groupInfo, 'name') || 'was-deleted');
            }

            return item;
          });

          newData = newData.map((item: any) => {
            if (!get(item, 'adObjectId')) {
              return {...item, name: 'creator'};
            }
            return item;
          });

          newData = this.deleteUsersGroupsWhoWasDeleted(newData, 'name', 'was-deleted');
          this.gridDef = new SecurityTemplateClassGrid(newData);
        })
      ).subscribe()
    );
  }


  private getAllAPIs = () => {
    this.store.dispatch(new GetFeaturesTypesAction());
    this.store.dispatch(new GetUsersSecurityTemplateAction())
    this.store.dispatch(new GetGroupsSecurityTemplateAction())
  }

  private setDataToDefault = () => {
    this.store.dispatch(new SetSecurityTemplateDataSource([]));
    this.store.dispatch(new SetDefaultSecurityTemplateDataSource([]));
  }

  private deleteUsersGroupsWhoWasDeleted(arr: any[], key: any, value: any): any[] {
    return arr.filter(item => get(item, key) !== value);
  }
}
