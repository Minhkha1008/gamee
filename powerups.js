// Power-ups Module
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.element = this.createElement();
        this.speed = 2;
        this.width = 30;
        this.height = 30;
    }

    createElement() {
        const element = document.createElement('div');
        element.className = 'powerup';
        
        const icons = {
            health: '❤️',
            speed: '⚡',
            shield: '🛡️',
            bomb: '💣'
        };
        
        element.textContent = icons[this.type] || '🎁';
        element.style.left = `${this.x}px`;
        element.style.top = `${this.y}px`;
        
        document.getElementById('powerups-container').appendChild(element);
        return element;
    }

    update() {
        this.y += this.speed;
        this.element.style.top = `${this.y}px`;
    }

    getPosition() {
        const rect = this.element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            width: rect.width,
            height: rect.height,
            left: rect.left,
            right: rect.right,
            top: rect.top,
            bottom: rect.bottom
        };
    }

    destroy() {
        this.element.remove();
    }

    isOffScreen() {
        return this.y > window.innerHeight + 50;
    }
}

class PowerUpManager {
    constructor() {
        this.powerUps = [];
        this.spawnRate = 15000; // 15 seconds
        this.lastSpawnTime = 0;
        this.powerUpTypes = ['health', 'speed', 'shield', 'bomb'];
        this.activeEffects = {
            speed: 0,
            shield: false
        };
        this.collectedCount = 0;
    }

    reset() {
        this.powerUps.forEach(p => p.destroy());
        this.powerUps = [];
        this.lastSpawnTime = 0;
        this.activeEffects = {
            speed: 0,
            shield: false
        };
        this.collectedCount = 0;
        this.updateIndicators();
    }

    spawn() {
        const x = Math.random() * (window.innerWidth - 100) + 50;
        const y = -50;
        const type = this.powerUpTypes[Math.floor(Math.random() * this.powerUpTypes.length)];
        const powerUp = new PowerUp(x, y, type);
        this.powerUps.push(powerUp);
    }

    update() {
        const currentTime = Date.now();
        
        // Spawn new power-ups
        if (currentTime - this.lastSpawnTime > this.spawnRate) {
            this.spawn();
            this.lastSpawnTime = currentTime;
        }

        // Update all power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.update();
        });

        // Remove power-ups that are off screen
        this.powerUps = this.powerUps.filter(powerUp => {
            if (powerUp.isOffScreen()) {
                powerUp.destroy();
                return false;
            }
            return true;
        });

        // Update active effects
        this.updateEffects();
    }

    updateEffects() {
        // Check speed effect expiration
        if (this.activeEffects.speed > 0) {
            this.activeEffects.speed -= 16; // Approximately 16ms per frame
            if (this.activeEffects.speed <= 0) {
                this.activeEffects.speed = 0;
                if (player) {
                    player.shootCooldown = 250; // Reset to normal
                }
                this.updateIndicators();
            }
        }
    }

    collect(powerUp) {
        const index = this.powerUps.indexOf(powerUp);
        if (index > -1) {
            this.powerUps.splice(index, 1);
        }
        
        powerUp.destroy();
        this.collectedCount++;
        
        soundManager.createPowerupSound();
        
        switch (powerUp.type) {
            case 'health':
                if (player && player.lives < player.maxLives) {
                    player.heal();
                    ui.updateLives(player.lives);
                    ui.showScorePopup('+1 ❤️');
                }
                break;
            case 'speed':
                if (player) {
                    this.activeEffects.speed = 10000; // 10 seconds
                    player.shootCooldown = 100; // Faster shooting
                    this.updateIndicators();
                    ui.showScorePopup('⚡ SPEED!');
                }
                break;
            case 'shield':
                this.activeEffects.shield = true;
                if (player) {
                    player.element.classList.add('shielded');
                }
                document.getElementById('shield-overlay').classList.remove('hidden');
                this.updateIndicators();
                ui.showScorePopup('🛡️ SHIELD!');
                
                // Shield lasts for 10 seconds
                setTimeout(() => {
                    this.activeEffects.shield = false;
                    if (player) {
                        player.element.classList.remove('shielded');
                    }
                    document.getElementById('shield-overlay').classList.add('hidden');
                    this.updateIndicators();
                }, 10000);
                break;
            case 'bomb':
                // Destroy all enemies on screen
                const enemies = enemyManager.getEnemies();
                enemies.forEach(enemy => {
                    collisionManager.createExplosion(enemy.x, enemy.y);
                    enemy.destroy();
                    enemyManager.removeEnemy(enemy);
                    ui.addScore(50);
                });
                ui.showScorePopup('💣 BOOM!');
                break;
        }

        // Check achievement
        achievementManager.checkPowerupCollector(this.collectedCount);
    }

    updateIndicators() {
        const speedIndicator = document.getElementById('speed-indicator');
        const shieldIndicator = document.getElementById('shield-indicator');

        if (speedIndicator) {
            if (this.activeEffects.speed > 0) {
                speedIndicator.classList.remove('hidden');
            } else {
                speedIndicator.classList.add('hidden');
            }
        }

        if (shieldIndicator) {
            if (this.activeEffects.shield) {
                shieldIndicator.classList.remove('hidden');
            } else {
                shieldIndicator.classList.add('hidden');
            }
        }
    }

    getPowerUps() {
        return this.powerUps;
    }

    removePowerUp(powerUp) {
        const index = this.powerUps.indexOf(powerUp);
        if (index > -1) {
            this.powerUps.splice(index, 1);
        }
    }

    hasShield() {
        return this.activeEffects.shield;
    }

    clearAll() {
        this.powerUps.forEach(p => p.destroy());
        this.powerUps = [];
    }
}

// Create global instance
const powerUpManager = new PowerUpManager();
