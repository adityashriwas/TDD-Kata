"use client";
import { useEffect, useMemo, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import api from '@/lib/axios';
import Button from '@/components/ui/button';

export default function AdminSweetsListPage() {
  const { user, loading } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await api.get('/api/v1/sweet/get-all-sweets');
    setSweets(data.sweets || []);
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm('Delete this sweet?')) return;
    setBusy(true);
    try { await api.delete(`/api/v1/sweet/${id}`); await load(); }
    catch (e) { alert(e?.response?.data?.message || 'Delete failed'); }
    finally { setBusy(false); }
  };

  if (!loading && (!user || user.role !== 'admin')) {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin · Sweets</h1>
        <a href="/admin/sweets/create"><Button>New Sweet</Button></a>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.category}</td>
                <td className="p-2">${s.price}</td>
                <td className="p-2">{s.quantity}</td>
                <td className="p-2 text-right space-x-2">
                  <a href={`/admin/sweets/details/${s._id}`} className="inline-block">
                    <Button variant="outline" size="sm">View Details</Button>
                  </a>
                  <a href={`/admin/sweets/edit/${s._id}`} className="inline-block">
                    <Button variant="secondary" size="sm">Edit</Button>
                  </a>
                  <Button variant="destructive" size="sm" onClick={()=>onDelete(s._id)} disabled={busy} className="inline-block">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
