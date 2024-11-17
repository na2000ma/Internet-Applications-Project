export enum IPs {
  GHADEER = 105,
}

export const environment = {
  production: false,
  serverURL: `http://192.168.1.${IPs.GHADEER}:8000/`,
  base: '/'
};


