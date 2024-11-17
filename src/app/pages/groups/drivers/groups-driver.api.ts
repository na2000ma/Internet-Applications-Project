import {environment} from "@env/environment";

export const GroupsDriverApis = {
  getAllGroups: environment.serverURL + "api/allGroups",
  getMyGroups: environment.serverURL + "api/userGroups",
  getAllUsers: environment.serverURL + "api/allUsers",
  addGroup: environment.serverURL + "api/group/store",
  showGroup: (id: any) => environment.serverURL + `api/group/${id}`,
  joinGroup: (id: any) => environment.serverURL + `api/group/join/${id}`,
};
