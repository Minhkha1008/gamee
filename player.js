// Player Module - Enhanced
class Player {
    constructor(bulletManager) {
        this.element = document.getElementById('player');
        this.x = window.innerWidth / 2;
        this.y = 0;
        this.speed = 8;
        this.width = 50;
        this.height = 50;
        this.lives = 3;
        this.maxLives = 3;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.canShoot = true;
        this.shootCooldown = 250;
        this.lastShotTime = 0;
        this.bulletManager = bulletManager;
        this.isShielded = false;
    }

    init() {
        this.reset();
        this.setupControls();
    }

    reset() {
        this.x = window.innerWidth / 2;
        this.lives = this.maxLives;
        this.isShielded = false;
        this.element.classList.remove('shielded');
        this.shootCooldown = 250;
        this.updatePosition();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'Left') {
                this.isMovingLeft = true;
            } else if (e.key === 'ArrowRight' || e.key === 'Right') {
                this.isMovingRight = true;
            } else if (e.key === ' ') {
                e.preventDefault();
                this.shoot();
            } else if (e.key === 'p' || e.key === 'P') {
                if (game && game.isRunning) {
                    game.togglePause();
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'Left') {
                this.isMovingLeft = false;
            } else if (e.key === 'ArrowRight' || e.key === 'Right') {
                this.isMovingRight = false;
            }
        });
    }

    update() {
        if (this.isMovingLeft) {
            this.x -= this.speed;
        }
        if (this.isMovingRight) {
            this.x += this.speed;
        }

        // Boundary check
        const minX = this.width / 2;
        const maxX = window.innerWidth - this.width / 2;
        this.x = Math.max(minX, Math.min(maxX, this.x));

        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
    }

    shoot() {
        const currentTime = Date.now();
        if (!this.canShoot || currentTime - this.lastShotTime < this.shootCooldown) {
            return null;
        }

        this.lastShotTime = currentTime;
        this.element.classList.add('player-shoot');
        setTimeout(() => {
            this.element.classList.remove('player-shoot');
        }, 200);

        soundManager.createShootSound();
        
        // Create bullet and add to manager
        // `Bullet` expects `y` as CSS bottom distance in px.
        // "Đầu máy bay" = đỉnh element #player (rect.top), convert to bottom:
        const rect = this.element.getBoundingClientRect();
        const bulletBottomY = window.innerHeight - rect.top;

        const bullet = new Bullet(this.x, bulletBottomY);
        if (this.bulletManager) {
            this.bulletManager.addBullet(bullet);
        }

        return bullet;
    }

    takeDamage() {
        // Check if shield is active
        if (powerUpManager.hasShield()) {
            soundManager.createPowerupSound();
            ui.showScorePopup('🛡️ BLOCKED!');
            return false;
        }

        this.lives--;
        this.element.classList.add('player-damage');
        setTimeout(() => {
            this.element.classList.remove('player-damage');
        }, 300);

        soundManager.createDamageSound();

        // Check survivor achievement
        achievementManager.checkSurvivor(this.lives);

        return this.lives <= 0;
    }

    heal() {
        this.lives = Math.min(this.lives + 1, this.maxLives);
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
}
