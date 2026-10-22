import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Receipt,
  Wallet,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Map,
  AlertTriangle,
  Tag,
} from 'lucide-react';
import { useAuth, useCart } from '@/context';
import { formatCurrency } from '@/utils';
import { Button } from '@/components';
import { useDebounce } from '@/hooks/useDebounce';
import { orderApi, ValidateVoucherResponse } from '@/services/api/order';

type PaymentMethod = 'CASH' | 'QR' | 'E_WALLET';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Bán kính trái đất (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const RESTAURANT_LOC = [21.036237, 105.789139]; // Cầu Giấy
const MAX_DISTANCE = 15;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalPrice, clearCart, restaurantId } = useCart();
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [address, setAddress] = useState('144 Xuân Thủy, Cầu Giấy, Hà Nội');
  const debouncedAddress = useDebounce(address, 1000);
  const [distance, setDistance] = useState<number | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Voucher states
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<ValidateVoucherResponse | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  useEffect(() => {
    if (!debouncedAddress) {
      setDistance(null);
      return;
    }
    setIsGeocoding(true);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedAddress)}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const dist = calculateDistance(RESTAURANT_LOC[0], RESTAURANT_LOC[1], lat, lon);
          setDistance(dist);
        } else {
          setDistance(null);
        }
      })
      .finally(() => setIsGeocoding(false));
  }, [debouncedAddress]);

  let shippingFee = 0;
  if (items.length > 0) {
    if (distance !== null) {
      if (distance <= 3) {
        shippingFee = 15000;
      } else {
        shippingFee = 15000 + Math.ceil(distance - 3) * 5000;
      }
    } else {
      shippingFee = 15000;
    }
  }

  const subtotal = totalPrice;
  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * appliedVoucher.discountValue) / 100;
      // Cap at discountValue if the backend enforces a max, but backend returns pre-calculated discountAmount
      discountAmount = appliedVoucher.discountAmount;
    } else {
      discountAmount = appliedVoucher.discountValue;
    }
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }
  }

  const finalTotal = subtotal + shippingFee - discountAmount;
  const isTooFar = distance !== null && distance > MAX_DISTANCE;
  const cannotFindAddress = distance === null && debouncedAddress.length > 0;

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setIsApplyingVoucher(true);
    setVoucherError(null);
    try {
      const result = await orderApi.validateVoucher(voucherCode.trim(), subtotal);
      setAppliedVoucher(result);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setVoucherError(errorObj?.response?.data?.message || 'Mã giảm giá không hợp lệ');
      setAppliedVoucher(null);
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    setVoucherError(null);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0 || isTooFar || !restaurantId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const orderItems = items.map((item) => ({
        foodId: item.foodId,
        foodName: item.name,
        quantity: item.quantity,
        priceAtOrder: item.price,
        toppings: item.toppings.map((t) => ({
          id: t.id,
          toppingId: t.id,
          toppingName: t.name,
          priceAtOrder: t.price,
          quantity: 1,
        })),
      }));

      const payload = {
        restaurantId,
        voucherId: appliedVoucher?.id,
        receiverAddress: address,
        receiverLat: 21.036237, // Hardcoded for demo
        receiverLng: 105.789139, // Hardcoded for demo
        distanceKm: distance || 2,
        baseFee: 15000,
        shippingType: 'STANDARD' as const,
        discountAmount: discountAmount,
        taxAmount: 0,
        items: orderItems,
      };

      const order = await orderApi.createOrder(payload);

      if (method === 'QR') {
        navigate('/payment/qr');
        return;
      }

      if (method === 'E_WALLET') {
        navigate(`/mock-gateway/${order.id}`);
        return;
      }

      clearCart();
      localStorage.setItem(`order_address_${order.id}`, address);
      navigate(`/tracking?orderId=${order.id}`);
    } catch (err: unknown) {
      console.error('Failed to create order:', err);
      if (err instanceof Error) {
        setError(err.message || 'Lỗi khi đặt hàng. Vui lòng thử lại!');
      } else {
        setError('Lỗi không xác định khi đặt hàng.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Receipt className="h-20 w-20 text-slate-200 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Giỏ hàng trống</h2>
        <p className="text-slate-500 mb-8 max-w-md">
          Bạn chưa chọn món ăn nào. Hãy quay lại cửa hàng để chọn cho mình những món ngon nhé!
        </p>
        <Button onClick={() => navigate('/app')} className="rounded-full px-8">
          Khám phá món ngon
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-300 mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-6">
        <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/app')}>
          Trang chủ
        </span>
        <span>/</span>
        <span className="text-slate-900">Thanh toán</span>
      </div>

      <h1 className="text-3xl font-black text-slate-900 mb-8">Xác nhận đơn hàng</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column - Details */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Address Card */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Giao hàng đến
              </h2>
              <button className="text-sm font-bold text-primary hover:text-rose-700 transition-colors">
                Thay đổi
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="font-bold text-slate-800 mb-1">
                {user?.fullName || user?.name || 'Khách hàng'}
              </p>
              <p className="text-sm font-medium text-slate-600 mb-2">
                {user?.phone || '0123456789'}
              </p>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-primary"
                placeholder="Nhập địa chỉ nhận hàng chi tiết..."
              />
            </div>

            {/* Distance Indicator */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              {isGeocoding ? (
                <span className="text-slate-500 animate-pulse">Đang định vị địa chỉ...</span>
              ) : distance !== null ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <Map className="w-4 h-4 text-emerald-500" />
                    Khoảng cách: {distance.toFixed(1)} km
                  </span>
                  {isTooFar && (
                    <span className="text-rose-600 font-semibold flex items-center gap-1 ml-2">
                      <AlertTriangle className="w-4 h-4" />
                      Quá xa (Chỉ giao &lt; 15km)
                    </span>
                  )}
                </div>
              ) : cannotFindAddress ? (
                <span className="text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Không thể định vị được địa chỉ này
                </span>
              ) : null}
            </div>
          </section>

          {/* Payment Methods */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5 text-primary" />
              Phương thức thanh toán
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  method === 'CASH'
                    ? 'border-primary bg-rose-50/50'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    name="payment_method"
                    className="w-4 h-4 text-primary bg-slate-100 border-slate-300 focus:ring-primary"
                    checked={method === 'CASH'}
                    onChange={() => setMethod('CASH')}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Tiền mặt (COD)</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    Thanh toán cho tài xế khi nhận hàng
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  method === 'QR'
                    ? 'border-primary bg-rose-50/50'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    name="payment_method"
                    className="w-4 h-4 text-primary bg-slate-100 border-slate-300 focus:ring-primary"
                    checked={method === 'QR'}
                    onChange={() => setMethod('QR')}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      Thanh toán mã QR <QrCode className="h-4 w-4 text-slate-400" />
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    Mở ứng dụng ngân hàng và quét mã
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  method === 'E_WALLET'
                    ? 'border-primary bg-rose-50/50'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    name="payment_method"
                    className="w-4 h-4 text-primary bg-slate-100 border-slate-300 focus:ring-primary"
                    checked={method === 'E_WALLET'}
                    onChange={() => setMethod('E_WALLET')}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Ví điện tử ZaloPay/MoMo</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    Chuyển hướng an toàn đến cổng thanh toán
                  </p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column - Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-28">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Chi tiết hóa đơn</h3>

            <div className="space-y-4 mb-6 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between gap-4 text-sm font-medium">
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">{item.quantity}x</span>
                    <span className="text-slate-800">{item.name}</span>
                  </div>
                  <span className="text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3 text-sm font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính</span>
                <span className="text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Phí giao hàng</span>
                <span className="text-slate-900">{formatCurrency(shippingFee)}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá (Voucher)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Voucher Section */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1">
                <Tag className="w-4 h-4 text-primary" /> Khuyến mãi
              </h4>
              {!appliedVoucher ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá..."
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary uppercase"
                      disabled={isApplyingVoucher}
                    />
                    <Button
                      onClick={handleApplyVoucher}
                      disabled={isApplyingVoucher || !voucherCode.trim()}
                      className="px-4 py-2 rounded-lg"
                    >
                      {isApplyingVoucher ? '...' : 'Áp dụng'}
                    </Button>
                  </div>
                  {voucherError && (
                    <p className="text-xs text-rose-500 font-medium">{voucherError}</p>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-500 text-white p-1 rounded-md">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-700">{appliedVoucher.code}</p>
                      <p className="text-xs text-emerald-600 font-medium">Đã áp dụng thành công</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    className="text-xs font-bold text-emerald-700 hover:text-rose-600 underline"
                  >
                    Bỏ mã
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-center mb-6">
              <span className="text-base font-bold text-slate-900">Tổng thanh toán</span>
              <span className="text-2xl font-black text-primary">{formatCurrency(finalTotal)}</span>
            </div>

            <div className="bg-amber-50 rounded-xl p-3 mb-6 flex items-start gap-2 border border-amber-100">
              <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-amber-800 leading-relaxed">
                Đơn hàng của bạn được bảo vệ bởi FlashFood. Miễn phí hoàn hủy nếu đối tác không xác
                nhận trong 5 phút.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm border border-rose-100 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              className={`w-full h-14 rounded-xl text-[15px] ${isTooFar ? 'bg-slate-400 hover:bg-slate-400 cursor-not-allowed' : ''}`}
              onClick={handlePlaceOrder}
              disabled={isSubmitting || isTooFar}
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? 'Đang xử lý...' : isTooFar ? 'Không thể đặt đơn' : 'Đặt đơn ngay'}
                {!isSubmitting && !isTooFar && <ArrowRight className="h-5 w-5" />}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
