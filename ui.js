// UI Module - Enhanced
class UIManager {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('hearts');
        this.levelElement = document.getElementById('level');
        this.timerElement = document.getElementById('timer');
        this.comboElement = document.getElementById('combo');
        this.highscoreElement = document.getElementById('highscore');
        
        this.score = 0;
        this.combo = 1;
        this.comboStreak = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.livesLost = 0;
    }

    init() {
        this.reset();
        this.updateHighScore();
    }

    reset() {
        this.score = 0;
        this.combo = 1;
        this.comboStreak = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.startTime = null;
        this.livesLost = 0;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.updateScore();
        this.updateCombo();
        this.updateLives(3);
        this.updateLevel(1);
        this.updateTimer('00:00');
        this.updateHighScore();
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        
        // Check high score achievement
        achievementManager.checkHighScorer(this.score);
    }

    addScore(points) {
        const bonusPoints = points * this.combo;
        this.score += bonusPoints;
        this.updateScore();
        
        // Show score popup
        this.showScorePopup(`+${bonusPoints}`);
    }

    showScorePopup(text) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = text;
        popup.style.position = 'absolute';
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.fontSize = '2rem';
        popup.style.fontWeight = 'bold';
        popup.style.color = '#ffd700';
        popup.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
        popup.style.zIndex = '100';
        popup.style.pointerEvents = 'none';
        
        document.getElementById('game-container').appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    updateLives(lives) {
        this.livesElement.textContent = '❤'.repeat(lives);
    }

    updateLevel(level) {
        this.levelElement.textContent = level;
    }

    updateCombo() {
        this.comboElement.textContent = `x${this.combo}`;
        
        // Check combo achievement
        achievementManager.checkCombo(this.combo);
        
        if (this.combo > 1) {
            this.comboElement.classList.add('combo-increase');
            setTimeout(() => {
                this.comboElement.classList.remove('combo-increase');
            }, 500);
        }
    }

    increaseCombo() {
        this.comboStreak++;
        
        if (this.comboStreak >= 3) {
            this.combo = 2;
        } else if (this.comboStreak >= 5) {
            this.combo = 3;
        } else if (this.comboStreak >= 10) {
            this.combo = 5;
        }
        
        this.updateCombo();
    }

    resetCombo() {
        this.combo = 1;
        this.comboStreak = 0;
        this.updateCombo();
    }

    updateQuizStats(isCorrect) {
        if (isCorrect) {
            this.correctAnswers++;
            this.increaseCombo();
        } else {
            this.wrongAnswers++;
            this.resetCombo();
        }
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimer(formattedTime = null) {
        if (formattedTime) {
            this.timerElement.textContent = formattedTime;
            return;
        }

        if (this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            this.timerElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    getElapsedTime() {
        if (this.startTime) {
            return Math.floor((Date.now() - this.startTime) / 1000);
        }
        return 0;
    }

    updateHighScore() {
        const highScore = highScoreManager.getHighestScore();
        this.highscoreElement.textContent = highScore;
    }

    showScreen(screenId) {
        console.log('Showing screen:', screenId);

        // Hide all screens (ONLY via class to avoid layout/display issues)
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });

        // Show target screen
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.remove('hidden');
            screen.classList.add('screen-transition');
            console.log('Screen shown:', screenId);
        } else {
            console.error('Screen not found:', screenId);
        }
    }

    showGameOver() {
        const elapsedTime = this.getElapsedTime();
        const isNewHighScore = highScoreManager.addHighScore(this.score);
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('correct-count').textContent = this.correctAnswers;
        document.getElementById('wrong-count').textContent = this.wrongAnswers;
        document.getElementById('final-time').textContent = this.timerElement.textContent;
        document.getElementById('gameover-highscore').textContent = highScoreManager.getHighestScore();
        
        // Show new high score notification
        const newHighscoreElement = document.getElementById('new-highscore');
        if (isNewHighScore) {
            newHighscoreElement.classList.remove('hidden');
        } else {
            newHighscoreElement.classList.add('hidden');
        }
        
        // Check speed demon achievement
        achievementManager.checkSpeedDemon(elapsedTime);
        
        // Check perfect game achievement
        achievementManager.checkPerfectGame(this.livesLost);
        
        soundManager.createGameOverSound();
        this.showScreen('gameover-screen');
    }

    showWin() {
        const elapsedTime = this.getElapsedTime();
        
        document.getElementById('win-score').textContent = this.score;
        
        const totalQuestions = this.correctAnswers + this.wrongAnswers;
        const accuracy = totalQuestions > 0 
            ? Math.round((this.correctAnswers / totalQuestions) * 100) 
            : 0;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        document.getElementById('win-time').textContent = this.timerElement.textContent;
        
        // Check achievements
        achievementManager.checkSpeedDemon(elapsedTime);
        achievementManager.checkPerfectGame(this.livesLost);
        
        // Show unlocked achievements
        const unlockedAchievements = achievementManager.getUnlockedAchievements();
        const achievementsSection = document.getElementById('achievements-unlocked');
        const achievementsList = document.getElementById('achievements-list');
        
        if (unlockedAchievements.length > 0) {
            achievementsSection.classList.remove('hidden');
            achievementsList.innerHTML = '';
            unlockedAchievements.forEach(achievement => {
                const badge = document.createElement('div');
                badge.className = 'achievement-badge';
                badge.textContent = achievement.icon;
                badge.title = `${achievement.name}: ${achievement.description}`;
                achievementsList.appendChild(badge);
            });
        } else {
            achievementsSection.classList.add('hidden');
        }
        
        soundManager.createWinSound();
        this.showScreen('win-screen');
    }

    incrementLivesLost() {
        this.livesLost++;
    }

    getStats() {
        return {
            score: this.score,
            correctAnswers: this.correctAnswers,
            wrongAnswers: this.wrongAnswers,
            combo: this.combo,
            time: this.getElapsedTime(),
            livesLost: this.livesLost
        };
    }
}

// Create global instance
const ui = new UIManager();
