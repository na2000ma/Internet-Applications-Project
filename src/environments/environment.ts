export enum IPs {
  // GHADEER = 206,
  GHADEER = 225,
  MARIA = 207,
  ELIE = 210,
  ALAN = 111
}

export const environment = {
  production: false,
  serverURL: `http://192.168.1.${IPs.MARIA}:8090/`,
  contentEngineURL: `http://192.168.1.${IPs.MARIA}:8090/`,
  securityTemplateURL: `http://192.168.1.${IPs.MARIA}:8090/`,
  base: '/'
};


