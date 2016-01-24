# isotropy-busboy
This is the browser port of isotroy-busboy, as part of the Isotropy Framework. While usage is the stream, underlying data is mocked in the request. Typically, you'd use this in browserify or webpack as an alias for "isotroy-busboy". 

## How To

Install from npm
```
npm install isotropy-busboy-in-browser
```

Multipart data can contain Fields and Files (called a 'Part').
File data comes as a stream, which you can pipe to a destination.

```
const busboy = require("isotropy-busboy");
const getPart = busboy(httpRequest);
let streams = 0, fields = 0, part;
while(part = await getPart()) {
  if (!part) break;
  if (part.value) {
    fields++;
  } else {
    //part.file is a stream
    part.file.resume();
    streams++;
  }
}
```

Every time you call getPart() as in the example above, you receive a new Part.
```
const getPart = busboy(httpRequest);
const part = await getPart()
const anotherPart = await getPart()
console.log(part.fieldname)
console.log(anotherPart.fieldname)
```

A Field Part has two properties:
```
const getPart = busboy(httpRequest);
const part = await getPart()
console.log(part.fieldname)
console.log(part.value)
```

A File Part has three properties.
```
const getPart = busboy(httpRequest);
const part = await getPart()
console.log(part.fieldname)
console.log(part.filename)
console.log(part.file) //The file property is a stream
```

To check if a Part is a Field or a File:
```
const getPart = busboy(httpRequest);
const part = await getPart()
if (part.file) {
  console.log("It's a file")
} else {
  console.log("It's a field")
}
```

There are options to limit the number of fields, files or parts while parsing.
If the limit is hit, an error is thrown.
```
//limit to 2 files
const getPart = busboy(httpRequest, { limit: { files: 2 }});
//limit to 2 fields
const getPart = busboy(httpRequest, { limit: { fields: 2 }});
//limit to 2 parts. Parts are the sum of files and fields
const getPart = busboy(httpRequest, { limit: { parts: 2 }});
```

You can see more examples in src/test/test.js
