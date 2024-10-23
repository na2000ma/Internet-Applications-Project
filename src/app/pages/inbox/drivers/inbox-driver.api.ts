import {environment} from "@env/environment";

export const InboxDriverApis = {
  getUsersAndSecretary: environment.contentEngineURL + 'user/get',
  lunchWorkFlow: environment.contentEngineURL + 'process/start',
  getTasks: environment.contentEngineURL + 'task/my-inbox',
  completeTask: environment.contentEngineURL + 'task/complete'
};
