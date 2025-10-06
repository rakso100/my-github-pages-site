// Language Fluency Assessment - Sequential sections with diverse question types

// Configuration: Show all questions from each section (no random selection)
const sectionQuestionCounts = {
    vocabulary: "all",    // Show all questions from vocabulary section
    verbs: "all",         // Show all questions from verbs section
    numbers: "all"        // Show all questions from numbers section
};

// Auth state for assessment access
let isAuthenticated = false;

// Warning system for test termination
let hasReceivedWarning = false;
let warningTimeout = null;

// Manual marking configuration
const manualMarkingConfig = {
    enabled: true,
    password: "tuga2024", // Password for accessing manual marking
    sections: {
        vocabulary: true,   // Vocabulary section requires manual marking
        verbs: true,        // Verbs section requires manual marking
        numbers: true       // Numbers section requires manual marking
    }
};

// Time limit configuration (in minutes)
const timeLimitConfig = {
    enabled: true,
    totalTime: 10, // Total time for entire assessment in minutes
    showTimer: true,
    warningTime: 5 // Show warning when 5 minutes remaining
};

const quizSections = {
    vocabulary: {
        title: "General/Common Vocabulary",
        icon: "fas fa-book-open",
        description: "We'll be testing your general ability to translate words to the opposite language.",
        difficulty: "Common Ability",
        questions: [
            {
                type: "fill-blank",
                question: "Translate: 'Tuga' to the opposite language.",
                correctAnswers: ["Hi", "Hello (informal)", "Hello"],
                caseSensitive: false,
                marks: 3
            },
            {
                type: "fill-blank",
                question: "Translate: 'Yes' to the opposite language.",
                correctAnswers: ["So"],
                caseSensitive: false,
                marks: 3
            },
            {
                type: "fill-blank",
                question: "Translate: 'Ti' to the opposite language.",
                correctAnswers: ["You", "You (singular)", "You (sg)", "You (s)", "You (single)"],
                caseSensitive: false,
                marks: 3
            },
            {
                type: "fill-blank",
                question: "Translate: 'Parukero' to the opposite language.",
                correctAnswers: ["Please"],
                caseSensitive: false,
                marks: 4
            },
            {
                type: "fill-blank",
                question: "Translate: 'How' to the opposite language.",
                correctAnswers: ["Kata"],
                caseSensitive: false,
                marks: 4
            },
            {
                type: "fill-blank",
                question: "Translate: 'Pasa' to the opposite language.",
                correctAnswers: ["To"],
                caseSensitive: false,
                marks: 4
            },
            {
                type: "fill-blank",
                question: "Translate: 'These' to the opposite language.",
                correctAnswers: ["zogs"],
                caseSensitive: false,
                marks: 4
            },
            {
                type: "fill-blank",
                question: "Translate: 'Pasada' to the opposite language.",
                correctAnswers: ["goodbye"],
                caseSensitive: false,
                marks: 5
            },
            {
                type: "fill-blank",
                question: "Translate: 'Who' to the opposite language.",
                correctAnswers: ["Kaja"],
                caseSensitive: false,
                marks: 5
            },
            {
                type: "fill-blank",
                question: "Translate: 'Tili' to the opposite language.",
                correctAnswers: ["cat"],
                caseSensitive: false,
                marks: 5
            }
        ]
    },
    verbs: {
        title: "Verbs",
        icon: "fas fa-running",
        description: "Test your ability to translate verbs between languages.",
        difficulty: "General Ability",
        questions: [
            {
                type: "fill-blank",
                question: "Translate: 'Hoto' to the opposite language.",
                correctAnswers: ["to eat", "eat", "to be eating", "the process of eating", "the verb to eat"],
                caseSensitive: false,
                marks: 3
            },
            {
                type: "fill-blank",
                question: "Translate: 'To Have' to the opposite language.",
                correctAnswers: ["pil"],
                caseSensitive: false,
                marks: 3
            },
            {
                type: "fill-blank",
                question: "Translate: 'Apas' to the opposite language.",
                correctAnswers: ["I am", "I be", "To Be (Present)", "To Be (Pres)", "To Be (Present Simple)", "To Be Present Tense", "To Be Present", "Present To Be", "be"],
                caseSensitive: false,
                marks: 3
            },
            {
                type: "fill-blank",
                question: "Translate: 'Have been eating' to the opposite language.",
                correctAnswers: ["iohoto"],
                caseSensitive: false,
                marks: 6
            }
        ]
    },
    numbers: {
        title: "Numbers",
        icon: "fas fa-calculator",
        description: "Test your ability to translate numbers between languages.",
        difficulty: "General Ability",
        questions: [
            {
                type: "fill-blank",
                question: "Translate: 'zero' to the opposite language.",
                correctAnswers: ["b"],
                caseSensitive: false,
                marks: 3
            },
            {
                type: "fill-blank",
                question: "Translate: 'two' to the opposite language.",
                correctAnswers: ["be"],
                caseSensitive: false,
                marks: 3
            },
            {
                type: "fill-blank",
                question: "Translate: 'eleven' to the opposite language.",
                correctAnswers: ["duba", "du ba", "du-ba"],
                caseSensitive: false,
                marks: 3
            },
            {
                type: "fill-blank",
                question: "Translate: 'one-hundred and thirty-nine' to the opposite language.",
                correctAnswers: ["bafubidudo", "fudidudo", "ba-fu-bi-du-do", "fu-di-du-do", "ba fu di du do", "fu di du do"],
                caseSensitive: false,
                marks: 6
            }
        ]
    }
};

// Quiz State
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let quizStarted = false;
let currentSection = null;
let currentQuizData = [];
let currentSectionIndex = 0;
let sectionScores = {};
let totalSections = Object.keys(quizSections).length;
let sectionOrder = ['vocabulary', 'verbs', 'numbers'];

