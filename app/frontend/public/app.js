class MindCareAI {
    constructor() {
        // Application state
        this.analysisHistory = [];
        this.currentTheme = 'light';
        this.isAnalyzing = false;
        
        this.resources = {
            low: [
                {
                    title: "Mindfulness Meditation Apps",
                    description: "Headspace, Calm, or Insight Timer for daily meditation",
                    type: "self-help",
                    url: "https://www.headspace.com"
                },
                {
                    title: "Mental Health First Aid",
                    description: "Learn about mental health basics and self-care",
                    type: "education",
                    url: "https://www.mentalhealthfirstaid.org"
                }
            ],
            moderate: [
                {
                    title: "Online Therapy Platforms",
                    description: "BetterHelp, Talkspace, or Psychology Today",
                    type: "therapy",
                    url: "https://www.psychologytoday.com"
                },
                {
                    title: "Support Groups",
                    description: "Local or online peer support communities",
                    type: "support",
                    url: "https://www.nami.org/Support-Education/Support-Groups"
                }
            ],
            high: [
                {
                    title: "National Suicide Prevention Lifeline",
                    description: "Call 988 for immediate help",
                    type: "crisis",
                    url: "tel:988"
                },
                {
                    title: "Crisis Text Line",
                    description: "Text HOME to 741741 for immediate support",
                    type: "crisis",
                    url: "sms:741741"
                }
            ]
        };

        // Wait for DOM to be ready before initializing
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing Enhanced MindCare AI...');
        this.bindEvents();
        this.updateCharCount();
        this.loadTheme();
        this.updateHistoryDisplay();
        console.log('Enhanced MindCare AI initialized successfully');
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Form submission
        const analysisForm = document.getElementById('analysisForm');
        if (analysisForm) {
            analysisForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAnalysis(e);
            });
        }

        // Character count
        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.addEventListener('input', () => this.updateCharCount());
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Emergency modal
        const emergencyBtn = document.getElementById('emergencyBtn');
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');

        if (emergencyBtn) {
            emergencyBtn.addEventListener('click', () => this.showEmergencyModal());
        }
        if (modalClose) {
            modalClose.addEventListener('click', () => this.hideEmergencyModal());
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.hideEmergencyModal());
        }

        // History management
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideEmergencyModal();
            }
            if (e.ctrlKey && e.key === 'Enter') {
                if (!this.isAnalyzing && analysisForm) {
                    const submitEvent = new Event('submit');
                    analysisForm.dispatchEvent(submitEvent);
                }
            }
        });

        console.log('All events bound successfully');
    }

    async callBackendAnalyze(text) {
        const resp = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        
        if (!resp.ok) {
            const err = await resp.json().catch(() => ({ error: resp.statusText }));
            throw new Error(err.error || 'Analysis request failed');
        }
        return resp.json();
    }

    getUserId() {
        let userId = localStorage.getItem('mindcare_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('mindcare_user_id', userId);
        }
        return userId;
    }

    generateRecommendations(severity) {
        return this.resources[severity] || this.resources.low;
    }

    async handleAnalysis(e) {
        console.log('Handling enhanced analysis...');
        if (e) e.preventDefault();
        
        const textInput = document.getElementById('textInput');
        if (!textInput) {
            console.error('Text input not found');
            return;
        }
        
        const text = textInput.value.trim();
        
        if (!text) {
            this.showError('Please enter some text to analyze.');
            return;
        }
        
        if (text.length < 5) {
            this.showError('Please enter at least 5 characters for analysis.');
            return;
        }

        try {
            console.log('Starting enhanced analysis for text:', text.substring(0, 50) + '...');
            this.setLoadingState(true);
            
            // Call backend API
            const result = await this.callBackendAnalyze(text);
            console.log('API response:', result);

            // Transform response
            const emotional_state = result.prediction === 1 ? 'Depression' : 'Normal';
            const severity = result.confidence > 0.8 ? 'High' : result.confidence > 0.6 ? 'Moderate' : 'Low';
            
            const uiAnalysis = {
                emotional_state: emotional_state,
                severity: severity,
                confidence: result.confidence,
                explanation: result.ai_response,
                keywords: [],
                recommendations: [],
                input: text,
                timestamp: new Date().toISOString(),
                id: Date.now()
            };
            
            console.log('Processed enhanced analysis:', uiAnalysis);
            
            // Add to history
            this.analysisHistory.unshift(uiAnalysis);
            
            // Display results
            this.displayResults(uiAnalysis);
            
            // Update history display
            this.updateHistoryDisplay();
            
            // Clear form
            textInput.value = '';
            this.updateCharCount();
            
        } catch (error) {
            console.error('Enhanced analysis failed:', error);
            this.showError('Analysis failed: ' + error.message);
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        console.log('Setting loading state:', loading);
        this.isAnalyzing = loading;
        const analyzeBtn = document.getElementById('analyzeBtn');
        const btnContent = analyzeBtn?.querySelector('.btn-content');
        const btnLoading = analyzeBtn?.querySelector('.btn-loading');
        
        if (loading) {
            analyzeBtn?.classList.add('loading');
            btnContent?.classList.add('hidden');
            btnLoading?.classList.remove('hidden');
            if (analyzeBtn) analyzeBtn.disabled = true;
        } else {
            analyzeBtn?.classList.remove('loading');
            btnContent?.classList.remove('hidden');
            btnLoading?.classList.add('hidden');
            if (analyzeBtn) analyzeBtn.disabled = false;
        }
    }

    displayResults(analysis) {
        console.log('Displaying enhanced results:', analysis);
        
        // Show results section
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
            resultsSection.classList.add('fade-in');
        }
        
        // Update timestamp
        const timestamp = document.getElementById('resultsTimestamp');
        if (timestamp) {
            timestamp.textContent = `Analyzed on ${new Date().toLocaleString()}`;
        }
        
        // Display emotional state
        this.displayEmotionalState(analysis.emotional_state);
        
        // Display confidence
        this.displayConfidence(analysis.confidence);
        
        // Display AI recommendations
        this.displayExplanation(analysis.explanation, analysis.keywords);
        
        // Scroll to results
        setTimeout(() => {
            resultsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    displayEmotionalState(state) {
        const emotionalState = document.getElementById('emotionalState');
        const stateText = emotionalState?.querySelector('.state-text');
        const stateIcon = emotionalState?.querySelector('.state-icon');
        
        if (stateText && stateIcon && emotionalState) {
            stateText.textContent = state;
            emotionalState.className = `result-value emotional-state ${state.toLowerCase()}`;
            
            // Enhanced icon set including positive emotions
            const icons = {
                'Happy': '😊',
                'Excited': '🤩',
                'Proud': '😎',
                'Content': '😌',
                'Normal': '😐',
                'Depression': '😞',
                'Anxiety': '😰',
                'Stress': '😤',
                'Anger': '😡'
            };
            stateIcon.textContent = icons[state] || '🤔';
        }
    }

    displaySeverity(severity, emotionalState) {
        const severityLevel = document.getElementById('severityLevel');
        const severityBadge = severityLevel?.querySelector('.severity-badge');
        
        if (severityBadge) {
            // For positive emotions, reinterpret severity labels
            const isPositive = ['Happy', 'Excited', 'Proud', 'Content'].includes(emotionalState);
            
            if (isPositive) {
                const positiveLabels = {
                    'Low': 'Mild',
                    'Moderate': 'Strong', 
                    'High': 'Very Strong'
                };
                severityBadge.textContent = positiveLabels[severity] || severity;
                severityBadge.className = `severity-badge positive-${severity.toLowerCase()}`;
            } else {
                severityBadge.textContent = severity;
                severityBadge.className = `severity-badge ${severity.toLowerCase()}`;
            }
        }
    }

    displayConfidence(confidence) {
        const confidenceScore = document.getElementById('confidenceScore');
        const confidenceFill = confidenceScore?.querySelector('.confidence-fill');
        const confidenceText = confidenceScore?.querySelector('.confidence-text');
        
        if (confidenceFill && confidenceText) {
            const percentage = Math.round(confidence * 100);
            confidenceFill.style.width = `${percentage}%`;
            confidenceText.textContent = `${percentage}%`;
        }
    }

    displayExplanation(explanation, keywords) {
        const explanationEl = document.getElementById('analysisExplanation');
        const keywordsList = document.getElementById('keywordsList');
        
        if (explanationEl) {
            explanationEl.textContent = explanation;
        }
        
        if (keywordsList && keywords && keywords.length > 0) {
            keywordsList.innerHTML = keywords.map(keyword => 
                `<span class="keyword-tag">${keyword}</span>`
            ).join('');
        }
    }



    getRecommendationIcon(type) {
        const icons = {
            'therapy': '<i class="fas fa-user-md"></i>',
            'support': '<i class="fas fa-users"></i>',
            'crisis': '<i class="fas fa-phone"></i>',
            'emergency': '<i class="fas fa-hospital"></i>',
            'self-help': '<i class="fas fa-heart"></i>',
            'education': '<i class="fas fa-book"></i>',
            'professional': '<i class="fas fa-stethoscope"></i>',
            'wellness': '<i class="fas fa-leaf"></i>',
            'apps': '<i class="fas fa-mobile-alt"></i>'
        };
        return icons[type] || '<i class="fas fa-info-circle"></i>';
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (!historyList) return;
        
        if (this.analysisHistory.length === 0) {
            historyList.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-history"></i>
                    <p>No previous analyses yet. Start by sharing your thoughts above.</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = this.analysisHistory.map(analysis => `
            <div class="history-item" onclick="mindCare.viewHistoryItem(${analysis.id})">
                <div class="history-header">
                    <div class="history-results">
                        <div class="history-result-item">
                            <span class="severity-badge ${analysis.severity.toLowerCase()}">${analysis.severity}</span>
                        </div>
                        <div class="history-result-item">
                            <span>${analysis.emotional_state}</span>
                        </div>
                    </div>
                    <span class="history-timestamp">${new Date(analysis.timestamp).toLocaleDateString()}</span>
                </div>
                <div class="history-preview">${analysis.input.substring(0, 100)}${analysis.input.length > 100 ? '...' : ''}</div>
            </div>
        `).join('');
    }

    viewHistoryItem(id) {
        const analysis = this.analysisHistory.find(item => item.id === id);
        if (analysis) {
            this.displayResults(analysis);
            
            // Update the input field with the historical text
            const textInput = document.getElementById('textInput');
            if (textInput) {
                textInput.value = analysis.input;
                this.updateCharCount();
            }
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear your analysis history?')) {
            this.analysisHistory = [];
            this.updateHistoryDisplay();
        }
    }

    updateCharCount() {
        const textInput = document.getElementById('textInput');
        const charCount = document.getElementById('charCount');
        
        if (textInput && charCount) {
            const count = textInput.value.length;
            charCount.textContent = `${count} characters`;
            
            // Add visual feedback for optimal length
            if (count < 50) {
                charCount.style.color = 'var(--color-text-secondary)';
            } else if (count < 200) {
                charCount.style.color = 'var(--color-success)';
            } else {
                charCount.style.color = 'var(--color-warning)';
            }
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        console.log(`Theme switched to: ${this.currentTheme}`);
    }

    loadTheme() {
        // Default to system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark';
        }
        
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    showEmergencyModal() {
        console.log('Showing emergency modal');
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideEmergencyModal() {
        console.log('Hiding emergency modal');
        const modal = document.getElementById('emergencyModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showError(message) {
        console.log('Showing error:', message);
        
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.error-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-error);
            color: white;
            padding: var(--space-16);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: var(--space-12);
            z-index: 1001;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the enhanced application when DOM is ready
let mindCare;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mindCare = new MindCareAI();
        window.mindCare = mindCare;
    });
} else {
    mindCare = new MindCareAI();
    window.mindCare = mindCare;
}

// Feedback handlers
(function bindFeedbackButtons(){
    const good = document.getElementById('feedbackGood');
    const bad = document.getElementById('feedbackBad');
    const status = document.getElementById('feedbackStatus');
    
    async function sendFeedback(helpful){
        const last = window.mindCare?.analysisHistory?.[0];
        if (!last || !last.apiAnalysisId) {
            if (status) status.textContent = 'Analyze something first';
            return;
        }
        try {
            if (status) status.textContent = 'Sending feedback...';
            const resp = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    analysis_id: last.apiAnalysisId, 
                    helpful,
                    user_id: window.mindCare?.getUserId()
                })
            });
            if (!resp.ok) throw new Error('feedback failed');
            if (status) status.textContent = 'Thanks for your feedback!';
            setTimeout(() => { if (status) status.textContent = ''; }, 3000);
        } catch(e){
            if (status) status.textContent = 'Failed to send feedback';
            setTimeout(() => { if (status) status.textContent = ''; }, 3000);
        }
    }
    
    good?.addEventListener('click', ()=>sendFeedback(true));
    bad?.addEventListener('click', ()=>sendFeedback(false));
})();

console.log('Enhanced MindCare AI System loaded successfully!');