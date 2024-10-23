import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AppHttpResponse} from '@organizo/interceptor/auth/app-http-response';
import {asapScheduler, tap} from 'rxjs';
import {ShowFailedToast} from '@app/store/app.action';
import {
  AddDefaultInstanceSecurityTemplate,
  AddSecurityTemplateAction,
  GetAllFeaturesAction,
  GetClassSecurityTemplateByIdAction,
  GetDefaultInstanceSecurityTemplateById,
  GetFeaturesTypesAction,
  GetGroupsSecurityTemplateAction,
  GetUsersSecurityTemplateAction,
  SecurityIdAddedAction,
  SetAddedDefaultSecurityId,
  SetClassSecurityTemplateAction,
  SetDefaultInstanceSecurityIdAction,
  SetDefaultInstanceSecurityTemplate,
  SetDefaultSecurityTemplateDataSource,
  SetFeaturesTypesAction,
  SetIsMovedFromUserToGroupOrViceVersaAction,
  SetSecurityTemplateDataSource,
  SetUsersGroupsFeaturesAction,
  UpdateSecurityByEntityAction
} from './class-security.action';
import {ClassSecurityService} from '../services/class-security.service';
import {get} from 'lodash-es';
import {GetDocumentsActionByContainerId} from "@app/pages/folder-structure/store/documents/documents.actions";
import {ActivatedRoute} from "@angular/router";

export class SecurityClassStateModel {
  classSecurityTemplate: any[]
  users: any[]
  groups: any[]
  features: any[]
  featuresTypes: any[]
  userGroupFeature_addSecurity: any[]
  defaultSecurityTemplate: any[]
  addedDefaultSecurityTemplateId: any[]
  securityIdAdded: any;
  securityTemplateDataSource: any[];
  defaultSecurityTemplateDataSource: any[];
  IsMovedFromUserToGroupOrViceVersa: boolean;
  defaultInstanceSecurityId: number;
}

const defaults = {
  classSecurityTemplate: [],
  users: [],
  groups: [],
  featuresTypes: [],
  userGroupFeature_addSecurity: [],
  defaultSecurityTemplate: [],
  addedDefaultSecurityTemplateId: null,
  securityIdAdded: null,
  securityTemplateDataSource: null,
  defaultSecurityTemplateDataSource: null,
  IsMovedFromUserToGroupOrViceVersa: null,
  defaultInstanceSecurityId: null
};

@State<SecurityClassStateModel>({
  name: 'securityClass',
  ...defaults
})
@Injectable()
export class SecurityClassState {

