import React, { useState } from 'react';
import LoginRegister from './components/LoginRegister'; // Componente de login/cadastro
import Cronometro from './components/Cronometro'; // Página principal do app
import UserData from './components/UserData'; // Importa o componente UserData

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar autenticação
  const [view, setView] = useState('cronometro'); // Alterna entre 'cronometro' e 'userData'

  // Renderiza a tela de login/cadastro se o usuário não estiver autenticado
  if (!isAuthenticated) {
    return <LoginRegister onLogin={() => setIsAuthenticated(true)} />;
  }

  // Renderiza a página principal ou a tela de dados do usuário
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {view === 'cronometro' ? (
        <Cronometro onViewUserData={() => setView('userData')} />
      ) : (
        <UserData onBack={() => setView('cronometro')} />
      )}
    </div>
  );
}

export default App;