// Timer variables
let timeRemaining = 0; // in seconds
let timerInterval = null;
let assessmentStartTime = null;

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const testPasswordScreen = document.getElementById('testPasswordScreen');
const warningScreen = document.getElementById('warningScreen');
const sectionScreen = document.getElementById('sectionScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');
const testEndedScreen = document.getElementById('testEndedScreen');
const startAssessmentBtn = document.getElementById('startAssessmentBtn');
const backToWelcomeBtn = document.getElementById('backToWelcomeBtn');
const backToSectionBtn = document.getElementById('backToSectionBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const retakeBtn = document.getElementById('retakeBtn');
const newSectionBtn = document.getElementById('newSectionBtn');
const shareBtn = document.getElementById('shareBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const sectionsGrid = document.getElementById('sectionsGrid');
const currentSectionName = document.getElementById('currentSectionName');

// Results elements
const scorePercentage = document.getElementById('scorePercentage');
const resultsTitle = document.getElementById('resultsTitle');
const resultsDescription = document.getElementById('resultsDescription');
const correctCount = document.getElementById('correctCount');
const totalCount = document.getElementById('totalCount');
const accuracy = document.getElementById('accuracy');

// Per-section answers store to correctly serialize submissions
let userAnswersBySection = {};

// Initialize the quiz
function initQuiz() {
    // Add event listeners
    if (startAssessmentBtn) startAssessmentBtn.addEventListener('click', startAssessment);
    if (backToWelcomeBtn) backToWelcomeBtn.addEventListener('click', showWelcome);
    if (backToSectionBtn) backToSectionBtn.addEventListener('click', showWelcome);
    if (prevBtn) prevBtn.addEventListener('click', previousQuestion);
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (retakeBtn) retakeBtn.addEventListener('click', retakeAssessment);
    if (newSectionBtn) newSectionBtn.addEventListener('click', showWelcome);
    if (shareBtn) shareBtn.addEventListener('click', shareResults);
    
    // Manual marking event listeners
    const submitPasswordBtn = document.getElementById('submitPasswordBtn');
    const markingPassword = document.getElementById('markingPassword');
    const backToPasswordBtn = document.getElementById('backToPasswordBtn');
    const completeMarkingBtn = document.getElementById('completeMarkingBtn');
    
    if (submitPasswordBtn) {
        submitPasswordBtn.addEventListener('click', () => {
            const enteredPassword = markingPassword.value;
            if (enteredPassword === manualMarkingConfig.password) {
                showManualMarkingInterface();
            } else {
                document.getElementById('passwordError').style.display = 'flex';
                markingPassword.value = '';
            }
        });
        
        markingPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitPasswordBtn.click();
            }
        });
    }
    
    if (backToPasswordBtn) {
        backToPasswordBtn.addEventListener('click', showManualMarkingPassword);
    }
    
    if (completeMarkingBtn) {
        completeMarkingBtn.addEventListener('click', completeManualMarking);
    }
    
    // Test password screen event listeners
    const submitTestPasswordBtn = document.getElementById('submitTestPasswordBtn');
    const testPassword = document.getElementById('testPassword');
    const backToWelcomeFromTestPasswordBtn = document.getElementById('backToWelcomeFromTestPasswordBtn');
    
    // Warning screen event listeners
    const acknowledgeWarningBtn = document.getElementById('acknowledgeWarningBtn');
    
    if (submitTestPasswordBtn) {
        submitTestPasswordBtn.addEventListener('click', () => {
            const enteredPassword = testPassword.value;
            if (enteredPassword === manualMarkingConfig.password) {
                isAuthenticated = true;
                showScreen('assessmentSummaryScreen');
            } else {
                const errorDiv = document.getElementById('testPasswordError');
                if (errorDiv) {
                    errorDiv.style.display = 'flex';
                }
                testPassword.value = '';
            }
        });
    }
    
    // Add Enter key support for password input
    if (testPassword) {
        testPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const enteredPassword = testPassword.value;
                if (enteredPassword === manualMarkingConfig.password) {
                    isAuthenticated = true;
                    showScreen('assessmentSummaryScreen');
                } else {
                    const errorDiv = document.getElementById('testPasswordError');
                    if (errorDiv) {
                        errorDiv.style.display = 'flex';
                    }
                    testPassword.value = '';
                }
            }
        });
    }
    
    if (backToWelcomeFromTestPasswordBtn) {
        backToWelcomeFromTestPasswordBtn.addEventListener('click', () => {
            // Clear password error when going back
            const errorDiv = document.getElementById('testPasswordError');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
            showScreen('welcomeScreen');
        });
    }
    
    if (acknowledgeWarningBtn) {
        acknowledgeWarningBtn.addEventListener('click', () => {
            console.log('Warning acknowledged, returning to quiz');
            
            // Clear any pending warning timeout
            if (warningTimeout) {
                clearTimeout(warningTimeout);
                warningTimeout = null;
            }
            
            // Return to the quiz screen with error handling
            try {
                showScreen('quizScreen');
            } catch (error) {
                console.error('Error returning to quiz screen:', error);
                // Fallback: try to show welcome screen
                showScreen('welcomeScreen');
            }
        });
    }
    
    // Test ended screen event listeners
    const backToWelcomeFromEndedBtn = document.getElementById('backToWelcomeFromEndedBtn');
    
    if (backToWelcomeFromEndedBtn) {
        backToWelcomeFromEndedBtn.addEventListener('click', () => {
            resetQuiz();
            showScreen('welcomeScreen');
        });
    }
    
    // Assessment summary event listeners
    const backToWelcomeFromSummaryBtn = document.getElementById('backToWelcomeFromSummaryBtn');
    const startAssessmentFromSummaryBtn = document.getElementById('startAssessmentFromSummaryBtn');
    
    if (backToWelcomeFromSummaryBtn) {
        backToWelcomeFromSummaryBtn.addEventListener('click', showWelcome);
    }
    
    if (startAssessmentFromSummaryBtn) {
        startAssessmentFromSummaryBtn.addEventListener('click', startAssessmentFromSummary);
    }
}

// Start the complete assessment
function startAssessment() {
    // Prevent footer clicks from starting assessment
    if (event && event.target && event.target.closest('.footers')) {
        console.log('Footer click prevented from starting assessment');
        return;
    }
    
    // For testing purposes, allow direct access without authentication
    // In production, uncomment the line below:
    // if (!isAuthenticated) return showScreen('testPasswordScreen');
    
    showAssessmentSummary();
}

// Show assessment summary before starting
function showAssessmentSummary() {
    // For testing purposes, allow access without authentication
    // In production, uncomment the line below:
    // if (!isAuthenticated) return showScreen('testPasswordScreen');
    
    calculateAssessmentTotals();
    renderSummarySections();
    showScreen('assessmentSummary');
}

// Calculate total questions and marks for the assessment
function calculateAssessmentTotals() {
    let totalQuestions = 0;
    let totalMarks = 0;
    
    sectionOrder.forEach(sectionKey => {
        const sectionQuestions = quizSections[sectionKey].questions;
        
        // Add up marks for all questions in the section
        sectionQuestions.forEach(question => {
            totalMarks += question.marks || 1;
        });
        
        totalQuestions += sectionQuestions.length;
    });
    
    // Update summary display
    document.getElementById('totalQuestions').textContent = totalQuestions;
    document.getElementById('totalMarks').textContent = totalMarks;
    document.getElementById('timeLimit').textContent = `${timeLimitConfig.totalTime} minutes`;
    document.getElementById('totalSections').textContent = sectionOrder.length;
}

// Render section breakdown in summary
function renderSummarySections() {
    const summarySections = document.getElementById('summarySections');
    summarySections.innerHTML = '';
    
    sectionOrder.forEach(sectionKey => {
        const section = quizSections[sectionKey];
        const sectionQuestions = quizSections[sectionKey].questions;
        
        // Calculate marks for all questions in this section
        let sectionMarks = 0;
        sectionQuestions.forEach(question => {
            sectionMarks += question.marks || 1;
        });
        
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'summary-section';
        sectionDiv.innerHTML = `
            <span class="summary-section-name">${section.title}</span>
            <span class="summary-section-details">${sectionQuestions.length} questions • ${sectionMarks} marks</span>
        `;
        
        summarySections.appendChild(sectionDiv);
    });
}

// Start assessment from summary
function startAssessmentFromSummary() {
    console.log('=== START ASSESSMENT FROM SUMMARY DEBUG ===');
    console.log('Starting assessment from summary');
    if (!isAuthenticated) return showScreen('testPasswordScreen');
    
    currentSectionIndex = 0;
    sectionScores = {};
    quizStarted = true;
    
    console.log('Reset variables - currentSectionIndex:', currentSectionIndex);
    console.log('Reset variables - quizStarted:', quizStarted);
    
    // Initialize timer if enabled
    if (timeLimitConfig.enabled) {
        console.log('Initializing timer');
        initializeTimer();
    }
    
    // Start with the first section
    console.log('About to call startNextSection');
    showScreen('quizScreen');
    startNextSection();
    
    console.log('=== END START ASSESSMENT FROM SUMMARY DEBUG ===');
}

// Initialize timer
function initializeTimer() {
    timeRemaining = timeLimitConfig.totalTime * 60; // Convert to seconds
    assessmentStartTime = Date.now();
    
    // Show timer
    const timerContainer = document.getElementById('timerContainer');
    if (timerContainer) {
        timerContainer.style.display = 'flex';
    }
    
    // Start timer
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial update
    
    // Initialize focus and mouse leave detection
    initializeFocusDetection();
    
    // Add test function for debugging (remove in production)
    window.testEndTest = () => {
        console.log('Manually triggering test end...');
        endTestAutomatically('manual-test');
    };
}

// Update timer display
function updateTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timerElement = document.getElementById('timer');
    const timerContainer = document.getElementById('timerContainer');
    
    if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update timer styling based on time remaining
    if (timerContainer) {
        timerContainer.className = 'timer-container';
        
        if (timeRemaining <= timeLimitConfig.warningTime * 60) {
            timerContainer.classList.add('warning');
        }
        
        if (timeRemaining <= 60) { // Last minute
            timerContainer.classList.add('critical');
        }
    }
    
    // Check if time is up
    if (timeRemaining <= 0) {
        timeUp();
        return;
    }
    
    timeRemaining--;
}

// Handle time up
function timeUp() {
    clearInterval(timerInterval);
    
    // Auto-submit current section if in progress
    if (quizStarted && currentSectionIndex < sectionOrder.length) {
        finishQuiz();
    }
    
    // Show time up message
    alert('Time\'s up! Your assessment has been automatically submitted.');
}

// Initialize focus and mouse leave detection
function initializeFocusDetection() {
    // Tab focus detection
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Mouse leave detection
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Window blur detection (alternative to visibility change)
    window.addEventListener('blur', handleWindowBlur);
}

