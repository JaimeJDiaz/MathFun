document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const emoji = document.getElementById('emoji');
    const countdown = document.getElementById('countdown');
    
    // Array de emojis de construcción
    const constructionEmojis = ['👷', '🚧', '🛠️', '🔨', '⛑️', '🏗️', '👷‍♀️', '👷‍♂️'];
    
    // Cambiar emoji al hacer clic
    emoji.addEventListener('click', function() {
        const randomIndex = Math.floor(Math.random() * constructionEmojis.length);
        emoji.textContent = constructionEmojis[randomIndex];
        createConfetti();
    });
    
    // Contador regresivo divertido
    let count = 10;
    const countdownInterval = setInterval(() => {
        countdown.textContent = `Tiempo estimado: ${count} ${count === 1 ? 'día' : 'días'}`;
        
        if (count <= 3) {
            countdown.style.color = '#E71D36';
            countdown.style.fontWeight = 'bold';
        }
        
        count--;
        
        if (count < 0) {
            clearInterval(countdownInterval);
            countdown.textContent = "¡Casi listo! Sigue intentando...";
            count = 10;
            setTimeout(() => {
                countdownInterval = setInterval(arguments.callee, 1000);
            }, 3000);
        }
    }, 1000);
    
    // Crear efecto de confeti
    function createConfetti() {
        const colors = ['#FF9F1C', '#E71D36', '#2EC4B6', '#4D96FF', '#FF6B6B'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = confetti.style.width;
            
            document.body.appendChild(confetti);
            
            // Eliminar confeti después de la animación
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    // Crear herramientas flotantes adicionales
    function createFloatingTools() {
        const tools = ['🔨', '🛠️', '⛏️', '🔧', '📐', '⚒️'];
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        
        for (let i = 0; i < 8; i++) {
            const tool = document.createElement('div');
            tool.className = 'tool';
            tool.textContent = tools[Math.floor(Math.random() * tools.length)];
            tool.style.left = `${Math.random() * containerWidth}px`;
            tool.style.top = `${Math.random() * containerHeight}px`;
            tool.style.animationDuration = `${Math.random() * 5 + 3}s`;
            
            document.body.appendChild(tool);
        }
    }
    
    createFloatingTools();
});
