import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { Button, Input } from '@/components';
import { ShieldCheck } from 'lucide-react';
import { authApi } from '@/services/api/auth';
import { formatErrorMessage } from '@/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const AdminLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setErrorMsg('');
      const response = await authApi.login({ ...data, role: 'admin' });
      login(response.token, response.user);
      navigate('/admin/dashboard');
    } catch (err) {
      setErrorMsg(formatErrorMessage(err, 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'));
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      <div className="flex items-center space-x-2 text-indigo-600 mb-2">
        <ShieldCheck className="h-6 w-6" />
        <span className="text-xs font-bold uppercase tracking-wider">Internal Security Portal</span>
      </div>
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Quản Trị Hệ Thống</h2>
        <p className="mt-2 text-sm text-slate-600">
          Cổng truy cập bí mật dành riêng cho Ban Quản Trị FlashFood.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            label="Tài khoản Quản trị (SĐT)"
            type="tel"
            placeholder="0900000005"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>

        <div>
          <Input
            label="Mật khẩu Bảo vệ"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-800 text-white py-3 font-bold rounded-xl shadow-md transition-all active:scale-95 mt-2"
        >
          {isSubmitting ? 'Đang xác thực...' : 'Đăng Nhập Control Center'}
        </Button>
      </form>
    </div>
  );
};
