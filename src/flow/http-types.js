/* @flow */
export type FormDataEntryType = {
  fieldname: string;
  value: string;
  filename?: string;
}

export type FormDataType = Array<FormDataEntryType>;

export type BodyType = string | FormDataType;

export type IncomingMessage = {
  removeListener: (name: string) => void;
  removeAllListeners: (name: string) => void;
  on: (name: string, fn: Function) => void;
  pipe: (dest: any) => void;
  headers: Object;
  httpVersion: string;
  method: string;
  trailers: Object;
  setTimeout: (msecs: number, callback: Function) => void;
  statusCode: number;
  url: string;
  __getBody: () => BodyType;
  on: (name: string, fn: Function) => void;
  pipe: (dest: any) => void;
  writeHead: (code: number, headers: Object) => void;
  write: (data: string) => void;
  end: () => void;
}
