import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

console.log("Checking PDFParse class...");
try {
  // Let's create an empty uint8array representing a tiny empty PDF or similar
  const dummyData = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a]); // %PDF-1.4
  const parser = new pdfParse.PDFParse({ data: dummyData });
  console.log("PDFParse class initialized successfully with dummy binary data!");
  
  // Try to call parser.getText() and catch PDF parse errors (since it's a dummy PDF, it will fail to parse but it proves the class method is callable!)
  parser.getText()
    .then((res) => {
      console.log("Result:", res);
    })
    .catch((err) => {
      console.log("Promise rejected (expected because PDF is empty, but this proves the method was executed):", err.message);
    });
} catch (err) {
  console.error("Error running test:", err.message);
}
