import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../services/settings.api';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import Loader from '../../components/common/Loader';

export const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currency: 'INR',
    theme: 'system',
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await settingsApi.getProfile();
        const user = response?.data || response;
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          currency: user?.currency || 'INR',
          theme: user?.theme || 'system',
        });
      } catch (err) {
        console.error('Settings fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsApi.updateProfile({
        name: formData.name,
        currency: formData.currency,
        theme: formData.theme,
      });
      alert('Settings successfully save ho gayi hain!');
    } catch (err) {
      alert(err?.message || 'Settings update me problem aayi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Apne profile preferences aur currency settings customize karo.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            value={formData.email}
            disabled
            className="opacity-60 cursor-not-allowed"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
              Primary Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" isLoading={saving}>
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};