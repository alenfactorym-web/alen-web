export default {
  name: "aboutSection",
  title: "About Section",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "localeString" },
    { name: "subtitle", title: "Subtitle", type: "localeString" },
    { name: "body", title: "Body", type: "localeText" },

    {
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    },

    {
      name: "qualityImage",
      title: "Quality Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "qualityImageSquare",
      title: "Quality Image Square",
      type: "image",
      options: { hotspot: true },
    },

    {
      name: "productionImage",
      title: "Production Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "productionImageSquare",
      title: "Production Image Square",
      type: "image",
      options: { hotspot: true },
    },

    {
      name: "distributionImage",
      title: "Distribution Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "distributionImageSquare",
      title: "Distribution Image Square",
      type: "image",
      options: { hotspot: true },
    },

    {
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    },
  ],
};