  constructor(
    private service: ClassSecurityService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  @Selector()
  static classSecurityTemplate(state: SecurityClassState) {
    return get(state, 'classSecurityTemplate') || []
  }

  @Selector()
  static users(state: SecurityClassState) {
    return get(state, 'users') || []
  }

  @Selector()
  static groups(state: SecurityClassState) {
    return get(state, 'groups') || []
  }

  @Selector()
  static features(state: SecurityClassState) {
    return get(state, 'features') || []
  }

  @Selector()
  static featuresTypes(state: SecurityClassState) {
    return get(state, 'featuresTypes') || []
  }

  @Selector()
  static userGroupFeature_addSecurity(state: SecurityClassState) {
    return get(state, 'userGroupFeature_addSecurity') || []
  }

  @Selector()
  static defaultSecurityTemplate(state: SecurityClassState) {
    return get(state, 'defaultSecurityTemplate') || []
  }

  @Selector()
  static securityIdAdded(state: SecurityClassState) {
    return get(state, 'securityIdAdded') || null
  }

  @Selector()
  static addedDefaultSecurityTemplateId(state: SecurityClassState) {
    return get(state, 'addedDefaultSecurityTemplateId') || null
  }

  @Selector()
  static securityTemplateDataSource(state: SecurityClassState) {
    return get(state, 'securityTemplateDataSource') || null
  }

  @Selector()
  static defaultSecurityTemplateDataSource(state: SecurityClassState) {
    return get(state, 'defaultSecurityTemplateDataSource') || null
  }

  @Selector()
  static defaultInstanceSecurityId(state: SecurityClassState) {
    return get(state, 'defaultInstanceSecurityId') || null
  }

  @Selector()
  static IsMovedFromUserToGroupOrViceVersa(state: SecurityClassState) {
    return get(state, 'IsMovedFromUserToGroupOrViceVersa') || false
  }

  @Action(GetClassSecurityTemplateByIdAction)
  getClassSecurityTemplateByIdAction({dispatch}: StateContext<SecurityClassStateModel>, {
    classSecurityId,
    forDefault
  }: GetClassSecurityTemplateByIdAction) {
    return this.service.getClassSecurityTemplateById(classSecurityId, forDefault).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetClassSecurityTemplateAction(data))
            dispatch(new SetSecurityTemplateDataSource(data))
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(GetUsersSecurityTemplateAction)
  getUsersSecurityTemplateAction({dispatch, patchState}: StateContext<SecurityClassStateModel>) {
    return this.service.getAllUsersSecurityTemplate().pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            patchState({users: data})
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(GetGroupsSecurityTemplateAction)
  getGroupsSecurityTemplateAction({dispatch, patchState}: StateContext<SecurityClassStateModel>) {
    return this.service.getAllGroupsSecurityTemplate().pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            patchState({groups: data})
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(GetAllFeaturesAction)
  getAllFeatures({
                   dispatch,
                   patchState
                 }: StateContext<SecurityClassStateModel>, {payload}: GetAllFeaturesAction) {
    return this.service.getAllFeatures(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any[]) => {
            patchState({features: data})
            // dispatch(new ShowSuccessToast());
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(AddSecurityTemplateAction)
  addSecurityTemplate({dispatch}: StateContext<SecurityClassStateModel>, {payload}: AddSecurityTemplateAction) {
    return this.service.addSecurityTemplate(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SecurityIdAddedAction(get(data, 'objectId')))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetUsersGroupsFeaturesAction)
  setUsersGroupsFeatures({patchState}: StateContext<SecurityClassStateModel>, {payload}: SetUsersGroupsFeaturesAction) {
    patchState({userGroupFeature_addSecurity: payload})
  }

  @Action(GetFeaturesTypesAction)
  getFeaturesTypesAction({dispatch}: StateContext<SecurityClassStateModel>) {
    return this.service.getFeaturesTypes().pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetFeaturesTypesAction(data))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetFeaturesTypesAction)
  setFeaturesTypesAction({patchState}: StateContext<SecurityClassStateModel>, {payload}: SetFeaturesTypesAction) {
    patchState({featuresTypes: payload})
  }

  @Action(GetDefaultInstanceSecurityTemplateById)
  GetDefaultInstanceSecurityTemplateById(
    {dispatch}: StateContext<SecurityClassStateModel>,
    {classSecurityId}: GetDefaultInstanceSecurityTemplateById
  ) {
    return this.service.getDefaultInstanceSecurityTemplate(classSecurityId).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetDefaultInstanceSecurityTemplate(data))
            dispatch(new SetDefaultSecurityTemplateDataSource(data))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SetDefaultInstanceSecurityTemplate)
  setDefaultInstanceSecurityTemplate({patchState}: StateContext<SecurityClassStateModel>, {payload}: SetDefaultInstanceSecurityTemplate) {
    patchState({defaultSecurityTemplate: payload})
  }

  @Action(AddDefaultInstanceSecurityTemplate)
  addDefaultInstanceSecurityTemplate(
    {dispatch}: StateContext<SecurityClassStateModel>,
    {payload}: AddDefaultInstanceSecurityTemplate
  ) {
    return this.service.addDefaultInstanceSecurityTemplate(payload).pipe(
      tap((response: AppHttpResponse) => {
        response.handle((data: any) => {
            dispatch(new SetAddedDefaultSecurityId(get(data, 'objectId')))
          }, () => {
            asapScheduler.schedule(() => dispatch(new ShowFailedToast()))
          }
        )
      })
    );
  }

  @Action(SecurityIdAddedAction)
  securityIdAddedAction({patchState}: StateContext<SecurityClassStateModel>,
                        {payload}: SecurityIdAddedAction) {
    patchState({
      securityIdAdded: payload
    })
  }

  @Action(SetAddedDefaultSecurityId)
  setAddedDefaultSecurityId({patchState}: StateContext<SecurityClassStateModel>, {defaultSecurityId}: SetAddedDefaultSecurityId) {
    patchState({addedDefaultSecurityTemplateId: defaultSecurityId})
  }

  @Action(SetClassSecurityTemplateAction)
  setClassSecurityTemplateAction({patchState}: StateContext<SecurityClassStateModel>, {payload}: SetClassSecurityTemplateAction) {
    patchState({classSecurityTemplate: payload})
  }

  @Action(SetSecurityTemplateDataSource)
  setSecurityTemplateDataSource({patchState}: StateContext<SecurityClassStateModel>, {payload}: SetSecurityTemplateDataSource) {
    patchState({securityTemplateDataSource: payload})
  }

  @Action(SetDefaultSecurityTemplateDataSource)
  setDefaultSecurityTemplateDataSource({patchState}: StateContext<SecurityClassStateModel>, {payload}: SetDefaultSecurityTemplateDataSource) {
    patchState({defaultSecurityTemplateDataSource: payload})
  }

  @Action(SetDefaultInstanceSecurityIdAction)
  setDefaultInstanceSecurityIdAction({patchState}: StateContext<SecurityClassStateModel>, {id}: SetDefaultInstanceSecurityIdAction) {
    patchState({defaultInstanceSecurityId: id})
  }

  @Action(SetIsMovedFromUserToGroupOrViceVersaAction)
  setIsInViewUserAction({patchState}: StateContext<SecurityClassStateModel>, {status}: SetIsMovedFromUserToGroupOrViceVersaAction) {
    patchState({IsMovedFromUserToGroupOrViceVersa: status})
  }

  @Action(UpdateSecurityByEntityAction)
  updateSecurityByEntityAction(
    {dispatch, getState}: StateContext<SecurityClassStateModel>,
    {entity, payload}: UpdateSecurityByEntityAction) {
    return this.service.updateSecurity(entity, payload).pipe(
      tap(
        (response: AppHttpResponse) => {
          response.handle(
            () => {
              if (entity === 'document') {
                dispatch([
                  new GetDocumentsActionByContainerId(this.activatedRoute.snapshot.queryParams['containerId']),
                  new GetClassSecurityTemplateByIdAction(getState().securityIdAdded)
                ])
              }
            },
            () => {
              dispatch(new ShowFailedToast())
            }
          )
        }
      )
    )
  }

}



