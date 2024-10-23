import {get} from "lodash-es";

/**
 * types of returned code of request
 */
enum ReturnedStatus {
  success = 'Success',
  failed = 'Failed'
}

/**
 * model for handle response
 */
interface AppResponse {

  readonly response: any;

  /**
   * handle the request response
   * must the body of response
   * {
   *   "returnCode": "Success",
   *   "data": "{any}"
   * } => @do{success function}
   *
   * or
   * {
   *   "returnCode": "Success",
   *   "message": "{string 'error title'}"
   * } => @do{failed function}
   *
   * or response failed => @do{connectionError function}
   */
  handle(
    success: (data: any, extra?: any, headers?: any) => any,
    failed?: (message: any) => any,
    connectionError?: (errors: any) => any
  ): any;
}

export class AppHttpResponse implements AppResponse {

  readonly response: any;

  constructor(requestRes: any) {
    this.response = requestRes;
    // if (requestRes.url.includes('login') || requestRes.url.includes('register')) {
    //   const token = requestRes.headers.get('Authorization');
    //   localStorage.setItem('token', token);
    // }
  }

  handle(
    success: (data?: any, extra?: any, headers?: any, count?: number) => any,
    failed?: (message?: any) => any,
    connectionError?: (errors?: any) => any
  ): any {
    if (get(this.response, 'status', null) === 200) {
      const headers = get(this.response, 'headers', null);
      const count = get(this.response, 'body.count', null);
      if (get(this.response, 'body.returnCode', '') === ReturnedStatus.success) {
        const body = get(this.response, 'body', null);
        const model = get(this.response, 'body.model', null);
        const list = get(this.response, 'body.list', null);
        const extra = get(this.response, 'body.extraData', null);
        if (model) {
          return success && success(model, extra || null, headers || null, count || null);
        } else if (list) {
          return success && success(list, extra || null, headers || null, count || null);
        } else {
          return success && success(body, extra || null, headers || null, count || null);
        }
      } else if (get(this.response, 'body.returnCode', '') === ReturnedStatus.failed) {
        const text = get(this.response, 'body.extraData.msg', '');
        return failed && failed(text);
      } else {
        return success && success(get(this.response, 'body', null), null, headers || null, count || null);
      }
    } else if (get(this.response, 'error.returnCode', '') === ReturnedStatus.failed) {
      const text = get(this.response, 'error.extraData.msg', '');
      return failed && failed(text);
    } else {
      return connectionError && connectionError('Connection Error');
    }
  }
}
