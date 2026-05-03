export default {
  name: "video",
  title: "Videos",
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
      validation: (Rule) => Rule.required(),
    },

    {
      name: "youtubeUrl",
      title: "YouTube URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ["http", "https"],
        }).custom((value, context) => {
          const { videoFile } = context.document || {};

          if (!value && !videoFile) {
            return "Either YouTube URL or uploaded video is required";
          }

          return true;
        }),
    },

    {
      name: "date",
      title: "Publish Date",
      type: "datetime",
    },

    // legacy field - hidden
    {
      name: "source",
      title: "Source",
      type: "string",
      hidden: true,
    },

    // فقط برای ویدئوی کارخانه / featured
    {
      name: "videoFile",
      title: "Video File (Upload for featured only)",
      type: "file",
      options: { accept: "video/*" },
    },

      {
  name: "thumbnail",
  title: "Thumbnail (for uploaded videos)",
  type: "image",
  hidden: ({ document }) => !!document?.youtubeUrl
},
  ],

  preview: {
    select: {
      title: "title.en",
      brand: "brand.title.en",
      date: "date",
      media: "thumbnail",
    },
    prepare({ title, brand, date, media }) {
      const parts = [
        brand && `Brand: ${brand}`,
        date && new Date(date).toLocaleDateString("en-GB"),
      ].filter(Boolean);

      return {
        title: title || "Untitled",
        subtitle: parts.join(" • "),
        media,
      };
    },
  },
};
