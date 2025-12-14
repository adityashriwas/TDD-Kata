"use client";
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Button from '@/components/ui/button';

export default function SweetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [sweet, setSweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setErr(null);
        setLoading(true);
        const { data } = await api.get('/api/v1/sweet/get-all-sweets');
        const s = (data.sweets || []).find((x) => x._id === id);
        if (!s) setErr('Sweet not found');
        setSweet(s || null);
      } catch (e) { setErr('Failed to load sweet'); }
      finally { setLoading(false); }
    };
    if (id) run();
  }, [id]);

  const onPurchase = async () => {
    if (!id) return;
    setBusy(true);
    try {
      await api.post(`/api/v1/sweet/${id}/purchase`);
      // Reload detail
      const { data } = await api.get('/api/v1/sweet/get-all-sweets');
      const s = (data.sweets || []).find((x) => x._id === id);
      setSweet(s || null);
      alert('Purchased');
    } catch (e) {
      alert(e?.response?.data?.message || 'Purchase failed');
    } finally { setBusy(false); }
  };

  if (loading) return <p>Loading...</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!sweet) return <p>Not found</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <img src={sweet.sweetImage} alt={sweet.name} className="w-full h-auto rounded-md" />
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{sweet.name}</h1>
        <div className="text-gray-600">{sweet.category}</div>
        <div className="text-lg">Price: <span className="font-medium">${sweet.price}</span></div>
        <div className="text-sm">Quantity: {sweet.quantity}</div>
        <p className="text-sm text-gray-700">{sweet.description}</p>
        <div className="pt-2">
          <Button onClick={onPurchase} disabled={busy || sweet.quantity <= 0}>
            {busy ? 'Processing...' : sweet.quantity > 0 ? 'Purchase' : 'Out of stock'}
          </Button>
        </div>
      </div>
    </div>
  );
}
