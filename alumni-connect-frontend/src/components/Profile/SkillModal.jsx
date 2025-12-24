import React, { useState } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const SkillModal = ({ show, onClose, onSave, initialData = null, loading = false }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        level: initialData?.level || 'Beginner',
        yearsOfExperience: initialData?.yearsOfExperience || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : null
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full">
                <div className="border-b border-dark-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-primary-600" />
                        </div>
                        <h2 className="font-display font-bold text-xl text-dark-900">
                            {initialData ? 'Edit Keahlian' : 'Tambah Keahlian'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-dark-400 hover:text-dark-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Input
                        label="Nama Keahlian *"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. React.js, Python, Data Analysis"
                        required
                    />

                    <div>
                        <label className="block text-sm font-semibold text-dark-700 mb-2">
                            Level
                        </label>
                        <select
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>

                    <Input
                        label="Tahun Pengalaman"
                        name="yearsOfExperience"
                        type="number"
                        min="0"
                        max="50"
                        value={formData.yearsOfExperience}
                        onChange={handleChange}
                        placeholder="e.g. 3"
                    />

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            icon={<Save className="w-5 h-5" />}
                            loading={loading}
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SkillModal;
