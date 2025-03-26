import { defineEndpoint } from "@directus/extensions-sdk";
import serveStatic from "serve-static";
import path from "path";
import * as fflate from "fflate";
import fs from "fs";
import { promisify } from "util"; 

const statAsync = promisify(fs.stat);
const mkdirAsync = promisify(fs.mkdir); 
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
// Define the paths for the public and public/page directories
const __dirname = path.resolve(process.cwd()); 
const publicDir = path.join(__dirname, "public");
const pageDir = path.join(publicDir, "page"); 

// Define the file types that should be compressed with gzip
const compressibleTypes = [".js", ".css", ".html"];

// Function to ensure a directory exists; if not, create it
async function ensureDirectoryExists(dirPath: string) {
  try {
    await statAsync(dirPath); // Check if the directory exists
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // If the directory doesn't exist, create it recursively
      await mkdirAsync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    } else {
      throw error;
    }
  }
}

// Function to ensure initial files (like index.html) exist; if not, create them
async function ensureInitialFiles() {
  const indexPath = path.join(pageDir, "index.html"); 
  try {
    await statAsync(indexPath); 
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // If the file doesn't exist, create a default index.html file
      const defaultHtml = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Page</title>
  </head>
  <body>
    <h1>Welcome to Custom Page</h1>
    <p>This is a default page. You can customize it through the admin interface.</p>
  </body>
  </html>`;
      await writeFileAsync(indexPath, defaultHtml); // Write the default HTML content to the file
      console.log(`Created default index.html at ${indexPath}`);
    } else {
      throw error;
    }
  }
}

function getContentType(url: string): string {
  if (url.endsWith(".js")) {
    return "application/javascript";
  }
  if (url.endsWith(".css")) {
    return "text/css";
  }
  if (url.endsWith(".html")) {
    return "text/html";
  }
  return "application/octet-stream"; 
}

// Define the Directus endpoint
export default defineEndpoint({
  id: "custompage", // Endpoint ID
  handler: async (router, context) => {
    // Handler function for the endpoint
    // Ensure the public and public/page directories exist, create them if they don't, and initialize index.html
    try {
      await ensureDirectoryExists(publicDir); // Ensure the public directory exists
      await ensureDirectoryExists(pageDir); // Ensure the page directory exists
      await ensureInitialFiles(); // Ensure the initial files exist
    } catch (error) {
      console.error("Failed to create directories:", error);
      throw new Error("Unable to initialize required directories");
    }

    const { services, getSchema } = context;
    const { ItemsService } = services;

    // GZIP compression middleware
    const gzipMiddleware = async (req, res, next) => {
      // Check if the request is a GET request and if the client accepts gzip encoding
      if (req.method !== "GET" || !req.acceptsEncodings("gzip")) {
        return next(); // Skip gzip compression if not a GET request or gzip not accepted
      }

      const filePath = path.join(pageDir, req.url); // Construct the file path

      try {
        const stats = await statAsync(filePath); // Get file stats
        if (!stats.isFile()) {
          return next(); // Skip if it's not a file
        }

        // Check if the file type should be compressed
        if (!compressibleTypes.some((ext) => req.url.endsWith(ext))) {
          return next(); // Skip if the file type is not compressible
        }

        const data = await readFileAsync(filePath); // Read the file data

        // Compress the data using fflate's gzipSync
        const compressed = fflate.gzipSync(data, { level: 6 });

        // Set response headers to indicate gzip encoding
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Content-Type", getContentType(req.url));

        res.send(Buffer.from(compressed));
      } catch (error: any) {
        if (error.code !== "ENOENT") {
          console.error("GZIP compression failed:", error);
        }
        return next(error); 
      }
    };

    // Serve static files from the public directory
    const servePublic = serveStatic(pageDir);

    // Use the GZIP middleware
    router.use("/static", gzipMiddleware, servePublic); // Apply gzip middleware to the /static route

    // Route to view the custom page
    router.get("/view", async (req, res) => {
      // Get the page visibility setting
      let pageVisible = true;
      const disableFilePath = path.join(pageDir, ".disable"); // Path to the .disable file
      if (fs.existsSync(disableFilePath)) {
        pageVisible = false; // If .disable exists, the page is not visible
      }

      if (pageVisible === false) {
        return res.status(404).send({
          errors: [
            {
              message: "Route /custompage/view doesn't exist.",
              extensions: {
                path: "/custompage/view",
                code: "ROUTE_NOT_FOUND",
              },
            },
          ],
        });
      }
      res.sendFile(path.join(pageDir, "index.html")); 
    });

    // Route to read the HTML file and send it to the settings platform
    router.get("/setting/get", async (req, res) => {
      //@ts-ignore
      const accountability = req.accountability; // Get the user's accountability
      if (accountability?.admin === false) {
        // If the user is not an admin, return a 404 error
        return res.status(404).send({
          errors: [
            {
              message: "Route /custompage/setting/get doesn't exist.",
              extensions: {
                path: "/custompage/setting/get",
                code: "ROUTE_NOT_FOUND",
              },
            },
          ],
        });
      }

      const filePath = path.join(pageDir, "index.html");
      try {
        const data = await readFileAsync(filePath, "utf8"); 
        res.setHeader("Content-Type", "text/plain");
        res.send(data);
      } catch (err) {
        res.status(500).send("Internal Server Error");
        console.error("Error reading file:", err);
      }
    });

    // Route to receive the HTML file and save it to the public directory
    router.post("/setting/save", async (req, res) => {
      //@ts-ignore
      const accountability = req.accountability; // Get the user's accountability
      if (accountability?.admin === false) {
        // If the user is not an admin, return a 404 error
        return res.status(404).send({
          errors: [
            {
              message: "Route /custompage/setting/save doesn't exist.",
              extensions: {
                path: "/custompage/setting/save",
                code: "ROUTE_NOT_FOUND",
              },
            },
          ],
        });
      }

      const filePath = path.join(pageDir, "index.html");
      const { page } = req.body;
      try {
        await writeFileAsync(filePath, page);
        res.send({
          message: "success",
        });
      } catch (err) {
        console.error("Error writing file:", err);
        res.status(500).send("Internal Server Error");
      }
    });

    // Route to check the page disable status
    router.post("/setting/status", async (req, res) => {
      //@ts-ignore
      const accountability = req.accountability;
      if (accountability?.admin === false) {
        return res.status(404).send({
          errors: [
            {
              message: "Route /custompage/disable doesn't exist.",
              extensions: {
                path: "/custompage/disable",
                code: "ROUTE_NOT_FOUND",
              },
            },
          ],
        });
      }
      const disableFilePath = path.join(pageDir, ".disable"); // Path to the .disable file
      if (fs.existsSync(disableFilePath)) {
        // If the .disable file exists, the page is disabled
        res.send({
          data: {
            visible: false,
            message:
              "Custom Page is disabled, you can enable it in the settings page.",
          },
        });
      }
      res.send({
        data: {
          visible: true,
          message: "Custom Page is enabled.",
        },
      });
    });

    // Route to disable the custom page
    router.post("/setting/disable", async (req, res) => {
      //@ts-ignore
      const accountability = req.accountability;
      if (accountability?.admin === false) {
        // If the user is not an admin, return a 404 error
        return res.status(404).send({
          errors: [
            {
              message: "Route /custompage/disable doesn't exist.",
              extensions: {
                path: "/custompage/disable",
                code: "ROUTE_NOT_FOUND",
              },
            },
          ],
        });
      }

      const disableFilePath = path.join(pageDir, ".disable"); 
      const { visible } = req.body; 

      try {
        if (visible === false) {
          // If visible is false, create the .disable file
          await writeFileAsync(disableFilePath, "1145141919810"); // Create .disable file with specified content
          return res.send({
            data: {
              visible: false,
              message:
                "Custom Page is disabled, you can enable it in the settings page.",
            },
          });
        } else if (visible === true) {
          // If visible is true, delete the .disable file
          if (fs.existsSync(disableFilePath)) {
            // Check if file exists before attempting to delete
            fs.unlink(disableFilePath, function (err) {
              if (err) throw err;
            });
            return res.send({
              data: {
                visible: true,
                message: "Custom Page is enabled.",
              },
            });
          }
        } else {
          // If visible is not a boolean, return an error
          return res.status(400).send({
            errors: [
              {
                message: "Invalid visible value. Must be boolean.",
                extensions: {
                  code: "INVALID_PAYLOAD",
                },
              },
            ],
          });
        }
      } catch (err) {
        console.error("Error handling disable file:", err);
        return res.status(500).send("Internal Server Error"); // Send an error response
      }
    });
  },
});
