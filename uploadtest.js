import fs from "fs";
import { uploadToS3 } from "./s3Client.js";

// Use your new test file
const fileStream = fs.createReadStream("test-file.txt");

uploadToS3("rohith-fragments-s3", "test-file.txt", fileStream)
  .then(() => console.log("Upload complete!"))
  .catch(console.error);
