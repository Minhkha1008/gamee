// Settings Module
class SettingsManager {
    constructor() {
        this.settings = {
            volume: 0.7,
            musicEnabled: true,
            sfxEnabled: true,
            difficulty: 'normal'
        };
        this.loadSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('quizPlaneSettings');
        if (saved) {
            try {
                this.settings = JSON.parse(saved);
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }

    saveSettings() {
        localStorage.setItem('quizPlaneSettings', JSON.stringify(this.settings));
    }

    getVolume() {
        return this.settings.volume;
    }

    setVolume(value) {
        this.settings.volume = value;
        soundManager.setVolume(value);
        this.saveSettings();
    }

    isMusicEnabled() {
        return this.settings.musicEnabled;
    }

    setMusicEnabled(enabled) {
        this.settings.musicEnabled = enabled;
        soundManager.setMusicEnabled(enabled);
        this.saveSettings();
    }

    isSfxEnabled() {
        return this.settings.sfxEnabled;
    }

    setSfxEnabled(enabled) {
        this.settings.sfxEnabled = enabled;
        soundManager.setSfxEnabled(enabled);
        this.saveSettings();
    }

    getDifficulty() {
        return this.settings.difficulty;
    }

    setDifficulty(difficulty) {
        this.settings.difficulty = difficulty;
        this.saveSettings();
    }

    applySettings() {
        soundManager.setVolume(this.settings.volume);
        soundManager.setMusicEnabled(this.settings.musicEnabled);
        soundManager.setSfxEnabled(this.settings.sfxEnabled);
    }

    reset() {
        this.settings = {
            volume: 0.7,
            musicEnabled: true,
            sfxEnabled: true,
            difficulty: 'normal'
        };
        this.saveSettings();
        this.applySettings();
    }
}

// Create global instance
const settingsManager = new SettingsManager();
