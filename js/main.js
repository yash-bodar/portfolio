/**
 * Aurora Portfolio Main Scripts
 * Author: Yash Bodar
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursorSpotlight();
    initCanvasParticles();
    initTypingEffect();
    initNavigation();
    initProjectFiltering();
    initCounterStats();
    initSkillBars();
    init3DCardTilt();
    initArtisanTerminal();
    initContactForm();
    initScrollAnimations();
    initBackToTop();
});

/* ==========================================================================
   1. Interactive Cursor Spotlight
   ========================================================================== */
function initCursorSpotlight() {
    const spotlight = document.getElementById('cursor-spotlight');
    if (!spotlight) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
            isVisible = true;
            spotlight.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', () => {
        isVisible = false;
        spotlight.style.opacity = '0';
    });

    function render() {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;
        spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        requestAnimationFrame(render);
    }

    render();
}

/* ==========================================================================
   2. Interactive Particle / Aurora Ambient Canvas with Mouse Reaction
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 16000), 80);
    const colors = ['#00ffaa', '#00aaff', '#aa00ff', '#ff00aa'];

    let mouse = {
        x: null,
        y: null,
        radius: 140
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.8;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Proximity repulsion
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw inter-particle lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 115) {
                    ctx.save();
                    const alpha = (1 - dist / 115) * 0.12;
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = '#00aaff';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            // Draw line to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - particles[i].x;
                const dy = mouse.y - particles[i].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    ctx.save();
                    const alpha = (1 - dist / mouse.radius) * 0.25;
                    ctx.globalAlpha = alpha;
                    ctx.strokeStyle = '#00ffaa';
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

/* ==========================================================================
   3. Typing Effect for Hero Roles
   ========================================================================== */
function initTypingEffect() {
    const target = document.getElementById('typing-role');
    if (!target) return;

    const roles = [
        'Senior PHP Laravel Developer',
        'Backend & REST API Architect',
        'MySQL Database Tuning Specialist',
        'Full-Stack Web Craftsman'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            target.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            target.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2200;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   4. Navigation & Active Scroll Tracking
   ========================================================================== */
function initNavigation() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileBtn.innerHTML = '<i class="fas fa-times text-2xl text-aurora-green"></i>';
            } else {
                mobileMenu.classList.add('hidden');
                mobileBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
            }
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileBtn.innerHTML = '<i class="fas fa-bars text-2xl"></i>';
            });
        });
    }

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-aurora-green', 'font-semibold');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-aurora-green', 'font-semibold');
            }
        });
    });
}

/* ==========================================================================
   5. Project Filtering
   ========================================================================== */
function initProjectFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* ==========================================================================
   6. 3D Card Tilt & Interactive Glare
   ========================================================================== */
function init3DCardTilt() {
    const cards = document.querySelectorAll('.glass-card');
    
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }
}

/* ==========================================================================
   7. Counter Stats Animation
   ========================================================================== */
function initCounterStats() {
    const statCounters = document.querySelectorAll('.stat-counter');
    if (!statCounters.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statCounters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    const suffix = counter.getAttribute('data-suffix') || '';
                    let current = 0;
                    const increment = Math.max(1, Math.floor(target / 35));
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target + suffix;
                            clearInterval(timer);
                        } else {
                            counter.textContent = current + suffix;
                        }
                    }, 30);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('about');
    if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   8. Skill Progress Bars Animation on Scroll
   ========================================================================== */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    if (!skillBars.length) return;

    let animated = false;
    const skillsSection = document.getElementById('skills');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                skillBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width') || '85%';
                    bar.style.width = targetWidth;
                });
            }
        });
    }, { threshold: 0.2 });

    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

/* ==========================================================================
   9. Contact Form & Toast Notification
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        if (!name || !email || !message) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
        }, 1100);
    });

    function showToast(msg, type = 'success') {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = msg;
        
        if (type === 'error') {
            toast.classList.remove('border-aurora-green');
            toast.classList.add('border-red-500');
        } else {
            toast.classList.remove('border-red-500');
            toast.classList.add('border-aurora-green');
        }

        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
    }
}

/* ==========================================================================
   10. Intersection Observer for Scroll Fade-in
   ========================================================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedElements.forEach(el => {
        el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
        observer.observe(el);
    });
}

/* ==========================================================================
   11. Back to Top Button
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
            backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
            backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ==========================================================================
   12. Interactive Laravel Artisan Tinker Terminal Engine
   ========================================================================== */
