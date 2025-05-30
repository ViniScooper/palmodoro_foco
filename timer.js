function playBeepLoop() {
  const beep = new Audio('audio/beep_short.ogg');
  beep.volume = 1.0; // Corrigido
  beep.loop = true;
  beep.play();

  alert('Tempo acabou!');

  beep.pause();
  beep.currentTime = 0;
}

// Quando o timer acabar, chame:
// playBeepLoop();
