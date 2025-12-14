"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr(null); setOk(null);
    try {
      const res = await register(form);
      setOk(res?.message || 'Account created');
      setTimeout(()=> router.push('/login'), 800);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select id="role" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </Select>
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        {ok && <p className="text-green-600 text-sm">{ok}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
      </form>
    </div>
  );
}
