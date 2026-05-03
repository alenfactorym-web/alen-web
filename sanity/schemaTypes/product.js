export default {
  name: "product",
  title: "Product",
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
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    },
   {
     name: "productGroup",
     title: "Product Group",
     type: "reference",
     to: [{ type: "productGroup" }],
    },
    {
      name: "packaging",
      title: "Packaging",
      type: "reference",
      to: [{ type: "packaging" }],
    },
    {
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    },
        { name: "desc", title: "Description", type: "localeText" },
    { name: "images", title: "Images", type: "array", of: [{ type: "image" }] },
    { name: "coverImage", title: "Cover Image", type: "image" },
    { name: "sku", title: "SKU", type: "string" },
{ name: "unitsPerPack", title: "Units Per Pack", type: "number" },
{ name: "packsPerCarton", title: "Packs Per Carton", type: "number" },
{ name: "isActive", title: "Active", type: "boolean", initialValue: true },
    { name: "order", title: "Order", type: "number" },
       
  ],
  preview: {
   select: {
  title: "title.en",
  brand: "brand.title.en",
  category: "category.title.en",
  productGroup: "productGroup.title.en",
  packaging: "packaging.title.en",
  media: "coverImage",
},
prepare({ title, brand, category, productGroup, packaging, media }) {
  const sub = [
    brand && `Brand: ${brand}`,
    category && `Category: ${category}`,
    productGroup && `Group: ${productGroup}`,
    packaging ? `Packaging: ${packaging}` : "Direct Product",
  ]
    .filter(Boolean)
    .join(" • ");

  return { title: title || "Untitled", subtitle: sub, media };
},
  },
};
