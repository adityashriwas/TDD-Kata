"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/axios';
import Button from '@/components/ui/button';

export default function SweetDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sweet, setSweet] = useState(null);
  const [loadingSweet, setLoadingSweet] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSweet = async () => {
      try {
        setLoadingSweet(true);
        // First try to get the specific sweet
        try {
          const { data } = await api.get(`/api/v1/sweet/${id}`);
          setSweet(data.sweet || data);
          return;
        } catch (e) {
          console.log('Direct fetch failed, trying fallback...', e);
        }
        
        // Fallback: Get all sweets and find the one we need
        const { data } = await api.get('/api/v1/sweet/get-all-sweets');
        const foundSweet = (data.sweets || []).find(s => s._id === id);
        
        if (!foundSweet) {
          throw new Error('Sweet not found');
        }
        
        setSweet(foundSweet);
      } catch (err) {
        console.error('Error fetching sweet:', err);
        setError(err.message || 'Failed to fetch sweet details');
      } finally {
        setLoadingSweet(false);
      }
    };

    if (id) {
      fetchSweet();
    }
  }, [id]);

  if (!loading && (!user || user.role !== 'admin')) {
    return <p>Access denied. Admins only.</p>;
  }

  if (loadingSweet) {
    return <div>Loading sweet details...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!sweet) {
    return <div>Sweet not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Sweet Details</h1>
        <Button onClick={() => router.push('/admin/sweets')}>Back to List</Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {sweet.sweetImage ? (
              <img 
                src={sweet.sweetImage} 
                alt={sweet.name} 
                className="w-full h-auto rounded-lg shadow-md"
              />
            ) : (
              <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-2">{sweet.name}</h2>
            <p className="text-gray-600 mb-4">{sweet.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="text-lg">{sweet.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <p className="text-lg">${sweet.price}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
                <p className="text-lg">{sweet.quantity}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => router.push(`/admin/sweets/edit/${sweet._id}`)}
                variant="secondary"
              >
                Edit Sweet
              </Button>
              <Button onClick={() => router.push('/admin/sweets')} variant="outline">
                Back to List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
