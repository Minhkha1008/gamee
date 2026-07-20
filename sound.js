// Sound Module - Enhanced with Web Audio API
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.volume = 0.7;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.sounds = {};
        this.initialized = false;
        this.backgroundMusic = null;
        this.musicGainNode = null;
        this.musicPlaying = false;
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('Audio system initialized');
        } catch (error) {
            console.error('Web Audio API not supported:', error);
            this.initialized = false;
        }
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        // Update music gain node if it exists
        if (this.musicGainNode) {
            this.musicGainNode.gain.value = this.volume * 0.3;
        }
    }

    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (!enabled) {
            this.stopBackgroundMusic();
        }
    }

    setSfxEnabled(enabled) {
        this.sfxEnabled = enabled;
    }

    // Create a simple beep sound using Web Audio API
    createBeep(frequency = 440, duration = 0.1, type = 'sine') {
        if (!this.initialized || !this.sfxEnabled) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            console.error('Error creating beep:', error);
        }
    }

    createShootSound() {
        this.createBeep(800, 0.1, 'square');
    }

    createExplosionSound() {
        if (!this.initialized || !this.sfxEnabled) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = 100;
            oscillator.type = 'sawtooth';

            gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        } catch (error) {
            console.error('Error creating explosion sound:', error);
        }
    }

    createCorrectSound() {
        this.createBeep(523.25, 0.15, 'sine'); // C5
        setTimeout(() => this.createBeep(659.25, 0.15, 'sine'), 100); // E5
        setTimeout(() => this.createBeep(783.99, 0.2, 'sine'), 200); // G5
    }

    createWrongSound() {
        this.createBeep(200, 0.2, 'sawtooth');
        setTimeout(() => this.createBeep(150, 0.3, 'sawtooth'), 150);
    }

    createPowerupSound() {
        this.createBeep(600, 0.1, 'sine');
        setTimeout(() => this.createBeep(800, 0.1, 'sine'), 100);
        setTimeout(() => this.createBeep(1000, 0.15, 'sine'), 200);
    }

    createDamageSound() {
        this.createBeep(150, 0.3, 'sawtooth');
    }

    createLevelUpSound() {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
            setTimeout(() => this.createBeep(freq, 0.2, 'sine'), index * 100);
        });
    }

    createGameOverSound() {
        const notes = [392, 349.23, 329.63, 293.66, 261.63]; // G4, F4, E4, D4, C4
        notes.forEach((freq, index) => {
            setTimeout(() => this.createBeep(freq, 0.3, 'sine'), index * 200);
        });
    }

    createWinSound() {
        const melody = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
        melody.forEach((freq, index) => {
            setTimeout(() => this.createBeep(freq, 0.2, 'sine'), index * 150);
        });
    }

    createBossAppearSound() {
        this.createBeep(100, 0.5, 'sawtooth');
        setTimeout(() => this.createBeep(80, 0.5, 'sawtooth'), 400);
        setTimeout(() => this.createBeep(60, 0.8, 'sawtooth'), 800);
    }

    createClickSound() {
        this.createBeep(1000, 0.05, 'sine');
    }

    createHoverSound() {
        this.createBeep(600, 0.05, 'sine');
    }

    // Resume audio context if suspended (required by some browsers)
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Background Music Methods
    createBackgroundMusic() {
        if (!this.initialized) return;

        try {
            // Create a gain node for music volume control
            this.musicGainNode = this.audioContext.createGain();
            this.musicGainNode.connect(this.audioContext.destination);
            this.musicGainNode.gain.value = this.volume * 0.3; // Music at 30% of master volume

            // Create oscillators for background music melody
            this.backgroundMusic = [];
            const melody = [
                { freq: 261.63, duration: 0.5 },  // C4
                { freq: 293.66, duration: 0.5 },  // D4
                { freq: 329.63, duration: 0.5 },  // E4
                { freq: 349.23, duration: 0.5 },  // F4
                { freq: 392.00, duration: 0.5 },  // G4
                { freq: 349.23, duration: 0.5 },  // F4
                { freq: 329.63, duration: 0.5 },  // E4
                { freq: 293.66, duration: 0.5 },  // D4
            ];

            let startTime = this.audioContext.currentTime;

            melody.forEach((note, index) => {
                const oscillator = this.audioContext.createOscillator();
                const noteGain = this.audioContext.createGain();

                oscillator.connect(noteGain);
                noteGain.connect(this.musicGainNode);

                oscillator.frequency.value = note.freq;
                oscillator.type = 'sine';

                noteGain.gain.setValueAtTime(0, startTime);
                noteGain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
                noteGain.gain.linearRampToValueAtTime(0, startTime + note.duration);

                oscillator.start(startTime);
                oscillator.stop(startTime + note.duration);

                startTime += note.duration;

                this.backgroundMusic.push(oscillator);
            });
        } catch (error) {
            console.error('Error creating background music:', error);
        }
    }

    playBackgroundMusic() {
        if (!this.initialized || !this.musicEnabled || this.musicPlaying) return;

        this.createBackgroundMusic();
        this.musicPlaying = true;

        // Loop the music
        this.musicInterval = setInterval(() => {
            if (this.musicEnabled && this.musicPlaying) {
                this.createBackgroundMusic();
            } else {
                this.stopBackgroundMusic();
            }
        }, 4000); // 4 seconds loop (melody duration)
    }

    stopBackgroundMusic() {
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }

        if (this.backgroundMusic) {
            this.backgroundMusic.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Oscillator already stopped
                }
            });
            this.backgroundMusic = [];
        }

        this.musicPlaying = false;
    }

    toggleBackgroundMusic() {
        if (this.musicPlaying) {
            this.stopBackgroundMusic();
        } else {
            this.playBackgroundMusic();
        }
    }
}

// Create global instance
const soundManager = new SoundManager();
