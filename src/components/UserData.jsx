import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserData = ({ onBack }) => {
  const [userData, setUserData] = useState(null);
  const [completedActivities, setCompletedActivities] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log('User ID:', userId);
        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        console.log('Response:', response.data);
        setUserData(response.data.user);
        setCompletedActivities(response.data.completedActivities);
      } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error);
        alert('Erro ao carregar os dados do usuário');
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:5000/user/${userData.id}`, userData);
      alert('Dados do usuário atualizados com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar os dados do usuário');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-blue-500 rounded-xl shadow-2xl min-h-screen flex flex-col text-white">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
      >
        Voltar
      </button>
      <h1 className="text-3xl font-bold text-center mb-4">Dados do Usuário</h1>
      {userData && (
        <div>
          <div className="mb-4">
            <label className="block text-white">Nome</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="w-full p-2 border rounded text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Email</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full p-2 border rounded text-black"
            />
          </div>
          <button
            onClick={handleUpdateUser}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Atualizar Dados
          </button>
        </div>
      )}
      {/* A seção de "Sessões Registradas" foi removida conforme solicitado */}
    </div>
  );
};

export default UserData;
