import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
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
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('El nombre completo es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El correo electrónico es requerido');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });

      if (error) {
        setError(error.message || 'Error al crear la cuenta');
      } else {
        setSuccess('Cuenta creada exitosamente. Revisa tu correo para confirmar tu cuenta.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <div className='mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4'>
            <LineChart className='h-8 w-8 text-white' />
          </div>
          <h2 className='text-3xl font-bold text-gray-900'>Crear Cuenta</h2>
          <p className='mt-2 text-sm text-gray-600'>
            Únete a la plataforma MTZ Ouroborus AI
          </p>
        </div>

        {/* Formulario */}
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3'>
              <AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
              <p className='text-sm text-red-700'>{error}</p>
            </div>
          )}

          {success && (
            <div className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3'>
              <CheckCircle className='h-5 w-5 text-green-500 flex-shrink-0' />
              <p className='text-sm text-green-700'>{success}</p>
            </div>
          )}

          <div className='space-y-4'>
            <div className='relative'>
              <Input
                label='Nombre Completo'
                type='text'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                placeholder='Juan Pérez'
                required
                autoComplete='name'
              />
              <User className='absolute right-3 top-9 h-5 w-5 text-gray-400' />
            </div>

            <div className='relative'>
              <Input
                label='Correo Electrónico'
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='tu@email.com'
                required
                autoComplete='email'
              />
              <Mail className='absolute right-3 top-9 h-5 w-5 text-gray-400' />
            </div>

            <div className='relative'>
              <Input
                label='Contraseña'
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='••••••••'
                required
                autoComplete='new-password'
              />
              <button
                type='button'
                className='absolute right-3 top-9 text-gray-400 hover:text-gray-600'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>

            <div className='relative'>
              <Input
                label='Confirmar Contraseña'
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='••••••••'
                required
                autoComplete='new-password'
              />
              <button
                type='button'
                className='absolute right-3 top-9 text-gray-400 hover:text-gray-600'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          <Button
            type='submit'
            loading={loading}
            disabled={loading}
            className='w-full'
            size='lg'
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>

          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              ¿Ya tienes cuenta?{' '}
              <Link
                to='/login'
                className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className='text-center text-xs text-gray-500 space-y-2'>
          <p>Sistema MTZ Ouroborus AI</p>
          <p>Plataforma segura de gestión empresarial</p>
        </div>
      </div>
    </div>
  );
};

export default Register;