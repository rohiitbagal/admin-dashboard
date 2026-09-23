import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="mb-4 text-gray-600">The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-500 hover:underline">
        Go Back Home
      </Link>
    </div>
  );
}
