// High Score Module
class HighScoreManager {
    constructor() {
        this.highScores = [];
        this.maxScores = 10;
        this.loadHighScores();
    }

    loadHighScores() {
        const saved = localStorage.getItem('quizPlaneHighScores');
        if (saved) {
            try {
                this.highScores = JSON.parse(saved);
            } catch (error) {
                console.error('Error loading high scores:', error);
                this.highScores = [];
            }
        }
    }

    saveHighScores() {
        localStorage.setItem('quizPlaneHighScores', JSON.stringify(this.highScores));
    }

    addHighScore(score, playerName = 'Player') {
        const date = new Date().toLocaleDateString('vi-VN');
        const newScore = {
            score: score,
            name: playerName,
            date: date
        };

        this.highScores.push(newScore);
        this.highScores.sort((a, b) => b.score - a.score);
        
        if (this.highScores.length > this.maxScores) {
            this.highScores = this.highScores.slice(0, this.maxScores);
        }

        this.saveHighScores();
        return this.isNewHighScore(score);
    }

    isNewHighScore(score) {
        if (this.highScores.length === 0) return true;
        return score > this.highScores[this.highScores.length - 1].score;
    }

    getHighScores() {
        return this.highScores;
    }

    getHighestScore() {
        if (this.highScores.length === 0) return 0;
        return this.highScores[0].score;
    }

    getRank(score) {
        for (let i = 0; i < this.highScores.length; i++) {
            if (score >= this.highScores[i].score) {
                return i + 1;
            }
        }
        return this.highScores.length + 1;
    }

    clearHighScores() {
        this.highScores = [];
        this.saveHighScores();
    }

    displayHighScores() {
        const container = document.getElementById('highscores-list');
        if (!container) return;

        container.innerHTML = '';

        if (this.highScores.length === 0) {
            container.innerHTML = '<p class="no-scores">Chưa có điểm số nào</p>';
            return;
        }

        this.highScores.forEach((score, index) => {
            const item = document.createElement('div');
            item.className = 'highscore-item';
            
            let cupEmoji = '';
            let rankClass = '';
            if (index === 0) {
                cupEmoji = '🥇';
                rankClass = 'gold';
            } else if (index === 1) {
                cupEmoji = '🥈';
                rankClass = 'silver';
            } else if (index === 2) {
                cupEmoji = '🥉';
                rankClass = 'bronze';
            } else {
                cupEmoji = `${index + 1}`;
            }

            item.innerHTML = `
                <span class="highscore-rank ${rankClass}">${cupEmoji}</span>
                <span class="highscore-name">${score.name}</span>
                <span class="highscore-score">${score.score}</span>
                <span class="highscore-date">${score.date}</span>
            `;
            container.appendChild(item);
        });
    }
}

// Create global instance
const highScoreManager = new HighScoreManager();
