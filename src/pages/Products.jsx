import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import ProductTable from '../components/ProductTable';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import { Loader2, Plus, AlertCircle, Search, Filter, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

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
  
  // Local state for immediate input feedback
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [categories, setCategories] = useState([]);
  
  // Fetch categories on mount
  useEffect(() => {
    api.get('/products/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearchParams(prev => {
        if (debouncedSearch) {
          prev.set('q', debouncedSearch);
          // API doesn't support both q and category, so clear category
          prev.delete('category');
        } else {
          prev.delete('q');
        }
        prev.set('page', 1);
        return prev;
      });
    }
  }, [debouncedSearch, search, setSearchParams]);

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
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
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

  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormSuccess = (savedProduct) => {
    setIsFormModalOpen(false);
    
    // Fake persistence: Update local state
    if (selectedProduct) {
      // It was an edit
      setLocalProducts(prev => prev.map(p => p.id === savedProduct.id ? { ...p, ...savedProduct } : p));
    } else {
      // It was an add - DummyJSON returns the new object with a new ID
      // We prepend it to the list
      setLocalProducts(prev => [savedProduct, ...prev]);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      await api.delete(`/products/${selectedProduct.id}`);
      // Fake persistence: Remove from local state
      setLocalProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSearchParams(prev => {
      if (val === 'all') {
        prev.delete('category');
      } else {
        prev.set('category', val);
        // Clear search when category is selected
        prev.delete('q');
        setSearchInput('');
      }
      prev.set('page', 1);
      return prev;
    });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSearchParams(prev => {
      if (!val) {
        prev.delete('sortBy');
        prev.delete('order');
      } else {
        const [sort, ord] = val.split('-');
        prev.set('sortBy', sort);
        prev.set('order', ord);
      }
      prev.set('page', 1);
      return prev;
    });
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
            onClick={handleAddClick}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={category}
              onChange={handleCategoryChange}
              disabled={!!searchInput} // Disable category if searching
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.slug || cat} value={cat.slug || cat}>
                  {cat.name || cat}
                </option>
              ))}
            </select>
          </div>
          
          <select
            className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            value={sortBy ? `${sortBy}-${order}` : ''}
            onChange={handleSortChange}
          >
            <option value="">Sort by: None</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: Highest</option>
            <option value="rating-asc">Rating: Lowest</option>
            <option value="title-asc">Title: A-Z</option>
            <option value="title-desc">Title: Z-A</option>
          </select>
        </div>
      </div>
      
      {!!searchInput && (
        <p className="text-sm text-gray-500">
          Showing search results for "{searchInput}". Category filters are disabled during search.
        </p>
      )}
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

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Add New Product'}
      >
        <ProductForm 
          product={selectedProduct} 
          onSuccess={handleFormSuccess} 
          onCancel={() => setIsFormModalOpen(false)} 
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete <strong>{selectedProduct?.title}</strong>? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
            Delete
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
