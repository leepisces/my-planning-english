// Add interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Store current page in session storage for back navigation
    const currentPage = window.location.pathname.split('/').pop();
    sessionStorage.setItem('current_vocab_page', currentPage);
    
    // Store referrer information when coming from dashboard
    if (window.parent !== window) {
        // We're in an iframe, so we need to track where we came from
        const currentPath = window.location.pathname.split('/').pop();
        
        // Determine the section based on the file name pattern
        let section = 'vocabulary';
        if (currentPath.indexOf('topic_') !== -1) {
            section = 'topics';
        } else if (currentPath.indexOf('grammar_') !== -1) {
            section = 'grammar';
        }
        
        // Store this section as the referrer
        localStorage.setItem('vocab_referrer', section);
    }
    
    // Create and add back button
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerHTML = '<span style="margin-right: 5px;">←</span> Back';
    document.querySelector('.mindmap-container').appendChild(backButton);
    
    // Back button functionality
    backButton.addEventListener('click', function() {
        // Get the referrer from localStorage if available
        const referrer = localStorage.getItem('vocab_referrer');
        
        if (referrer) {
            // Navigate back to the referring section
            window.parent.postMessage({
                action: 'navigate',
                file: referrer
            }, '*');
        } else {
            // If no referrer stored, go to index.html as fallback
            window.parent.postMessage({
                action: 'navigate',
                file: 'index.html'
            }, '*');
        }
    });
    
    // Add tips section if it doesn't exist
    if (!document.querySelector('.tips')) {
        const tipsDiv = document.createElement('div');
        tipsDiv.className = 'tips';
        tipsDiv.innerHTML = '💡 <strong>Mẹo học:</strong> Hover chuột lên mỗi nhánh để xem rõ hơn! ' +
                           'Học theo nhóm màu để dễ nhớ và phân loại kiến thức.';
        document.querySelector('.mindmap').appendChild(tipsDiv);
    }
    
    // Branch hover effects
    document.querySelectorAll('.branch').forEach(branch => {
        branch.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-5px)';
            this.style.zIndex = '20';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
        });
        
        branch.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '5';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // Add click to highlight effect
    document.querySelectorAll('.branch').forEach(branch => {
        branch.addEventListener('click', function() {
            // Remove highlight from all branches
            document.querySelectorAll('.branch').forEach(b => {
                b.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                b.style.transform = 'scale(1)';
            });
            
            // Highlight clicked branch
            this.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.6)';
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '20';
        });
    });
    
    // Add animation to items
    document.querySelectorAll('.item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
});
