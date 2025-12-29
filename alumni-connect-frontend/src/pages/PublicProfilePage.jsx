import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
    User,
    MapPin,
    Briefcase,
    Calendar,
    Award,
    BookOpen,
    Linkedin,
    Github,
    Globe,
    CheckCircle,
    ExternalLink
} from 'lucide-react';
import { PUBLIC_PROFILE_QUERY } from '../graphql/profile.queries';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const PublicProfilePage = () => {
    const { cardNumber } = useParams();
    const { data, loading, error } = useQuery(PUBLIC_PROFILE_QUERY, {
        variables: { cardNumber },
        skip: !cardNumber
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !data?.publicProfile) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil Tidak Ditemukan</h2>
                    <p className="text-gray-600 mb-6">
                        Alumni card number tidak valid atau profil alumni tidak ditemukan.
                    </p>
                    <Link to="/">
                        <Button variant="primary">Kembali ke Beranda</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const profile = data.publicProfile;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header / Cover */}
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="h-48 bg-gradient-to-r from-primary-600 to-secondary-600 relative">
                        {profile.coverImage && (
                            <img
                                src={profile.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover opacity-50"
                            />
                        )}
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold border border-white/30">
                            VERIFIED ALUMNI
                        </div>
                    </div>

                    <div className="px-6 pb-6 relative">
                        <div className="flex flex-col sm:flex-row items-end -mt-16 mb-6 gap-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt={profile.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <User className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center" title="Verified">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            <div className="flex-1 pb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{profile.fullName}</h1>
                                <p className="text-lg text-primary-600 font-medium">{profile.currentPosition || 'Alumni Telkom University'} {profile.currentCompany && `at ${profile.currentCompany}`}</p>
                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{profile.major} ' {profile.batch}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Lulus {profile.graduationYear}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mb-2">
                                {profile.linkedinUrl && (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-[#0077b5] hover:bg-blue-50 rounded-lg transition-colors">
                                        <Linkedin className="w-6 h-6" />
                                    </a>
                                )}
                                {profile.githubUrl && (
                                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Github className="w-6 h-6" />
                                    </a>
                                )}
                                {profile.portfolioUrl && (
                                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                        <Globe className="w-6 h-6" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {profile.bio && (
                            <div className="mb-6">
                                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-center p-4 bg-primary-50 rounded-xl border border-primary-100 text-center">
                            <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
                            <span className="text-primary-800 font-medium">Valid Alumni Card Member</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Experience */}
                        {profile.experiences?.length > 0 && (
                            <Card>
                                <div className="flex items-center gap-2 mb-4">
                                    <Briefcase className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-bold text-lg text-gray-900">Pengalaman Kerja</h3>
                                </div>
                                <div className="space-y-6">
                                    {profile.experiences.map((exp) => (
                                        <div key={exp.id} className="relative pl-6 border-l-2 border-gray-100 last:border-0 pb-6 last:pb-0">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-100 border-2 border-white"></div>
                                            <h4 className="font-bold text-gray-900">{exp.title}</h4>
                                            <p className="text-gray-600 text-sm mb-1">{exp.company}</p>
                                            <p className="text-gray-400 text-xs">
                                                {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrentJob ? 'Sekarang' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ''}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Education */}
                        {profile.education?.length > 0 && (
                            <Card>
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-bold text-lg text-gray-900">Pendidikan</h3>
                                </div>
                                <div className="space-y-4">
                                    {profile.education.map((edu) => (
                                        <div key={edu.id} className="flex gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <BookOpen className="w-6 h-6 text-gray-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{edu.institution}</h4>
                                                <p className="text-gray-600 text-sm">{edu.degree} - {edu.fieldOfStudy}</p>
                                                <p className="text-gray-400 text-xs">
                                                    {new Date(edu.startDate).getFullYear()} - {edu.isCurrentStudy ? 'Sekarang' : new Date(edu.endDate).getFullYear()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Achievements */}
                        {profile.achievements?.length > 0 && (
                            <Card>
                                <div className="flex items-center gap-2 mb-4">
                                    <Award className="w-5 h-5 text-primary-600" />
                                    <h3 className="font-bold text-lg text-gray-900">Penghargaan</h3>
                                </div>
                                <div className="grid gap-4">
                                    {profile.achievements.map((item) => (
                                        <div key={item.id} className="p-3 bg-gray-50 rounded-lg flex items-start gap-3">
                                            <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-sm text-gray-900">{item.title}</h4>
                                                <p className="text-xs text-gray-500">{item.issuer} • {new Date(item.issueDate).getFullYear()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Skills */}
                        {profile.skillsList?.length > 0 && (
                            <Card>
                                <h3 className="font-bold text-gray-900 mb-4">Keahlian</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skillsList.map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Footer Brand */}
                        <div className="text-center p-6 text-gray-400">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-white font-bold">
                                    AC
                                </div>
                                <span className="font-display font-bold text-gray-600">AlumniConnect</span>
                            </div>
                            <p className="text-xs">
                                Platform Jejaring Alumni Telkom University
                            </p>
                            <Link to="/" className="text-primary-600 text-xs hover:underline mt-2 inline-block">
                                Gabung Sekarang
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfilePage;
