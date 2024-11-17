import {environment} from "@env/environment";

export const FoldersDriverApis = {

  getAcceptedFolders: environment.serverURL + 'api/acceptedFiles',
  addFile: environment.serverURL + 'api/file/store',
};
