import { useParams } from 'react-router-dom';

export default function ProductDetails() {
  const { id } = useParams();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Product Details: {id}</h1>
    </div>
  );
}
