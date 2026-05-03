export default {
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en" },
    },
    {
      name: "title",
      title: "Title",
      type: "localeString",
    },
    { name: "color", title: "Color", type: "string" },
    { name: "logo", title: "Logo", type: "image" },
    { name: "heroImage", title: "Hero Image", type: "image" },
    { name: "isActive", title: "Active", type: "boolean", initialValue: true },
    { name: "order", title: "Order", type: "number" },
  ],

  preview: {
    select: {
      title: "title.en"
    }
  }
};
