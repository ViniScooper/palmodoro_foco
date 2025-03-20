import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { useToast } from './components/ui/use-toast';
import { Toaster } from './components/ui/toaster';
import { Plus, Trash2, Clock, Timer } from 'lucide-react';

function App() {
  const [viewMode, setViewMode] = useState('clock');
  const [time, setTime] = useState(new Date());
  const [timerInput, setTimerInput] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('activities');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, title: 'Exercício matinal', completed: false },
          { id: 2, title: 'Reunião de equipe', completed: false },
          { id: 3, title: 'Estudar', completed: false },
        ];
  });
  const { toast, toasts } = useToast();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      toast({
        title: 'Temporizador concluído!',
        variant: 'default',
      });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

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

  const toggleCompletion = (id) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );

    const activity = activities.find((a) => a.id === id);
    toast({
      title: activity.completed ? 'Atividade pendente' : 'Atividade concluída',
      description: activity.title,
    });
  };

  const deleteActivity = (id) => {
    setActivities(activities.filter((activity) => activity.id !== id));
    toast({
      title: 'Atividade removida',
      variant: 'destructive',
    });
  };

  const addNewActivity = () => {
    const title = prompt('Digite o nome da nova atividade:');
    if (title) {
      const newActivity = {
        id: Date.now(),
        title,
        completed: false,
      };
      setActivities([...activities, newActivity]);
      toast({
        title: 'Nova atividade adicionada',
        description: title,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl min-h-screen flex flex-col text-white">
      {/* Header Section */}
      <div className="flex-none">
        <div className="view-switcher mb-6 flex justify-center gap-4">
          <Button
            variant={viewMode === 'clock' ? 'default' : 'outline'}
            onClick={() => setViewMode('clock')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Clock className="mr-2 h-4 w-4" /> Relógio
          </Button>
          <Button
            variant={viewMode === 'timer' ? 'default' : 'outline'}
            onClick={() => setViewMode('timer')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Timer className="mr-2 h-4 w-4" /> Temporizador
          </Button>
        </div>

        {viewMode === 'clock' ? (
          <div className="mb-6">
            <div className="text-5xl font-extrabold text-center mb-2">
              {time.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </div>
            <div className="text-center text-white/80">
              {time.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="text-5xl font-extrabold text-center mb-4">
              {formatTime(timeLeft)}
            </div>

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
                  className="w-20 px-2 py-1 border rounded text-center bg-white/20 text-white"
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
                  className="w-20 px-2 py-1 border rounded text-center bg-white/20 text-white"
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
                  className="w-20 px-2 py-1 border rounded text-center bg-white/20 text-white"
                  placeholder="Segundos"
                />
              </div>
            )}

            <div className="flex gap-2 justify-center">
              {!isTimerRunning ? (
                <Button
                  onClick={startTimer}
                  disabled={timeLeft > 0}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Iniciar
                </Button>
              ) : (
                <Button
                  onClick={() => setIsTimerRunning(false)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Pausar
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={resetTimer}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Reiniciar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Activities Section */}
      <div className="flex-1 overflow-y-auto mt-4">
        <Button
          className="w-full mb-4 bg-green-500 hover:bg-green-600 text-white"
          onClick={addNewActivity}
        >
          Adicionar +
        </Button>

        <div className="space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 bg-white/10 p-4 rounded-lg shadow-md"
            >
              <input
                type="checkbox"
                checked={activity.completed}
                onChange={() => toggleCompletion(activity.id)}
                className="w-6 h-6 rounded border-gray-300 text-green-500 focus:ring-green-500 focus:ring-2"
              />
              <span
                className={`flex-1 ${
                  activity.completed ? 'line-through text-gray-400' : 'text-white'
                }`}
              >
                {activity.title}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteActivity(activity.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Toaster toasts={toasts} />
    </div>
  );
}

export default App;
