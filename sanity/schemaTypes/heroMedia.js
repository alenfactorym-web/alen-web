export default {
  name: "heroMedia",
  title: "Hero Media",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "heroVideo",
      title: "Hero Video",
      type: "file",
      options: {
        accept: "video/*",
      },
    },
    {
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    },
  ],
};
