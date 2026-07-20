// Quiz Module - Enhanced with timer
class QuizManager {
    constructor() {
        this.popup = document.getElementById('quiz-popup');
        this.questionNumber = document.getElementById('quiz-number');
        this.questionCategory = document.getElementById('quiz-category');
        this.questionText = document.getElementById('quiz-question');
        this.optionsContainer = document.getElementById('quiz-options');
        this.feedback = document.getElementById('quiz-feedback');
        this.timerElement = document.getElementById('quiz-timer');
        this.currentQuestion = null;
        this.questionCount = 0;
        this.isBossQuiz = false;
        this.bossQuestionsRequired = 5;
        this.bossQuestionsAnswered = 0;
        this.bossCorrectAnswers = 0;
        this.onQuizComplete = null;
        this.isPaused = false;
        this.quizTimer = null;
        this.timeLeft = 15;
        this.correctStreak = 0;
    }

    init() {
        this.setupOptionListeners();
    }

    setupOptionListeners() {
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (!this.popup.classList.contains('hidden')) {
                const key = parseInt(e.key);
                if (key >= 1 && key <= 4) {
                    const options = this.optionsContainer.querySelectorAll('.quiz-option');
                    if (options[key - 1]) {
                        const answerIndex = parseInt(options[key - 1].dataset.answer);
                        this.handleAnswer(answerIndex, options[key - 1]);
                    }
                }
            }
        });
    }

    show(isBoss = false) {
        this.isBossQuiz = isBoss;
        this.currentQuestion = questions.getRandomQuestion();
        
        if (!this.currentQuestion) {
            console.error('No question available');
            this.hide();
            if (this.onQuizComplete) {
                this.onQuizComplete(false);
            }
            return;
        }

        this.questionCount++;
        
        this.questionNumber.textContent = `Câu ${this.questionCount}`;
        this.questionCategory.textContent = this.currentQuestion.category || 'General';
        this.questionText.textContent = this.currentQuestion.question;
        
        // Clear and create options
        this.optionsContainer.innerHTML = '';
        this.currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.dataset.answer = index;
            button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            button.addEventListener('click', (e) => {
                const answerIndex = parseInt(e.target.dataset.answer);
                this.handleAnswer(answerIndex, e.target);
            });
            this.optionsContainer.appendChild(button);
        });

        // Hide feedback
        this.feedback.classList.add('hidden');
        this.feedback.className = 'quiz-feedback hidden';

        // Start timer
        this.startTimer();

        // Show popup
        this.popup.classList.remove('hidden');
        this.popup.classList.add('quiz-appear');
        this.isPaused = true;
    }

    startTimer() {
        this.timeLeft = 15;
        this.updateTimerDisplay();
        
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }
        
        this.quizTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                clearInterval(this.quizTimer);
                this.handleTimeout();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        if (this.timerElement) {
            this.timerElement.textContent = `⏱️ ${this.timeLeft}s`;
            
            // Change color when time is running low
            if (this.timeLeft <= 5) {
                this.timerElement.style.color = '#ff4444';
            } else {
                this.timerElement.style.color = '#ffd700';
            }
        }
    }

    handleTimeout() {
        // Treat as wrong answer
        const options = this.optionsContainer.querySelectorAll('.quiz-option');
        if (options.length > 0) {
            const correctOption = options[this.currentQuestion.correct];
            if (correctOption) {
                correctOption.classList.add('correct');
            }
        }
        
        this.feedback.textContent = '⏰ Hết giờ!';
        this.feedback.classList.remove('hidden', 'correct');
        this.feedback.classList.add('wrong');
        soundManager.createWrongSound();
        collisionManager.showDamageEffect();

        // Player takes damage
        const isDead = player.takeDamage();
        ui.updateLives(player.lives);
        this.correctStreak = 0;

        if (isDead) {
            setTimeout(() => {
                this.hide();
                game.gameOver();
            }, 1000);
            return;
        }

        // Update stats
        ui.updateQuizStats(false);

        // Handle boss quiz
        if (this.isBossQuiz) {
            this.bossQuestionsAnswered++;
            
            setTimeout(() => {
                this.hide();
                
                if (this.bossQuestionsAnswered >= this.bossQuestionsRequired) {
                    if (this.bossCorrectAnswers >= this.bossQuestionsRequired) {
                        game.levelComplete();
                    } else {
                        game.gameOver();
                    }
                } else {
                    this.show(true);
                }
            }, 1500);
        } else {
            // Regular quiz
            setTimeout(() => {
                this.hide();
                if (this.onQuizComplete) {
                    this.onQuizComplete(false);
                }
            }, 1000);
        }
    }

    handleAnswer(answerIndex, selectedOption) {
        // Clear timer
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }

        const isCorrect = questions.checkAnswer(answerIndex);
        
        // Disable all options
        const options = this.optionsContainer.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.disabled = true;
            if (parseInt(option.dataset.answer) === this.currentQuestion.correct) {
                option.classList.add('correct');
            }
        });

        if (isCorrect) {
            selectedOption.classList.add('correct');
            this.feedback.textContent = '✔ Chính xác';
            this.feedback.classList.remove('hidden', 'wrong');
            this.feedback.classList.add('correct');
            soundManager.createCorrectSound();
            collisionManager.showCorrectEffect();
            this.correctStreak++;

            if (this.isBossQuiz) {
                this.bossCorrectAnswers++;
            }

            // Check quiz master achievement
            achievementManager.checkQuizMaster(this.correctStreak);
        } else {
            selectedOption.classList.add('wrong');
            this.feedback.textContent = '✖ Sai rồi';
            this.feedback.classList.remove('hidden', 'correct');
            this.feedback.classList.add('wrong');
            soundManager.createWrongSound();
            collisionManager.showDamageEffect();
            this.correctStreak = 0;

            // Player takes damage
            const isDead = player.takeDamage();
            ui.updateLives(player.lives);

            if (isDead) {
                setTimeout(() => {
                    this.hide();
                    game.gameOver();
                }, 1000);
                return;
            }
        }

        // Update stats
        ui.updateQuizStats(isCorrect);

        // Handle boss quiz
        if (this.isBossQuiz) {
            this.bossQuestionsAnswered++;
            
            setTimeout(() => {
                this.hide();
                
                if (this.bossQuestionsAnswered >= this.bossQuestionsRequired) {
                    if (this.bossCorrectAnswers >= this.bossQuestionsRequired) {
                        game.levelComplete();
                    } else {
                        game.gameOver();
                    }
                } else {
                    this.show(true);
                }
            }, 1500);
        } else {
            // Regular quiz
            setTimeout(() => {
                this.hide();
                if (this.onQuizComplete) {
                    this.onQuizComplete(isCorrect);
                }
            }, 1000);
        }
    }

    hide() {
        // Clear timer
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }
        
        this.popup.classList.add('hidden');
        this.popup.classList.remove('quiz-appear');
        this.isPaused = false;
    }

    reset() {
        this.questionCount = 0;
        this.isBossQuiz = false;
        this.bossQuestionsAnswered = 0;
        this.bossCorrectAnswers = 0;
        this.correctStreak = 0;
        this.feedback.classList.add('hidden');
        
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }
    }

    isQuizActive() {
        return !this.popup.classList.contains('hidden');
    }

    setOnQuizComplete(callback) {
        this.onQuizComplete = callback;
    }
}

// Create global instance
const quizManager = new QuizManager();