// Handle tab visibility change
function handleVisibilityChange() {
    // Add small delay to prevent rapid firing
    setTimeout(() => {
        if (document.hidden && isQuizActive()) {
            if (!hasReceivedWarning) {
                showWarning('tab');
            } else {
                endTestAutomatically('tab');
            }
        }
    }, 100);
}

// Handle mouse leaving the screen
function handleMouseLeave(event) {
    // Only trigger if mouse actually leaves the viewport (not just moving to another element)
    if (isQuizActive() && event.clientY <= 0 && event.relatedTarget === null) {
        if (!hasReceivedWarning) {
            showWarning('mouse');
        } else {
            endTestAutomatically('mouse');
        }
    }
}

// Handle window blur (when user switches to another application)
function handleWindowBlur() {
    // Add small delay to prevent rapid firing
    setTimeout(() => {
        if (isQuizActive() && document.hidden) {
            if (!hasReceivedWarning) {
                showWarning('window');
            } else {
                endTestAutomatically('window');
            }
        }
    }, 100);
}

// Check if quiz is currently active
function isQuizActive() {
    return quizScreen.classList.contains('active') || 
           manualMarkingPasswordScreen.classList.contains('active') ||
           manualMarkingScreen.classList.contains('active');
}

// Show warning screen
function showWarning(reason) {
    console.log(`Showing warning for: ${reason}`);
    
    // Prevent multiple warnings from showing simultaneously
    if (document.getElementById('warningScreen').classList.contains('active')) {
        console.log('Warning screen already active, ignoring duplicate warning');
        return;
    }
    
    // Set warning flag
    hasReceivedWarning = true;
    
    // Clear any existing timeout
    if (warningTimeout) {
        clearTimeout(warningTimeout);
    }
    
    // Show warning screen with better error handling
    try {
        showScreen('warningScreen');
        
        // Set timeout to automatically end test if user doesn't acknowledge warning
        warningTimeout = setTimeout(() => {
            console.log('Warning timeout reached, ending test');
            endTestAutomatically(`${reason} - warning timeout`);
        }, 30000); // 30 seconds timeout
    } catch (error) {
        console.error('Error showing warning screen:', error);
        // Fallback: end test immediately if warning screen fails
        endTestAutomatically(`${reason} - warning screen error`);
    }
}

// End test automatically
function endTestAutomatically(reason) {
    console.log(`Test ended automatically due to: ${reason}`);
    
    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Reset quiz state
    resetQuiz();
    
    // Show test ended screen
    console.log('Showing test ended screen...');
    showScreen('testEndedScreen');
    
    // Verify screen is shown
    setTimeout(() => {
        const testEndedScreen = document.getElementById('testEndedScreen');
        console.log('Test ended screen element:', testEndedScreen);
        console.log('Test ended screen classes:', testEndedScreen?.classList.toString());
    }, 100);
}

// Clean up focus detection
function cleanupFocusDetection() {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    document.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('blur', handleWindowBlur);
    
    // Clear warning timeout
    if (warningTimeout) {
        clearTimeout(warningTimeout);
        warningTimeout = null;
    }
}

// Reset quiz to initial state
function resetQuiz() {
    // Reset quiz state
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    currentSection = null;
    currentSectionIndex = 0;
    sectionScores = {};
    quizStarted = false;
    
    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Reset time
    timeRemaining = 0;
    assessmentStartTime = null;
    
    // Reset warning state
    hasReceivedWarning = false;
    if (warningTimeout) {
        clearTimeout(warningTimeout);
        warningTimeout = null;
    }
    
    // Clean up focus detection
    cleanupFocusDetection();
    
    // Reset UI elements
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
    
    const timerContainer = document.getElementById('timerContainer');
    if (timerContainer) {
        timerContainer.style.display = 'none';
    }
    
    // Reset question display
    // Do not cache these; always re-query before render to avoid stale refs
    let questionText = document.getElementById('questionText');
    let optionsContainer = document.getElementById('optionsContainer');
    if (questionText) questionText.textContent = '';
    if (optionsContainer) optionsContainer.innerHTML = '';
    
    // Reset progress
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    if (progressFill) progressFill.style.width = '0%';
    if (progressText) progressText.textContent = 'Question 1 of 5';
    
    // Reset navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
}


// Utility function to shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Start the next section in sequence
function startNextSection() {
    console.log('=== START NEXT SECTION DEBUG ===');
    console.log('Starting next section, index:', currentSectionIndex);
    console.log('Section order:', sectionOrder);
    console.log('Total sections:', sectionOrder.length);
    
    if (currentSectionIndex >= sectionOrder.length) {
        // All sections completed, show final results
        console.log('All sections completed, showing final results');
        showFinalResults();
        return;
    }
    
    const sectionKey = sectionOrder[currentSectionIndex];
    const section = quizSections[sectionKey];
    
    console.log('Section key:', sectionKey);
    console.log('Section data:', section);
    console.log('Section questions:', section ? section.questions : 'undefined');
    console.log('Number of questions in section:', section ? section.questions.length : 'undefined');
    
    if (!section || !section.questions) {
        console.error('Section not found or has no questions:', sectionKey);
        return;
    }
    
    // Set up current section with all questions
    currentSection = sectionKey;
    currentQuizData = [...section.questions];
    
    console.log('Current quiz data set to:', currentQuizData);
    console.log('Current quiz data length:', currentQuizData.length);
    console.log('First question:', currentQuizData[0]);
    
    // Use all questions from the section (no random selection)
    
    if (currentSectionName) {
        currentSectionName.textContent = section.title;
        console.log('Updated section name to:', section.title);
    }
    
    currentQuestion = 0;
    score = 0;
    userAnswers = new Array(currentQuizData.length).fill(null);
    userAnswersBySection[currentSection] = new Array(currentQuizData.length).fill(null);
    
    console.log('About to show quiz screen');
    showScreen('quizScreen');
    // Ensure warning overlay is not blocking the quiz
    const ws = document.getElementById('warningScreen');
    if (ws) {
        ws.classList.remove('active', 'fade-in-up');
        ws.style.display = '';
    }
    
    console.log('About to load question');
    loadQuestion();
    
    console.log('About to update progress');
    updateProgress();
    
    // Show progress container
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.style.display = 'flex';
        console.log('Progress container shown');
    } else {
        console.error('Progress container not found');
    }
    
    console.log('=== END START NEXT SECTION DEBUG ===');
}

// Show welcome screen
function showWelcome() {
    showScreen('welcome');
    // Hide progress container on welcome screen
    document.getElementById('progressContainer').style.display = 'none';
}

