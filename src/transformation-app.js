// Personal Transformation Master - Main Application Logic
class TransformationApp {
    constructor() {
        this.profile = {
            currentWeight: 80,
            targetWeight: 70,
            startDate: new Date().toISOString().split('T')[0],
            weeklyGoal: 0.5 // kg per week
        };
        this.progressData = {};
        this.routines = {};
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updateProgressDisplay();
        this.initializeRoutines();
        this.setupSchedule();
    }

    loadUserData() {
        const stored = localStorage.getItem('transformationData');
        if (stored) {
            const data = JSON.parse(stored);
            this.profile = { ...this.profile, ...data.profile };
            this.progressData = data.progressData || {};
            this.routines = data.routines || {};
        }
    }

    saveData() {
        const data = {
            profile: this.profile,
            progressData: this.progressData,
            routines: this.routines,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('transformationData', JSON.stringify(data));
        this.showNotification('Progress saved successfully! 📊', 'success');
    }

    initializeRoutines() {
        this.routines = {
            hairCare: {
                name: 'Hair Care Routine',
                daily: [
                    'Apply leave-in curl cream to damp hair',
                    'Use sea salt spray for texture',
                    'Scrunch gently, air dry or diffuse'
                ],
                weekly: [
                    'Wash hair every 3-4 days (Mon/Thu)',
                    'Deep condition on wash days',
                    'Hair mask on Sunday nights'
                ]
            },
            skincare: {
                name: 'Skincare Routine',
                morning: [
                    'Gentle cleanser',
                    'Vitamin C serum (wait 10 min)',
                    'Moisturizer with ceramides',
                    'SPF 50 broad spectrum'
                ],
                evening: [
                    'Gentle cleanser',
                    'Niacinamide serum',
                    'Night moisturizer'
                ],
                weekly: [
                    'BHA exfoliation 2x/week',
                    'Hydrating mask on Sundays'
                ]
            },
            beardCare: {
                name: 'Beard Grooming',
                daily: [
                    '3-4 drops beard oil after shower',
                    'Brush downward with boar bristle brush',
                    'Train hair to grow down from jaw'
                ],
                weekly: [
                    'Trim with 6-8mm guard',
                    'Define neckline (two-finger rule)',
                    'Clean up cheek lines',
                    'Shape mustache'
                ]
            },
            fitness: {
                name: 'Workout Routine',
                schedule: {
                    'Monday': 'Chest/Shoulders + Beard trim',
                    'Tuesday': 'Back/Biceps + HIIT cardio',
                    'Wednesday': 'Legs + Meal prep',
                    'Thursday': 'Shoulders/Core + HIIT cardio',
                    'Friday': 'Active rest + Steady cardio',
                    'Saturday': 'Full body + BHA exfoliate',
                    'Sunday': 'Rest + Hair mask + Face mask'
                },
                exercises: {
                    'Chest/Shoulders': [
                        'Push-ups: 3x8-12',
                        'Bench press: 3x8-12',
                        'Shoulder press: 3x12-15',
                        'Lateral raises: 3x12-15'
                    ],
                    'Back/Biceps': [
                        'Pull-ups: 3x6-10',
                        'Rows: 3x8-12',
                        'Lat pulldowns: 3x12-15',
                        'Bicep curls: 3x12-15'
                    ]
                }
            }
        };
    }

    updateProgressDisplay() {
        const currentDate = new Date();
        const startDate = new Date(this.profile.startDate);
        const daysPassed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        const weeksPassed = Math.max(1, Math.floor(daysPassed / 7));

        // Update progress cards
        const progressElements = {
            week: document.querySelector('.progress-card:nth-child(1) .progress-value'),
            weight: document.querySelector('.progress-card:nth-child(2) .progress-value'),
            target: document.querySelector('.progress-card:nth-child(3) .progress-value'),
            timeline: document.querySelector('.progress-card:nth-child(4) .progress-value')
        };

        if (progressElements.week) {
            progressElements.week.textContent = `Week ${weeksPassed}`;
        }

        if (progressElements.weight) {
            const currentWeight = this.getCurrentWeight();
            progressElements.weight.textContent = `${currentWeight} kg`;
        }

        if (progressElements.target) {
            const targetLoss = this.profile.currentWeight - this.profile.targetWeight;
            progressElements.target.textContent = `${targetLoss} kg`;
        }

        if (progressElements.timeline) {
            const estimatedWeeks = Math.ceil((this.profile.currentWeight - this.profile.targetWeight) / this.profile.weeklyGoal);
            progressElements.timeline.textContent = `${estimatedWeeks} weeks`;
        }
    }

    getCurrentWeight() {
        const latestEntry = Object.keys(this.progressData)
            .sort()
            .reverse()[0];

        return latestEntry ? this.progressData[latestEntry].weight : this.profile.currentWeight;
    }

    setupSchedule() {
        const today = new Date().getDay();
        const dayCards = document.querySelectorAll('.day-card');

        dayCards.forEach((card, index) => {
            // Sunday = 0, but we want it at position 6 in our grid
            const dayIndex = index === 6 ? 0 : index + 1;

            if (dayIndex === today) {
                card.classList.add('today');
                // Add special today styling or notifications
                this.addTodaysTasks(card);
            }
        });
    }

    addTodaysTasks(dayCard) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = days[new Date().getDay()];
        const todaysTasks = this.routines.fitness.schedule[today];

        // Could add dynamic task updates here
        console.log(`Today's focus: ${todaysTasks}`);
    }

