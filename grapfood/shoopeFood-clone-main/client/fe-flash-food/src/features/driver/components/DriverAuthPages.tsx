import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context';
import { Button, Input } from '@/components';
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

export const DriverLogin: React.FC = () => {
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
      const response = await authApi.login({ ...data, role: 'driver' });
      login(response.token, response.user);
      navigate('/driver/dashboard');
    } catch (err) {
      setErrorMsg(formatErrorMessage(err, 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'));
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      <div>
        <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2">
          Driver App
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">Bật App Nhận Đơn Nhanh</h2>
        <p className="mt-2 text-sm text-slate-600">
          Ứng dụng làm việc dành riêng cho Đối Tác Tài Xế FlashFood.
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
            label="Số Điện Thoại Tài Xế"
            type="tel"
            placeholder="0909123456"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>

        <div>
          <Input
            label="Mật khẩu"
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
          className="bg-emerald-400 hover:bg-emerald-500 text-white py-3 font-bold rounded-xl shadow-md transition-all active:scale-95 mt-2"
        >
          {isSubmitting ? 'Đang xác thực...' : 'Đăng Nhập Nhận Đơn'}
        </Button>
      </form>
    </div>
  );
};
