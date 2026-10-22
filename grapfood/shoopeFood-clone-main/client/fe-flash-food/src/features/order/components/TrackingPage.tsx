import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';
import { CheckCircle2, Clock, ChefHat, Bike } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { orderApi } from '@/services/api/order';

type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

const STATUS_STEPS = [
  { id: 'PENDING', label: 'Chờ xác nhận', icon: Clock },
  { id: 'PREPARING', label: 'Quán chuẩn bị', icon: ChefHat },
  { id: 'DELIVERING', label: 'Đang giao hàng', icon: Bike },
  { id: 'COMPLETED', label: 'Hoàn thành', icon: CheckCircle2 },
];

const mapStatusToStep = (backendStatus: string): string => {
  if (['CONFIRMED', 'DRIVER_ACCEPTED', 'PICKING_UP'].includes(backendStatus)) {
    return 'PREPARING';
  }
  return backendStatus;
};

const getHeading = (from: [number, number], to: [number, number]) => {
  const y = Math.sin(((to[1] - from[1]) * Math.PI) / 180) * Math.cos((to[0] * Math.PI) / 180);
  const x =
    Math.cos((from[0] * Math.PI) / 180) * Math.sin((to[0] * Math.PI) / 180) -
    Math.sin((from[0] * Math.PI) / 180) *
      Math.cos((to[0] * Math.PI) / 180) *
      Math.cos(((to[1] - from[1]) * Math.PI) / 180);
  return (Math.atan2(y, x) * 180) / Math.PI;
};

