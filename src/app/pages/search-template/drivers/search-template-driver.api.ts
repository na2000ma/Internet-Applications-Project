import {environment} from "@env/environment";

export const SearchTemplateDriverApi = {
  getAllContainers: environment.contentEngineURL + 'classification-class/get-all-classification',
  getFilteredDocuments: environment.contentEngineURL + 'document/dynamic-search',
};
