import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/button';
import { useToast } from './components/ui/use-toast';
import { Toaster } from './components/ui/toaster';
import { Plus, Check, Trash2 } from 'lucide-react';

function App() {
  const [time, setTime] = useState(new Date());
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Exercício matinal", completed: false },
      { id: 2, title: "Reunião de equipe", completed: false },
      { id: 3, title: "Estudar", completed: false }
    ];
  });
  const { toast, toasts } = useToast();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const toggleActivity = (id) => {
    setActivities(activities.map(activity => 
      activity.id === id 
        ? { ...activity, completed: !activity.completed }
        : activity
    ));

    const activity = activities.find(a => a.id === id);
    toast({
      title: activity.completed ? "Atividade pendente" : "Atividade concluída",
      description: activity.title,
    });
  };

  const deleteActivity = (id) => {
    setActivities(activities.filter(activity => activity.id !== id));
    toast({
      title: "Atividade removida",
      variant: "destructive",
    });
  };

  const addNewActivity = () => {
    const title = prompt("Digite o nome da nova atividade:");
    if (title) {
      const newActivity = {
        id: Date.now(),
        title,
        completed: false
      };
      setActivities([...activities, newActivity]);
      toast({
        title: "Nova atividade adicionada",
        description: title,
      });
    }
  };

  return (
    <div className="clock-container">
      <div className="clock-time">{time.toLocaleTimeString()}</div>
      <div className="clock-date">{time.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</div>
      <div className="activity-list">
        <Button onClick={addNewActivity}>
          <Plus /> Adicionar
        </Button>
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <Button onClick={() => toggleActivity(activity.id)}>
              {activity.completed ? <Check /> : <Plus />}
            </Button>
            <span>{activity.title}</span>
            <Button onClick={() => deleteActivity(activity.id)}>
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>
      <Toaster toasts={toasts} />
    </div>
  );
}

export default App;