import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserData = ({ onBack }) => {
  const [userData, setUserData] = useState(null);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log('User ID:', userId); // Log do userId
        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        console.log('Response:', response.data); // Log da resposta do backend
        setUserData(response.data.user);
        setCompletedActivities(response.data.completedActivities);
      } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error);
        alert('Erro ao carregar os dados do usuário');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token'); // Obtenha o token do localStorage

        const response = await axios.get(`http://localhost:5000/sessions/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSessions(response.data);
      } catch (error) {
        console.error('Erro ao carregar as sessões:', error);
        alert('Erro ao carregar as sessões.');
      }
    };

    fetchSessions();
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
              className="w-full p-2 border rounded text-black" // Adiciona text-black para o texto preto
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Email</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full p-2 border rounded text-black" // Adiciona text-black para o texto preto
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
      <h2 className="text-2xl font-bold mt-6">Sessões Registradas</h2>
<ul className="space-y-2 mt-4">
  {sessions.map((session) => (
    <li key={session.id} className="p-4 bg-blue-200 rounded">
      <p><strong>Atividade:</strong> {session.activity_title || 'Sem atividade'}</p>
      <p><strong>Duração:</strong> {Math.floor(session.duration_seconds / 60)} minutos</p>
      <p><strong>Concluído em:</strong> {new Date(session.completed_at).toLocaleString('pt-BR')}</p>
    </li>
  ))}
</ul>
    </div>
  );
};

export default UserData;