import type { Product } from '@/types/product';

const ProductSpecifications = ({ product }: { product: Product }) => {
  const details = [
    { label: 'SKU', value: `#${product._id.slice(-8).toUpperCase()}` },
    { label: 'Brand', value: product.brand },
    { label: 'Category', value: product.category.name },
    { label: 'Weight', value: product.specifications.weight },
    { label: 'Size', value: product.specifications.size },
    { label: 'Material', value: product.specifications.material },
    { label: 'Color', value: product.specifications.color },
    {
      label: 'Ingredients',
      value:
        product.specifications.ingredients &&
        product.specifications.ingredients.length > 0
          ? product.specifications.ingredients.join(', ')
          : null,
    },
    {
      label: 'Stock',
      value: `${product.stock} units available`,
    },
    {
      label: 'Published Date',
      value: new Date(product.createdAt).toLocaleDateString('en-GB'),
    },
  ];

  return (
    <div className="mt-5">
      <div className="space-y-3">
        {details.map(
          (detail) =>
            detail.value && (
              <div
                key={detail.label}
                className="flex justify-between border-b py-2 text-sm"
              >
                <span className="w-1/3 text-gray-500">{detail.label}</span>
                <span className="w-2/3 text-gray-500">: {detail.value}</span>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default ProductSpecifications;
