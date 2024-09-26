let questions = [];
let userAnswers = [];
let correctAnswers = 0;
let timerInterval;
let timeElapsed = 0;

function startQuiz() {
    document.getElementById('quiz-container').innerHTML = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('finish-btn').style.display = 'block';
    document.getElementById('retry-btn').style.display = 'none';
    document.getElementById('start-btn').style.display = 'none'; // Sembunyikan tombol Start
    correctAnswers = 0;
    userAnswers = [];
    timeElapsed = 0;
    updateTimer();
    
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data.sort(() => 0.5 - Math.random());
            displayQuestions();
            startTimer(); // Mulai menghitung waktu setelah quiz dimulai
        });
}

function displayQuestions() {
    const quizContainer = document.getElementById('quiz-container');
    questions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `
            <p>${q.question}</p>
            <input type="text" id="answer-${index}" placeholder="Your answer">
            <span id="correct-answer-${index}" class="correct-answer" style="display:none; color:green;">Correct answer: ${q.answer}</span>
        `;
        quizContainer.appendChild(questionElement);
    });
}

function finishQuiz() {
    correctAnswers = 0;
    userAnswers = [];
    
    questions.forEach((q, index) => {
        const userAnswer = document.getElementById(`answer-${index}`).value.trim().toLowerCase();
        const correctAnswer = q.answer.toLowerCase();
        
        userAnswers.push(userAnswer);
        if (userAnswer === correctAnswer) {
            document.getElementById(`answer-${index}`).classList.add('correct');
            correctAnswers++;
        } else {
            document.getElementById(`answer-${index}`).classList.add('incorrect');
            document.getElementById(`correct-answer-${index}`).style.display = 'inline'; // Tampilkan jawaban yang benar jika salah
        }
    });

    stopTimer(); // Hentikan timer saat quiz selesai
    displayResult();
}

function displayResult() {
    const resultContainer = document.getElementById('result');
    const percentage = (correctAnswers / questions.length) * 100;
    
    resultContainer.innerHTML = `<h2>You got ${correctAnswers} out of ${questions.length} (${percentage.toFixed(2)}%) correct.</h2>`;
    document.getElementById('finish-btn').style.display = 'none';
    document.getElementById('retry-btn').style.display = 'block';
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        updateTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimer() {
    const minutes = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
    const seconds = (timeElapsed % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `Time: ${minutes}:${seconds}`;
}

window.onload = function() {
    document.getElementById('start-btn').style.display = 'block'; // Tampilkan tombol Start saat load pertama
};
