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
    
    
    const url = isLogin ? 'http://192.168.1.10:5000/login' : 'http://192.168.1.10:5000/register';

    try {
      const response = await axios.post(url, formData);
      alert(response.data.message);

      if (isLogin) {
        // Salva o token no localStorage (opcional)
        localStorage.setItem('token', response.data.token);

        // Chama a função onLogin para redirecionar
        onLogin();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao processar a solicitação');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Cadastro'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Senha</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>
      <p className="mt-4 text-center">
        {isLogin ? 'Não possui uma conta?' : 'Já possui uma conta?'}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 underline"
        >
          {isLogin ? 'Cadastre-se' : 'Faça login'}
        </button>
      </p>
    </div>
  );
};

export default LoginRegister;