// Newsletter Form JavaScript
class NewsletterForm {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        this.emailInput = document.getElementById('email');
        this.errorMessage = document.getElementById('errorMessage');
        this.submitBtn = this.form.querySelector('.submit-btn');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.confirmedEmail = document.getElementById('confirmedEmail');
        this.dismissBtn = document.getElementById('dismissBtn');

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAccessibility();
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.emailInput.addEventListener('input', () => this.handleInput());
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.emailInput.addEventListener('focus', () => this.clearError());
        
        // Success message dismissal
        this.dismissBtn.addEventListener('click', () => this.dismissModal());
        
        // Close modal when clicking overlay
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.dismissModal();
            }
        });
        
        // Close modal with an Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay.classList.contains('show')) {
                this.dismissModal();
            }
        });
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Button interactions
        this.setupButtonInteractions();
    }

    setupAccessibility() {
        // Add ARIA labels for better accessibility
        this.form.setAttribute('aria-label', 'Newsletter subscription form');
        this.modalOverlay.setAttribute('role', 'dialog');
        this.modalOverlay.setAttribute('aria-modal', 'true');
        this.modalOverlay.setAttribute('aria-labelledby', 'success-title');
        this.errorMessage.setAttribute('role', 'alert');
    }

    setupKeyboardNavigation() {
        // Allow Enter and Space to dismiss modal
        this.dismissBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.dismissModal();
            }
        });

        // Enhanced form navigation
        this.emailInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.form.dispatchEvent(new Event('submit'));
            }
        });
    }

    setupButtonInteractions() {
        // Submit button hover effects
        this.submitBtn.addEventListener('mouseenter', () => {
            if (!this.submitBtn.disabled) {
                this.submitBtn.style.transform = 'translateY(-2px)';
            }
        });

        this.submitBtn.addEventListener('mouseleave', () => {
            if (!this.submitBtn.disabled) {
                this.submitBtn.style.transform = 'translateY(0)';
            }
        });

        // Dismiss button hover effects
        this.dismissBtn.addEventListener('mouseenter', () => {
            this.dismissBtn.style.transform = 'translateY(-2px)';
        });

        this.dismissBtn.addEventListener('mouseleave', () => {
            this.dismissBtn.style.transform = 'translateY(0)';
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateEmail()) {
            this.showModal();
        } else {
            this.shakeInput();
            this.setError('Please enter a valid email address');
        }
    }

    handleInput() {
        // Clear error state while typing
        if (this.emailInput.classList.contains('error')) {
            this.clearError();
        }
        
        // Real-time validation feedback (subtle)
        const email = this.emailInput.value.trim();
        if (email.length > 0 && this.isValidEmail(email)) {
            this.emailInput.style.borderColor = 'hsl(120, 50%, 50%)';
        } else if (email.length > 0) {
            this.emailInput.style.borderColor = 'hsl(4, 100%, 67%)';
        } else {
            this.emailInput.style.borderColor = 'hsl(231, 7%, 80%)';
        }
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        
        // Check if empty
        if (!email) {
            this.setError('Email field cannot be empty');
            return false;
        }
        
        // Check email format
        if (!this.isValidEmail(email)) {
            this.setError('Valid email required');
            return false;
        }
        
        this.clearError();
        return true;
    }

    isValidEmail(email) {
        // RFC 5322 compliant email regex (simplified)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        this.emailInput.classList.add('error');
        this.emailInput.setAttribute('aria-invalid', 'true');
        this.emailInput.setAttribute('aria-describedby', 'errorMessage');
        
        // Focus management for screen readers
        this.errorMessage.focus();
        setTimeout(() => this.emailInput.focus(), 100);
    }

    clearError() {
        this.errorMessage.classList.remove('show');
        this.emailInput.classList.remove('error');
        this.emailInput.removeAttribute('aria-invalid');
        this.emailInput.style.borderColor = '';
        
        // Clear error message after animation
        setTimeout(() => {
            if (!this.errorMessage.classList.contains('show')) {
                this.errorMessage.textContent = '';
            }
        }, 300);
    }

    shakeInput() {
        this.emailInput.classList.add('shake');
        setTimeout(() => {
            this.emailInput.classList.remove('shake');
        }, 700);
    }

    showModal() {
        // Update confirmed email
        this.confirmedEmail.textContent = this.emailInput.value.trim();
        
        // Show modal
        this.modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus management for accessibility
        setTimeout(() => {
            this.dismissBtn.focus();
        }, 300);
        
        // Trap focus within modal
        this.trapFocus();
    }

    dismissModal() {
        // Hide modal
        this.modalOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset form
        this.form.reset();
        this.clearError();
        
        // Focus management - return to email input
        this.emailInput.focus();
    }

    trapFocus() {
        const focusableElements = this.modalOverlay.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this.modalOverlay.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // Public method to reset form (useful for testing)
    reset() {
        this.form.reset();
        this.clearError();
        this.modalOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}



// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the newsletter form
     new NewsletterForm();
    
    // Add some enhancement for better UX
    enhanceUserExperience();
    
    // Setup error handling
    setupErrorHandling();

    
    console.log('Newsletter form initialized successfully');
});

// Enhanced user experience features
function enhanceUserExperience() {
    // Add loading states
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            PerformanceMonitor.measureFormInteraction('submit');
        });
    }
}

// Global error handling
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Newsletter form error:', e.error);

    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Newsletter form promise rejection:', e.reason);
    });
}

function PerformanceMonitor() {
    return false;
}