// Show specific screen
function showScreen(screenName) {
    console.group('showScreen');
    console.log('Requested screenName:', screenName);
    // Prevent footer clicks from changing screens
    if (event && event.target && event.target.closest('.footers')) {
        console.log('Footer click prevented from changing screen to:', screenName);
        console.groupEnd();
        return;
    }
    
    // Clear any warning timeouts when changing screens
    if (warningTimeout) {
        clearTimeout(warningTimeout);
        warningTimeout = null;
    }
    
    // Hide all screens
    const allScreens = document.querySelectorAll('.screen');
    const beforeActive = [...allScreens].filter(s => s.classList.contains('active')).map(s => s.id);
    console.log('Currently active before hide:', beforeActive);
    allScreens.forEach(screen => {
        if (screen.classList.contains('active')) {
            console.log('Removing active from:', screen.id);
        }
        screen.classList.remove('active');
        screen.classList.remove('fade-in-up'); // Remove animation class
    });
    
    // Show target screen
    const targetId = screenName.endsWith('Screen') ? screenName : `${screenName}Screen`;
    const targetScreen = document.getElementById(targetId);
    console.log('Target screen element:', targetScreen);
    console.log('Screen name:', screenName);
    
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log('Added active class to screen:', screenName);
        
        // Add animation class with a small delay for warning screen
        if (screenName === 'warningScreen') {
            setTimeout(() => {
                targetScreen.classList.add('fade-in-up');
            }, 50);
        } else {
            targetScreen.classList.add('fade-in-up');
        }

        // Hard-disable lingering warning overlay when switching away from it
        if (targetId !== 'warningScreen') {
            const ws = document.getElementById('warningScreen');
            if (ws) {
                ws.classList.remove('active', 'fade-in-up');
                ws.style.display = ''; // let CSS control it
            }
        }

        // If switching to quiz, force-render the current question immediately
        if (targetId === 'quizScreen') {
            try {
                if (currentQuizData && currentQuizData[currentQuestion]) {
                    const qNumEl = document.getElementById('questionNumber');
                    const qTextEl = document.getElementById('questionText');
                    const optsEl = document.getElementById('optionsContainer');
                    if (qNumEl) qNumEl.textContent = currentQuestion + 1;
                    if (qTextEl) qTextEl.textContent = currentQuizData[currentQuestion].question || '';
                    if (optsEl) optsEl.innerHTML = '';
                    renderQuestionByType(currentQuizData[currentQuestion]);
                    updateNavigationButtons();
                } else {
                    console.warn('No current question to render on quizScreen activation');
                }
            } catch (e) {
                console.error('Force render on quizScreen failed:', e);
            }
        }
    } else {
        console.error('Target screen not found:', screenName);
    }

    // Debug state after show
    const afterActive = [...document.querySelectorAll('.screen.active')].map(s => s.id);
    console.log('Active screens after show:', afterActive);
    const topAtPoint = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2);
    if (topAtPoint) {
        console.log('Top element at viewport center:', topAtPoint.id || topAtPoint.className);
        if (targetScreen && topAtPoint !== targetScreen && !targetScreen.contains(topAtPoint)) {
            console.warn('Another element is on top of target screen:', topAtPoint);
        }
    }
    console.groupEnd();
    
    // Clear password fields when showing password screens
    if (screenName === 'testPasswordScreen' || screenName === 'testPassword') {
        const testPasswordField = document.getElementById('testPassword');
        if (testPasswordField) {
            testPasswordField.value = '';
        }
        // Hide any error messages
        const testPasswordError = document.getElementById('testPasswordError');
        if (testPasswordError) {
            testPasswordError.style.display = 'none';
        }
    }
    
    if (screenName === 'manualMarkingPasswordScreen' || screenName === 'manualMarkingPassword') {
        const manualPasswordField = document.getElementById('manualMarkingPassword');
        if (manualPasswordField) {
            manualPasswordField.value = '';
        }
        // Hide any error messages
        const manualPasswordError = document.getElementById('manualMarkingPasswordError');
        if (manualPasswordError) {
            manualPasswordError.style.display = 'none';
        }
    }
    
    // All screens are now full width by default - no special handling needed
}

// Load current question
function loadQuestion() {
    console.log('=== LOAD QUESTION DEBUG ===');
    console.log('Loading question:', currentQuestion);
    console.log('Current quiz data:', currentQuizData);
    console.log('Current section:', currentSection);
    console.log('Quiz data length:', currentQuizData ? currentQuizData.length : 'undefined');
    
    // Check if DOM elements exist
    console.log('questionNumber element:', questionNumber);
    console.log('questionText element:', questionText);
    console.log('optionsContainer element:', optionsContainer);
    
    if (!currentQuizData || currentQuizData.length === 0) {
        console.error('No quiz data available');
        if (questionText) {
            questionText.textContent = 'No questions available. Please try refreshing the page.';
        }
        return;
    }
    
    const question = currentQuizData[currentQuestion];
    
    if (!question) {
        console.error('No question found at index:', currentQuestion);
        if (questionText) {
            questionText.textContent = 'Question not found. Please try refreshing the page.';
        }
        return;
    }
    
    console.log('Question data:', question);
    console.log('Question text:', question.question);
    
    // Re-query live elements to avoid updating hidden duplicates
    const qNumEl = document.getElementById('questionNumber');
    const qTextEl = document.getElementById('questionText');
    const optsEl = document.getElementById('optionsContainer');

    // Update question number and text
    if (qNumEl) {
        questionNumber.textContent = currentQuestion + 1;
        console.log('Updated question number to:', currentQuestion + 1);
    }
    if (qTextEl) {
        qTextEl.textContent = question.question;
        console.log('Updated question text to:', question.question);
    }
    
    // Clear options container
    if (optsEl) {
        optsEl.innerHTML = '';
        console.log('Cleared options container');
    }
    
    // Render question based on type
    try {
        console.log('Rendering question type:', question.type);
        renderQuestionByType(question);
        console.log('Question rendered successfully');
    } catch (error) {
        console.error('Error rendering question:', error);
        if (optionsContainer) {
            optionsContainer.innerHTML = '<p>Error loading question. Please try refreshing the page.</p>';
        }
    }
    
    // Update navigation buttons
    updateNavigationButtons();
    updateProgress();
    console.log('=== END LOAD QUESTION DEBUG ===');
}

// Render question based on type
function renderQuestionByType(question) {
    const type = question.type || 'multiple-choice';
    
    switch(type) {
        case 'multiple-choice':
            renderMultipleChoice(question);
            break;
        case 'fill-blank':
            renderFillBlank(question);
            break;
        case 'true-false':
            renderTrueFalse(question);
            break;
        case 'matching':
            renderMatching(question);
            break;
        case 'word-order':
            renderWordOrder(question);
            break;
        case 'dropdown':
            renderDropdown(question);
            break;
        case 'transformation':
            renderTransformation(question);
            break;
        case 'cloze':
            renderCloze(question);
            break;
        default:
            renderMultipleChoice(question);
    }
}

// Render multiple choice questions
function renderMultipleChoice(question) {
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option';
        optionBtn.textContent = option;
        optionBtn.dataset.index = index;
        
        if (userAnswers[currentQuestion] === index) {
            optionBtn.classList.add('selected');
        }
        
        optionBtn.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionBtn);
    });
}

// Render fill-in-the-blank questions
function renderFillBlank(question) {
    const inputContainer = document.createElement('div');
    inputContainer.className = 'fill-blank-container';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'fill-blank-input';
    input.placeholder = 'Type your answer here...';
    
    if (userAnswers[currentQuestion]) {
        input.value = userAnswers[currentQuestion];
    }
    
    input.addEventListener('input', () => {
        userAnswers[currentQuestion] = input.value;
        if (currentSection && userAnswersBySection[currentSection]) {
            userAnswersBySection[currentSection][currentQuestion] = input.value;
        }
        updateNavigationButtons();
    });
    
    inputContainer.appendChild(input);
    optionsContainer.appendChild(inputContainer);
}

// Render true/false questions
function renderTrueFalse(question) {
    const trueBtn = document.createElement('button');
    trueBtn.className = 'option true-false-option';
    trueBtn.textContent = 'True';
    trueBtn.dataset.value = 'true';
    
    const falseBtn = document.createElement('button');
    falseBtn.className = 'option true-false-option';
    falseBtn.textContent = 'False';
    falseBtn.dataset.value = 'false';
    
    if (userAnswers[currentQuestion] === 'true') {
        trueBtn.classList.add('selected');
    } else if (userAnswers[currentQuestion] === 'false') {
        falseBtn.classList.add('selected');
    }
    
    trueBtn.addEventListener('click', () => selectTrueFalse('true'));
    falseBtn.addEventListener('click', () => selectTrueFalse('false'));
    
    optionsContainer.appendChild(trueBtn);
    optionsContainer.appendChild(falseBtn);
}

// Render matching questions
function renderMatching(question) {
    const matchingContainer = document.createElement('div');
    matchingContainer.className = 'matching-container';
    
    const leftColumn = document.createElement('div');
    leftColumn.className = 'matching-column';
    
    const rightColumn = document.createElement('div');
    rightColumn.className = 'matching-column';
    
    // Create draggable items for left column
    question.leftColumn.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'matching-item left-item';
        itemEl.textContent = item;
        itemEl.draggable = true;
        itemEl.dataset.leftIndex = index;
        leftColumn.appendChild(itemEl);
    });
    
    // Create drop zones for right column
    question.rightColumn.forEach((item, index) => {
        const dropZone = document.createElement('div');
        dropZone.className = 'matching-drop-zone';
        dropZone.dataset.rightIndex = index;
        dropZone.textContent = item;
        rightColumn.appendChild(dropZone);
    });
    
    matchingContainer.appendChild(leftColumn);
    matchingContainer.appendChild(rightColumn);
    optionsContainer.appendChild(matchingContainer);
    
    // Add drag and drop functionality
    addDragAndDropListeners();
}

