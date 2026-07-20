// Questions Module
class Questions {
    constructor() {
        this.questions = [];
        this.usedQuestions = [];
        this.currentQuestion = null;
        this.categories = ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Tin học', 'Toán', 'Tiếng Anh'];
    }

    async loadQuestions() {
        try {
            const response = await fetch('assets/data/questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.questions = data.questions || [];
            console.log(`Loaded ${this.questions.length} questions`);
            return true;
        } catch (error) {
            console.error('Error loading questions:', error);
            // Fallback to hardcoded questions if JSON fails
            this.loadFallbackQuestions();
            return true;
        }
    }

    loadFallbackQuestions() {
        this.questions = [
            {
                id: 1,
                category: "HTML",
                question: "HTML dùng để làm gì?",
                options: ["Thiết kế giao diện", "Tạo cấu trúc Website", "Quản lý Database", "Chạy Server"],
                correct: 1
            },
            {
                id: 2,
                category: "HTML",
                question: "Tag nào dùng để tạo tiêu đề lớn nhất trong HTML?",
                options: ["<title>", "<h1>", "<header>", "<heading>"],
                correct: 1
            },
            {
                id: 3,
                category: "CSS",
                question: "Thuộc tính nào dùng để thay đổi màu nền?",
                options: ["color", "background-color", "font-color", "text-color"],
                correct: 1
            },
            {
                id: 4,
                category: "JavaScript",
                question: "Kết quả của 2 + '2' là gì?",
                options: ["4", "'22'", "NaN", "Error"],
                correct: 1
            },
            {
                id: 5,
                category: "JavaScript",
                question: "Cách nào đúng để khai báo biến?",
                options: ["variable myVar", "var myVar", "v myVar", "declare myVar"],
                correct: 1
            }
        ];
        console.log('Using fallback questions');
    }

    getRandomQuestion() {
        if (this.questions.length === 0) {
            console.error('No questions available');
            return null;
        }

        if (this.usedQuestions.length >= this.questions.length) {
            this.usedQuestions = [];
        }

        const availableQuestions = this.questions.filter(
            q => !this.usedQuestions.includes(q.id)
        );

        if (availableQuestions.length === 0) {
            this.usedQuestions = [];
            return this.getRandomQuestion();
        }

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const question = availableQuestions[randomIndex];
        this.usedQuestions.push(question.id);
        this.currentQuestion = question;

        return question;
    }

    getQuestionById(id) {
        return this.questions.find(q => q.id === id);
    }

    getQuestionsByCategory(category) {
        return this.questions.filter(q => q.category === category);
    }

    checkAnswer(answerIndex) {
        if (!this.currentQuestion) return false;
        return answerIndex === this.currentQuestion.correct;
    }

    reset() {
        this.usedQuestions = [];
        this.currentQuestion = null;
    }

    getTotalQuestions() {
        return this.questions.length;
    }

    getAvailableCategories() {
        const categories = [...new Set(this.questions.map(q => q.category))];
        return categories;
    }
}

// Create global instance
const questions = new Questions();
