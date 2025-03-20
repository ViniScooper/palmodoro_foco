import React, { useState } from 'react';
import LoginRegister from './components/LoginRegister'; // Componente de login/cadastro
import Cronometro from './components/Cronometro'; // Página principal do app

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar autenticação

  // Renderiza a tela de login/cadastro se o usuário não estiver autenticado
  if (!isAuthenticated) {
    return <LoginRegister onLogin={() => setIsAuthenticated(true)} />;
  }

  // Renderiza a página principal (Cronômetro) se o usuário estiver autenticado
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Cronometro />
    </div>
  );
}

export default App;
