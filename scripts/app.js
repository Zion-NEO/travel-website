document.addEventListener('DOMContentLoaded', () => {
    const timelineContainer = document.querySelector('.timeline');

    // Fetch and Render Itinerary
    fetch('/api/itinerary')
        .then(response => response.json())
        .then(data => {
            renderTimeline(data);
            initInteractions();
        })
        .catch(err => console.error('Error loading itinerary:', err));

    function renderTimeline(data) {
        timelineContainer.innerHTML = data.map((day, index) => `
            <div class="day-card ${index % 2 === 0 ? 'left' : 'right'}">
                <div class="day-marker"></div>
                <div class="card-content">
                    <span class="day-number">${day.day}</span>
                    <h3>${day.title}</h3>
                    <p>${day.description}</p>
                    <div class="details">
                        ${day.details.map(detail => {
            // Simple formatting for bold text if it contains "："
            const parts = detail.split('：');
            if (parts.length > 1) {
                return `<p><strong>${parts[0]}：</strong>${parts.slice(1).join('：')}</p>`;
            }
            return `<p>${detail}</p>`;
        }).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    function initInteractions() {
        // Hamburger Menu
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Scroll Animation for Timeline
        const observerOptions = { threshold: 0.2 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        const dayCards = document.querySelectorAll('.day-card');
        dayCards.forEach(card => observer.observe(card));

        // Expandable Details
        const cardContents = document.querySelectorAll('.card-content');
        cardContents.forEach(content => {
            content.addEventListener('click', () => {
                content.classList.toggle('active');
            });
        });

        // Back to Top Button
        const backToTopBtn = document.getElementById('backToTop');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