    logProgress(data) {
        const today = new Date().toISOString().split('T')[0];
        this.progressData[today] = {
            date: today,
            weight: data.weight || this.getCurrentWeight(),
            skinRating: data.skinRating || 5,
            energyLevel: data.energyLevel || 7,
            workoutCompleted: data.workoutCompleted || false,
            notes: data.notes || '',
            photos: data.photos || []
        };

        this.saveData();
        this.updateProgressDisplay();
        this.checkMilestones();
    }

    checkMilestones() {
        const currentDate = new Date();
        const startDate = new Date(this.profile.startDate);
        const daysPassed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        const weeksPassed = Math.floor(daysPassed / 7);

        // Check for milestone weeks
        if (weeksPassed === 4) {
            this.showMilestone('Week 4: Skin Assessment Time!', 'Time to evaluate skin improvements and adjust skincare routine if needed.');
        } else if (weeksPassed === 8) {
            this.showMilestone('Week 8: Major Progress Check!', 'Take progress photos, measurements, and adjust diet/workout plan.');
        } else if (weeksPassed === 12) {
            this.showMilestone('Week 12: Transformation Complete!', 'Final assessment and planning for the next phase of your journey.');
        }
    }

    showMilestone(title, message) {
        const milestone = document.createElement('div');
        milestone.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            z-index: 1001;
            text-align: center;
            max-width: 400px;
            animation: milestoneAppear 0.5s ease;
        `;

        milestone.innerHTML = `
            <h3 style="margin-bottom: 15px; font-size: 1.5em;">${title}</h3>
            <p style="margin-bottom: 20px; line-height: 1.5;">${message}</p>
            <button onclick="this.parentElement.remove()" style="
                background: rgba(255,255,255,0.2);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
            ">Got it! 🎯</button>
        `;

        document.body.appendChild(milestone);

        // Add animation styles
        const milestoneStyle = document.createElement('style');
        milestoneStyle.textContent = `
            @keyframes milestoneAppear {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(milestoneStyle);
    }

    setupEventListeners() {
        // Quick progress logging
        this.createQuickLogButton();

        // Auto-save on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveData();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveData();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.openQuickLog();
                        break;
                }
            }
        });
    }

    createQuickLogButton() {
        const quickLogBtn = document.createElement('button');
        quickLogBtn.innerHTML = '📊 Quick Log';
        quickLogBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        quickLogBtn.addEventListener('mouseenter', () => {
            quickLogBtn.style.transform = 'translateY(-3px)';
            quickLogBtn.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        });

        quickLogBtn.addEventListener('mouseleave', () => {
            quickLogBtn.style.transform = 'translateY(0)';
            quickLogBtn.style.boxShadow = '0 5px 20px rgba(102, 126, 234, 0.3)';
        });

        quickLogBtn.addEventListener('click', () => this.openQuickLog());
        document.body.appendChild(quickLogBtn);
    }

    openQuickLog() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 400px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <h2 style="margin-bottom: 20px; text-align: center; color: #4a5568;">📊 Quick Progress Log</h2>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Weight (kg)</label>
                    <input type="number" id="quick-weight" step="0.1" placeholder="Current weight" style="
                        width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px;
                    ">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Skin Rating (1-10)</label>
                    <input type="range" id="quick-skin" min="1" max="10" value="7" style="width: 100%;">
                    <span id="skin-value">7</span>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Energy Level (1-10)</label>
                    <input type="range" id="quick-energy" min="1" max="10" value="7" style="width: 100%;">
                    <span id="energy-value">7</span>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: flex; align-items: center; font-weight: 600;">
                        <input type="checkbox" id="quick-workout" style="margin-right: 10px;">
                        Completed today's workout
                    </label>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600;">Notes (optional)</label>
                    <textarea id="quick-notes" placeholder="How are you feeling? Any observations?" style="
                        width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; resize: vertical;
                        min-height: 60px;
                    "></textarea>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button onclick="this.closest('.modal-backdrop').remove()" style="
                        flex: 1; padding: 12px; background: #e2e8f0; border: none; border-radius: 8px;
                        cursor: pointer; font-weight: 600;
                    ">Cancel</button>
                    <button id="save-log" style="
                        flex: 2; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;
                    ">Save Progress</button>
                </div>
            </div>
        `;

        modal.className = 'modal-backdrop';
        document.body.appendChild(modal);

        // Setup range value displays
        const skinRange = modal.querySelector('#quick-skin');
        const energyRange = modal.querySelector('#quick-energy');
        const skinValue = modal.querySelector('#skin-value');
        const energyValue = modal.querySelector('#energy-value');

        skinRange.addEventListener('input', () => {
            skinValue.textContent = skinRange.value;
        });

        energyRange.addEventListener('input', () => {
            energyValue.textContent = energyRange.value;
        });

        // Setup save button
        modal.querySelector('#save-log').addEventListener('click', () => {
            const data = {
                weight: parseFloat(modal.querySelector('#quick-weight').value) || this.getCurrentWeight(),
                skinRating: parseInt(modal.querySelector('#quick-skin').value),
                energyLevel: parseInt(modal.querySelector('#quick-energy').value),
                workoutCompleted: modal.querySelector('#quick-workout').checked,
                notes: modal.querySelector('#quick-notes').value
            };

            this.logProgress(data);
            modal.remove();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'warning' ? '#ed8936' : '#667eea'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Meal planning helper
    generateMealPlan() {
        const meals = {
            breakfast: [
                '3 eggs + 2 rotis + vegetables (500 cal)',
                'Greek yogurt + fruits + nuts (450 cal)',
                'Oats + banana + almonds (400 cal)'
            ],
            lunch: [
                '150g chicken + rice + vegetables + salad (600 cal)',
                '2 cups dal + 2 rotis + vegetables (550 cal)',
                'Quinoa bowl + paneer + vegetables (580 cal)'
            ],
            snack: [
                'Protein smoothie + banana (300 cal)',
                'Sprouted chana + green tea (250 cal)',
                'Greek yogurt + berries (200 cal)'
            ],
            dinner: [
                'Grilled fish + quinoa + steamed vegetables (500 cal)',
                'Paneer curry + cauliflower rice (450 cal)',
                'Chicken salad + sweet potato (480 cal)'
            ]
        };

        return meals;
    }

    // Workout reminder system
    setupWorkoutReminders() {
        const now = new Date();
        const workoutTime = new Date();
        workoutTime.setHours(18, 0, 0, 0); // 6 PM default

        if (now < workoutTime) {
            const timeToWorkout = workoutTime - now;
            setTimeout(() => {
                this.showNotification('🏋️ Time for your workout! Check today\'s routine.', 'info');
            }, timeToWorkout);
        }
    }
}

// Global function for tab switching
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Initialize the transformation app
window.addEventListener('DOMContentLoaded', () => {
    window.transformationApp = new TransformationApp();

    // Setup workout reminders
    window.transformationApp.setupWorkoutReminders();

    // Show welcome message on first visit
    const isFirstVisit = !localStorage.getItem('transformationData');
    if (isFirstVisit) {
        setTimeout(() => {
            window.transformationApp.showNotification('Welcome to your transformation journey! 🚀 Use Ctrl+L for quick progress logging.', 'success');
        }, 2000);
    }
});

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);