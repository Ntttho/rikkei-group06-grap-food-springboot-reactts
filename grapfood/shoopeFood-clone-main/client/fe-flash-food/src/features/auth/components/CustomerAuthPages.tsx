import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context';
import { Button, Input } from '@/components';
import { authApi } from '@/services/api/auth';
import { formatErrorMessage } from '@/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn, UserPlus } from 'lucide-react';

const loginSchema = z.object({
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const CustomerLogin: React.FC = () => {
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
      const response = await authApi.login({ ...data, role: 'customer' });
      login(response.token, response.user);
      navigate('/app');
    } catch (err) {
      setErrorMsg(formatErrorMessage(err, 'Đăng nhập thất bại. Vui lòng thử lại.'));
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <LogIn className="h-8 w-8 text-primary" />
          Đăng nhập
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Nhập tài khoản của bạn để khám phá hàng ngàn món ăn ngon!
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
            label="Số điện thoại"
            type="tel"
            placeholder="0901234567"
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

        <div className="flex justify-end">
          <Link to="#" className="text-sm font-semibold text-primary hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary-hover text-white py-3 font-bold rounded-xl shadow-md transition-all active:scale-95 mt-2"
        >
          {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập ngay'}
        </Button>
      </form>

      <div className="text-center text-sm text-slate-600">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="font-bold text-primary hover:underline">
          Đăng ký ngay
        </Link>
      </div>

      {/* Switch Portal Footer Link */}
      <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-x-4">
        <Link to="/merchant/login" className="hover:text-slate-800 underline transition-colors">
          Dành cho Chủ Quán
        </Link>
        <span>•</span>
        <Link to="/driver/login" className="hover:text-slate-800 underline transition-colors">
          Dành cho Tài Xế
        </Link>
      </div>
    </div>
  );
};

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Tên quá ngắn').max(50, 'Tên quá dài'),
    phone: z.string().min(10, 'Số điện thoại không hợp lệ').max(15, 'Số điện thoại quá dài'),
    password: z
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Mật khẩu phải bao gồm cả chữ và số'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const CustomerRegister: React.FC = () => {
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
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setErrorMsg('');
      const response = await authApi.register({
        fullName: data.fullName,
        phone: data.phone,
        password: data.password,
        role: 'customer',
      });
      // Tự động đăng nhập sau khi đăng ký thành công
      login(response.token, response.user);
      navigate('/app');
    } catch (err) {
      setErrorMsg(formatErrorMessage(err, 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'));
    }
  };

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary" />
          Đăng ký mới
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Tạo tài khoản mới để nhận ngay voucher giảm 50k đơn đầu tiên!
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
            label="Họ và tên"
            type="text"
            placeholder="Nguyễn Văn A"
            {...register('fullName')}
            error={errors.fullName?.message}
          />
        </div>

        <div>
          <Input
            label="Số điện thoại"
            type="tel"
            placeholder="0901234567"
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

        <div>
          <Input
            label="Xác nhận Mật khẩu"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary-hover text-white py-3 font-bold rounded-xl shadow-md transition-all active:scale-95 mt-2"
        >
          {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
        </Button>
      </form>

      <div className="text-center text-sm text-slate-600">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-bold text-primary hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};
