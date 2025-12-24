import React, { useState } from 'react';
import { X, Save, GraduationCap } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const EducationModal = ({ show, onClose, onSave, initialData = null, loading = false }) => {
    const [formData, setFormData] = useState({
        institution: initialData?.institution || '',
        degree: initialData?.degree || '',
        fieldOfStudy: initialData?.fieldOfStudy || '',
        startDate: initialData?.startDate ? initialData.startDate.split('T')[0] : '',
        endDate: initialData?.endDate ? initialData.endDate.split('T')[0] : '',
        isCurrentStudy: initialData?.isCurrentStudy || false,
        grade: initialData?.grade || '',
        activities: initialData?.activities || '',
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
                        <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-secondary-600" />
                        </div>
                        <h2 className="font-display font-bold text-xl text-dark-900">
                            {initialData ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
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
                        label="Institusi *"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        placeholder="e.g. Universitas Indonesia"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Gelar *"
                            name="degree"
                            value={formData.degree}
                            onChange={handleChange}
                            placeholder="e.g. S1 - Bachelor"
                            required
                        />

                        <Input
                            label="Bidang Studi *"
                            name="fieldOfStudy"
                            value={formData.fieldOfStudy}
                            onChange={handleChange}
                            placeholder="e.g. Teknik Informatika"
                            required
                        />
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
                            disabled={formData.isCurrentStudy}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isCurrentStudy"
                            name="isCurrentStudy"
                            checked={formData.isCurrentStudy}
                            onChange={handleChange}
                            className="w-5 h-5 text-primary-600 rounded border-dark-300 focus:ring-primary-500"
                        />
                        <label htmlFor="isCurrentStudy" className="text-sm font-medium text-dark-700">
                            Saya masih menempuh pendidikan ini
                        </label>
                    </div>

                    <Input
                        label="IPK / Nilai"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        placeholder="e.g. 3.75"
                    />

                    <div>
                        <label className="block text-sm font-semibold text-dark-700 mb-2">
                            Aktivitas & Organisasi
                        </label>
                        <textarea
                            name="activities"
                            value={formData.activities}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                            placeholder="Organisasi, kegiatan kampus, dll..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-dark-700 mb-2">
                            Deskripsi
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                            placeholder="Ceritakan tentang pengalaman pendidikan Anda..."
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

export default EducationModal;
