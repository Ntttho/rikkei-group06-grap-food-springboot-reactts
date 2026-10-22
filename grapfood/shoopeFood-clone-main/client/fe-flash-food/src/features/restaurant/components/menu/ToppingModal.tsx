import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Modal, Input, Button } from '@/components';
import { Topping } from '@/types';
import { createTopping, updateTopping } from '@/services/api/toppings';

const toppingSchema = z.object({
  name: z.string().min(2, 'Tên topping phải có ít nhất 2 ký tự').max(100, 'Tên quá dài'),
  price: z.number().min(0, 'Giá không được âm'),
  isAvailable: z.boolean(),
  defaultQuantity: z.number().min(0, 'Số lượng không được âm'),
  currentQuantity: z.number().min(0, 'Số lượng không được âm'),
});

type ToppingFormValues = z.infer<typeof toppingSchema>;

interface ToppingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  topping?: Topping | null;
  restaurantId: number;
}

export const ToppingModal: React.FC<ToppingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  topping,
  restaurantId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ToppingFormValues>({
    resolver: zodResolver(toppingSchema),
    defaultValues: {
      name: '',
      price: 0,
      isAvailable: true,
      defaultQuantity: 100,
      currentQuantity: 100,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (topping) {
        setValue('name', topping.name);
        setValue('price', topping.price);
        setValue('isAvailable', topping.isAvailable ?? true);
        setValue('defaultQuantity', topping.defaultQuantity ?? 100);
        setValue('currentQuantity', topping.currentQuantity ?? 100);
      } else {
        reset({
          name: '',
          price: 0,
          isAvailable: true,
          defaultQuantity: 100,
          currentQuantity: 100,
        });
      }
    }
  }, [isOpen, topping, setValue, reset]);

  const onSubmit = async (data: ToppingFormValues) => {
    try {
      if (topping) {
        await updateTopping(topping.id, data);
      } else {
        await createTopping(restaurantId, data);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      alert(errorObj?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={topping ? 'Cập nhật Topping' : 'Thêm Topping Mới'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Tên Topping"
          placeholder="VD: Trân châu trắng"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label="Giá bán (VNĐ)"
          type="number"
          placeholder="VD: 5000"
          {...register('price', { valueAsNumber: true })}
          error={errors.price?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Số lượng tối đa"
            type="number"
            {...register('defaultQuantity', { valueAsNumber: true })}
            error={errors.defaultQuantity?.message}
          />
          <Input
            label="Số lượng hiện tại"
            type="number"
            {...register('currentQuantity', { valueAsNumber: true })}
            error={errors.currentQuantity?.message}
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="isAvailable"
            {...register('isAvailable')}
            className="w-5 h-5 text-primary rounded border-slate-300 focus:ring-primary"
          />
          <label htmlFor="isAvailable" className="text-slate-700 font-semibold cursor-pointer">
            Đang mở bán
          </label>
        </div>
        {errors.isAvailable && (
          <p className="text-sm text-rose-500 mt-1">{errors.isAvailable.message}</p>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
