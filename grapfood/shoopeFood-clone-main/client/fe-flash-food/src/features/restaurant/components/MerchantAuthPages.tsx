import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

export const MerchantLogin: React.FC = () => {
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
      const response = await authApi.login({ ...data, role: 'merchant' });
      login(response.token, response.user);
      navigate('/merchant/dashboard');
    } catch (err) {
      setErrorMsg(formatErrorMessage(err, 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'));
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      <div>
        <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-2">
          Merchant Portal
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">Đăng nhập Đột Phá Doanh Số</h2>
        <p className="mt-2 text-sm text-slate-600">
          Cổng quản lý đơn hàng và thực đơn dành riêng cho Chủ Nhà Hàng / Quán Ăn.
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
            label="Số Điện Thoại Đối Tác"
            type="tel"
            placeholder="0912345678"
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
          className="bg-amber-500 hover:bg-amber-600 text-white py-3 font-bold rounded-xl shadow-md transition-all active:scale-95 mt-2"
        >
          {isSubmitting ? 'Đang xác thực...' : 'Vào Trang Quản Lý Quán'}
        </Button>
      </form>

      <div className="text-center text-sm text-slate-600">
        Chưa là đối tác của FlashFood?{' '}
        <Link to="/merchant/register" className="font-bold text-amber-500 hover:underline">
          Đăng ký mở quán ngay
        </Link>
      </div>
    </div>
  );
};

const registerSchema = z.object({
  fullName: z.string().min(2, 'Tên quá ngắn').max(50, 'Tên quá dài'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ').max(15, 'Số điện thoại quá dài'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Mật khẩu phải bao gồm cả chữ và số'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const MerchantRegister: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setErrorMsg('');
      const response = await authApi.register({
        fullName: data.fullName,
        phone: data.phone,
        password: data.password,
        role: 'merchant',
      });
      login(response.token, response.user);
      navigate('/merchant/dashboard');
    } catch (err) {
      setErrorMsg(formatErrorMessage(err, 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'));
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Đăng ký Cửa hàng Mới</h2>
        <p className="mt-2 text-sm text-slate-600">
          Tiếp cận hàng triệu khách hàng tiềm năng cùng hệ thống giao hàng Flash.
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
            label="Tên Quán Ăn / Nhà Hàng (Đại Diện)"
            type="text"
            placeholder="Trà Sữa Gong Cha"
            {...register('fullName')}
            error={errors.fullName?.message}
          />
        </div>

        <div>
          <Input
            label="Số Điện Thoại Quản Lý"
            type="tel"
            placeholder="0912345678"
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
          className="bg-amber-500 hover:bg-amber-600 text-white py-3 font-bold rounded-xl shadow-md transition-all active:scale-95 mt-2"
        >
          {isSubmitting ? 'Đang nộp hồ sơ...' : 'Nộp Hồ Sơ Mở Quán'}
        </Button>
      </form>

      <div className="text-center text-sm text-slate-600">
        Đã có tài khoản?{' '}
        <Link to="/merchant/login" className="font-bold text-amber-500 hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};
