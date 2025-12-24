import React, { useState } from 'react';
import { X, Save, Trophy } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AchievementModal = ({ show, onClose, onSave, initialData = null, loading = false }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        issuer: initialData?.issuer || '',
        issueDate: initialData?.issueDate ? initialData.issueDate.split('T')[0] : '',
        expiryDate: initialData?.expiryDate ? initialData.expiryDate.split('T')[0] : '',
        credentialId: initialData?.credentialId || '',
        credentialUrl: initialData?.credentialUrl || '',
        description: initialData?.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
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
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-dark-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-yellow-600" />
                        </div>
                        <h2 className="font-display font-bold text-xl text-dark-900">
                            {initialData ? 'Edit Penghargaan' : 'Tambah Penghargaan'}
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
                        label="Nama Penghargaan / Sertifikat *"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. AWS Certified Solutions Architect"
                        required
                    />

                    <Input
                        label="Penerbit *"
                        name="issuer"
                        value={formData.issuer}
                        onChange={handleChange}
                        placeholder="e.g. Amazon Web Services"
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Tanggal Terbit *"
                            name="issueDate"
                            type="date"
                            value={formData.issueDate}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Tanggal Kadaluarsa"
                            name="expiryDate"
                            type="date"
                            value={formData.expiryDate}
                            onChange={handleChange}
                        />
                    </div>

                    <Input
                        label="ID Kredensial"
                        name="credentialId"
                        value={formData.credentialId}
                        onChange={handleChange}
                        placeholder="e.g. AWS-CSA-2023-001"
                    />

                    <Input
                        label="URL Kredensial"
                        name="credentialUrl"
                        value={formData.credentialUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        type="url"
                    />

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
                            placeholder="Jelaskan tentang penghargaan atau sertifikat ini..."
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

export default AchievementModal;
