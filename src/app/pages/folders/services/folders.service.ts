import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FoldersDriverApis} from "@app/pages/folders/drivers/folders-driver.api";

@Injectable({
  providedIn: 'root'
})
export class FoldersService {


  constructor(private httpClient: HttpClient) {
  }


  getAcceptedFiles() {
    return this.httpClient.get(FoldersDriverApis.getAcceptedFolders)
  }

  addFile(payload: any) {
    return this.httpClient.post(FoldersDriverApis.addFile, {...payload})
  }
}
