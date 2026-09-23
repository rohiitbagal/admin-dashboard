import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';

export default function ProductTable({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-300 sm:rounded-lg">
      {/* Mobile view (Cards) */}
      <div className="block sm:hidden">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id} className="p-4 flex flex-col gap-3">
              <div className="flex items-start gap-4">
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="h-16 w-16 object-cover rounded bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                  <p className="text-sm text-gray-500 truncate">{product.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-gray-900">${product.price}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      ★ {product.rating}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                <div className="flex gap-2">
                  <Link to={`/products/${product.id}`} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button onClick={() => onEdit(product)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => onDelete(product)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop view (Table) */}
      <div className="hidden sm:block">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded object-cover bg-gray-100" src={product.thumbnail} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{product.title}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                  {product.category.replace('-', ' ')}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                  ${product.price.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    ★ {product.rating}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {product.stock}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end gap-3">
                    <Link to={`/products/${product.id}`} className="text-blue-600 hover:text-blue-900" title="View">
                      <Eye className="h-5 w-5" />
                    </Link>
                    <button onClick={() => onEdit(product)} className="text-green-600 hover:text-green-900" title="Edit">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(product)} className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
