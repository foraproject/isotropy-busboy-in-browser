/* @flow */
import stream from "stream";
import type { IncomingMessage, BodyType, FormDataType, FormDataEntryType } from "isotropy-interfaces/node/http-in-browser";

type StreamReadable = {
  _read: Function,
  push(chunk: ?(Buffer | string), encoding? : string): boolean
}

type OptionsType = {
  limits?: {
    files?: number,
    parts?: number,
    fields?: number
  }
}

export default function (request: IncomingMessage, opts: OptionsType = {}) : () => Promise<?FormDataEntryType> {

  let isAwaiting = false;
  let resolve, reject;
  let body: FormDataType = (request.__getBody() : any);
  let errors: Array<Error> = [];

  // koa special sauce

  const fields = body.filter(p => typeof p.filename === "undefined");
  const files = body.filter(p => typeof p.filename !== "undefined");

  if (opts.limits) {
    if (opts.limits.files) {
      if (files.length > opts.limits.files) {
        onError("Reach files limit");
      }
    }
    if (opts.limits.fields) {
      if (fields.length > opts.limits.fields) {
        onError("Reach fields limit");
      }
    }
    if (opts.limits.parts) {
      if (body.length > opts.limits.parts) {
        onError("Reach parts limit");
      }
    }
  }

  function onError(str) {
    const err = new Error(str);
    errors.push(err);
    fulfill();
  }

  function fulfill() {
    if (isAwaiting) {
      if (errors.length) {
        reject(errors[0]);
      } else if (body.length) {
        if (typeof body !== "string") {
          const part = body.shift();
          if (part.filename) {
            const s: StreamReadable = (new stream.Readable() : any);
            s._read = function noop() {}; // redundant? see update below
            s.push(part.value);
            s.push(null);
            resolve({
              filename: part.filename,
              fieldname: part.fieldname,
              file: s,
              value: part.value
            });
          } else {
            resolve(part);
          }
          isAwaiting = false;
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    }
  }

  return () : Promise<?FormDataEntryType> => {
    return new Promise((_resolve, _reject) => {
      isAwaiting = true;
      resolve = _resolve;
      reject = _reject;
      fulfill();
    });
  }
};
