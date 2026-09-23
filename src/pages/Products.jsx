import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductTable from '../components/ProductTable';
import Pagination from '../components/Pagination';
import { Loader2, Plus, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL params with defaults and validation
  const pageParam = parseInt(searchParams.get('page'), 10);
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  
  const limitParam = parseInt(searchParams.get('limit'), 10);
  const limit = isNaN(limitParam) || ![10, 20, 50].includes(limitParam) ? 10 : limitParam;
  
  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || 'asc';

  const { products, total, isLoading, error } = useProducts({
    page,
    limit,
    search,
    category,
    sortBy,
    order
  });

  // Local state for fake mutations
  // In a real app, React Query handles cache invalidation.
  // Here, we just store fetched products in local state and modify it if needed,
  // though since we fetch every time URL changes, local changes will be lost on pagination.
  // We will handle fake Add/Edit/Delete fully in a later step.
  const [localProducts, setLocalProducts] = useState([]);
  
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      prev.set('page', newPage);
      return prev;
    });
  };

  const handleLimitChange = (newLimit) => {
    setSearchParams(prev => {
      prev.set('limit', newLimit);
      prev.set('page', 1); // Reset to page 1 on limit change
      return prev;
    });
  };

  const handleEdit = (product) => {
    console.log('Edit', product);
    // TODO: implement edit modal
  };

  const handleDelete = (product) => {
    console.log('Delete', product);
    // TODO: implement delete confirm
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Products
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            A list of all the products in your account including their name, title, and role.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Product
          </button>
        </div>
      </div>

      {/* TODO: Filters and Search bar will go here */}
      
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!error && (
        <>
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-lg min-h-[300px]">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            )}
            
            <div className={isLoading ? 'opacity-50' : ''}>
              <ProductTable 
                products={localProducts} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            </div>
          </div>
          
          {total > 0 && (
            <Pagination 
              page={page} 
              limit={limit} 
              total={total} 
              onPageChange={handlePageChange} 
              onLimitChange={handleLimitChange} 
            />
          )}
        </>
      )}
    </div>
  );
}
