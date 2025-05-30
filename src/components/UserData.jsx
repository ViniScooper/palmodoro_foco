import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserData = ({ onBack }) => {
  const [userData, setUserData] = useState(null);
  const [completedActivities, setCompletedActivities] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`http://100.66.7.63:5000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUserData(response.data.user);
        setCompletedActivities(response.data.completedActivities);
      } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error);
        alert(`Erro: ${error.response?.data?.message || error.message}`);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://100.66.7.63:5000/user/${userData.id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Dados do usuário atualizados com sucesso!');
    } catch (error) {
      alert(`Erro ao atualizar: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-green-300 transition duration-200"
        >
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Dados do Usuário
        </h1>
        {userData && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nome

                
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <button
              onClick={handleUpdateUser}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Atualizar Dados
            </button>

            {/* Exibição das atividades concluídas */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Atividades Concluídas</h2>
              {completedActivities.length > 0 ? (
                <ul className="space-y-3">
                  {completedActivities.map((activity) => (
                    <li
                      key={activity.id}
                      className="p-4 bg-green-100 rounded-lg text-gray-800"
                    >
                      {activity.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Nenhuma atividade concluída.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserData;