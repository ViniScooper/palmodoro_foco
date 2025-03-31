// filepath: c:\Users\vini\Music\Palmodoro_foco\src\components\Cronometro.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cronometro = ({ onViewUserData }) => {
  const [viewMode, setViewMode] = useState('clock'); // Alterna entre 'clock' e 'timer'
  const [currentTime, setCurrentTime] = useState(new Date()); // Relógio atual
  const [timerInput, setTimerInput] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activities, setActivities] = useState([]);

  // Atualiza o relógio atual a cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Atualiza o temporizador quando está rodando
  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert('Temporizador concluído!');

      // Salva a sessão no cache do navegador (localStorage)
      const userId = localStorage.getItem('userId');
      const activityId = activities.find((a) => !a.completed)?.id || null;
      const durationSeconds =
        timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds;
      const completedAt = new Date().toISOString();

      // Recupera as sessões já salvas (se houver) e adiciona a nova sessão
      const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      sessions.push({ userId, activityId, durationSeconds, completedAt });
      localStorage.setItem('sessions', JSON.stringify(sessions));

      alert('Sessão registrada localmente!');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, timerInput, activities]);

  // Busca as atividades ao montar o componente
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/activities', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setActivities(response.data);
      } catch (error) {
        console.error('Erro ao carregar atividades:', error);
      }
    };

    fetchActivities();
  }, []);

  const startTimer = () => {
    const totalSeconds =
      timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsTimerRunning(true);
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(0);
    setTimerInput({ hours: 0, minutes: 0, seconds: 0 });
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addNewActivity = () => {
    const title = prompt('Digite o nome da nova atividade:');
    if (title) {
      axios
        .post(
          'http://localhost:5000/activities',
          { 
            userId: localStorage.getItem('userId'),
            title 
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          setActivities([
            ...activities,
            {
              id: response.data.activityId,
              title,
              completed: false,
            },
          ]);
        })
        .catch((error) => {
          console.error('Erro ao salvar atividade:', error);
          alert('Erro ao salvar a atividade');
        });
    }
  };

  const toggleCompletion = (id) => {
    axios
      .put(
        `http://localhost:5000/activities/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then(() => {
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === id ? { ...activity, completed: !activity.completed } : activity
          )
        );
      })
      .catch((error) => console.error('Erro ao atualizar atividade:', error));
  };

  const deleteActivity = (id) => {
    axios
      .delete(`http://localhost:5000/activities/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        setActivities((prev) => prev.filter((activity) => activity.id !== id));
      })
      .catch((error) => console.error('Erro ao excluir atividade:', error));
  };

  const handleViewUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:5000/user/${userId}`);
      console.log(response.data);
      alert('Dados do usuário carregados. Veja o console para mais detalhes.');
    } catch (error) {
      alert('Erro ao carregar os dados do usuário');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessions');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-500 flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold text-gray-800">Palmodoro</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sair
          </button>
        </div>
        <button
          onClick={onViewUserData}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 mb-6"
        >
          Ver Dados do Usuário
        </button>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setViewMode('clock')}
            className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
              viewMode === 'clock'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Relógio
          </button>
          <button
            onClick={() => setViewMode('timer')}
            className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
              viewMode === 'timer'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Temporizador
          </button>
        </div>

        {viewMode === 'clock' && (
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-800 mb-2">
              {currentTime.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </h2>
            <p className="text-xl text-gray-600">
              {currentTime.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )}

        {viewMode === 'timer' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Temporizador</h2>
            <div className="text-6xl font-extrabold text-blue-500 mb-4">{formatTime(timeLeft)}</div>
            {!isTimerRunning && (
              <div className="flex justify-center gap-3 mb-4">
                <input
                  type="number"
                  min="0"
                  value={timerInput.hours}
                  onChange={(e) =>
                    setTimerInput({ ...timerInput, hours: parseInt(e.target.value) || 0 })
                  }
                  className="w-20 px-3 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Horas"
                />
                <input
                  type="number"
                  min="0"
                  value={timerInput.minutes}
                  onChange={(e) =>
                    setTimerInput({ ...timerInput, minutes: parseInt(e.target.value) || 0 })
                  }
                  className="w-20 px-3 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minutos"
                />
                <input
                  type="number"
                  min="0"
                  value={timerInput.seconds}
                  onChange={(e) =>
                    setTimerInput({ ...timerInput, seconds: parseInt(e.target.value) || 0 })
                  }
                  className="w-20 px-3 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Segundos"
                />
              </div>
            )}
            <div className="flex justify-center gap-4">
              {!isTimerRunning ? (
                <button
                  onClick={startTimer}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Iniciar
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(false)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                >
                  Pausar
                </button>
              )}
              <button
                onClick={resetTimer}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Reiniciar
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Atividades</h2>
          <button
            onClick={addNewActivity}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-200 mb-4"
          >
            Adicionar Atividade
          </button>
          <ul className="space-y-3">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className={`flex items-center justify-between p-4 rounded-lg transition duration-200 ${
                  activity.completed ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                <span
                  className={`flex-1 ${
                    activity.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {activity.title}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleCompletion(activity.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                  >
                    {activity.completed ? 'Desfazer' : 'Concluir'}
                  </button>
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Cronometro;