// Render word ordering questions
function renderWordOrder(question) {
    const wordContainer = document.createElement('div');
    wordContainer.className = 'word-order-container';
    
    const instruction = document.createElement('p');
    instruction.className = 'word-order-instruction';
    instruction.textContent = question.instruction || 'Drag the words to arrange them in the correct order';
    wordContainer.appendChild(instruction);
    
    const wordList = document.createElement('div');
    wordList.className = 'word-list';
    
    question.words.forEach((word, index) => {
        const wordEl = document.createElement('div');
        wordEl.className = 'word-item';
        wordEl.textContent = word;
        wordEl.draggable = true;
        wordEl.dataset.wordIndex = index;
        wordList.appendChild(wordEl);
    });
    
    wordContainer.appendChild(wordList);
    optionsContainer.appendChild(wordContainer);
    
    // Add drag and drop functionality for word ordering
    addWordOrderListeners();
}

// Render dropdown questions
function renderDropdown(question) {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown-container';
    
    const sentenceParts = question.sentence.split('_____');
    const dropdown = document.createElement('select');
    dropdown.className = 'dropdown-select';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select an answer...';
    dropdown.appendChild(defaultOption);
    
    // Add answer options
    question.dropdowns[0].options.forEach((option, index) => {
        const optionEl = document.createElement('option');
        optionEl.value = index;
        optionEl.textContent = option;
        dropdown.appendChild(optionEl);
    });
    
    if (userAnswers[currentQuestion] !== null && userAnswers[currentQuestion] !== undefined) {
        dropdown.value = userAnswers[currentQuestion];
    }
    
    dropdown.addEventListener('change', () => {
        const val = parseInt(dropdown.value);
        userAnswers[currentQuestion] = val;
        if (currentSection && userAnswersBySection[currentSection]) {
            userAnswersBySection[currentSection][currentQuestion] = val;
        }
        updateNavigationButtons();
    });
    
    dropdownContainer.innerHTML = `
        <p>${sentenceParts[0]} <span class="dropdown-placeholder">_____</span> ${sentenceParts[1]}</p>
    `;
    
    dropdownContainer.querySelector('.dropdown-placeholder').replaceWith(dropdown);
    optionsContainer.appendChild(dropdownContainer);
}

// Render transformation questions
function renderTransformation(question) {
    const transformContainer = document.createElement('div');
    transformContainer.className = 'transformation-container';
    
    const originalSentence = document.createElement('div');
    originalSentence.className = 'original-sentence';
    originalSentence.textContent = question.originalSentence;
    
    const instruction = document.createElement('p');
    instruction.className = 'transformation-instruction';
    instruction.textContent = question.instruction || 'Type your answer in the text box';
    
    const input = document.createElement('textarea');
    input.className = 'transformation-input';
    input.placeholder = 'Type your transformed sentence here...';
    input.rows = 3;
    
    if (userAnswers[currentQuestion]) {
        input.value = userAnswers[currentQuestion];
    }
    
    input.addEventListener('input', () => {
        userAnswers[currentQuestion] = input.value;
        if (currentSection && userAnswersBySection[currentSection]) {
            userAnswersBySection[currentSection][currentQuestion] = input.value;
        }
        updateNavigationButtons();
    });
    
    transformContainer.appendChild(originalSentence);
    transformContainer.appendChild(instruction);
    transformContainer.appendChild(input);
    optionsContainer.appendChild(transformContainer);
}

// Render cloze test questions
function renderCloze(question) {
    const clozeContainer = document.createElement('div');
    clozeContainer.className = 'cloze-container';
    
    const passage = document.createElement('div');
    passage.className = 'cloze-passage';
    
    // Split passage by blanks and create input fields
    const parts = question.passage.split('_____');
    
    for (let i = 0; i < parts.length; i++) {
        // Add text part
        if (parts[i]) {
            const textSpan = document.createElement('span');
            textSpan.textContent = parts[i];
            passage.appendChild(textSpan);
        }
        
        // Add input field (except for the last part if it's empty)
        if (i < parts.length - 1 || (i === parts.length - 1 && parts[i] === '')) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'cloze-input';
            input.dataset.blankIndex = i;
            
            // Set existing value if available
            if (userAnswers[currentQuestion] && userAnswers[currentQuestion][i]) {
                input.value = userAnswers[currentQuestion][i];
            }
            
            // Add event listener
            input.addEventListener('input', () => {
                if (!userAnswers[currentQuestion]) userAnswers[currentQuestion] = [];
                userAnswers[currentQuestion][i] = input.value;
                if (currentSection && userAnswersBySection[currentSection]) {
                    if (!userAnswersBySection[currentSection][currentQuestion]) userAnswersBySection[currentSection][currentQuestion] = [];
                    userAnswersBySection[currentSection][currentQuestion][i] = input.value;
                }
                updateNavigationButtons();
            });
            
            passage.appendChild(input);
        }
    }
    
    clozeContainer.appendChild(passage);
    optionsContainer.appendChild(clozeContainer);
}

// Select an option (for multiple choice)
function selectOption(optionIndex) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    const selectedOption = document.querySelector(`[data-index="${optionIndex}"]`);
    selectedOption.classList.add('selected');
    
    // Store user answer
    userAnswers[currentQuestion] = optionIndex;
    if (currentSection) {
        userAnswersBySection[currentSection] = userAnswersBySection[currentSection] || [];
        userAnswersBySection[currentSection][currentQuestion] = optionIndex;
    }
    
    // Mirror per-section answer
    if (currentSection && userAnswersBySection[currentSection]) {
        userAnswersBySection[currentSection][currentQuestion] = optionIndex;
    }
    // Enable next button
    nextBtn.disabled = false;
}

// Select true/false option
function selectTrueFalse(value) {
    // Remove previous selection
    document.querySelectorAll('.true-false-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    const selectedOption = document.querySelector(`[data-value="${value}"]`);
    selectedOption.classList.add('selected');
    
    // Store user answer
    userAnswers[currentQuestion] = value;
    if (currentSection) {
        userAnswersBySection[currentSection] = userAnswersBySection[currentSection] || [];
        userAnswersBySection[currentSection][currentQuestion] = value;
    }
    
    // Mirror per-section answer
    if (currentSection && userAnswersBySection[currentSection]) {
        userAnswersBySection[currentSection][currentQuestion] = value;
    }
    // Enable next button
    nextBtn.disabled = false;
}

// Add drag and drop listeners for matching
function addDragAndDropListeners() {
    const leftItems = document.querySelectorAll('.left-item');
    const dropZones = document.querySelectorAll('.matching-drop-zone');
    
    leftItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.leftIndex);
            e.target.classList.add('dragging');
        });
        
        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', (e) => {
            zone.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const leftIndex = e.dataTransfer.getData('text/plain');
            const rightIndex = zone.dataset.rightIndex;
            
            // Check if this left item is already matched elsewhere
            const existingMatches = document.querySelectorAll('.matching-drop-zone.matched');
            existingMatches.forEach(existingZone => {
                if (existingZone.dataset.matchedLeftIndex === leftIndex) {
                    // Clear the previous match
                    existingZone.textContent = '';
                    existingZone.classList.remove('matched');
                    existingZone.removeAttribute('data-matched-left-index');
                }
            });
            
            // Store the match
            if (!userAnswers[currentQuestion]) {
                userAnswers[currentQuestion] = {};
            }
            userAnswers[currentQuestion][leftIndex] = rightIndex;
            if (currentSection && userAnswersBySection[currentSection]) {
                if (!userAnswersBySection[currentSection][currentQuestion]) {
                    userAnswersBySection[currentSection][currentQuestion] = {};
                }
                userAnswersBySection[currentSection][currentQuestion][leftIndex] = rightIndex;
            }
            
            // Visual feedback
            zone.textContent = document.querySelector(`[data-left-index="${leftIndex}"]`).textContent;
            zone.classList.add('matched');
            zone.dataset.matchedLeftIndex = leftIndex;
            
            updateNavigationButtons();
        });
    });
}

// Add word order listeners
function addWordOrderListeners() {
    const wordItems = document.querySelectorAll('.word-item');
    
    wordItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.wordIndex);
            e.target.classList.add('dragging');
        });
        
        item.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        item.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedIndex = e.dataTransfer.getData('text/plain');
            const targetIndex = e.target.dataset.wordIndex;
            
            if (draggedIndex !== targetIndex) {
                // Swap positions
                const draggedEl = document.querySelector(`[data-word-index="${draggedIndex}"]`);
                const targetEl = e.target;
                
                const draggedText = draggedEl.textContent;
                const targetText = targetEl.textContent;
                
                draggedEl.textContent = targetText;
                targetEl.textContent = draggedText;
                
                // Update word order in user answers
                if (!userAnswers[currentQuestion]) {
                    userAnswers[currentQuestion] = [];
                }
                
                // Simple array to track current order
                const currentOrder = Array.from(document.querySelectorAll('.word-item')).map(el => el.textContent);
                userAnswers[currentQuestion] = currentOrder;
                if (currentSection && userAnswersBySection[currentSection]) {
                    userAnswersBySection[currentSection][currentQuestion] = currentOrder;
                }
                
                updateNavigationButtons();
            }
        });
    });
}

