// Collision Module - Enhanced
class CollisionManager {
    constructor() {
        this.player = null;
        this.enemyManager = null;
        this.bulletManager = null;
        this.powerUpManager = null;
    }

    init(player, enemyManager, bulletManager, powerUpManager) {
        this.player = player;
        this.enemyManager = enemyManager;
        this.bulletManager = bulletManager;
        this.powerUpManager = powerUpManager;
    }

    checkCollisions() {
        this.checkBulletEnemyCollisions();
        this.checkPlayerEnemyCollisions();
        this.checkPlayerPowerUpCollisions();
    }

    checkBulletEnemyCollisions() {
        const bullets = this.bulletManager.getBullets();
        const enemies = this.enemyManager.getEnemies();

        bullets.forEach(bullet => {
            enemies.forEach(enemy => {
                if (this.isColliding(bullet, enemy)) {
                    this.handleBulletEnemyCollision(bullet, enemy);
                }
            });
        });
    }

    checkPlayerEnemyCollisions() {
        const playerPos = this.player.getPosition();
        const enemies = this.enemyManager.getEnemies();

        enemies.forEach(enemy => {
            if (this.isColliding(playerPos, enemy)) {
                this.handlePlayerEnemyCollision(enemy);
            }
        });
    }

    checkPlayerPowerUpCollisions() {
        const playerPos = this.player.getPosition();
        const powerUps = this.powerUpManager.getPowerUps();

        powerUps.forEach(powerUp => {
            if (this.isColliding(playerPos, powerUp)) {
                this.handlePlayerPowerUpCollision(powerUp);
            }
        });
    }

    isColliding(obj1, obj2) {
        const pos1 = obj1.getPosition ? obj1.getPosition() : obj1;
        const pos2 = obj2.getPosition ? obj2.getPosition() : obj2;

        return (
            pos1.left < pos2.right &&
            pos1.right > pos2.left &&
            pos1.top < pos2.bottom &&
            pos1.bottom > pos2.top
        );
    }

    handleBulletEnemyCollision(bullet, enemy) {
        bullet.destroy();
        this.bulletManager.removeBullet(bullet);

        // Add points for hitting enemy
        ui.addScore(10);

        if (enemy.takeDamage()) {
            // Enemy destroyed
            this.createExplosion(enemy.x, enemy.y);
            enemy.destroy();
            this.enemyManager.removeEnemy(enemy);
            
            // Add bonus points for killing enemy
            ui.addScore(50);
            
            // Check boss achievement
            if (enemy.isBoss) {
                achievementManager.checkBossSlayer();
            }
            
            // Trigger quiz
            game.triggerQuiz(enemy.isBoss);
        }
    }

    handlePlayerEnemyCollision(enemy) {
        enemy.destroy();
        this.enemyManager.removeEnemy(enemy);
        
        const isDead = this.player.takeDamage();
        this.createExplosion(enemy.x, enemy.y);
        
        // Show damage effect
        this.showDamageEffect();
        
        // Update UI
        ui.updateLives(this.player.lives);

        if (isDead) {
            game.gameOver();
        }
    }

    handlePlayerPowerUpCollision(powerUp) {
        this.powerUpManager.collect(powerUp);
    }

    createExplosion(x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.textContent = '💥';
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        document.getElementById('game-container').appendChild(explosion);
        
        soundManager.createExplosionSound();

        setTimeout(() => {
            explosion.remove();
        }, 500);
    }

    showDamageEffect() {
        const overlay = document.getElementById('damage-overlay');
        overlay.classList.remove('hidden');
        overlay.classList.add('flash-wrong');
        
        setTimeout(() => {
            overlay.classList.add('hidden');
            overlay.classList.remove('flash-wrong');
        }, 300);
    }

    showCorrectEffect() {
        const overlay = document.getElementById('flash-overlay');
        overlay.classList.remove('hidden');
        overlay.classList.add('flash-correct');
        
        setTimeout(() => {
            overlay.classList.add('hidden');
            overlay.classList.remove('flash-correct');
        }, 300);
    }
}

// Create global instance
const collisionManager = new CollisionManager();
