/**
 * Vinay Aluguri - Elite Portfolio Interactive Engine
 * Custom Cursor, 3D Perspective Tilt (Cards, Profile, Cubes), Scroll Reveal,
 * Popups for All Sections, and Golden Connective Node Canvas
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Configuration
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('open');
  });

  // Close mobile menu when nav link is clicked
  const navLinks = document.querySelectorAll('.nav-item a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  // 3. Custom Fluid Cursor
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  if (cursor && cursorDot) {
    document.addEventListener('mousemove', (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      
      cursor.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 150, fill: 'forwards' });
    });

    // Handle hover states dynamically for current and future elements
    const updateCursorListeners = () => {
      const hoverTargets = document.querySelectorAll('.hover-target, a, button, input, textarea, .project-card, .profile-circle-container, .modal-close, .clickable-experience, .clickable-skill, .clickable-cert, .cube');
      hoverTargets.forEach(target => {
        if (!target.dataset.cursorBound) {
          target.dataset.cursorBound = 'true';
          target.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
          target.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        }
      });
    };
    
    updateCursorListeners();
    setInterval(updateCursorListeners, 1500);
  }

  // 4. Interactive 3D Perspective Tilt (Cards, Profile Circle, & Spinning Cubes!)
  const tiltElements = document.querySelectorAll('.project-card, .profile-circle-container[data-tilt], .cube[data-tilt]');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation based on center (-15 to 15 degrees)
      const rotateY = ((x / width) - 0.5) * 15;
      const rotateX = -((y / height) - 0.5) * 15;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    });
    
    el.addEventListener('mouseleave', () => {
      // Return to default (spinning cubes spin via animation keyframes, reset transform only for non-cubes)
      if (el.classList.contains('cube')) {
        el.style.transform = ''; // Keep default keyframe spin
      } else {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      }
      el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });

  // 5. Scroll Reveal Engine
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        if (entry.target.classList.contains('skills-card')) {
          const skillFills = entry.target.querySelectorAll('.skill-fill');
          skillFills.forEach(fill => {
            const width = fill.getAttribute('data-width');
            fill.style.width = width;
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // 6. 3D Dynamic Connecting Node Canvas (Agent Workflow Simulation)
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 65;
    const connectionDist = 120;
    
    let mouse = { x: null, y: null, active: false };
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    
    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180) {
            this.x += dx * 0.005;
            this.y += dy * 0.005;
          }
        }
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
        ctx.fill();
      }
    }
    
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < connectionDist) {
            const alpha = (1 - (dist / connectionDist)) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        
        if (mouse.active) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            const alpha = (1 - (dist / 150)) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  // 7. Data Matrices for Multi-Purpose Modals
  const experienceData = {
    turing: {
      tag: "EXPERIENCE RETROSPECTIVE // SECURE PIPELINE",
      title: "LLM Agentic Trainer (Turing)",
      desc: "Designed and engineered complex multi-step AI agent workflows utilizing Python scripts and third-party API configurations. Built secure orchestration pipelines with automated loop structures, self-correction algorithms, retry boundaries, and JSON-based output validation schemas. Optimized foundation models via Chain-of-Thought (CoT) and ReAct prompt engineering on golden training sets.",
      tech: ["Python Core", "JSON Schemas", "n8n Workflows", "API Integrations", "LLM Evaluation", "Chain-of-Thought", "ReAct Paradigms"],
      actionLink: "mailto:vinayaluguru@gmail.com",
      actionText: "DE-ORBIT RETROSPECTIVE LOGS"
    },
    kodnest: {
      tag: "EXPERIENCE RETROSPECTIVE // BACKEND NODE",
      title: "Java Full Stack Intern (Kodnest)",
      desc: "Architected RESTful Web APIs and robust server logic infrastructures using Core Java, SQL databases, and spring frameworks. Designed optimized relational SQL query parameters and verified CRUD database integrations, debugging concurrency performance blocks for client applications.",
      tech: ["Java Core", "RESTful Web APIs", "Spring MVC", "SQL Database Core", "CRUD Operations", "Backend Debugging"],
      actionLink: "mailto:vinayaluguru@gmail.com",
      actionText: "RETRIEVE API METADATA"
    },
    globalquest: {
      tag: "EXPERIENCE RETROSPECTIVE // VALIDATION ENGINE",
      title: "Software Testing Intern (Global Quest)",
      desc: "Executed detailed functional, performance validation, and regression testing schedules for enterprise clients. Recorded granular defect logs, collaborated actively with developers inside iterative SDLC sprints, and successfully verified system patch integrity.",
      tech: ["Sanity Testing", "Regression Pipelines", "Defect Logging", "System Debugging", "SDLC Integration", "Collaborative Testing"],
      actionLink: "mailto:vinayaluguru@gmail.com",
      actionText: "DISPATCH LOG AUDITS"
    }
  };

  const skillsData = {
    agents: {
      tag: "INTELLIGENCE MATRIX // SYSTEMS ARCHITECT",
      title: "AI Agents & Workflows",
      desc: "Designed and scaled autonomous agent graphs featuring conditional routers, self-correcting logic, context memory nodes, and functional tool-calling. Experienced in building multi-agent swarms that delegate tasks, evaluate results, and structure reports automatically.",
      tech: ["n8n Graphs", "Multi-Agent Swarms", "Tool Calling APIs", "Context Memory Nodes", "Conditional Branching"]
    },
    prompting: {
      tag: "INTELLIGENCE MATRIX // COGNITIVE ALIGNMENT",
      title: "Prompt Engineering & LLM Eval",
      desc: "Created robust and reproducible Chain-of-Thought (CoT), ReAct, Zero-shot, and Few-shot formatting pipelines. Established automated prompt testing harnesses utilizing custom datasets and grading heuristics to optimize model accuracy and prevent hallucinations.",
      tech: ["Chain-of-Thought", "ReAct Paradigm", "Hallucination Audits", "Fidelity Evaluation", "System Prompts"]
    },
    rag: {
      tag: "INTELLIGENCE MATRIX // INGESTION ENGINE",
      title: "RAG & Structured Outputs",
      desc: "Integrated semantic vector indices, developed sliding-window token chunking algorithms, and created dynamic query rewriting layers. Mastered structured data extractions using function-calling and strict JSON schema adherence rules.",
      tech: ["Vector Embeddings", "Semantic Indexing", "Function Calling APIs", "JSON Schemas", "Pydantic Validation"]
    },
    python: {
      tag: "DEVELOPMENT MATRIX // CORE HUB",
      title: "Python & Backend Systems",
      desc: "Built high-performance backend pipelines, clean data extraction engines, REST APIs, and database adapters using Python core libraries, Java, and SQL databases. Highly competent in debugging complex systems code.",
      tech: ["Python", "Java Core", "SQL Databases", "REST APIs", "Query Optimizations"]
    },
    n8n: {
      tag: "DEVELOPMENT MATRIX // ORCHESTRATION PIPELINE",
      title: "n8n Automation & Pipelines",
      desc: "Engineered visually mapping automations with n8n nodes, configuring complex conditional branching loops, data parsing scripts, cloud webhooks triggers, and robust error-handling pipelines.",
      tech: ["n8n Node Workflows", "API Webhooks", "Trigger Pipelines", "Loops & Data Mapping", "System Error Catching"]
    },
    langchain: {
      tag: "DEVELOPMENT MATRIX // FRAMEWORKS",
      title: "AI Frameworks & Platforms",
      desc: "Utilised foundation platforms including LangChain libraries, Botpress conversation graphs, model provider APIs (OpenAI, Claude, Gemini), and modern environments such as Cursor AI and GitHub Copilot.",
      tech: ["LangChain", "Botpress Graphs", "Model APIs", "Cursor IDE", "AI Dev Tools"]
    }
  };

  const certsData = {
    microsoft: {
      tag: "VERIFIED CREDENTIAL // SECURE AGENTS",
      title: "Applied Agentic AI: Systems Design & Impact",
      desc: "Verified Microsoft Professional credential issued in 2026. Focuses on architecting multi-agent systems, designing loop-correction safeguards, evaluating system safety standards, and auditing autonomous agent societal impact.",
      tech: ["Microsoft Certified", "Systems Architecture", "AI Ethics Matrix", "Autonomous Safeguards"]
    },
    claude: {
      tag: "VERIFIED CREDENTIAL // ANTHROPIC CLI",
      title: "Claude Code in Action",
      desc: "Verified Anthropic credential issued in 2026. Attained deep technical competency using the terminal-based Claude Code developer agent tool for automated testing, debugging pipelines, and git logs management.",
      tech: ["Claude Code", "Anthropic Terminal", "Git Pipelines", "Automated Audits"]
    },
    internals: {
      tag: "VERIFIED CREDENTIAL // LLM MECHANICS",
      title: "MSAGI: LLM Internals & Planning Systems",
      desc: "Verified MSAGI credential issued in 2026. Covers foundation model inner mechanics: multi-head attention systems, token embeddings, decoding architectures, and visual reasoning paths.",
      tech: ["LLM Internals", "Attention Layers", "Decoding Mechanics", "Planning Architectures"]
    },
    multiagent: {
      tag: "VERIFIED CREDENTIAL // SWARM NETWORK",
      title: "MSAGI: Multi-Agent Swarms & Planning",
      desc: "Verified MSAGI credential issued in 2026. Specialization in distributed agent communications, task delegation, consensus algorithms, and multi-agent coordination frameworks.",
      tech: ["Multi-Agent swarms", "Consensus Algorithms", "Task Allocation", "Inter-Agent Channels"]
    },
    english: {
      tag: "VERIFIED CREDENTIAL // LINGUISTIC NODE",
      title: "EF SET C1 English Node",
      desc: "Verified EF SET credential. Certified at C1 Advanced English proficiency. Strong capability in handling technical system documentation, cross-border remote collaborations, and advanced presentations.",
      tech: ["C1 Advanced", "Remote Collaboration", "Technical Writing", "Presentations Hub"]
    },
    fullstack: {
      tag: "VERIFIED CREDENTIAL // DEVELOPMENT SYSTEM",
      title: "Java Full Stack Development Node",
      desc: "Verified Kodnest professional credential. Comprehensive training in relational SQL queries, Java Full Stack pipelines, MVC architectures, and web interface integrations.",
      tech: ["Java Core", "REST API Development", "MVC Web", "SQL Relational"]
    }
  };

  // 8. Multi-Purpose Glassmorphic Modal Controller
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');

  if (modal && modalClose) {
    
    // helper to populate and launch modal
    const populateAndLaunch = (tag, title, desc, imgSrc, tech, actionLink, actionText) => {
      document.getElementById('modal-project-tag').innerText = tag;
      document.getElementById('modal-project-title').innerText = title;
      document.getElementById('modal-project-desc').innerText = desc;
      
      const modalImg = document.getElementById('modal-project-img');
      const imgContainer = modalImg.parentElement;
      
      if (imgSrc) {
        modalImg.src = imgSrc;
        modalImg.alt = title;
        imgContainer.style.display = 'block';
      } else {
        imgContainer.style.display = 'none'; // Hide image area for text-only items (Experience, Skills, Certs)
      }
      
      // Tech tags
      const techContainer = document.getElementById('modal-project-tech');
      techContainer.innerHTML = '';
      tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.innerText = t;
        techContainer.appendChild(span);
      });

      // Actions button
      const modalBtn = document.getElementById('modal-action-link');
      if (actionLink && actionLink !== '#') {
        modalBtn.href = actionLink;
        modalBtn.innerText = actionText || "LAUNCH DEPLOYMENT";
        modalBtn.style.display = 'inline-block';
      } else {
        modalBtn.style.display = 'none';
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    // A. Bind click triggers to standard Project Cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      const titleLink = card.querySelector('.project-title');
      if (titleLink) {
        titleLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openProjectModal(card);
        });
      }
      
      card.addEventListener('click', (e) => {
        if (e.target.closest('a') && !e.target.closest('.project-title')) return;
        openProjectModal(card);
      });
    });

    const openProjectModal = (card) => {
      const tag = card.querySelector('.project-tag').innerText;
      const title = card.querySelector('.project-title').innerText;
      const desc = card.querySelector('.project-desc').innerText;
      const imgSrc = card.querySelector('.project-img')?.src || '';
      const techTagsArray = Array.from(card.querySelectorAll('.tech-tag')).map(t => t.innerText);
      const actionLink = card.querySelector('a.project-title')?.href || '#';

      populateAndLaunch(tag, title, desc, imgSrc, techTagsArray, actionLink, "LAUNCH DEPLOYMENT");
    };

    // B. Bind click triggers to Experience items
    const expItems = document.querySelectorAll('.clickable-experience');
    expItems.forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-exp-id');
        const data = experienceData[id];
        if (data) {
          populateAndLaunch(data.tag, data.title, data.desc, '', data.tech, data.actionLink, data.actionText);
        }
      });
    });

    // C. Bind click triggers to Skills matrix
    const skillItems = document.querySelectorAll('.clickable-skill');
    skillItems.forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-skill-id');
        const data = skillsData[id];
        if (data) {
          populateAndLaunch(data.tag, data.title, data.desc, '', data.tech, '#', '');
        }
      });
    });

    // D. Bind click triggers to Certifications list
    const certItems = document.querySelectorAll('.clickable-cert');
    certItems.forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-cert-id');
        const data = certsData[id];
        if (data) {
          populateAndLaunch(data.tag, data.title, data.desc, '', data.tech, '#', '');
        }
      });
    });

    // Modal dismissal handlers
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }
});
