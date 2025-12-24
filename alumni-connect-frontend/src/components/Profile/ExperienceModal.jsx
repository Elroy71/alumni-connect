import React, { useState } from 'react';
import { X, Save, Briefcase } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ExperienceModal = ({ show, onClose, onSave, initialData = null, loading = false }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        company: initialData?.company || '',
        location: initialData?.location || '',
        employmentType: initialData?.employmentType || 'Full-time',
        startDate: initialData?.startDate ? initialData.startDate.split('T')[0] : '',
        endDate: initialData?.endDate ? initialData.endDate.split('T')[0] : '',
        isCurrentJob: initialData?.isCurrentJob || false,
        description: initialData?.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-dark-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-primary-600" />
                        </div>
                        <h2 className="font-display font-bold text-xl text-dark-900">
                            {initialData ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
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
                        label="Posisi *"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Senior Software Engineer"
                        required
                    />

                    <Input
                        label="Perusahaan *"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. PT Tech Indonesia"
                        required
                    />

                    <Input
                        label="Lokasi"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Jakarta, Indonesia"
                    />

                    <div>
                        <label className="block text-sm font-semibold text-dark-700 mb-2">
                            Tipe Pekerjaan
                        </label>
                        <select
                            name="employmentType"
                            value={formData.employmentType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Freelance">Freelance</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Tanggal Mulai *"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Tanggal Selesai"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            disabled={formData.isCurrentJob}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isCurrentJob"
                            name="isCurrentJob"
                            checked={formData.isCurrentJob}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-600 rounded border-dark-300 focus:ring-primary-500"
                        />
                        <label htmlFor="isCurrentJob" className="text-sm font-medium text-dark-700">
                            Saya masih bekerja di posisi ini
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-dark-700 mb-2">
                            Deskripsi
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                            placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
                        />
                    </div>

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

export default ExperienceModal;
