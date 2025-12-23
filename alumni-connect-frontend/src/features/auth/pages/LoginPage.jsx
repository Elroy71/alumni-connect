import React from 'react';
import AuthLayout from '../../../layouts/AuthLayout';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <AuthLayout
      title="Selamat Datang Kembali!"
      subtitle="Masuk ke akun Anda untuk melanjutkan"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;