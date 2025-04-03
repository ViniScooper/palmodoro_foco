// filepath: src/components/LoginRegister.jsx
import React, { useState } from 'react';
import axios from 'axios';

const LoginRegister = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin ? 'http://100.66.7.63:5000/login' : 'http://100.66.7.63:5000/register';

    try {
      const response = await axios.post(url, formData);
      console.log('Resposta do backend:', response.data);
      alert(response.data.message);

      if (isLogin) {
        if (response.data.userId) {
          localStorage.setItem('userId', response.data.userId);
        } else {
          console.error('userId não retornado pelo backend');
        }
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        onLogin();
      }
    } catch (error) {
      console.error('Erro na requisição:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Erro ao processar a solicitação');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Entrar' : 'Cadastro'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          {isLogin ? 'Não possui uma conta?' : 'Já possui uma conta?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 font-medium hover:underline"
          >
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginRegister;
