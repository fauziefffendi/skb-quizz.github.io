let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let correctAnswers = 0;
let currentSubject = '';
let questionLimit = 0;  // To store the number of questions to be taken

async function loadQuestions(subject) {
    try {
        const response = await fetch(subject === 'skb' ? 'questions.json' : 'questions_ld.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const questions = await response.json();
        return shuffleArray(questions).slice(0, questionLimit);  // Limit questions
    } catch (error) {
        console.error("Failed to load questions:", error);
        alert("Failed to load questions. Please try again.");
    }
}

function startQuiz() {
    currentSubject = document.getElementById("subject").value;
    questionLimit = parseInt(document.getElementById("question-count").value);  // Get number of questions

    // Hide start section
    document.getElementById('start-section').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';

    // Load the questions
    loadQuestions(currentSubject).then(questions => {
        if (questions && questions.length > 0) {
            currentQuestions = questions;
            userAnswers = Array(currentQuestions.length).fill(null);  // Initialize user answers
            showQuestion(currentQuestionIndex);  // Show the first question
            startTimer();
        } else {
            alert("No questions found.");
        }
    });
}

function showQuestion(index) {
    const question = currentQuestions[index];
    document.getElementById("question-number").innerText = `Question ${index + 1}`;
    document.getElementById("question-text").innerText = question.question;

    const optionsList = document.getElementById("options-list");
    const textAnswerInput = document.getElementById("text-answer");
    const submitButton = document.getElementById("submit-answer");

    // Clear previous options
    optionsList.innerHTML = '';
    textAnswerInput.style.display = 'none';
    submitButton.style.display = 'none';  // Hide submit button
    textAnswerInput.value = '';  // Clear text input

    // Check if it's a multiple-choice question
    if (question.option1 && question.option2 && question.option3 && question.option4) {
        optionsList.style.display = 'block';
        optionsList.innerHTML = `
            <li onclick="selectAnswer('${question.option1}')">A. ${question.option1}</li>
            <li onclick="selectAnswer('${question.option2}')">B. ${question.option2}</li>
            <li onclick="selectAnswer('${question.option3}')">C. ${question.option3}</li>
            <li onclick="selectAnswer('${question.option4}')">D. ${question.option4}</li>
        `;
    } else {
        // It's a short-answer question
        optionsList.style.display = 'none';
        textAnswerInput.style.display = 'block';
        submitButton.style.display = 'block';  // Show submit button
    }

    // Show saved answer if user has answered previously
    if (userAnswers[index]) {
        if (optionsList.style.display === 'block') {
            const selectedLi = Array.from(optionsList.children).find(li => li.innerText.includes(userAnswers[index]));
            if (selectedLi) selectedLi.style.backgroundColor = '#d3d3d3';
        } else {
            textAnswerInput.value = userAnswers[index];
        }
    }
}

function selectAnswer(answer) {
    userAnswers[currentQuestionIndex] = answer;
    showQuestion(currentQuestionIndex);  // Refresh the question display to show selected answer
}

function submitTextAnswer() {
    const textAnswerInput = document.getElementById("text-answer");
    userAnswers[currentQuestionIndex] = textAnswerInput.value;
    showQuestion(currentQuestionIndex);  // Refresh the question display to show saved answer
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
}

function finishQuiz() {
    correctAnswers = 0;
    const resultContainer = document.getElementById('result-section');
    resultContainer.innerHTML = '<h2>Your Results:</h2>';

    

    currentQuestions.forEach((question, index) => {
        const correctAnswer = question.answer.trim().toLowerCase();
        const userAnswer = userAnswers[index] ? userAnswers[index].trim().toLowerCase() : '';
        
        let questionHTML = `<h3>${index + 1}. ${question.question}</h3>`;
        
        if (question.option1 && question.option2 && question.option3 && question.option4) {
            questionHTML += `
                <ul>
                    <li ${userAnswer === question.option1.toLowerCase() ? 'style="color:grey"' : ''}>A. ${question.option1}</li>
                    <li ${userAnswer === question.option2.toLowerCase() ? 'style="color:grey"' : ''}>B. ${question.option2}</li>
                    <li ${userAnswer === question.option3.toLowerCase() ? 'style="color:grey"' : ''}>C. ${question.option3}</li>
                    <li ${userAnswer === question.option4.toLowerCase() ? 'style="color:grey"' : ''}>D. ${question.option4}</li>
                </ul>
            `;
        }

        if (userAnswer === correctAnswer) {
            correctAnswers++;
            questionHTML += `<p>Your answer: <span style="color:green">${userAnswers[index]}</span> (Correct)</p>`;
        } else {
            questionHTML += `<p>Your answer: <span style="color:red">${userAnswers[index] ? userAnswers[index] : 'No answer'}</span> (Incorrect)</p>`;
        }

        questionHTML += `<p>Correct answer: <span style="color:green">${question.answer}</span></p>`;

        resultContainer.innerHTML += questionHTML;
    });

    const scorePercentage = (correctAnswers / currentQuestions.length) * 100;
    resultContainer.innerHTML += `<p style="font-size: 1.5em;color: blue;"><strong>You got ${correctAnswers} out of ${currentQuestions.length} (${scorePercentage.toFixed(2)}%)</strong></p>`;
    resultContainer.innerHTML += `<button onclick="restartQuiz()">Restart Quiz</button>`;

    document.getElementById('quiz-section').style.display = 'none';
    resultContainer.style.display = 'block';
}

function restartQuiz() {
    location.reload();
}

function startTimer() {
    let totalSeconds = 0;
    const timerElement = document.getElementById("timer");
    const timer = setInterval(() => {
        totalSeconds++;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timerElement.innerText = `Time: ${minutes} : ${seconds}`;
    }, 1000);

    document.getElementById('finish-button').addEventListener('click', () => {
        clearInterval(timer);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