// Update navigation buttons
function updateNavigationButtons() {
    prevBtn.disabled = currentQuestion === 0;
    
    // Enable next button if user has answered current question
    nextBtn.disabled = !isQuestionAnswered(currentQuestion);
    
    // Change next button text for last question
    if (currentQuestion === currentQuizData.length - 1) {
        // Check if this is the last section
        if (currentSectionIndex === sectionOrder.length - 1) {
            nextBtn.innerHTML = 'Finish Assessment <span class="fas fa-check" aria-hidden="true"></span>';
        } else {
            nextBtn.innerHTML = 'Finish Section <span class="fas fa-check" aria-hidden="true"></span>';
        }
    } else {
        nextBtn.innerHTML = 'Next <span class="fas fa-arrow-right" aria-hidden="true"></span>';
    }
}

// Check if question is answered based on type
function isQuestionAnswered(questionIndex) {
    const answer = userAnswers[questionIndex];
    const question = currentQuizData[questionIndex];
    const type = question.type || 'multiple-choice';
    
    switch(type) {
        case 'multiple-choice':
        case 'dropdown':
            return answer !== null && answer !== undefined;
        case 'fill-blank':
        case 'transformation':
            return answer && answer.trim() !== '';
        case 'true-false':
            return answer === 'true' || answer === 'false';
        case 'matching':
            return answer && Object.keys(answer).length > 0;
        case 'word-order':
            return answer && Array.isArray(answer) && answer.length > 0;
        case 'cloze':
            return answer && Array.isArray(answer) && answer.every(item => item && item.trim() !== '');
        default:
            return answer !== null && answer !== undefined;
    }
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestion + 1) / currentQuizData.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestion + 1} of ${currentQuizData.length}`;
}

// Go to previous question
function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

// Go to next question
function nextQuestion() {
    if (currentQuestion < currentQuizData.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        // Finish quiz
        finishQuiz();
    }
}

// Finish quiz and show results
function finishQuiz() {
    // Calculate score with individual question marks
    score = 0;
    currentQuizData.forEach((question, index) => {
        if (isAnswerCorrect(question, userAnswers[index])) {
            score += question.marks || 1; // Use individual question marks
        }
    });
    
    // Calculate total possible marks
    const totalMarks = currentQuizData.reduce((total, question) => {
        return total + (question.marks || 1);
    }, 0);
    
    // Calculate percentage
    const percentage = Math.round((score / totalMarks) * 100);
    
    // Store section score
    sectionScores[currentSection] = {
        score: score,
        total: totalMarks,
        percentage: percentage,
        questions: currentQuizData.length
    };
    
    // Move to next section
    currentSectionIndex++;
    
    if (currentSectionIndex < sectionOrder.length) {
        // Show section completion message (no score shown)
        showSectionComplete();
    } else {
        // All sections completed -> go to submit flow
        cleanupFocusDetection();
        showSubmitResults();
    }
}

// Check if any sections require manual marking
function needsManualMarking() { return false; }

// Show manual marking password screen
function showManualMarkingPassword() { return; }

// Show manual marking interface
function showManualMarkingInterface() { return; }

// Render manual marking sections
function renderManualMarkingSections() {
    const markingSections = document.getElementById('markingSections');
    markingSections.innerHTML = '';
    
    // Get sections that require manual marking
    const manualSections = sectionOrder.filter(sectionKey => 
        manualMarkingConfig.sections[sectionKey] && sectionScores[sectionKey]
    );
    
    window.__manualAssigned = {}; // track assigned marks completeness
    manualSections.forEach(sectionKey => {
        const section = quizSections[sectionKey];
        const sectionScore = sectionScores[sectionKey];
        
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'marking-section';
        
        sectionDiv.innerHTML = `
            <div class="marking-section-header">
              <h3 class="marking-section-title">${section.title}</h3>
              <div class="marking-section-total" id="markingTotal-${sectionKey}">0 / ${sectionScore.total} marks</div>
            </div>
            <div class="marking-questions" id="markingQuestions-${sectionKey}"></div>
        `;
        
        markingSections.appendChild(sectionDiv);
        
        // Populate questions for this section
        populateMarkingQuestions(sectionKey, sectionScore);
    });
    
    // Add event listeners for marking buttons (only once)
    if (!window.markingEventListenersAdded) {
        addMarkingEventListeners();
        window.markingEventListenersAdded = true;
    }
}

// Populate marking questions for a section
function populateMarkingQuestions(sectionKey, sectionScore) {
    const questionsContainer = document.getElementById(`markingQuestions-${sectionKey}`);
    const originalQuestions = quizSections[sectionKey].questions;
    
    // Get the questions that were actually used in the quiz
    // For now, we'll show all questions from the section
    window.__manualAssigned[sectionKey] = window.__manualAssigned[sectionKey] || {};
    originalQuestions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'marking-question';
        
        const maxMarks = question.marks || 1; // Use individual question marks
        
        // Calculate system's suggested marks
        const systemSuggestedMarks = isAnswerCorrect(question, userAnswers[index]) ? maxMarks : 0;
        
        questionDiv.innerHTML = `
            <div class="marking-question-text">Question ${index + 1}: ${question.question}</div>
            <div class="marking-question-answer"><strong>Student Answer:</strong> ${getStudentAnswerText(question, userAnswers[index])}</div>
            <div class="marking-suggested"><strong>System Suggestion:</strong> ${systemSuggestedMarks}/${maxMarks} marks</div>
            <div class="marking-controls">
                <button class="marking-btn marking-correct" data-section="${sectionKey}" data-question="${index}" data-max="${maxMarks}">Correct (${maxMarks})</button>
                <button class="marking-btn marking-incorrect" data-section="${sectionKey}" data-question="${index}" data-max="${maxMarks}">Incorrect (0)</button>
                <label class="marking-custom-label">Partial:
                  <select class="partial-select" data-section="${sectionKey}" data-question="${index}">
                    ${Array.from({length: maxMarks-1}, (_,i)=>`<option value="${i+1}">${i+1}</option>`).join('')}
                  </select>
                </label>
                <span class="marking-current" id="markingCurrent-${sectionKey}-${index}">—</span>
            </div>
            <input type="hidden" class="marking-final-marks" id="marks-${sectionKey}-${index}" value="" data-section="${sectionKey}" data-question="${index}">
        `;

        questionsContainer.appendChild(questionDiv);

        // initialize suggested value as a hint only (not final)
    });
}

// Add event listeners for marking buttons using event delegation
function addMarkingEventListeners() {
    return;
}

// Update marking button states
function updateMarkingButtonStates(sectionKey, questionIndex, selectedType) {
    const questionDiv = document.querySelector(`#marks-${sectionKey}-${questionIndex}`).closest('.marking-question');
    
    // Reset all buttons
    questionDiv.querySelectorAll('.marking-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Highlight selected button
    if (selectedType === 'correct') {
        questionDiv.querySelector('.marking-correct').classList.add('selected');
        const max = parseInt(questionDiv.querySelector('.marking-correct').dataset.max);
        const current = document.getElementById(`markingCurrent-${sectionKey}-${questionIndex}`);
        if (current) current.textContent = `${max}/${max}`;
    } else if (selectedType === 'incorrect') {
        questionDiv.querySelector('.marking-incorrect').classList.add('selected');
        const max = parseInt(questionDiv.querySelector('.marking-correct').dataset.max);
        const current = document.getElementById(`markingCurrent-${sectionKey}-${questionIndex}`);
        if (current) current.textContent = `0/${max}`;
    } else if (selectedType === 'custom') {
        // no button to select; the select value is shown in running label
    }
}

