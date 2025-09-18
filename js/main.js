// ===== MAIN JAVASCRIPT FOR SHRINATH HINGE PORTFOLIO (FIXED) ===== //

(() => {
    'use strict';
  
    // ---------- Utility & Safety ----------
    const safeQuery = (selector, parent = document) => parent.querySelector(selector);
    const safeQueryAll = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
  
    // Debounce
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  
    // Notification helper (kept your implementation but defensive)
    function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">
          <i class="fas fa-times"></i>
        </button>
      `;
      if (!safeQuery('#notification-styles')) {
        const notificationStyles = `
          <style id="notification-styles">
            .notification {
                position: fixed;
                top: 100px;
                right: 2rem;
                background: var(--glass-white);
                backdrop-filter: blur(20px);
                border: 1px solid var(--glass-border);
                border-radius: 12px;
                padding: 1rem 1.5rem;
                color: white;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 3000;
                animation: slideInRight 0.3s ease;
                min-width: 300px;
                box-shadow: var(--shadow-glass);
            }
            .notification-success { border-left: 4px solid #00ff7f; }
            .notification-error { border-left: 4px solid #ff4757; }
            .notification button { background:none; border:none; color:white; cursor:pointer; padding:0.25rem; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; }
            .notification button:hover { background: rgba(255,255,255,0.12); }
            @keyframes slideInRight {
              from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; }
            }
            @media (max-width:600px) {
              .notification { right: 1rem; left: 1rem; min-width: auto; }
            }
          </style>
        `;
        document.head.insertAdjacentHTML('beforeend', notificationStyles);
      }
      document.body.appendChild(notification);
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn && closeBtn.addEventListener('click', () => notification.remove());
      setTimeout(() => notification.remove(), 5000);
    }
  
    // ---------- Modal management (fixed, no inline handlers) ----------
    function createProjectModal(project = {}) {
      const existing = document.querySelector('.project-modal');
      if (existing) existing.remove();
  
      const overlay = document.createElement('div');
      overlay.className = 'project-modal';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
  
      const content = document.createElement('div');
      content.className = 'modal-content glass-panel';
      content.setAttribute('tabindex', '0');
  
      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal-close';
      closeBtn.type = 'button';
      closeBtn.innerHTML = `<i class="fas fa-times" aria-hidden="true"></i>`;
      closeBtn.setAttribute('aria-label', 'Close project details');
  
      const title = document.createElement('h2');
      title.textContent = project.title || 'Untitled Project';
  
      const desc = document.createElement('p');
      desc.className = 'project-description';
      desc.textContent = project.description || '';
  
      const techContainer = document.createElement('div');
      techContainer.className = 'project-tech';
      techContainer.innerHTML = `<h3>Technologies Used:</h3>`;
      const techTags = document.createElement('div');
      techTags.className = 'tech-tags';
      (project.tech || []).forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = t;
        techTags.appendChild(tag);
      });
      techContainer.appendChild(techTags);
  
      const featuresContainer = document.createElement('div');
      featuresContainer.className = 'project-features';
      featuresContainer.innerHTML = `<h3>Key Features:</h3>`;
      const ul = document.createElement('ul');
      (project.features || []).forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        ul.appendChild(li);
      });
      featuresContainer.appendChild(ul);
  
      const actions = document.createElement('div');
      actions.className = 'modal-actions';
      const btnPrimary = document.createElement('button');
      btnPrimary.className = 'btn-primary';
      btnPrimary.type = 'button';
      btnPrimary.textContent = 'View Live Demo';
      btnPrimary.addEventListener('click', () => {
        if (project.demoUrl) window.open(project.demoUrl, '_blank');
        else showNotification('No live demo URL provided.', 'info');
      });
  
      const btnSecondary = document.createElement('button');
      btnSecondary.className = 'btn-secondary';
      btnSecondary.type = 'button';
      btnSecondary.textContent = 'View Source Code';
      btnSecondary.addEventListener('click', () => {
        if (project.sourceUrl) window.open(project.sourceUrl, '_blank');
        else showNotification('No source URL provided.', 'info');
      });
  
      actions.appendChild(btnPrimary);
      actions.appendChild(btnSecondary);
  
      content.appendChild(closeBtn);
      content.appendChild(title);
      content.appendChild(desc);
      content.appendChild(techContainer);
      content.appendChild(featuresContainer);
      content.appendChild(actions);
  
      overlay.appendChild(content);
      document.body.appendChild(overlay);
  
      if (!safeQuery('#modal-styles')) {
        const modalStyles = `
          <style id="modal-styles">
            .project-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.25s ease forwards;
            }
            .modal-content {
                max-width: 720px;
                width: calc(100% - 3rem);
                max-height: 80vh;
                overflow-y: auto;
                margin: 2rem;
                padding: 2rem;
                position: relative;
                animation: slideIn 0.25s ease forwards;
                background: rgba(10,10,12,0.45);
                border-radius: 12px;
                box-shadow: 0 12px 40px rgba(0,0,0,0.6);
                backdrop-filter: blur(8px);
            }
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            .modal-close:hover { background: rgba(255,255,255,0.06); color: var(--primary-gold); }
            .project-description { color: rgba(255,255,255,0.9); line-height:1.6; margin-bottom:1rem; }
            .project-tech, .project-features { margin-bottom: 1rem; }
            .project-tech h3, .project-features h3 { color: var(--primary-aqua); margin-bottom: 0.5rem; font-size:1.05rem; }
            .tech-tags { display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.5rem; }
            .tech-tag { background: var(--glass-white); border:1px solid var(--glass-border); padding:0.4rem 0.8rem; border-radius:10px; color:var(--primary-gold); font-size:0.9rem; }
            .project-features ul { list-style:none; padding-left:0; }
            .project-features li { color: rgba(255,255,255,0.85); margin-bottom:0.45rem; padding-left:1.4rem; position:relative; }
            .project-features li::before { content: '▶'; color: var(--primary-gold); position:absolute; left:0; }
            .modal-actions { display:flex; gap:1rem; flex-wrap:wrap; margin-top:1rem; }
            .btn-primary, .btn-secondary {
               padding: 0.75rem 1.2rem; border:none; border-radius:12px; cursor:pointer; font-weight:600; transition:all 0.18s ease; min-width:140px;
            }
            .btn-primary { background: linear-gradient(45deg, var(--primary-gold), #ffed4e); color: var(--dark-navy); }
            .btn-secondary { background: var(--glass-white); color: white; border:1px solid var(--glass-border); }
            .btn-primary:hover, .btn-secondary:hover { transform:translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.35); }
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideIn { from { transform: translateY(-30px); opacity:0 } to { transform: translateY(0); opacity:1 } }
            @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
            @media (max-width:600px) {
              .modal-content { margin: 1rem; padding: 1rem; }
              .modal-actions { flex-direction: column; }
              .btn-primary, .btn-secondary { width: 100%; min-width: auto; }
            }
          </style>
        `;
        document.head.insertAdjacentHTML('beforeend', modalStyles);
      }
  
      // Force reflow then open (for transitions)
      requestAnimationFrame(() => {
        overlay.classList.add('open');
        content.focus();
      });
  
      // Event listeners:
      const onOverlayClick = (e) => {
        if (e.target === overlay) closeProjectModal();
      };
      overlay.addEventListener('click', onOverlayClick);
  
      closeBtn.addEventListener('click', () => closeProjectModal());
  
      const onKeyDown = (e) => {
        if (e.key === 'Escape') closeProjectModal();
      };
      document.addEventListener('keydown', onKeyDown);
  
      function closeProjectModal() {
        overlay.style.animation = 'fadeOut 0.2s ease forwards';
        overlay.classList.remove('open');
        setTimeout(() => {
          overlay.remove();
          document.removeEventListener('keydown', onKeyDown);
        }, 220);
      }
  
      return { overlay, content, close: closeProjectModal };
    }
  
    // ---------- Project data and interactions ----------
    const PROJECT_DATA = {
      asteroid: {
        title: 'Asteroid Shooter VR',
        description: 'An immersive VR game where players navigate through space and destroy asteroids using various weapons. Built with Unity and C# with realistic physics.',
        tech: ['Unity', 'C#', 'VR SDK', 'Physics'],
        features: ['360° VR Movement', 'Weapon Systems', 'Score Tracking', 'Realistic Physics'],
        demoUrl: '#',
        sourceUrl: '#'
      },
      lightfront: {
        title: 'LightFront VR Experience',
        description: 'A cutting-edge VR application showcasing advanced lighting techniques and interactive environments for architectural visualization.',
        tech: ['Unity', 'HDRP', 'VR', 'Lighting'],
        features: ['Real-time Lighting', 'Interactive Objects', 'Multi-platform VR', 'Performance Optimization'],
        demoUrl: '#',
        sourceUrl: '#'
      },
      focus: {
        title: 'Focus Web Application',
        description: 'A productivity web app helping users manage tasks and maintain focus with pomodoro technique and goal tracking.',
        tech: ['JavaScript', 'HTML5', 'CSS3', 'Local Storage'],
        features: ['Pomodoro Timer', 'Task Management', 'Progress Tracking', 'Responsive Design'],
        demoUrl: '#',
        sourceUrl: '#'
      },
      haunted: {
        title: 'Haunted House 3D',
        description: 'A spine-chilling 3D horror experience with atmospheric lighting, sound design, and interactive storytelling elements.',
        tech: ['Unity', '3D Modeling', 'Audio', 'Scripting'],
        features: ['3D Environment', 'Horror Atmosphere', 'Interactive Story', 'Immersive Audio'],
        demoUrl: '#',
        sourceUrl: '#'
      },
      food: {
        title: 'Online Food Delivery System',
        description: 'A complete food delivery web application with user authentication, restaurant management, and order tracking functionality.',
        tech: ['JavaScript', 'Node.js', 'MongoDB', 'Express'],
        features: ['User Authentication', 'Restaurant Portal', 'Order Management', 'Payment Integration'],
        demoUrl: '#',
        sourceUrl: '#'
      },
      pos: {
        title: 'Point of Sale System',
        description: 'A comprehensive POS solution for retail businesses with inventory management, sales tracking, and reporting features.',
        tech: ['Java', 'MySQL', 'JavaFX', 'Reports'],
        features: ['Inventory Management', 'Sales Processing', 'Customer Database', 'Analytics Dashboard'],
        demoUrl: '#',
        sourceUrl: '#'
      }
    };
  
    function initializeProjectInteractions() {
      const projectTiles = safeQueryAll('.project-tile');
      if (!projectTiles || projectTiles.length === 0) return;
  
      projectTiles.forEach(tile => {
        tile.addEventListener('click', (e) => {
          const projectName = tile.dataset.project;
          if (!projectName) return;
          const project = PROJECT_DATA[projectName];
          if (!project) {
            showNotification('Project data not found.', 'error');
            return;
          }
          createProjectModal(project);
        });
  
        tile.addEventListener('mouseenter', () => {
          tile.style.transform = 'translateY(-8px) scale(1.02)';
        });
        tile.addEventListener('mouseleave', () => {
          tile.style.transform = '';
        });
  
        tile.setAttribute('role', 'button');
        if (!tile.hasAttribute('tabindex')) tile.setAttribute('tabindex', '0');
        tile.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            tile.click();
          }
        });
      });
    }
  
    // ---------- Navigation ----------
    function initializeNavigation() {
      const navToggle = safeQuery('.nav-toggle');
      const navLinks = safeQuery('.nav-links');
      const navLinkItems = safeQueryAll('.nav-link');
  
      if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
          navLinks.classList.toggle('active');
          const icon = navToggle.querySelector('i');
          if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
          }
        });
      }
  
      navLinkItems.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href') || '';
          if (href.startsWith('#')) {
            e.preventDefault();
            const target = safeQuery(href);
            if (target) {
              navLinkItems.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              if (navLinks) navLinks.classList.remove('active');
              if (navToggle) {
                const icon = navToggle.querySelector('i');
                if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-times'); }
              }
            }
          }
        });
      });
  
      window.addEventListener('scroll', debounce(() => {
        updateActiveNav();
        updateNavbarBackground();
      }, 20));
    }
  
    function updateActiveNav() {
      const sections = safeQueryAll('section[id]');
      const navLinks = safeQueryAll('.nav-link');
  
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
  
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }
  
    function updateNavbarBackground() {
      const navbar = document.getElementById('main-navbar');
      const scrollY = window.scrollY;
      if (!navbar) return;
      if (scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.2)';
        navbar.style.backdropFilter = 'blur(30px)';
      } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.15)';
        navbar.style.backdropFilter = 'blur(20px)';
      }
    }
  
    // ---------- Theme toggle (defensive) ----------
    function initThemeToggle() {
      const themeToggleBtn = safeQuery('#theme-toggle');
      const body = document.body;
      const themeIcon = safeQuery('.theme-icon');
  
      const lightModeIcon = '../assets/background/sun.png';
      const darkModeIcon = '../assets/background/moon.png';
  
      const savedTheme = localStorage.getItem('theme') || 'dark';
      body.setAttribute('data-theme', savedTheme);
  
      if (themeIcon) {
        themeIcon.src = savedTheme === 'light' ? darkModeIcon : lightModeIcon;
      }
  
      if (!themeToggleBtn) return;
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (themeIcon) themeIcon.src = newTheme === 'light' ? darkModeIcon : lightModeIcon;
      });
    }
  
    // ---------- Scroll animations ----------
    function initializeScrollAnimations() {
      const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animate-in');
          }
        });
      }, observerOptions);
  
      const glassPanels = safeQueryAll('.glass-panel');
      glassPanels.forEach(panel => observer.observe(panel));
  
      window.addEventListener('scroll', debounce(() => {
        const scrollY = window.scrollY;
        const blurs = safeQueryAll('.bg-blur');
        blurs.forEach((blur, index) => {
          const speed = 0.1 + (index * 0.05);
          blur.style.transform = `translate(0, ${scrollY * speed}px)`;
        });
      }, 12));
    }
  
    // ---------- Contact form ----------
    function initializeContactForm() {
      const contactForm = safeQuery('.contact-form');
      if (!contactForm) return;
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleContactSubmission();
      });
  
      const inputs = safeQueryAll('.form-group input, .form-group textarea', contactForm);
      inputs.forEach(input => {
        input.addEventListener('focus', () => input.parentElement && input.parentElement.classList.add('focused'));
        input.addEventListener('blur', () => {
          if (input.value === '' && input.parentElement) input.parentElement.classList.remove('focused');
        });
      });
    }
  
    function handleContactSubmission() {
      const form = safeQuery('.contact-form');
      if (!form) return showNotification('Contact form not found.', 'error');
      const submitBtn = form.querySelector('.submit-btn');
      if (!submitBtn) return showNotification('Submit button not found.', 'error');
  
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
  
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'linear-gradient(45deg, #00ff7f, #32cd32)';
        form.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
        showNotification('Thank you! Your message has been sent successfully.', 'success');
      }, 1400);
    }
  
    // ---------- Resume download ----------
    function initializeResumeDownload() {
      const resumeButtons = safeQueryAll('.resume-btn, .download-btn, .floating-btn');
      if (!resumeButtons) return;
      resumeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          downloadResume();
        });
      });
    }
  
    function downloadResume() {
      const resumeContent = generateResumeContent();
      const blob = new Blob([resumeContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Shrinath_Hinge_Resume.txt';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showNotification('Resume downloaded successfully!', 'success');
    }
  
    function generateResumeContent() {
      return `
  SHRINATH HINGE
  Software Developer & VR Enthusiast
  =====================================
  (contact & content placeholder)
      `.trim();
    }
  
    // ---------- Parallax & other UX ----------
    function initializeParallaxEffects() {
      let ticking = false;
      function updateParallax() {
        const scrollY = window.pageYOffset;
        const hero = safeQuery('.hero-card');
        if (hero) hero.style.transform = `translateY(${scrollY * 0.1}px)`;
        const skillTags = safeQueryAll('.skill-tag');
        skillTags.forEach((tag, index) => tag.style.animationDelay = `${index * 0.1}s`);
        ticking = false;
      }
      function requestTick() {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      }
      window.addEventListener('scroll', requestTick);
    }
  
    // ---------- Touch interactions ----------
    function initializeTouchInteractions() {
      const interactiveElements = safeQueryAll('.glass-panel, .social-link, .project-tile, .skill-tag, .cert-badge');
      interactiveElements.forEach(el => {
        el.addEventListener('touchstart', () => { el.style.transform = 'scale(0.98)'; });
        el.addEventListener('touchend', () => { el.style.transform = ''; });
      });
    }
  
    // ---------- Accessibility improvements ----------
    function enhanceAccessibility() {
      const interactiveElements = safeQueryAll('.project-tile');
      interactiveElements.forEach((element, index) => {
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', element.getAttribute('tabindex') || '0');
        element.setAttribute('aria-label', `View details for project ${index + 1}`);
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            element.click();
          }
        });
      });
    }
  
    // ---------- Error handling ----------
    window.addEventListener('error', (e) => {
      console.error('Portfolio Error:', e.error || e.message || e);
    });
  
    // Expose some functions for testing if needed (safe)
    window.__portfolio = {
      createProjectModal,
      downloadResume
    };
  
    // ---------- Initialization ----------
    document.addEventListener('DOMContentLoaded', () => {
      try {
        initializeNavigation();
        initializeScrollAnimations();
        initializeProjectInteractions();
        initializeContactForm();
        initializeResumeDownload();
        initializeParallaxEffects();
        initializeTouchInteractions();
        initThemeToggle();
        enhanceAccessibility();
  
        console.log('🚀 Portfolio loaded successfully (fixed)');
      } catch (err) {
        console.error('Initialization error:', err);
      }
    });
  
  })(); // end IIFE