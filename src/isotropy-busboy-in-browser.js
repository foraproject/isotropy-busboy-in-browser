/* @flow */
import type { IncomingMessage, PartType } from "./flow/http-types";

type OptionsType = {
  limits?: {
    files?: number,
    parts?: number,
    fields?: number
  }
}

export default function (request: IncomingMessage, opts: OptionsType = {}) : () => Promise<?PartType> {

  let isAwaiting = false;
  let resolve, reject;
  let parts: Array<PartType> = [].concat(request.__parts);
  let errors: Array<Error> = [];

  // koa special sauce

  const fields = request.__parts.filter(p => p.type === "field");
  const files = request.__parts.filter(p => p.type === "file");

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
      if (parts.length > opts.limits.parts) {
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
      } else if (parts.length) {
        resolve(parts.shift());
        isAwaiting = false;
      } else {
        resolve();
      }
    }
  }

  return () : Promise<?PartType> => {
    return new Promise((_resolve, _reject) => {
      isAwaiting = true;
      resolve = _resolve;
      reject = _reject;
      fulfill();
    });
  }
};
