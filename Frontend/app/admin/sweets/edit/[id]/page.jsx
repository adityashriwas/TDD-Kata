"use client";
import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import Textarea from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';

const CATEGORIES = ["CHOCOLATE","CANDY","PASTRY","BAKERY","NAMKEEN","TRADITIONAL"];

export default function EditSweetPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', category: '', price: '', quantity: '', description: '' });
  const [file, setFile] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data } = await api.get('/api/v1/sweet/get-all-sweets');
      const s = (data.sweets || []).find((x)=>x._id === id);
      if (!s) return setErr('Sweet not found');
      setForm({ name: s.name || '', category: s.category || '', price: s.price || '', quantity: s.quantity || '', description: s.description || '' });
    };
    if (id) run();
  }, [id]);

  if (!loading && (!user || user.role !== 'admin')) {
    return <p>Access denied. Admins only.</p>;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      // Backend expects a new image during update
      if (file) fd.append('image', file);
      else return setErr('Please select a new image for update');
      await api.put(`/api/v1/sweet/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      router.push('/admin/sweets');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Update failed');
    } finally { setBusy(false); }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Edit Sweet</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} required>
            <option value="" disabled>Select category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Price</Label>
            <Input type="number" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} required />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input type="number" value={form.quantity} onChange={(e)=>setForm({...form,quantity:e.target.value})} required />
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
        </div>
        <div>
          <Label>New Image</Label>
          <Input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} required />
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <Button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</Button>
      </form>
    </div>
  );
}
