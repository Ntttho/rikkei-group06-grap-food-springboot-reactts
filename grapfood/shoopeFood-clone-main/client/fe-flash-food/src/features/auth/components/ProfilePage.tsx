import React, { useState } from 'react';
import { useAuth } from '@/context';
import { ProfileSidebar } from './profile/ProfileSidebar';
import { ProfileInfoTab } from './profile/ProfileInfoTab';
import { ProfileOrdersTab } from './profile/ProfileOrdersTab';
import { ProfileAddressesTab } from './profile/ProfileAddressesTab';
import { ProfileEditModal } from './profile/ProfileEditModal';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'addresses'>('info');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <ProfileSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'info' && (
          <ProfileInfoTab user={user} onOpenEditModal={() => setIsEditModalOpen(true)} />
        )}
        {activeTab === 'addresses' && <ProfileAddressesTab />}
        {activeTab === 'orders' && <ProfileOrdersTab />}
      </div>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onUpdate={updateUser}
      />
    </div>
  );
};
