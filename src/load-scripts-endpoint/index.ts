import { defineEndpoint } from "@directus/extensions-sdk"; 

export default defineEndpoint({
  id: "customjs",
  handler: (router, context) => {
    // Handler function for the endpoint
    const { services, getSchema } = context; // Destructure services and getSchema from the context
    const { ItemsService } = services; // Destructure ItemsService from the services

    router.get("/scripts", async (req, res) => {
      let scripts = {
        adminScript: false,
        appScript: false,
        customPage: false,
        isAdmin: {
          head: "",
          body: "",
        },
        notAdmin: {
          head: "",
          body: "",
        },
      };
      //@ts-ignore
      const accountability = req.accountability; // Get the user's accountability from the request

      // If the user is not logged in, return an empty script
      if (accountability?.user === undefined || accountability?.user === null) {
        res.send(""); 
      }

      // Get settings
      const itemsService = new ItemsService("directus_settings", {
        // Create an instance of ItemsService for the directus_settings collection
        schema: await getSchema(),
        accountability: accountability, 
      });
      const data = await itemsService.readOne("1"); // Read the item with ID "1" from the directus_settings collection

      // Get scripts and permissions
      if (data?.ext_custom_scripts_page_settings !== undefined) {
        scripts = data.ext_custom_scripts_page_settings;
      }

      if (accountability?.admin) {
        // If the user is an admin
        if (scripts.adminScript) {
          // If adminScript is enabled
          res.send(scripts.isAdmin); 
        }
        return res.send("");
      } else {
        // If the user is not an admin
        if (scripts.appScript) {
          // If appScript is enabled
          res.send(scripts.notAdmin);
        }
        return res.send(""); 
      }
    });
  },
});