const motoIcon = (heading: number) =>
  L.divIcon({
    className: 'moto-marker',
    html: `<div class="moto-pin" style="--heading:${heading}deg"><svg viewBox="0 0 64 44" aria-hidden="true"><circle cx="16" cy="32" r="8"></circle><circle cx="48" cy="32" r="8"></circle><path d="M18 32h12l8-13h8l6 13"></path><path d="M29 32l-7-14h12l6 14"></path><path d="M41 18h10l5-5"></path><path d="M26 12h11"></path></svg></div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

const pinIcon = (type: 'restaurant' | 'home') =>
  L.divIcon({
    className: `tracking-pin ${type}`,
    html: type === 'home' ? '🏠' : '🏪',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

function MapAutoFit({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [map, points]);
  return null;
}

export const TrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { isConnected, joinOrderRoom, leaveOrderRoom, onOrderStatusUpdated } = useSocket();
  const [status, setStatus] = useState<OrderStatus>('PENDING');
  // Lấy trạng thái ban đầu từ server
  useEffect(() => {
    if (orderId) {
      orderApi
        .getOrderById(Number(orderId))
        .then((order) => {
          if (order && order.statusCode) {
            setStatus(mapStatusToStep(order.statusCode) as OrderStatus);
          }
        })
        .catch(console.error);
    }
  }, [orderId]);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [restaurantLocation, setRestaurantLocation] = useState<[number, number] | null>(null);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [driverPos, setDriverPos] = useState<[number, number] | null>(null);
  const [heading, setHeading] = useState(0);
  const [routeIndex, setRouteIndex] = useState(0);

  useEffect(() => {
    const addressStr = orderId ? localStorage.getItem(`order_address_${orderId}`) : null;
    const defaultFallback = () => {
      const loc: [number, number] = [21.036237, 105.789139];
      setUserLocation(loc);
      setRestaurantLocation([loc[0] - 0.015, loc[1] + 0.015]);
    };

    if (addressStr) {
      // Dùng Nominatim API (OpenStreetMap) để lấy toạ độ thực tế từ địa chỉ người dùng nhập
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressStr)}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const loc: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            setUserLocation(loc);
            let latOffsetStr = localStorage.getItem(`tracking_latoffset_${orderId}`);
            let lngOffsetStr = localStorage.getItem(`tracking_lngoffset_${orderId}`);
            if (!latOffsetStr || !lngOffsetStr) {
              const latOffset = (Math.random() - 0.5) * 0.03;
              const lngOffset = (Math.random() - 0.5) * 0.03;
              localStorage.setItem(`tracking_latoffset_${orderId}`, latOffset.toString());
              localStorage.setItem(`tracking_lngoffset_${orderId}`, lngOffset.toString());
              latOffsetStr = latOffset.toString();
              lngOffsetStr = lngOffset.toString();
            }
            setRestaurantLocation([
              loc[0] + parseFloat(latOffsetStr),
              loc[1] + parseFloat(lngOffsetStr),
            ]);
          } else {
            // Nếu không tìm thấy địa chỉ (nhập bừa), fallback về toạ độ mặc định
            defaultFallback();
          }
        })
        .catch(defaultFallback);
    } else {
      defaultFallback();
    }
  }, [orderId]);

  useEffect(() => {
    if (userLocation && restaurantLocation) {
      fetch(
        `https://router.project-osrm.org/route/v1/driving/${restaurantLocation[1]},${restaurantLocation[0]};${userLocation[1]},${userLocation[0]}?overview=full&geometries=geojson`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.routes && data.routes[0]) {
            const coords = data.routes[0].geometry.coordinates.map(
              (c: number[]) => [c[1], c[0]] as [number, number]
            );
            setRoutePoints(coords);
            setDriverPos(coords[0]);
          }
        });
    }
  }, [userLocation, restaurantLocation]);

  useEffect(() => {
    if (status === 'DELIVERING' && routePoints.length > 0 && routeIndex < routePoints.length) {
      const startTimeKey = `tracking_start_${orderId}`;
      let startStr = localStorage.getItem(startTimeKey);
      if (!startStr) {
        startStr = Date.now().toString();
        localStorage.setItem(startTimeKey, startStr);
      }
      const startTime = parseInt(startStr, 10);
      const expectedIndex = Math.floor((Date.now() - startTime) / 600);

      if (routeIndex === 0 && expectedIndex > 0) {
        const newIndex = Math.min(expectedIndex, routePoints.length - 1);
        setRouteIndex(newIndex);
        setDriverPos(routePoints[newIndex]);
        if (newIndex > 0 && newIndex < routePoints.length) {
          setHeading(getHeading(routePoints[newIndex - 1], routePoints[newIndex]));
        }
        return undefined; // Let the next render start the interval from newIndex
      }

      const interval = setInterval(() => {
        setRouteIndex((prev) => {
          const next = prev + 1;
          if (next >= routePoints.length) {
            clearInterval(interval);
            setStatus('COMPLETED');
            return prev;
          }
          const currPos = routePoints[prev];
          const nextPos = routePoints[next];
          setDriverPos(nextPos);
          setHeading(getHeading(currPos, nextPos));
          return next;
        });
      }, 600);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [status, routePoints, routeIndex, orderId]);

  useEffect(() => {
    if (orderId && isConnected) {
      joinOrderRoom(orderId);
    }
    return () => {
      if (orderId) leaveOrderRoom(orderId);
    };
  }, [orderId, isConnected, joinOrderRoom, leaveOrderRoom]);

  useEffect(() => {
    const unsubscribe = onOrderStatusUpdated((data: unknown) => {
      const payload = data as { status?: string; statusCode?: string };
      const newStatus = payload.statusCode || payload.status;
      if (newStatus) {
        setStatus(mapStatusToStep(newStatus) as OrderStatus);
      }
    });
    return () => unsubscribe();
  }, [onOrderStatusUpdated]);

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.id === mapStatusToStep(status));

  const mapBounds = useMemo(() => {
    const pts: [number, number][] = [];
    if (userLocation) pts.push(userLocation);
    if (restaurantLocation) pts.push(restaurantLocation);
    if (driverPos) pts.push(driverPos);
    return pts;
  }, [userLocation, restaurantLocation, driverPos]);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Không tìm thấy đơn hàng</p>
      </div>
    );
  }

  return (
    <div className="max-w-250 mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Trạng thái Đơn hàng</h1>
            <p className="text-slate-500 font-medium mt-1">Mã đơn: #{orderId}</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <div
              className={`h-2.5 w-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}
            />
            <span className="text-sm font-bold text-emerald-700">
              {isConnected ? 'Real-time Tracking' : 'Đang kết nối...'}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mb-12 px-4 md:px-12">
          <div className="absolute top-7 left-[10%] right-[10%] h-1.5 bg-slate-100 rounded-full" />
          <div
            className="absolute top-7 left-[10%] h-1.5 bg-primary rounded-full transition-all duration-700 ease-in-out"
            style={{
              width: `${(Math.max(0, currentStepIndex) / (STATUS_STEPS.length - 1)) * 80}%`,
            }}
          />

          <div className="relative flex justify-between">
            {STATUS_STEPS.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 w-24">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                      isActive
                        ? 'bg-primary border-rose-100 text-white shadow-lg shadow-rose-200'
                        : 'bg-white border-slate-100 text-slate-300'
                    } ${isCurrent ? 'scale-110' : ''}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm font-bold text-center transition-colors ${
                      isActive ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Container */}
        {userLocation && restaurantLocation && (
          <div className="w-full h-112.5 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
            <MapContainer
              center={restaurantLocation}
              zoom={14}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapAutoFit points={mapBounds} />

              {routePoints.length > 0 && (
                <Polyline positions={routePoints} color="#3b82f6" weight={5} opacity={0.7} />
              )}

              <Marker position={restaurantLocation} icon={pinIcon('restaurant')} />
              <Marker position={userLocation} icon={pinIcon('home')} />

              {driverPos && (status === 'PREPARING' || status === 'DELIVERING') && (
                <Marker position={driverPos} icon={motoIcon(heading)} />
              )}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};
