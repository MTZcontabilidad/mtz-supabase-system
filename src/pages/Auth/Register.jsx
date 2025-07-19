import React, { useState } from 'react';
import useAuth from '@/hooks/useAuth.js';
import { useNavigate, Link } from 'react-router-dom';
import {
  LineChart,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        nombre_completo: formData.fullName,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          'Cuenta creada exitosamente. Revisa tu email para confirmar.'
        );
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError('Error inesperado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4'>
      <div className='max-w-md w-full space-y-8'>
        {/* Logo y título */}
        <div className='text-center'>
          <div className='flex justify-center items-center mb-4'>
            <div className='bg-blue-600 p-3 rounded-xl'>
              <LineChart className='w-8 h-8 text-white' />
            </div>
          </div>
          <h2 className='text-3xl font-bold text-gray-900'>Crear Cuenta</h2>
          <p className='text-gray-600 mt-2'>MTZ Ouroborus AI</p>
        </div>

        {/* Formulario */}
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Nombre completo */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Nombre Completo
              </label>
              <div className='relative'>
                <User className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
                <Input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder='Tu nombre completo'
                  className='pl-10'
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
                <Input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='tu@email.com'
                  className='pl-10'
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Contraseña
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='••••••••'
                  className='pl-10 pr-10'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <EyeOff className='w-5 h-5' />
                  ) : (
                    <Eye className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Confirmar Contraseña
              </label>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
                <Input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder='••••••••'
                  className='pl-10'
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className='flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg'>
                <AlertCircle className='w-4 h-4' />
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className='flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg'>
                <CheckCircle className='w-4 h-4' />
                {success}
              </div>
            )}

            {/* Submit */}
            <Button
              type='submit'
              disabled={loading}
              className='w-full'
              size='lg'
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          {/* Links */}
          <div className='mt-6 text-center'>
            <div className='text-sm text-gray-600'>
              ¿Ya tienes cuenta?{' '}
              <Link to='/login' className='text-blue-600 hover:text-blue-800'>
                Inicia sesión aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
