import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building, MapPin, DollarSign, FileText, Users } from 'lucide-react';
import { CREATE_JOB, CREATE_COMPANY } from '../../graphql/job.mutations';
import { GET_COMPANIES } from '../../graphql/job.queries';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    type: 'FULL_TIME',
    level: 'MID',
    location: '',
    isRemote: false,
    salaryMin: '',
    salaryMax: '',
    skills: '',
    benefits: '',
    applicationUrl: '',
    deadline: '',
    companyId: ''
  });

  const [companyForm, setCompanyForm] = useState({
    name: '',
    description: '',
    website: '',
    logo: '',
    industry: '',
    size: '',
    location: '',
    founded: ''
  });

  const { data: companiesData } = useQuery(GET_COMPANIES);

const [createJob, { loading: jobLoading }] = useMutation(CREATE_JOB, {
    onCompleted: (data) => {
      console.log('Job created successfully:', data);
      alert('Job posted successfully!');
      navigate(`/dashboard/jobs/${data.createJob.id}`);
    },
    onError: (error) => {
      console.error('Create job error:', error);
      console.error('Error details:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
      });
      alert(`Error: ${error.message}`);
    }
  });

  const [createCompany, { loading: companyLoading }] = useMutation(CREATE_COMPANY, {
    onCompleted: (data) => {
      console.log('Company created successfully:', data);
      setJobForm({ ...jobForm, companyId: data.createCompany.id });
      setShowCreateCompany(false);
      alert('Company created successfully!');
    },
    onError: (error) => {
      console.error('Create company error:', error);
      console.error('Error details:', {
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
      });
      alert(`Error: ${error.message}`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!jobForm.title || !jobForm.description || !jobForm.requirements || !jobForm.responsibilities) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await createJob({
        variables: {
          input: {
            title: jobForm.title,
            description: jobForm.description,
            requirements: jobForm.requirements,
            responsibilities: jobForm.responsibilities,
            type: jobForm.type,
            level: jobForm.level,
            location: jobForm.location,
            isRemote: jobForm.isRemote,
            salaryMin: jobForm.salaryMin ? parseInt(jobForm.salaryMin) : undefined,
            salaryMax: jobForm.salaryMax ? parseInt(jobForm.salaryMax) : undefined,
            skills: jobForm.skills ? jobForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
            benefits: jobForm.benefits ? jobForm.benefits.split(',').map(b => b.trim()).filter(Boolean) : [],
            applicationUrl: jobForm.applicationUrl || undefined,
            deadline: jobForm.deadline || undefined,
            companyId: jobForm.companyId || undefined
          }
        }
      });
    } catch (error) {
      console.error('Create job error:', error);
    }
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();

    if (!companyForm.name) {
      alert('Company name is required');
      return;
    }

    try {
      await createCompany({
        variables: {
          input: {
            name: companyForm.name,
            description: companyForm.description || undefined,
            website: companyForm.website || undefined,
            logo: companyForm.logo || undefined,
            industry: companyForm.industry || undefined,
            size: companyForm.size || undefined,
            location: companyForm.location || undefined,
            founded: companyForm.founded ? parseInt(companyForm.founded) : undefined
          }
        }
      });
    } catch (error) {
      console.error('Create company error:', error);
    }
  };

  const companies = companiesData?.companies || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-dark-900 mb-2">
          Post Lowongan Kerja
        </h1>
        <p className="text-dark-600">
          Bagikan peluang karir untuk sesama alumni
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-center gap-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-dark-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-dark-200'}`}>
            1
          </div>
          <span className="font-semibold">Job Info</span>
        </div>
        <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary-600' : 'bg-dark-200'}`} />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-dark-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-dark-200'}`}>
            2
          </div>
          <span className="font-semibold">Details</span>
        </div>
        <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary-600' : 'bg-dark-200'}`} />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary-600' : 'text-dark-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-dark-200'}`}>
            3
          </div>
          <span className="font-semibold">Review</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card padding="lg">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-dark-900 flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Informasi Dasar
              </h2>

              <Input
                label="Posisi / Job Title *"
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-dark-900 mb-2">Tipe Pekerjaan *</label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    required
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FREELANCE">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-dark-900 mb-2">Level *</label>
                  <select
                    value={jobForm.level}
                    onChange={(e) => setJobForm({ ...jobForm, level: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    required
                  >
                    <option value="ENTRY">Entry Level</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="MID">Mid Level</option>
                    <option value="SENIOR">Senior</option>
                    <option value="LEAD">Lead</option>
                    <option value="MANAGER">Manager</option>
                    <option value="DIRECTOR">Director</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Lokasi *"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  placeholder="Jakarta, Indonesia"
                  icon={<MapPin className="w-5 h-5" />}
                  required
                />

                <div className="flex items-center gap-2 mt-8">
                  <input
                    type="checkbox"
                    id="remote"
                    checked={jobForm.isRemote}
                    onChange={(e) => setJobForm({ ...jobForm, isRemote: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-200"
                  />
                  <label htmlFor="remote" className="font-semibold text-dark-900">
                    Remote Work Available
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Company (Optional)</label>
                <div className="flex gap-3">
                  <select
                    value={jobForm.companyId}
                    onChange={(e) => setJobForm({ ...jobForm, companyId: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">No Company (Post as Individual)</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateCompany(true)}
                  >
                    <Building className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => setStep(2)}
                >
                  Next Step →
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <Card padding="lg">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-dark-900 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Detail Pekerjaan
              </h2>

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Deskripsi Pekerjaan *</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  rows={6}
                  placeholder="Jelaskan tentang pekerjaan ini..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Requirements *</label>
                <textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  rows={6}
                  placeholder="- Bachelor's degree in Computer Science&#10;- 3+ years experience in React&#10;- Strong problem-solving skills"
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Responsibilities *</label>
                <textarea
                  value={jobForm.responsibilities}
                  onChange={(e) => setJobForm({ ...jobForm, responsibilities: e.target.value })}
                  rows={6}
                  placeholder="- Develop and maintain web applications&#10;- Collaborate with design team&#10;- Write clean, maintainable code"
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Skills (pisahkan dengan koma)</label>
                <Input
                  value={jobForm.skills}
                  onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                  placeholder="React, Node.js, GraphQL, PostgreSQL"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Benefits (pisahkan dengan koma)</label>
                <Input
                  value={jobForm.benefits}
                  onChange={(e) => setJobForm({ ...jobForm, benefits: e.target.value })}
                  placeholder="Health Insurance, Remote Work, Learning Budget"
                />
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={() => setStep(3)}
                >
                  Next Step →
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Additional Info */}
        {step === 3 && (
          <Card padding="lg">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-dark-900 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Informasi Tambahan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Gaji Minimum (IDR)"
                  type="number"
                  value={jobForm.salaryMin}
                  onChange={(e) => setJobForm({ ...jobForm, salaryMin: e.target.value })}
                  placeholder="5000000"
                />

                <Input
                  label="Gaji Maximum (IDR)"
                  type="number"
                  value={jobForm.salaryMax}
                  onChange={(e) => setJobForm({ ...jobForm, salaryMax: e.target.value })}
                  placeholder="10000000"
                />
              </div>

              <Input
                label="Link Aplikasi Eksternal (Optional)"
                value={jobForm.applicationUrl}
                onChange={(e) => setJobForm({ ...jobForm, applicationUrl: e.target.value })}
                placeholder="https://company.com/careers/apply"
              />

              <Input
                label="Deadline (Optional)"
                type="date"
                value={jobForm.deadline}
                onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
              />

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(2)}
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={jobLoading}
                  disabled={jobLoading}
                >
                  {jobLoading ? 'Posting...' : 'Post Job'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </form>

      {/* Create Company Modal */}
      {showCreateCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card padding="lg" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-display font-bold text-2xl text-dark-900 mb-6">
              Create Company Profile
            </h2>

            <form onSubmit={handleCreateCompany} className="space-y-6">
              <Input
                label="Company Name *"
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                placeholder="PT. Tech Indonesia"
                required
              />

              <div>
                <label className="block font-semibold text-dark-900 mb-2">Description</label>
                <textarea
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  rows={4}
                  placeholder="About the company..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Website"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  placeholder="https://company.com"
                />

                <Input
                  label="Logo URL"
                  value={companyForm.logo}
                  onChange={(e) => setCompanyForm({ ...companyForm, logo: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Industry"
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                  placeholder="Technology"
                />

                <Input
                  label="Company Size"
                  value={companyForm.size}
                  onChange={(e) => setCompanyForm({ ...companyForm, size: e.target.value })}
                  placeholder="100-500 employees"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Location"
                  value={companyForm.location}
                  onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                  placeholder="Jakarta, Indonesia"
                />

                <Input
                  label="Founded Year"
                  type="number"
                  value={companyForm.founded}
                  onChange={(e) => setCompanyForm({ ...companyForm, founded: e.target.value })}
                  placeholder="2020"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={companyLoading}
                  disabled={companyLoading}
                  fullWidth
                >
                  {companyLoading ? 'Creating...' : 'Create Company'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setShowCreateCompany(false)}
                  disabled={companyLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreateJobPage;