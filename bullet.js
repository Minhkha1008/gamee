// Bullet Module - Enhanced
class Bullet {
    constructor(x, y) {
        // Here `y` represents distance from bottom (CSS bottom) in px
        this.x = x;
        this.y = y;
        this.speed = 10;
        this.width = 20;
        this.height = 20;
        this.element = this.createElement();
    }

    createElement() {
        const element = document.createElement('div');
        element.className = 'bullet';
        element.textContent = '🔸';
        element.style.left = `${this.x}px`;
        element.style.bottom = `${this.y}px`;
        document.getElementById('bullets-container').appendChild(element);
        
        // Play shooting sound effect
        soundManager.createShootSound();
        
        return element;
    }

    update() {
        this.y -= this.speed;
        this.element.style.bottom = `${this.y}px`;
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
        return this.y < -20;
    }
}

// Bullet Manager - Enhanced
class BulletManager {
    constructor() {
        this.bullets = [];
    }

    addBullet(bullet) {
        this.bullets.push(bullet);
    }

    update() {
        this.bullets.forEach(bullet => {
            bullet.update();
        });

        // Remove bullets that are off screen
        this.bullets = this.bullets.filter(bullet => {
            if (bullet.isOffScreen()) {
                bullet.destroy();
                return false;
            }
            return true;
        });
    }

    getBullets() {
        return this.bullets;
    }

    removeBullet(bullet) {
        const index = this.bullets.indexOf(bullet);
        if (index > -1) {
            this.bullets.splice(index, 1);
        }
    }

    clearAll() {
        this.bullets.forEach(bullet => bullet.destroy());
        this.bullets = [];
    }
}
