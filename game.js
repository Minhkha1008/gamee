// Main Game Module - Enhanced
class Game {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.gameLoop = null;
        this.player = null;
        this.enemyManager = null;
        this.bulletManager = null;
        this.powerUpManager = null;
        this.bossSpawned = false;
    }

    async init() {
        // Initialize sound system
        soundManager.init();
        settingsManager.applySettings();
        
        // Load questions
        const questionsLoaded = await questions.loadQuestions();
        if (!questionsLoaded) {
            console.error('Failed to load questions');
        }

        // Initialize components
        this.bulletManager = new BulletManager();
        this.enemyManager = new EnemyManager();
        this.powerUpManager = new PowerUpManager();
        this.player = new Player(this.bulletManager);

        // Initialize managers
        this.player.init();
        quizManager.init();
        ui.init();

        // Setup collision manager
        collisionManager.init(this.player, this.enemyManager, this.bulletManager, this.powerUpManager);

        // Setup quiz callback
        quizManager.setOnQuizComplete((isCorrect) => {
            this.handleQuizComplete(isCorrect);
        });

        // Setup menu buttons
        this.setupMenuButtons();

        console.log('Game initialized successfully');
    }

    setupMenuButtons() {
        // Main menu buttons
        document.getElementById('btn-play').addEventListener('click', () => {
            soundManager.createClickSound();
            this.startCountdown();
        });

        document.getElementById('btn-highscores').addEventListener('click', () => {
            soundManager.createClickSound();
            highScoreManager.displayHighScores();
            ui.showScreen('highscores-screen');
        });

        document.getElementById('btn-guide').addEventListener('click', () => {
            soundManager.createClickSound();
            ui.showScreen('guide-screen');
        });

        document.getElementById('btn-settings').addEventListener('click', () => {
            soundManager.createClickSound();
            this.loadSettings();
            ui.showScreen('settings-screen');
        });

        document.getElementById('btn-exit').addEventListener('click', () => {
            soundManager.createClickSound();
            if (confirm('Bạn có chắc muốn thoát game?')) {
                window.close();
            }
        });

        // High scores screen
        document.getElementById('btn-back-menu').addEventListener('click', () => {
            soundManager.createClickSound();
            ui.showScreen('main-menu');
        });

        // Guide screen
        document.getElementById('btn-back-guide').addEventListener('click', () => {
            soundManager.createClickSound();
            ui.showScreen('main-menu');
        });

        // Settings screen
        document.getElementById('btn-save-settings').addEventListener('click', () => {
            soundManager.createClickSound();
            this.saveSettings();
            ui.showScreen('main-menu');
        });

        document.getElementById('btn-back-settings').addEventListener('click', () => {
            soundManager.createClickSound();
            ui.showScreen('main-menu');
        });

        // Pause screen
        document.getElementById('btn-resume').addEventListener('click', () => {
            soundManager.createClickSound();
            this.togglePause();
        });

        document.getElementById('btn-restart-pause').addEventListener('click', () => {
            soundManager.createClickSound();
            this.restart();
        });

        document.getElementById('btn-quit').addEventListener('click', () => {
            soundManager.createClickSound();
            this.goToMenu();
        });

        // Game pause button
        document.getElementById('btn-pause').addEventListener('click', () => {
            soundManager.createClickSound();
            this.togglePause();
        });

        // Game over screen
        document.getElementById('btn-restart').addEventListener('click', () => {
            soundManager.createClickSound();
            this.restart();
        });

        document.getElementById('btn-menu').addEventListener('click', () => {
            soundManager.createClickSound();
            this.goToMenu();
        });

        // Win screen
        document.getElementById('btn-play-again').addEventListener('click', () => {
            soundManager.createClickSound();
            this.restart();
        });

        document.getElementById('btn-home').addEventListener('click', () => {
            soundManager.createClickSound();
            this.goToMenu();
        });

        // Settings controls
        document.getElementById('volume-slider').addEventListener('input', (e) => {
            const value = e.target.value / 100;
            document.getElementById('volume-value').textContent = `${e.target.value}%`;
            settingsManager.setVolume(value);
        });

        document.getElementById('music-toggle').addEventListener('change', (e) => {
            settingsManager.setMusicEnabled(e.target.checked);
        });

        document.getElementById('sfx-toggle').addEventListener('change', (e) => {
            settingsManager.setSfxEnabled(e.target.checked);
        });

        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            settingsManager.setDifficulty(e.target.value);
        });
    }

    loadSettings() {
        const volume = settingsManager.getVolume();
        const musicEnabled = settingsManager.isMusicEnabled();
        const sfxEnabled = settingsManager.isSfxEnabled();
        const difficulty = settingsManager.getDifficulty();

        document.getElementById('volume-slider').value = volume * 100;
        document.getElementById('volume-value').textContent = `${Math.round(volume * 100)}%`;
        document.getElementById('music-toggle').checked = musicEnabled;
        document.getElementById('sfx-toggle').checked = sfxEnabled;
        document.getElementById('difficulty-select').value = difficulty;
    }

    saveSettings() {
        const volume = document.getElementById('volume-slider').value / 100;
        const musicEnabled = document.getElementById('music-toggle').checked;
        const sfxEnabled = document.getElementById('sfx-toggle').checked;
        const difficulty = document.getElementById('difficulty-select').value;

        settingsManager.setVolume(volume);
        settingsManager.setMusicEnabled(musicEnabled);
        settingsManager.setSfxEnabled(sfxEnabled);
        settingsManager.setDifficulty(difficulty);
    }

    startCountdown() {
        console.log('Starting countdown...');
        soundManager.resumeAudioContext();

        const removeCountdownOverlay = () => {
            const existing = document.getElementById('countdown-overlay');
            if (existing) existing.remove();
        };

        // Hide menu/guide screens for countdown
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });

        // Create countdown overlay
        const overlay = document.createElement('div');
        overlay.id = 'countdown-overlay';
        overlay.style.cssText =
            'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;display:flex;justify-content:center;align-items:center;z-index:999999;';

        const number = document.createElement('div');
        number.id = 'countdown-text';
        number.style.cssText =
            'font-size:200px;font-weight:bold;color:#fff;font-family:Arial,sans-serif;';
        number.textContent = '3';

        overlay.appendChild(number);
        document.body.appendChild(overlay);

        console.log('Countdown overlay created');

        let count = 3;

        const countdownInterval = setInterval(() => {
            count--;
            console.log('Countdown:', count);

            if (count >= 1) {
                number.textContent = count;
                soundManager.createClickSound();
            } else if (count === 0) {
                number.textContent = 'START!';
                number.style.fontSize = '100px';
                soundManager.createLevelUpSound();
                console.log('START! Starting game in 500ms');
                setTimeout(() => {
                    clearInterval(countdownInterval);
                    removeCountdownOverlay();

                    try {
                        this.start();
                    } catch (err) {
                        console.error('Error starting game after countdown:', err);
                        removeCountdownOverlay();
                    }
                }, 500);
            } else {
                if (count < 0) {
                    clearInterval(countdownInterval);
                }
            }
        }, 1000);
    }

    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.bossSpawned = false;

        // Reset all components
        this.player.reset();
        this.enemyManager.reset();
        this.bulletManager.clearAll();
        this.powerUpManager.reset();
        quizManager.reset();
        levelManager.reset();
        ui.reset();

        // Apply level config
        levelManager.applyLevelConfig();

        // Show game screen
        ui.showScreen('game-screen');

        // Ensure game screen is visible
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.classList.remove('hidden');
        }

        // Start timer
        ui.startTimer();

        // Start game loop
        this.gameLoop = requestAnimationFrame(() => this.update());

        console.log('Game started');
    }

    update() {
        if (!this.isRunning) return;

        if (!this.isPaused && !quizManager.isQuizActive()) {
            // Update player
            this.player.update();

            // Update enemies
            this.enemyManager.update();

            // Update bullets
            this.bulletManager.update();

            // Update power-ups
            this.powerUpManager.update();

            // Check collisions
            collisionManager.checkCollisions();

            // Check for boss spawn
            this.checkBossSpawn();

            // Check level progression
            this.checkLevelProgress();
        }

        this.gameLoop = requestAnimationFrame(() => this.update());
    }

    checkBossSpawn() {
        if (levelManager.isBossLevel() && !this.bossSpawned) {
            // Spawn boss after some time
            setTimeout(() => {
                if (this.isRunning && !this.bossSpawned) {
                    this.enemyManager.spawn(true);
                    this.bossSpawned = true;
                }
            }, 5000);
        }
    }

    triggerQuiz(isBoss) {
        this.isPaused = true;
        quizManager.show(isBoss);
    }

    handleQuizComplete(isCorrect) {
        this.isPaused = false;

        if (isCorrect) {
            ui.addScore(100);
        } else {
            ui.incrementLivesLost();
        }
    }

    checkLevelProgress() {
        const currentLevel = levelManager.getCurrentLevel();
        const config = levelManager.getLevelConfig(currentLevel);

        // Check if level should advance (based on score)
        const levelThreshold = currentLevel * 500;
        
        if (this.score >= levelThreshold && !levelManager.isBossLevel()) {
            if (levelManager.nextLevel()) {
                this.levelUp();
            }
        }
    }

    levelUp() {
        const newLevel = levelManager.getCurrentLevel();
        ui.updateLevel(newLevel);
        levelManager.applyLevelConfig();
        
        ui.showScorePopup(`LEVEL ${newLevel}!`);
        
        // Brief pause
        this.isPaused = true;
        setTimeout(() => {
            this.isPaused = false;
        }, 1000);
    }

    levelComplete() {
        this.isRunning = false;
        ui.stopTimer();

        if (levelManager.getCurrentLevel() >= levelManager.maxLevels) {
            // Game completed
            ui.showWin();
        } else {
            // Next level
            levelManager.nextLevel();
            this.bossSpawned = false;
            
            // Brief pause then continue
            setTimeout(() => {
                this.isRunning = true;
                this.isPaused = false;
                levelManager.applyLevelConfig();
                ui.updateLevel(levelManager.getCurrentLevel());
            }, 2000);
        }
    }

    togglePause() {
        if (!this.isRunning) return;

        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            ui.showScreen('pause-screen');
        } else {
            ui.showScreen('game-screen');
        }
    }

    gameOver() {
        this.isRunning = false;
        ui.stopTimer();
        ui.showGameOver();
        console.log('Game Over');
    }

    restart() {
        this.start();
    }

    goToMenu() {
        this.isRunning = false;
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        ui.showScreen('main-menu');
    }

    get score() {
        return ui.score;
    }

    set score(value) {
        ui.score = value;
        ui.updateScore();
    }
}

// Create global game instance
const game = new Game();

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        game.init();
        // Ensure main menu is visible after initialization
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error initializing game:', error);
        // Ensure main menu is visible even if initialization fails
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.classList.remove('hidden');
        }
    }
});
