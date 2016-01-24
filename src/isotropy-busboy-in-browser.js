/* @flow */
import type { KoaContextType } from "./flow/koa-types";
import type { IncomingMessage } from "./flow/http-types";

type FilePartType = {
  fieldname: string;
  file: string;
  filename: string;
}

type FieldPartType = {
  fieldname: string;
  value: string;
}

type PartType = FilePartType | FieldPartType;

type OptionsType = {
  limits?: {
    files?: number,
    parts?: number,
    fields?: number
  }
}

export default function (context: KoaContextType, opts: OptionsType = {}) : () => Promise<?PartType> {
  const request: IncomingMessage = context.req || context;

  let isAwaiting = false;
  let resolve, reject;
  let parts: Array<PartType> = [].concat(request.__parts);
  let errors: Array<Error> = [];

  // koa special sauce

  const fields = request.__parts.filter(p => typeof p.value !== "undefined");
  const files = request.__parts.filter(p => typeof p.value === "undefined");

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
