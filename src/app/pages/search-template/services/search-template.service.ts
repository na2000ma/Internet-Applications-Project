import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SearchTemplateDriverApi} from "@app/pages/search-template/drivers/search-template-driver.api";

@Injectable({
  providedIn: "root"
})
export class SearchTemplateService {

  constructor(private httpClient: HttpClient) {
  }

  getAllClassifications() {
    return this.httpClient.get(SearchTemplateDriverApi.getAllContainers)
  }

  getFilteredDocuments(payload: any) {
    return this.httpClient.post(SearchTemplateDriverApi.getFilteredDocuments, {...payload})
  }
}
