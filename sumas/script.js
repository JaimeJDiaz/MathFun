document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const num1Element = document.getElementById('num1');
    const num2Element = document.getElementById('num2');
    const optionButtons = [
        document.getElementById('option1'),
        document.getElementById('option2'),
        document.getElementById('option3'),
        document.getElementById('option4')
    ];
    const feedbackElement = document.getElementById('feedback');
    const characterElement = document.getElementById('character');
    const speechBubbleElement = document.getElementById('speech-bubble');
    const currentLevelElement = document.getElementById('current-level');
    const correctCountElement = document.getElementById('correct-count');
    const stars = [
        document.getElementById('star1'),
        document.getElementById('star2'),
        document.getElementById('star3'),
        document.getElementById('star4'),
        document.getElementById('star5'),
        document.getElementById('star6'),
        document.getElementById('star7'),
        document.getElementById('star8'),
        document.getElementById('star9'),
        document.getElementById('star10')
    ];

    // Variables del juego
    let lives = 5;
    let level = 1;
    let correctAnswers = 0;
    let correctAnswerIndex;
    let currentCorrect = 0;
    const answersPerLevel = 10;

    // Iniciar el juego
    startLevel();

    // Event listeners para los botones de opción
    optionButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            checkAnswer(index);
        });
    });

    function startLevel() {
        correctAnswers = 0;
        currentCorrect = 0;
        updateLevelInfo();
        updateHearts();
        resetStars();
        generateNewQuestion();
        showMessage(`Nivel ${level} - Sumas hasta ${getMaxNumber()}`);
    }

    function getMaxNumber() {
        // Aumenta el rango de números según el nivel
        return 10 + (level - 1) * 5;
    }

    function generateNewQuestion() {
        const maxNumber = getMaxNumber();
        num1 = Math.floor(Math.random() * maxNumber) + 1;
        num2 = Math.floor(Math.random() * maxNumber) + 1;
        const correctResult = num1 + num2;

        // Actualizar la pantalla
        num1Element.textContent = num1;
        num2Element.textContent = num2;

        // Generar opciones de respuesta
        const incorrectOptions = generateOptions(correctResult, maxNumber * 2);
        const allOptions = [correctResult, ...incorrectOptions];
        shuffleArray(allOptions);

        // Asignar las opciones a los botones
        optionButtons.forEach((button, index) => {
            button.textContent = allOptions[index];
            button.disabled = false;
            button.style.backgroundColor = 'var(--primary)';
            
            // Guardar cuál es la respuesta correcta
            if (allOptions[index] === correctResult) {
                correctAnswerIndex = index;
            }
        });

        // Animación
        document.querySelector('.operation-container').classList.add('animate__pulse');
        setTimeout(() => {
            document.querySelector('.operation-container').classList.remove('animate__pulse');
        }, 1000);
    }    

    function generateNewQuestion() {
        const maxNumber = getMaxNumber();
        num1 = Math.floor(Math.random() * maxNumber) + 1;
        num2 = Math.floor(Math.random() * maxNumber) + 1;
        const correctResult = num1 + num2;
        
        // Actualizar la pantalla
        num1Element.textContent = num1;
        num2Element.textContent = num2;
    
        // Generar 3 opciones incorrectas diferentes
        const incorrectOptions = generateIncorrectOptions(correctResult, maxNumber * 2);
        
        // Crear array con todas las opciones (correcta + incorrectas)
        const allOptions = [correctResult, ...incorrectOptions];
        
        // Mezclar las opciones aleatoriamente
        shuffleArray(allOptions);
        
        // Asignar las opciones a los botones
        optionButtons.forEach((button, index) => {
            button.textContent = allOptions[index];
            button.disabled = false;
            button.style.backgroundColor = 'var(--primary)';
            
            // Guardar cuál es la respuesta correcta
            if (allOptions[index] === correctResult) {
                correctAnswerIndex = index;
            }
        });
    
        // Animación
        document.querySelector('.operation-container').classList.add('animate__pulse');
        setTimeout(() => {
            document.querySelector('.operation-container').classList.remove('animate__pulse');
        }, 1000);
    }
    
    function generateIncorrectOptions(correctResult, maxPossible) {
        const options = new Set();
        
        // Generar opciones incorrectas cercanas a la respuesta correcta
        while (options.size < 3) {
            const difference = Math.floor(Math.random() * 5) + 1;
            const shouldAdd = Math.random() > 0.5;
            
            let option;
            if (shouldAdd) {
                option = correctResult + difference;
            } else {
                option = correctResult - difference;
            }
            
            // Asegurar que la opción es válida y diferente a la correcta
            if (option > 0 && option <= maxPossible && option !== correctResult) {
                options.add(option);
            }
            
            // Si no podemos generar opciones cercanas, generar aleatorias
            if (options.size < 3 && options.size / (Date.now() % 10 + 1) < 0.3) {
                const randomOption = Math.floor(Math.random() * maxPossible) + 1;
                if (randomOption !== correctResult) {
                    options.add(randomOption);
                }
            }
        }
        
        return Array.from(options);
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function checkAnswer(selectedIndex) {
        const isCorrect = selectedIndex === correctAnswerIndex;
    
        // Deshabilitar todos los botones después de seleccionar
        optionButtons.forEach(button => {
            button.disabled = true;
        });
    
        // Resaltar la respuesta correcta
        optionButtons[correctAnswerIndex].style.backgroundColor = 'var(--secondary)';
    
        if (isCorrect) {
            correctAnswers++;
            currentCorrect++;
            showFeedback("¡Correcto! 🎉", "correct");
            characterElement.classList.add('bounce');
            playSound('correct');
            
            // Llenar la estrella correspondiente
            if (correctAnswers <= answersPerLevel) {
                stars[correctAnswers - 1].classList.add('filled');
                stars[correctAnswers - 1].classList.add('celebrate');
            }
            
            setTimeout(() => {
                characterElement.classList.remove('bounce');
                
                if (correctAnswers < answersPerLevel) {
                    generateNewQuestion();
                    showMessage("¡Muy bien! Sigue así.");
                } else {
                    // Ganar una vida al completar el nivel (máximo 5)
                    if (lives < 5) {
                        lives++;
                        updateHearts();
                        document.getElementById('hearts').classList.add('heart-animation');
                        setTimeout(() => {
                            document.getElementById('hearts').classList.remove('heart-animation');
                        }, 1000);
                    }
                    levelUp();
                }
            }, 1000);
        } else {
            // Perder una vida
            lives--;
            updateHearts();
            document.getElementById('hearts').classList.add('lost-heart');
            setTimeout(() => {
                document.getElementById('hearts').classList.remove('lost-heart');
            }, 1000);
    
            showFeedback(`¡Ups! Era ${num1 + num2}`, "incorrect");
            optionButtons[selectedIndex].style.backgroundColor = 'var(--accent)';
            characterElement.classList.add('shake');
            playSound('incorrect');
            
            setTimeout(() => {
                characterElement.classList.remove('shake');
                
                if (lives <= 0) {
                    gameOver();
                } else {
                    generateNewQuestion();
                    showMessage(`¡Cuidado! Te quedan ${lives} vidas`);
                }
            }, 1500);
        }
    
        updateLevelInfo();
    }

    function gameOver() {
        showFeedback(`¡Juego terminado! Llegaste al nivel ${level}`, "incorrect");
        characterElement.textContent = '😢';
        showMessage("¡No te rindas! Inténtalo de nuevo");
        
        setTimeout(() => {
            if (confirm(`Llegaste al nivel ${level}. ¿Quieres jugar otra vez?`)) {
                // Reiniciar el juego
                level = 1;
                lives = 5;
                startLevel();
            }
        }, 1500);
    }
    

    function levelUp() {
        level++;
        const message = lives < 5 ? 
            `¡Nivel ${level - 1} completado! +1 vida 🏆` : 
            `¡Nivel ${level - 1} completado! 🏆`;
        
        showFeedback(message, "correct");
        characterElement.textContent = '🎉';
        characterElement.classList.add('celebrate');
        showMessage(`¡Avanzando al nivel ${level}!`);
        
        setTimeout(() => {
            characterElement.textContent = getRandomCharacter();
            characterElement.classList.remove('celebrate');
            startLevel();
        }, 2500);
    }

    function getRandomCharacter() {
        const characters = ['🐵', '🦊', '🐶', '🐱', '🐭', '🐻', '🐨', '🐯'];
        return characters[Math.floor(Math.random() * characters.length)];
    }

    function updateLevelInfo() {
        currentLevelElement.textContent = level;
        correctCountElement.textContent = correctAnswers;
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('filled', 'celebrate');
        });
    }

    function showFeedback(message, type) {
        feedbackElement.textContent = message;
        feedbackElement.className = 'feedback animate__animated animate__bounceIn';
        feedbackElement.classList.add(type);
        
        setTimeout(() => {
            feedbackElement.classList.remove('animate__bounceIn');
        }, 1000);
    }

    function showMessage(message) {
        speechBubbleElement.textContent = message;
        speechBubbleElement.style.opacity = '1';
        
        setTimeout(() => {
            speechBubbleElement.style.opacity = '0';
        }, 2000);
    }

    function playSound(type) {
        // En un juego real, aquí podrías incluir sonidos
        console.log(`Play ${type} sound`);
    }

    function updateHearts() {
        const heartsElement = document.getElementById('hearts');
        heartsElement.innerHTML = '❤️'.repeat(lives);
    }
});