import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SecurityTemplateDriverApis} from "@app/pages/security-template/driver/security-template.driver.apis";

@Injectable({
  providedIn: 'root'
})
export class ClassSecurityService {

  constructor(private httpClient: HttpClient) {
  }

  getClassSecurityTemplateById(securityId: any, forDefault: boolean = false) {
    return this.httpClient.get(SecurityTemplateDriverApis.classSecurity.getClassSecurityTemplate, {
      params: {objectId: securityId, forDefault: forDefault}
    });
  }

  getAllUsersSecurityTemplate() {
    return this.httpClient.get(SecurityTemplateDriverApis.classSecurity.getAllUsersSecurityTemplate);
  }

  getAllGroupsSecurityTemplate() {
    return this.httpClient.get(SecurityTemplateDriverApis.classSecurity.getAllGroupsSecurityTemplate);
  }

  getAllFeatures(payload: any) {
    return this.httpClient.post(SecurityTemplateDriverApis.classSecurity.getAllFeatures, payload);
  }

  getFeaturesTypes() {
    return this.httpClient.get(SecurityTemplateDriverApis.classSecurity.getFeaturesTypes);
  }

  addSecurityTemplate(payload: any) {
    let domain = {
      ...payload
    }
    return this.httpClient.post(SecurityTemplateDriverApis.classSecurity.addSecurityTemplate, {domain});
  }

  getDefaultInstanceSecurityTemplate(classId: any) {
    return this.httpClient.get(SecurityTemplateDriverApis.classSecurity.getDefaultInstanceSecurity, {
      params: classId ? {objectId: classId} : null
    });
  }


  addDefaultInstanceSecurityTemplate(payload: any) {
    let domain = {
      ...payload
    }
    return this.httpClient.post(SecurityTemplateDriverApis.classSecurity.addDefaultInstanceSecurityTemplate, {domain});
  }

  updateSecurity(entity: string, payload: any) {
    return this.httpClient.patch(SecurityTemplateDriverApis.classSecurity.updateSecurity(entity), {updateSecurityDomain: payload})
  }

}
