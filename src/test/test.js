import __polyfill from "babel-polyfill";
import should from "should";
import XMLHttpRequest from "./xml-http-request";
import httpModule from 'isotropy-http-in-browser';
import busboy from '../isotropy-busboy-in-browser';

describe('isotropy-busboy', () => {

  it('should return the correct number of parts', async () => {
    const getPart = busboy(request());
    let streams = 0, fields = 0, part;
    while(part = await getPart()) {
      if (!part) break;
      if (part.value) {
        fields++;
      } else {
        part.file.resume();
        streams++;
      }
    }
    fields.should.equal(6);
    streams.should.equal(3);
  });


  it('should throw error when the files limit is reached', async () => {
    const getPart = busboy(request(), {
      limits: { files: 1 }
    });

    let error;
    try {
      let part;
      while(part = await getPart()) {
        if (part.file) {
          part.file.resume();
        }
      }
    }
    catch (e) {
      error = e;
    }
    error.message.should.equal("Reach files limit");
  });


  it('should throw error when the fields limit is reached', async () => {
    const getPart = busboy(request(), {
      limits: { fields: 1 }
    });

    let error;
    try {
      let part;
      while(part = await getPart()) {
        if (part.file) {
          part.file.resume();
        }
      }
    }
    catch (e) {
      error = e;
    }
    error.message.should.equal("Reach fields limit");
  });


  it('should throw error when the fields limit is reached', async () => {
    const getPart = busboy(request(), {
      limits: { parts: 1 }
    });

    let error;
    try {
      let part;
      while(part = await getPart()) {
        if (part.file) {
          part.file.resume();
        }
      }
    }
    catch (e) {
      error = e;
    }
    error.message.should.equal("Reach parts limit");
  });


  function request() {
    const req = new httpModule.IncomingMessage();
    req.__setBody([
      { fieldname: "file_name_0", value: "super alpha file" },
      { fieldname: "file_name_0", value: "super beta file" },
      { fieldname: "file_name_0", value: "super gamma file" },
      { fieldname: "file_name_1", value: "super gamma file" },
      { fieldname: "_csrf", value: "ooxx" },
      { fieldname: "hasOwnProperty", value: "super bad file" },
      { fieldname: "upload_file_0", filename: "1k_a.dat", file: "Some file content" },
      { fieldname: "upload_file_0", filename: "1k_b.dat", file: "Other file content" },
      { fieldname: "upload_file_0", filename: "hack.exe", file: "Exe content" }
    ]);
    return req;
  }
})
