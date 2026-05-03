// https://www.sanity.io/docs/structure-builder-cheat-sheet
const ALLOWED_TYPES = [
  { type: 'brand', title: 'Brand' },
  { type: 'category', title: 'Category' },
  { type: 'productGroup', title: 'Product Group' },
   { type: 'packaging', title: 'Packaging' },
  { type: 'product', title: 'Product' },
  { type: 'news', title: 'News' },
  { type: 'video', title: 'Video' },
  { type: 'catalog', title: 'Catalog' },
]
export const structure = (S) =>
  S.list()
    .title('Content')
    .items(
      ALLOWED_TYPES.map(({ type, title }) =>
        S.documentTypeListItem(type).title(title)
      )
    )
