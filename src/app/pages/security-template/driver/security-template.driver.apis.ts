import {environment} from "@env/environment";

export const SecurityTemplateDriverApis = {
  classSecurity: {
    getClassSecurityTemplate: environment.securityTemplateURL + 'security/get-by-id',
    getAllUsersSecurityTemplate: environment.securityTemplateURL + 'user/get',
    getAllGroupsSecurityTemplate: environment.securityTemplateURL + 'group/get',
    getAllFeatures: environment.securityTemplateURL + 'features/get-all-or-by-type',
    getFeaturesTypes: environment.securityTemplateURL + 'features/get-features-types',
    addSecurityTemplate: environment.securityTemplateURL + 'security/add-new',
    getDefaultInstanceSecurity: environment.securityTemplateURL + 'default-security-template/get-by-id',
    addDefaultInstanceSecurityTemplate: environment.securityTemplateURL + 'default-security-template/add-new',
    updateSecurity: (entity: string) => environment.contentEngineURL + `${entity}/update-security`
  }
}
