// FAQ handling
const faqItems = document.querySelectorAll('.accordion-item');
faqItems.forEach(item => {
    const button = item.querySelector('.accordion-button');
    const content = item.querySelector('.accordion-collapse');
    
    button.addEventListener('click', function() {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherButton = otherItem.querySelector('.accordion-button');
                const otherContent = otherItem.querySelector('.accordion-collapse');
                otherButton.setAttribute('aria-expanded', 'false');
                otherContent.classList.remove('show');
            }
        });
        
        // Toggle current item
        button.setAttribute('aria-expanded', !isExpanded);
        content.classList.toggle('show');
    });
});

// Support form handling
const supportForm = document.getElementById('supportForm');
const formFields = supportForm.querySelectorAll('input, textarea');

// Form validation
formFields.forEach(field => {
    field.addEventListener('input', function() {
        validateField(this);
    });
});

function validateField(field) {
    const value = field.value.trim();
    const errorElement = field.nextElementSibling;
    
    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('invalid-feedback')) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        const error = document.createElement('div');
        error.className = 'invalid-feedback';
        error.textContent = message;
        field.parentNode.insertBefore(error, field.nextSibling);
    }
    field.classList.add('is-invalid');
}

function clearFieldError(field) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('invalid-feedback')) {
        errorElement.style.display = 'none';
    }
    field.classList.remove('is-invalid');
}

// Form submission
supportForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    formFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showError('Please fix the errors in the form');
        return;
    }
    
    const formData = new FormData(supportForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/api/support', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            showSuccess('Your message has been sent successfully');
            supportForm.reset();
        } else {
            showError(result.message || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error sending support message:', error);
        showError('Failed to send message');
    }
});

// Video tutorial handling
const videoThumbnails = document.querySelectorAll('.video-thumbnail');
videoThumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        const videoId = this.dataset.videoId;
        showVideoModal(videoId);
    });
});

function showVideoModal(videoId) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'videoModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Video Tutorial</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="ratio ratio-16x9">
                        <iframe src="https://www.youtube.com/embed/${videoId}" 
                                title="Video Tutorial" 
                                allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// Utility functions
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show';
    successDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container-fluid').insertBefore(successDiv, document.querySelector('.row'));
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container-fluid').insertBefore(errorDiv, document.querySelector('.row'));
} 