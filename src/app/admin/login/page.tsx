'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        toast.success('Đăng nhập thành công');
        router.push('/admin');
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Đăng nhập thất bại');
      }
    } catch (err) {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center justify-center flex-col">
        <div className="bg-primary text-primary-foreground p-3 rounded-xl mb-4 shadow-[0_0_40px_rgba(196,18,48,0.4)]">
          <Camera className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tighter text-white">Canon<span className="text-primary">Admin</span></h1>
        <p className="text-zinc-400 mt-2">Hệ thống quản trị Cửa hàng & Thuê thiết bị</p>
      </div>

      <Card className="w-full max-w-md border-white/10 bg-black/50 backdrop-blur-xl">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Đăng Nhập</CardTitle>
            <CardDescription className="text-center">Sử dụng tài khoản nội bộ để truy cập</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input 
                id="username" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="bg-white/5 border-white/10"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute right-3 top-3" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="mt-8 text-center text-sm text-zinc-500">
        <p>Mock Account: admin / 123456</p>
      </div>
    </div>
  );
}