function initArtisanTerminal() {
    const tabProfileBtn = document.getElementById('tabProfileBtn');
    const tabTinkerBtn = document.getElementById('tabTinkerBtn');
    const codeSnippetView = document.getElementById('codeSnippetView');
    const artisanTinkerView = document.getElementById('artisanTinkerView');
    const terminalForm = document.getElementById('terminalPromptForm');
    const terminalInput = document.getElementById('terminalCmdInput');
    const terminalOutput = document.getElementById('terminalOutputLog');
    const presetPills = document.querySelectorAll('.terminal-preset-pill');

    if (!tabProfileBtn || !tabTinkerBtn || !codeSnippetView || !artisanTinkerView) return;

    // Tab Switching
    tabProfileBtn.addEventListener('click', () => {
        tabProfileBtn.classList.add('active', 'text-white');
        tabProfileBtn.classList.remove('text-slate-400');
        tabTinkerBtn.classList.remove('active', 'text-white');
        tabTinkerBtn.classList.add('text-slate-400');

        codeSnippetView.classList.remove('hidden');
        artisanTinkerView.classList.add('hidden');
    });

    tabTinkerBtn.addEventListener('click', () => {
        tabTinkerBtn.classList.add('active', 'text-white');
        tabTinkerBtn.classList.remove('text-slate-400');
        tabProfileBtn.classList.remove('active', 'text-white');
        tabProfileBtn.classList.add('text-slate-400');

        codeSnippetView.classList.add('hidden');
        artisanTinkerView.classList.remove('hidden');
        if (terminalInput) terminalInput.focus();
    });

    // Command History Buffer
    const cmdHistory = [];
    let historyIndex = -1;

    // Command Handler & Parser
    function executeCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        cmdHistory.push(rawCmd);
        historyIndex = cmdHistory.length;

        // Print entered command
        appendOutput(`>>> ${rawCmd}`, 'text-aurora-green font-semibold');

        // Command Responses
        if (cmd === 'clear' || cmd === 'cls') {
            terminalOutput.innerHTML = `
                <div class="text-slate-500">// Laravel Artisan v11.x (Interactive Shell)</div>
                <div class="text-slate-400">Type <span class="text-aurora-green font-semibold">help</span> or click pills to execute commands.</div>
            `;
            return;
        }

        if (cmd === 'help' || cmd === '?') {
            appendOutput(`
Available Commands:
  • <span class="text-aurora-green">bio</span>               Show developer bio & career overview
  • <span class="text-aurora-blue">stack</span>             Display technical skills & frameworks
  • <span class="text-aurora-purple">projects</span>          Simulate real-time auction & API events
  • <span class="text-aurora-pink">contact</span>           Display direct contact & WhatsApp link
  • <span class="text-emerald-300">hire</span>              Check current work status & availability
  • <span class="text-slate-400">clear</span>             Clear console screen
            `);
            return;
        }

        if (cmd === 'bio' || cmd === 'developer:bio' || cmd === 'php artisan developer:bio') {
            appendOutput(`
<span class="text-aurora-green font-bold">👤 Developer Profile:</span>
{
  "name": "<span class="text-white">Yash Bodar</span>",
  "title": "<span class="text-aurora-blue">Senior PHP Laravel Developer</span>",
  "experience": "<span class="text-amber-300">3+ Years Overall Journey</span>",
  "current_company": "<span class="text-emerald-300">Parex Technologies</span>",
  "previous_experience": "<span class="text-slate-300">Lembits Technolab Pvt. Ltd.</span>",
  "location": "<span class="text-slate-300">Ahmedabad, Gujarat, India</span>"
}
            `);
            return;
        }

        if (cmd === 'stack' || cmd === 'stack:list' || cmd === 'php artisan stack:list') {
            appendOutput(`
<span class="text-aurora-blue font-bold">🛠️ Core Technology Stack:</span>
• Backend:   <span class="text-aurora-green">PHP 8.3+, Laravel 10/11, CodeIgniter, RESTful APIs</span>
• Database:  <span class="text-aurora-blue">MySQL (Indexing, Query Profiling, N+1 Optimization)</span>
• Payments:  <span class="text-emerald-300">Stripe Payment Gateway (Webhooks, Sessions)</span>
• Frontend:  <span class="text-aurora-purple">Vue.js, Blade Templates, JavaScript ES6+, AJAX, Bootstrap 5</span>
• DevOps:    <span class="text-aurora-pink">Git, Bitbucket, Postman, Composer, Agile / Scrum</span>
            `);
            return;
        }

        if (cmd === 'projects' || cmd.includes('auction') || cmd === 'php artisan project:run') {
            appendOutput(`
<span class="text-aurora-purple font-bold">🚀 Dispatching Real-Time Auction Simulation:</span>
[<span class="text-cyan-400">2026-08-20 12:45:00</span>] Event: <span class="text-aurora-green">App\\Events\\BidPlaced</span>
[<span class="text-cyan-400">2026-08-20 12:45:00</span>] Channel: <span class="text-aurora-blue">private-auction.420</span>
[<span class="text-cyan-400">2026-08-20 12:45:01</span>] Payload: <span class="text-white">{"bidder_id": 89, "amount": "$45,200", "status": "leading"}</span>
[<span class="text-cyan-400">2026-08-20 12:45:01</span>] Broadcast latency: <span class="text-aurora-green">11.4ms (WebSocket OK)</span>
✨ <span class="text-slate-300">Project: <strong>Auction Techs</strong> - Real-Time Timed & Onsite Auctions</span>
            `);
            return;
        }

        if (cmd.includes('car') || cmd === 'first-choice-car') {
            appendOutput(`
<span class="text-aurora-purple font-bold">🚗 Executing Vehicle API Endpoint:</span>
HTTP GET /api/v1/vehicles/compare?models=45,82
Response: <span class="text-aurora-green">200 OK (22ms)</span>
Payload: <span class="text-slate-300">{"total": 2, "comparison": ["Sedan Specs", "Pricing", "Commercial History"]}</span>
✨ <span class="text-slate-300">Project: <strong>First Choice Car</strong> - High Throughput REST APIs</span>
            `);
            return;
        }

        if (cmd === 'contact' || cmd === 'contact:info') {
            appendOutput(`
<span class="text-aurora-pink font-bold">📬 Contact Channels:</span>
• Email:    <a href="mailto:yashbodar7@gmail.com" class="text-aurora-green underline">yashbodar7@gmail.com</a>
• Phone:    <span class="text-white">+91 9016012405</span>
• WhatsApp: <a href="https://wa.me/919016012405" target="_blank" class="text-emerald-400 underline">Chat on WhatsApp</a>
• LinkedIn: <a href="https://www.linkedin.com/in/yash-bodar-8558a5275" target="_blank" class="text-aurora-blue underline">Yash Bodar on LinkedIn</a>
            `);
            return;
        }

        if (cmd === 'hire' || cmd === 'hire:developer') {
            appendOutput(`
<span class="text-emerald-400 font-bold">⚡ Availability Status:</span>
• Status: <span class="text-aurora-green font-bold">Open to High-Impact Opportunities & Senior Roles</span>
• Primary Focus: <span class="text-white">Laravel Backends, API Systems, Database Tuning</span>
• Quick Action: <a href="#contact" class="text-aurora-blue underline">Jump to Contact Form</a>
            `);
            return;
        }

        // Fallback unknown command
        appendOutput(`Command "<span class="text-red-400">${rawCmd}</span>" not found. Type <span class="text-aurora-green">help</span> to list commands.`, 'text-red-400');
    }

    function appendOutput(html, customClass = '') {
        const div = document.createElement('div');
        div.className = customClass;
        div.innerHTML = html;
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Form Submit
    if (terminalForm && terminalInput) {
        terminalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = terminalInput.value;
            terminalInput.value = '';
            executeCommand(val);
        });

        // Up / Down arrow history
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = cmdHistory[historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < cmdHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = cmdHistory[historyIndex] || '';
                } else {
                    historyIndex = cmdHistory.length;
                    terminalInput.value = '';
                }
            }
        });
    }

    // Preset Pills
    presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const cmd = pill.getAttribute('data-cmd');
            if (cmd) {
                // Ensure tinker tab is visible
                tabTinkerBtn.click();
                executeCommand(cmd);
            }
        });
    });
}
