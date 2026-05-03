export default {
  name: "catalog",
  title: "Catalog",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "file",
      title: "PDF File",
      type: "file",
      options: {
        accept: "application/pdf",
      },
    },
    {
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "publishDate",
      title: "Publish Date",
      type: "datetime",
    },
  ],
};
