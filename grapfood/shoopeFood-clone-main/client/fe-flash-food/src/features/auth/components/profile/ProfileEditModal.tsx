import React from 'react';
import { Modal, Input, Button } from '@/components';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@/features/auth/types/auth.types';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Tên quá ngắn').nonempty('Vui lòng nhập họ tên'),
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: (data: Partial<User>) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdate,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // Giả lập call API mất 1 giây
    setTimeout(() => {
      onUpdate(data);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cập nhật hồ sơ">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Họ và Tên"
          placeholder="Nhập họ và tên..."
          {...register('fullName')}
          error={errors.fullName?.message}
        />
        <Input
          label="Số điện thoại"
          placeholder="09xx..."
          {...register('phone')}
          error={errors.phone?.message}
        />
        <Input
          label="Email"
          type="email"
          placeholder="email@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
