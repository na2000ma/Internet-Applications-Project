import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {GroupsDriverApis} from "@app/pages/groups/drivers/groups-driver.api";

@Injectable({
  providedIn: 'root'
})
export class GroupsService {


  constructor(private httpClient:HttpClient) {
  }

  getAllGroups() {
    return this.httpClient.get(GroupsDriverApis.getAllGroups)
  }

  getAllUsers() {
    return this.httpClient.get(GroupsDriverApis.getAllUsers)
  }

  addGroup(payload: any) {
    return this.httpClient.post(GroupsDriverApis.addGroup, {...payload} );
  }

  showGroup(id: any) {
    return this.httpClient.get(GroupsDriverApis.showGroup(id));
  }

  joinGroup(id: any) {
    return this.httpClient.post(GroupsDriverApis.joinGroup(id), {});
  }

  getMyGroups() {
    return this.httpClient.get(GroupsDriverApis.getMyGroups)
  }

}