// Compute running totals and enable Complete when all marked
function updateManualRunningTotals() {
    let allAssigned = true;
    // per-section totals
    Object.keys(window.__manualAssigned).forEach(sectionKey => {
        const orig = quizSections[sectionKey].questions || [];
        const totalMax = orig.reduce((s,q)=>s+(q.marks||1),0);
        let awarded = 0;
        orig.forEach((q, idx) => {
            const input = document.getElementById(`marks-${sectionKey}-${idx}`);
            const val = input ? parseInt(input.value)||0 : 0;
            awarded += val;
            if (input && input.value === '') allAssigned = false;
        });
        const totalEl = document.getElementById(`markingTotal-${sectionKey}`);
        if (totalEl) totalEl.textContent = `${awarded} / ${totalMax} marks`;
    });
    const completeBtn = document.getElementById('completeMarkingBtn');
    if (completeBtn) {
        completeBtn.disabled = !allAssigned;
        completeBtn.textContent = allAssigned ? 'Complete Marking & View Results' : 'Mark all questions to continue';
    }
}

// Get student answer text for display
function getStudentAnswerText(question, userAnswer) {
    if (!userAnswer) return "No answer provided";
    
    const type = question.type || 'multiple-choice';
    
    switch(type) {
        case 'multiple-choice':
        case 'dropdown':
            return question.options[userAnswer] || "Invalid selection";
            
        case 'fill-blank':
        case 'transformation':
            return userAnswer;
            
        case 'true-false':
            return userAnswer === 'true' ? 'True' : 'False';
            
        case 'matching':
            return "Matching completed";
            
        case 'word-order':
            return Array.isArray(userAnswer) ? userAnswer.join(' ') : userAnswer;
            
        case 'cloze':
            return Array.isArray(userAnswer) ? userAnswer.join(', ') : userAnswer;
            
        default:
            return userAnswer;
    }
}

// Complete manual marking and show results
function completeManualMarking() {
    // Deprecated: replaced by submit flow
    showSubmitResults();
}

// Check if answer is correct based on question type
function isAnswerCorrect(question, userAnswer) {
    const type = question.type || 'multiple-choice';
    
    switch(type) {
        case 'multiple-choice':
        case 'dropdown':
            return userAnswer === question.correct;
            
        case 'fill-blank':
            if (!userAnswer || !question.correctAnswers) return false;
            const caseSensitive = question.caseSensitive !== undefined ? question.caseSensitive : false;
            const userText = caseSensitive ? userAnswer.trim() : userAnswer.toLowerCase().trim();
            return question.correctAnswers.some(correct => {
                const correctText = caseSensitive ? correct.trim() : correct.toLowerCase().trim();
                return correctText === userText;
            });
            
        case 'true-false':
            return userAnswer === String(question.correct);
            
        case 'matching':
            if (!userAnswer || !question.correctMatches) return false;
            return question.correctMatches.every(match => 
                userAnswer[match.left] == match.right
            );
            
        case 'word-order':
            if (!userAnswer || !Array.isArray(userAnswer)) return false;
            // Simple check - compare word sequences
            const correctWords = question.correctOrder.map(i => question.words[i]);
            return JSON.stringify(userAnswer) === JSON.stringify(correctWords);
            
        case 'transformation':
            if (!userAnswer || !question.correctAnswers) return false;
            const userTransform = userAnswer.toLowerCase().trim();
            return question.correctAnswers.some(correct => 
                correct.toLowerCase().trim() === userTransform
            );
            
        case 'cloze':
            if (!userAnswer || !Array.isArray(userAnswer) || !question.blanks) return false;
            return question.blanks.every((blank, index) => {
                const userText = userAnswer[index] ? userAnswer[index].toLowerCase().trim() : '';
                return blank.correctAnswers.some(correct => 
                    correct.toLowerCase().trim() === userText
                );
            });
            
        default:
            return userAnswer === question.correct;
    }
}

// Show section completion message
function showSectionComplete() {
    if (!isAuthenticated) return showScreen('testPasswordScreen');
    const sectionName = quizSections[currentSection].title;
    const nextKey = sectionOrder[currentSectionIndex];
    const next = quizSections[nextKey];
    const nextTitle = next?.title || 'Next Section';
    const nextCount = next?.questions?.length || 0;
    const nextMarks = (next?.questions || []).reduce((s,q)=>s+(q.marks||1),0);

    // Prepare a neutral interstitial card: no previous section feedback
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) scoreCircle.style.display = 'none';

    resultsTitle.textContent = `${sectionName} complete.`;
    resultsDescription.textContent = `Up next: ${nextTitle} • ${nextCount} questions • ${nextMarks} marks.`;

    const scorePercentageEl = document.getElementById('scorePercentage');
    const scoreLabel = document.querySelector('.score-label');
    if (scorePercentageEl) scorePercentageEl.textContent = '';
    if (scoreLabel) scoreLabel.textContent = '';

    // Ensure any action buttons are hidden
    const resultsActions = document.querySelector('.results-actions');
    if (resultsActions) resultsActions.style.display = 'none';

    // Show the neutral interstitial briefly, then continue
    showScreen('results');
    setTimeout(() => { startNextSection(); }, 1500);
}

// Show final comprehensive results
function showFinalResults() {
    if (!isAuthenticated) return showScreen('testPasswordScreen');
    // Calculate overall score
    let totalScore = 0;
    let totalQuestions = 0;
    
    Object.values(sectionScores).forEach(section => {
        totalScore += section.score;
        totalQuestions += section.total;
    });
    
    const overallPercentage = Math.round((totalScore / totalQuestions) * 100);
    const grade = getGrade(overallPercentage);
    const gradeDescription = getGradeDescription(grade);
    
    // Update results display
    updateResultsDisplay(totalScore, overallPercentage, grade);
    
    // Update results title and description for final results
    resultsTitle.textContent = `${grade} - ${getFluencyLevel(overallPercentage)}`;
    resultsDescription.textContent = `Overall Assessment Complete! You achieved ${overallPercentage}% (Grade: ${grade}) - ${gradeDescription}`;
    
    // Update breakdown to show section-by-section results
    updateFinalBreakdown();
    
    // Show score circle for final results
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) {
        scoreCircle.style.display = 'block';
    }
    
    // Show action buttons for final results
    const resultsActions = document.querySelector('.results-actions');
    if (resultsActions) {
        resultsActions.style.display = 'flex';
    }
    
    // Show results screen
    showScreen('results');
}

// Get fluency level based on overall percentage
function getFluencyLevel(percentage) {
    if (percentage >= 90) return "Advanced Fluency 🌟";
    if (percentage >= 80) return "Upper-Intermediate 📚";
    if (percentage >= 70) return "Intermediate Level 📖";
    if (percentage >= 60) return "Lower-Intermediate 📝";
    return "Beginner Level 📋";
}

// Get grade based on percentage
function getGrade(percentage) {
    if (percentage >= 95) return "A*";
    if (percentage >= 90) return "A";
    if (percentage >= 85) return "A-";
    if (percentage >= 80) return "B+";
    if (percentage >= 75) return "B";
    if (percentage >= 70) return "B-";
    if (percentage >= 65) return "C+";
    if (percentage >= 60) return "C";
    if (percentage >= 55) return "C-";
    if (percentage >= 50) return "D+";
    if (percentage >= 45) return "D";
    if (percentage >= 40) return "D-";
    return "F";
}

// Get grade description
function getGradeDescription(grade) {
    const descriptions = {
        "A*": "Outstanding - Exceptional language proficiency",
        "A": "Excellent - Advanced language skills",
        "A-": "Very Good - Strong language abilities",
        "B+": "Good - Above average proficiency",
        "B": "Satisfactory - Solid language foundation",
        "B-": "Adequate - Basic language competence",
        "C+": "Fair - Developing language skills",
        "C": "Pass - Minimum acceptable level",
        "C-": "Below Average - Needs improvement",
        "D+": "Poor - Significant gaps in knowledge",
        "D": "Very Poor - Major language difficulties",
        "D-": "Fail - Insufficient language skills",
        "F": "Fail - Inadequate performance"
    };
    return descriptions[grade] || "Grade not available";
}

