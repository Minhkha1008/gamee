// Enemy Module - Enhanced
class Enemy {
    constructor(x, y, isBoss = false) {
        this.x = x;
        this.y = y;
        this.isBoss = isBoss;
        this.element = this.createElement();
        this.hp = isBoss ? 20 : Math.floor(Math.random() * 3) + 3;
        this.maxHp = this.hp;
        this.speed = isBoss ? 1.5 : Math.random() * 2 + 1;
        this.width = isBoss ? 80 : 40;
        this.height = isBoss ? 80 : 40;
        this.emoji = this.getRandomEmoji();
        this.updateElement();
    }

    createElement() {
        const element = document.createElement('div');
        element.className = this.isBoss ? 'enemy boss' : 'enemy';
        element.innerHTML = `
            <div class="enemy-hp-bar">
                <div class="enemy-hp-fill" style="width: 100%"></div>
            </div>
            ${this.emoji}
        `;
        document.getElementById('enemies-container').appendChild(element);
        return element;
    }

    getRandomEmoji() {
        const normalEmojis = ['👾', '🤖', '👻', '🐲', '🐵', '🐸', '🦇', '🕷️'];
        const bossEmojis = ['🐉', '👹', '👺', '💀', '🦖'];
        
        if (this.isBoss) {
            return bossEmojis[Math.floor(Math.random() * bossEmojis.length)];
        }
        return normalEmojis[Math.floor(Math.random() * normalEmojis.length)];
    }

    updateElement() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        const hpFill = this.element.querySelector('.enemy-hp-fill');
        if (hpFill) {
            hpFill.style.width = `${(this.hp / this.maxHp) * 100}%`;
        }
    }

    update() {
        this.y += this.speed;
        
        // Add some horizontal movement for variety
        if (!this.isBoss) {
            this.x += Math.sin(this.y * 0.02) * 0.5;
        }
        
        this.updateElement();
    }

    takeDamage() {
        this.hp--;
        this.element.classList.add('enemy-hit');
        setTimeout(() => {
            this.element.classList.remove('enemy-hit');
        }, 200);
        this.updateElement();
        return this.hp <= 0;
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
}

// Enemy Manager - Enhanced
class EnemyManager {
    constructor() {
        this.enemies = [];
        this.spawnRate = 2000;
        this.lastSpawnTime = 0;
        this.minX = 50;
        this.maxX = window.innerWidth - 50;
        this.enemiesKilled = 0;
    }

    reset() {
        this.enemies.forEach(enemy => enemy.destroy());
        this.enemies = [];
        this.spawnRate = 2000;
        this.lastSpawnTime = 0;
        this.enemiesKilled = 0;
    }

    spawn(isBoss = false) {
        // Update maxX when spawn to ensure correct with current window
        this.maxX = window.innerWidth - 50;
        const x = Math.random() * (this.maxX - this.minX) + this.minX;
        const y = -50;
        const enemy = new Enemy(x, y, isBoss);
        this.enemies.push(enemy);
        
        if (isBoss) {
            soundManager.createBossAppearSound();
        }
        
        return enemy;
    }

    update() {
        const currentTime = Date.now();
        
        // Spawn new enemies
        if (currentTime - this.lastSpawnTime > this.spawnRate) {
            this.spawn();
            this.lastSpawnTime = currentTime;
        }

        // Update all enemies
        this.enemies.forEach(enemy => {
            enemy.update();
        });

        // Remove enemies that are off screen
        this.enemies = this.enemies.filter(enemy => {
            if (enemy.y > window.innerHeight + 50) {
                enemy.destroy();
                return false;
            }
            return true;
        });
    }

    getEnemies() {
        return this.enemies;
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
            this.enemiesKilled++;
            
            // Check first blood achievement
            if (this.enemiesKilled === 1) {
                achievementManager.checkFirstBlood();
            }
        }
    }

    setSpawnRate(rate) {
        this.spawnRate = rate;
    }

    clearAll() {
        this.enemies.forEach(enemy => enemy.destroy());
        this.enemies = [];
    }

    getEnemiesKilled() {
        return this.enemiesKilled;
    }
}
