import { defineType, defineField } from "sanity";

export default defineType({
  name: "productGroup",
  title: "Product Group",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.en",
        maxLength: 96,
      },
      hidden: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
  name: "category",
  title: "Category",
  type: "reference",
  to: [{ type: "category" }],
  validation: (Rule) => Rule.required(),
}),
defineField({
  name: "image",
  title: "Image",
  type: "image",
}),
defineField({
  name: "order",
      title: "Order",
      type: "number",
      hidden: true,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      brand: "brand.title.en",
      category: "category.title.en",
    },
    prepare({ title, brand, category }) {
      return {
        title: title || "Untitled",
        subtitle: [brand && `Brand: ${brand}`, category && `Category: ${category}`]
          .filter(Boolean)
          .join(" • "),
      };
    },
  },
});
