export default {
  name: "contactSection",
  title: "Contact Section",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "localeString" },
    { name: "subtitle", title: "Subtitle", type: "localeString" },
    { name: "company", title: "Company", type: "string" },
    { name: "address", title: "Address", type: "localeText" },
    { name: "footerText", title: "Footer Text", type: "localeText" },
    { name: "email", title: "Email", type: "string" },
    {
      name: "phones",
      title: "Phones",
      type: "array",
      of: [{ type: "string" }],
    },
    { name: "mapSrc", title: "Map Embed Src", type: "url" },
    { name: "mapLink", title: "Map Link", type: "url" },
    { name: "whatsAppNumber", title: "WhatsApp Number", type: "string" },
    {
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    },
  ],
};
