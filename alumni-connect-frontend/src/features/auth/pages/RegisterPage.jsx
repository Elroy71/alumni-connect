import React from 'react';
import AuthLayout from '../../../layouts/AuthLayout';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Bergabung dengan Alumni Connect"
      subtitle="Daftar sekarang dan mulai terhubung dengan alumni"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;