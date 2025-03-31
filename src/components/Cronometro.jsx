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

      // Registrar a sessão no backend
      const userId = localStorage.getItem('userId'); // Obtém o ID do usuário do localStorage
      const activityId = activities.find((a) => !a.completed)?.id || null; // Obtém a atividade atual (opcional)
      const durationSeconds =
        timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds;
      const completedAt = new Date().toISOString(); // Data e hora atual

      axios
        .post('http://localhost:5000/sessions', {
          userId,
          activityId,
          durationSeconds,
          completedAt,
        })
        .then(() => {
          alert('Sessão registrada com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao registrar a sessão:', error);
          alert('Erro ao registrar a sessão.');
        });
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
    // Atualiza no backend
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
        // Atualiza localmente
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === id ? { ...activity, completed: !activity.completed } : activity
          )
        );
      })
      .catch((error) => console.error('Erro ao atualizar atividade:', error));
  };

  const deleteActivity = (id) => {
    // Deleta no backend
    axios
      .delete(`http://localhost:5000/activities/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        // Atualiza localmente
        setActivities((prev) => prev.filter((activity) => activity.id !== id));
      })
      .catch((error) => console.error('Erro ao excluir atividade:', error));
  };

  const handleViewUserData = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Assumindo que o ID do usuário está salvo no localStorage
      const response = await axios.get(`http://localhost:5000/user/${userId}`);
      console.log(response.data); // Exibe os dados do usuário e atividades concluídas no console
      alert('Dados do usuário carregados. Veja o console para mais detalhes.');
    } catch (error) {
      alert('Erro ao carregar os dados do usuário');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-2xl min-h-screen flex flex-col text-black">
      <h1 className="text-3xl font-bold text-center mb-4">Palmodoro</h1>

      {/* Botão para acessar os dados do usuário */}
      <button
        onClick={onViewUserData}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Ver Dados do Usuário
      </button>

      {/* Botões para alternar entre Relógio e Temporizador */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setViewMode('clock')}
          className={`px-4 py-2 rounded ${
            viewMode === 'clock' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
          }`}
        >
          Relógio
        </button>
        <button
          onClick={() => setViewMode('timer')}
          className={`px-4 py-2 rounded ${
            viewMode === 'timer' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
          }`}
        >
          Temporizador
        </button>
      </div>

      {/* Exibição do Relógio */}
      {viewMode === 'clock' && (
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2">
            {currentTime.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
          </h2>
          <div className="text-2xl text-gray-700">
            {currentTime.toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      )}

      {/* Exibição do Temporizador */}
      {viewMode === 'timer' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Temporizador</h2>
          <div className="text-5xl font-extrabold mb-4">{formatTime(timeLeft)}</div>

          {!isTimerRunning && (
            <div className="flex gap-2 justify-center mb-4">
              <input
                type="number"
                min="0"
                value={timerInput.hours}
                onChange={(e) =>
                  setTimerInput({
                    ...timerInput,
                    hours: parseInt(e.target.value) || 0,
                  })
                }
                className="w-20 px-2 py-1 border rounded text-center"
                placeholder="Horas"
              />
              <input
                type="number"
                min="0"
                value={timerInput.minutes}
                onChange={(e) =>
                  setTimerInput({
                    ...timerInput,
                    minutes: parseInt(e.target.value) || 0,
                  })
                }
                className="w-20 px-2 py-1 border rounded text-center"
                placeholder="Minutos"
              />
              <input
                type="number"
                min="0"
                value={timerInput.seconds}
                onChange={(e) =>
                  setTimerInput({
                    ...timerInput,
                    seconds: parseInt(e.target.value) || 0,
                  })
                }
                className="w-20 px-2 py-1 border rounded text-center"
                placeholder="Segundos"
              />
            </div>
          )}

          <div className="flex gap-2 justify-center">
            {!isTimerRunning ? (
              <button
                onClick={startTimer}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Iniciar
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(false)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Pausar
              </button>
            )}
            <button
              onClick={resetTimer}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reiniciar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Atividades */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Atividades</h2>
        <button
          onClick={addNewActivity}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Adicionar Atividade
        </button>
        <ul className="space-y-2">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className={`flex items-center justify-between p-4 rounded ${
                activity.completed ? 'bg-green-200' : 'bg-gray-200'
              }`}
            >
              <span
                className={`flex-1 ${
                  activity.completed ? 'line-through text-gray-500' : 'text-black'
                }`}
              >
                {activity.title}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleCompletion(activity.id)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  {activity.completed ? 'Desfazer' : 'Concluir'}
                </button>
                <button
                  onClick={() => deleteActivity(activity.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Cronometro;
