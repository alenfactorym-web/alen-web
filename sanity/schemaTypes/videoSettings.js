export default {
  name: "videoSettings",
  title: "Video Settings",
  type: "document",
  fields: [
    {
      name: "featuredVideo",
      title: "Featured (Hero) Video",
      type: "reference",
      to: [{ type: "video" }],
      validation: (Rule) => Rule.required(),
    },
  ],
};

