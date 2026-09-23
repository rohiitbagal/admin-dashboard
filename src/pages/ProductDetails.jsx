import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Package, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('404'); // special flag for 404 page
        } else {
          setError(err.message || 'Failed to load product details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error === '404') {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product with ID {id} does not exist.</p>
        <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-2 text-sm font-semibold underline">
          Retry
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <Link to="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="aspect-square w-full rounded-lg bg-gray-100 overflow-hidden">
              <img 
                src={product.images?.[0] || product.thumbnail} 
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt="" 
                    className="h-20 w-20 object-cover rounded bg-gray-100 border border-gray-200"
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 flex flex-col justify-center">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-blue-600 font-medium capitalize tracking-wide">
                {product.category.replace('-', ' ')}
              </span>
              <span className="inline-flex items-center text-sm text-gray-500">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                {product.rating}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-gray-500 mb-6 leading-relaxed text-lg">{product.description}</p>
            
            <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-6">
              <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              <span className="inline-flex items-center text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                <Package className="h-4 w-4 mr-2 text-gray-500" />
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Reviews</h3>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900">{review.reviewerName}</span>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
