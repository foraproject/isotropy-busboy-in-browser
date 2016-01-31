/* @flow */
type FilePartType = {
  type: "file";
  fieldname: string;
  file: any ;
  filename: string;
  transferEncoding: string;
  mimeType: string;
}

type FieldPartType = {
  type: "field";
  fieldname: string;
  value: string;
}

export type HashType = { [key: string]: string };

export type PartType = FilePartType | FieldPartType;

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
  __body: HashType;
  __parts: Array<PartType>;
}

export type ServerResponse = {
  removeListener: (name: string) => void;
  removeAllListeners: (name: string) => void;
  on: (name: string, fn: Function) => void;
  pipe: (dest: any) => void;
  writeHead: (code: number, headers: Object) => void;
  write: (data: string) => void;
  end: () => void;
}
