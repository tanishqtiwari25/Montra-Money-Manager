import React, { useEffect, useState } from 'react';
import { categoriesApi } from '../../services/categories.api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Expense',
    icon: 'Tag',
  });

  const loadCategories = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await categoriesApi.getCategories(type);
      const data = response?.data || response?.items || response || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Categories load nahi hui.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [type]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await categoriesApi.createCategory(formData);
      setFormData({
        name: '',
        type: 'Expense',
        icon: 'Tag',
      });
      setIsModalOpen(false);
      await loadCategories();
    } catch (err) {
      alert(err?.message || 'Category create nahi hui.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Delete this category?')) {
      return;
    }

    try {
      await categoriesApi.deleteCategory(id);
      await loadCategories();
    } catch (err) {
      alert(err?.message || 'Category delete nahi hui.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Categories
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your income and expense categories.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          + Add Category
        </Button>
      </div>

      <div className="flex gap-2">
        {['', 'Income', 'Expense'].map((item) => (
          <button
            key={item || 'all'}
            onClick={() => setType(item)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
              type === item
                ? 'border-emerald-500 text-emerald-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            {item || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={loadCategories} />
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Create your first income or expense category."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const id = category.id || category._id;

            return (
              <div
                key={id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {category.type || 'Expense'}
                    </p>
                  </div>

                  <span className="text-xl">
                    {category.icon || '🏷️'}
                  </span>
                </div>

                {Array.isArray(category.subCategories) &&
                  category.subCategories.length > 0 && (
                    <div className="mt-4 space-y-1">
                      {category.subCategories.map((sub) => (
                        <div
                          key={sub.id || sub._id}
                          className="text-xs text-slate-500 dark:text-slate-400"
                        >
                          • {sub.name}
                        </div>
                      ))}
                    </div>
                  )}

                <button
                  onClick={() => handleDelete(id)}
                  className="mt-4 text-xs text-rose-500 hover:text-rose-600"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Category"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="e.g. Food"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
              Type
            </label>

            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value,
                }))
              }
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm"
            >
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
          </div>

          <Input
            label="Icon"
            value={formData.icon}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                icon: e.target.value,
              }))
            }
            placeholder="Food"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" isLoading={submitting}>
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
