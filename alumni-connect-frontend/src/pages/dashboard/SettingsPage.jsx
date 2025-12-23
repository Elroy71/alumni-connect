import React, { useState } from 'react';
import { Lock, Bell, Eye, Shield, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
          Pengaturan
        </h1>
        <p className="text-dark-600">
          Kelola akun dan preferensi Anda
        </p>
      </div>

      {/* Change Password */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-xl text-dark-900 mb-1">
              Ganti Password
            </h2>
            <p className="text-dark-600 text-sm">
              Ubah password Anda secara berkala untuk keamanan akun
            </p>
          </div>
        </div>

        <form className="space-y-4">
          <Input
            type="password"
            label="Password Lama"
            placeholder="Masukkan password lama"
          />
          <Input
            type="password"
            label="Password Baru"
            placeholder="Masukkan password baru"
          />
          <Input
            type="password"
            label="Konfirmasi Password Baru"
            placeholder="Konfirmasi password baru"
          />
          <Button variant="primary" size="md">
            Update Password
          </Button>
        </form>
      </Card>

      {/* Notifications */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <Bell className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-xl text-dark-900 mb-1">
              Notifikasi
            </h2>
            <p className="text-dark-600 text-sm">
              Atur preferensi notifikasi Anda
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
            <div className="flex-1">
              <p className="font-semibold text-dark-900 mb-1">Push Notifications</p>
              <p className="text-sm text-dark-600">Terima notifikasi di aplikasi</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
            <div className="flex-1">
              <p className="font-semibold text-dark-900 mb-1">Email Notifications</p>
              <p className="text-sm text-dark-600">Terima notifikasi via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Privacy */}
      <Card padding="lg">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <Eye className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-xl text-dark-900 mb-1">
              Privasi
            </h2>
            <p className="text-dark-600 text-sm">
              Kontrol siapa yang bisa melihat informasi Anda
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
            <span className="font-semibold text-dark-900">Profile Publik</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
            <span className="font-semibold text-dark-900">Tampilkan Email</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card padding="lg" className="border-2 border-red-200 bg-red-50">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-xl text-dark-900 mb-1">
              Danger Zone
            </h2>
            <p className="text-dark-600 text-sm">
              Tindakan irreversible - gunakan dengan hati-hati
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" size="md" className="border-red-300 text-red-600 hover:bg-red-100">
            Deactivate Account
          </Button>
          <Button variant="danger" size="md">
            Delete Account Permanently
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;