// Update final breakdown with section scores
function updateFinalBreakdown() {
    const breakdownContainer = document.querySelector('.results-breakdown');
    breakdownContainer.innerHTML = '';
    
    // Calculate overall stats
    const totalScore = Object.values(sectionScores).reduce((sum, section) => sum + section.score, 0);
    const totalQuestions = Object.values(sectionScores).reduce((sum, section) => sum + section.total, 0);
    const overallPercentage = Math.round((totalScore / totalQuestions) * 100);
    const grade = getGrade(overallPercentage);
    
    // Add overall score with grade
    const overallItem = document.createElement('div');
    overallItem.className = 'breakdown-item';
    overallItem.innerHTML = `
        <span class="breakdown-label">Overall Score:</span>
        <span class="breakdown-value correct">${overallPercentage}% (${grade})</span>
    `;
    breakdownContainer.appendChild(overallItem);
    
    // Add grade description
    const gradeItem = document.createElement('div');
    gradeItem.className = 'breakdown-item';
    gradeItem.innerHTML = `
        <span class="breakdown-label">Grade Description:</span>
        <span class="breakdown-value">${getGradeDescription(grade)}</span>
    `;
    breakdownContainer.appendChild(gradeItem);
    
    // Add section scores
    sectionOrder.forEach(sectionKey => {
        if (sectionScores[sectionKey]) {
            const sectionItem = document.createElement('div');
            sectionItem.className = 'breakdown-item';
            sectionItem.innerHTML = `
                <span class="breakdown-label">${quizSections[sectionKey].title}:</span>
                <span class="breakdown-value">${sectionScores[sectionKey].percentage}%</span>
            `;
            breakdownContainer.appendChild(sectionItem);
        }
    });
}

// Update results display
function updateResultsDisplay(correctAnswers, percentage, grade = null) {
    // Update score circle
    const scoreCircle = document.querySelector('.score-circle');
    const angle = (percentage / 100) * 360;
    scoreCircle.style.setProperty('--score-angle', `${angle}deg`);
    scoreCircle.style.setProperty('--final-score-angle', `${angle}deg`);
    
    // Update score percentage with grade if provided
    if (grade) {
        scorePercentage.textContent = `${percentage}%`;
        // Add grade display
        const scoreLabel = document.querySelector('.score-label');
        scoreLabel.textContent = `Grade: ${grade}`;
    } else {
        scorePercentage.textContent = `${percentage}%`;
    }
    
    // Update results text based on performance (only for section completion, not final results)
    if (!grade) {
        let title, description;
        if (percentage >= 90) {
            title = "Outstanding! 🌟";
            description = "You're a true quiz master! Perfect or near-perfect score!";
        } else if (percentage >= 80) {
            title = "Excellent! 🎉";
            description = "Great job! You have excellent knowledge on this topic.";
        } else if (percentage >= 70) {
            title = "Good Job! 👍";
            description = "Well done! You have a solid understanding.";
        } else if (percentage >= 60) {
            title = "Not Bad! 📚";
            description = "You're on the right track. Keep learning!";
        } else {
            title = "Keep Learning! 💪";
            description = "Don't worry, practice makes perfect. Try again!";
        }
        
        resultsTitle.textContent = title;
        resultsDescription.textContent = description;
    }
    
    // Update breakdown
    correctCount.textContent = correctAnswers;
    totalCount.textContent = currentQuizData.length;
    accuracy.textContent = `${percentage}%`;
}

// Retake the entire assessment
function retakeAssessment() {
    currentSectionIndex = 0;
    sectionScores = {};
    startAssessment();
}

// Submit results flow
function showSubmitResults() {
    showScreen('submitResultsScreen');
    const btn = document.getElementById('submitResultsBtn');
    if (btn && !btn.__wired) {
        btn.__wired = true;
        btn.addEventListener('click', submitResultsToEmail);
    }
    const backBtn = document.getElementById('backToWelcomeAfterSubmit');
    if (backBtn && !backBtn.__wired) {
        backBtn.__wired = true;
        backBtn.addEventListener('click', () => showScreen('welcomeScreen'));
    }
}

function submitResultsToEmail() {
    const nameInput = document.getElementById('participantName');
    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) { nameInput && nameInput.focus(); return; }
    const form = document.getElementById('hiddenResultsForm');
    if (!form) return;
    form.innerHTML = '';
    // Participant
    addHidden(form, 'name', name);
    addHidden(form, '_subject', 'TUGA Assessment Submission');
    // Per-question: "Answer - score" (no aggregates), using per-section answers
    sectionOrder.forEach(sectionKey => {
        const section = quizSections[sectionKey];
        if (!section) return;
        const answers = userAnswersBySection[sectionKey] || [];
        (section.questions||[]).forEach((q, idx) => {
            const ans = answers[idx];
            const max = q.marks || 1;
            const suggested = isAnswerCorrect(q, ans) ? max : 0;
            const answerText = getStudentAnswerText(q, ans);
            addHidden(form, `q_${sectionKey}_${idx}`, `${answerText} - ${suggested}`);
        });
    });
    form.submit();
    showScreen('submittedScreen');
}

function addHidden(form, name, value) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = String(name);
    input.value = String(value);
    form.appendChild(input);
}

// Share results
function shareResults() {
    let shareText;
    
    if (Object.keys(sectionScores).length === sectionOrder.length) {
        // Final results
        const totalScore = Object.values(sectionScores).reduce((sum, section) => sum + section.score, 0);
        const totalQuestions = Object.values(sectionScores).reduce((sum, section) => sum + section.total, 0);
        const overallPercentage = Math.round((totalScore / totalQuestions) * 100);
        const grade = getGrade(overallPercentage);
        const fluencyLevel = getFluencyLevel(overallPercentage);
        shareText = `I completed the Language Fluency Assessment and achieved Grade ${grade} (${overallPercentage}%) - ${fluencyLevel}! 🧠📚`;
    } else {
        // Section results
        const percentage = Math.round((score / currentQuizData.length) * 100);
        const sectionName = currentSection ? quizSections[currentSection].title : 'Assessment';
        shareText = `I scored ${percentage}% on the ${sectionName} section of the Language Fluency Assessment! 🧠`;
    }
    
    if (navigator.share) {
        navigator.share({
            title: 'Quiz Master Results',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            // Show temporary success message
            const originalText = shareBtn.innerHTML;
            shareBtn.innerHTML = '<span class="fas fa-check" aria-hidden="true"></span> Copied!';
            shareBtn.style.background = '#22c55e';
            
            setTimeout(() => {
                shareBtn.innerHTML = originalText;
                shareBtn.style.background = '';
            }, 2000);
        });
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!quizStarted) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            if (!prevBtn.disabled) {
                previousQuestion();
            }
            break;
        case 'ArrowRight':
            if (!nextBtn.disabled) {
                nextQuestion();
            }
            break;
        case '1':
        case '2':
        case '3':
        case '4':
            const optionIndex = parseInt(e.key) - 1;
            if (optionIndex >= 0 && optionIndex < currentQuizData[currentQuestion].options.length) {
                selectOption(optionIndex);
            }
            break;
    }
});

// Add smooth transitions and animations
function addAnimations() {
    // Add hover effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
    addAnimations();
    // Ensure page is fully visible
    document.body.style.opacity = '1';

    // Wire Start Assessment button on welcome screen
    const startAssessmentBtn = document.getElementById('startAssessmentBtn');
    if (startAssessmentBtn && !startAssessmentBtn.__wired) {
        startAssessmentBtn.__wired = true;
        startAssessmentBtn.addEventListener('click', startAssessment);
    }

    // Wire Start Assessment button on assessment summary screen
    const startAssessmentFromSummaryBtn = document.getElementById('startAssessmentFromSummaryBtn');
    if (startAssessmentFromSummaryBtn && !startAssessmentFromSummaryBtn.__wired) {
        startAssessmentFromSummaryBtn.__wired = true;
        startAssessmentFromSummaryBtn.addEventListener('click', startAssessmentFromSummary);
    }
});

// Test function for debugging (can be called from browser console)
window.testQuiz = function() {
    console.log('=== QUIZ TEST DEBUG ===');
    console.log('Quiz sections:', quizSections);
    console.log('Section order:', sectionOrder);
    console.log('Current section index:', currentSectionIndex);
    console.log('Current quiz data:', currentQuizData);
    console.log('Quiz started:', quizStarted);
    
    // Test loading first question manually
    if (quizSections && quizSections.vocabulary && quizSections.vocabulary.questions) {
        console.log('Testing manual question load...');
        currentQuizData = [...quizSections.vocabulary.questions];
        currentQuestion = 0;
        currentSection = 'vocabulary';
        
        console.log('Set quiz data:', currentQuizData);
        console.log('First question:', currentQuizData[0]);
        
        // Try to load question
        loadQuestion();
    } else {
        console.error('Quiz sections not available');
    }
    console.log('=== END QUIZ TEST DEBUG ===');
};
document.body.style.transition = 'opacity 0.5s ease-in-out';
