// Level Module - Enhanced with difficulty settings
class LevelManager {
    constructor() {
        this.currentLevel = 1;
        this.maxLevels = 5;
        this.levelConfigs = {
            1: {
                spawnRate: 2000,
                enemySpeed: 1.5,
                enemyCount: 1,
                boss: false,
                description: "Khởi đầu"
            },
            2: {
                spawnRate: 1500,
                enemySpeed: 2,
                enemyCount: 1,
                boss: false,
                description: "Tăng tốc"
            },
            3: {
                spawnRate: 1000,
                enemySpeed: 2.5,
                enemyCount: 2,
                boss: false,
                description: "Đồng loạt"
            },
            4: {
                spawnRate: 800,
                enemySpeed: 3,
                enemyCount: 2,
                boss: true,
                bossHp: 20,
                description: "Boss Battle"
            },
            5: {
                spawnRate: 600,
                enemySpeed: 3.5,
                enemyCount: 3,
                boss: true,
                bossHp: 25,
                description: "Thử thách cuối"
            }
        };
        this.difficultyMultipliers = {
            easy: { spawnRate: 1.5, enemySpeed: 0.8, bossHp: 0.7 },
            normal: { spawnRate: 1.0, enemySpeed: 1.0, bossHp: 1.0 },
            hard: { spawnRate: 0.7, enemySpeed: 1.3, bossHp: 1.3 }
        };
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getLevelConfig(level) {
        const baseConfig = this.levelConfigs[level] || this.levelConfigs[1];
        const difficulty = settingsManager.getDifficulty();
        const multiplier = this.difficultyMultipliers[difficulty] || this.difficultyMultipliers.normal;
        
        return {
            ...baseConfig,
            spawnRate: baseConfig.spawnRate * multiplier.spawnRate,
            enemySpeed: baseConfig.enemySpeed * multiplier.enemySpeed,
            bossHp: baseConfig.bossHp ? Math.floor(baseConfig.bossHp * multiplier.bossHp) : null
        };
    }

    applyLevelConfig() {
        const config = this.getLevelConfig(this.currentLevel);
        
        // Update enemy manager
        if (enemyManager) {
            enemyManager.setSpawnRate(config.spawnRate);
        }

        return config;
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevels) {
            this.currentLevel++;
            soundManager.createLevelUpSound();
            
            // Check level master achievement
            achievementManager.checkLevelMaster(this.currentLevel);
            
            return true;
        }
        return false;
    }

    reset() {
        this.currentLevel = 1;
    }

    isBossLevel() {
        const config = this.getLevelConfig(this.currentLevel);
        return config.boss;
    }

    getLevelDescription() {
        const config = this.getLevelConfig(this.currentLevel);
        return config.description;
    }

    getProgress() {
        return (this.currentLevel / this.maxLevels) * 100;
    }
}

// Create global instance
const levelManager = new LevelManager();
