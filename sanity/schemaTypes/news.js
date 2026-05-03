export default {
  name: "news",
  title: "News",
  type: "document",

  fields: [
    {
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    },

    {
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        { name: "en", title: "English", type: "string" },
        { name: "ar", title: "Arabic", type: "string" },
        { name: "ku", title: "Kurdish", type: "string" },
      ],
    },

    {
      name: "excerpt",
      title: "Excerpt",
      type: "object",
      fields: [
        { name: "en", type: "text", rows: 3 },
        { name: "ar", type: "text", rows: 3 },
        { name: "ku", type: "text", rows: 3 },
      ],
    },

    {
      name: "content",
      title: "Content",
      type: "object",
      fields: [
        { name: "en", type: "array", of: [{ type: "block" }] },
        { name: "ar", type: "array", of: [{ type: "block" }] },
        { name: "ku", type: "array", of: [{ type: "block" }] },
      ],
    },

    {
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    },

    {
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    },

    {
      name: "publishDate",
      title: "Publish Date",
      type: "datetime",
    },

    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.en",
        maxLength: 96,
      },
    },
  ],

  preview: {
    select: {
      title: "title.en",
      brand: "brand.title.en",
      media: "coverImage",
      publishDate: "publishDate",
    },
    prepare({ title, brand, media, publishDate }) {
      const parts = [
        brand && `Brand: ${brand}`,
        publishDate && new Date(publishDate).toLocaleDateString("en-GB"),
      ].filter(Boolean);

      return {
        title: title || "Untitled",
        subtitle: parts.join(" • "),
        media,
      };
    },
  },

  orderings: [
    {
      title: "Publish date desc",
      name: "publishDateDesc",
      by: [{ field: "publishDate", direction: "desc" }],
    },
  ],
};
