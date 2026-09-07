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
    turing_ai: {
      tag: "EXPERIENCE RETROSPECTIVE // PRODUCTION AI",
      title: "AI Engineer (Turing — Remote)",
      desc: "Owned end-to-end delivery of RAG and multi-agent AI systems, from architecture design through production deployment on AWS. Led integration of multiple LLM providers (OpenAI, Claude, Gemini, Groq) into production workflows, ensuring reliable, context-aware responses at scale. Drove adoption of evaluation practices across projects—tracking retrieval accuracy, groundedness, latency, and hallucination rate to guide iteration. Integrated agentic AI frameworks and automation tools (LangChain, CrewAI, MCP, n8n) to build scalable backend services and automated workflows.",
      tech: ["Python", "FastAPI", "LangChain", "CrewAI", "MCP", "n8n", "OpenAI", "Claude", "Gemini", "Groq", "AWS EC2", "CI/CD"],
      actionLink: "mailto:vinayaluguru@gmail.com",
      actionText: "CONTACT VIA EMAIL"
    },
    turing_s2: {
      tag: "EXPERIENCE RETROSPECTIVE // TRAJECTORY ALIGNMENT",
      title: "LLM S2 Annotator — CUA Specialist (Turing)",
      desc: "Created Computer Use Agent (CUA) trajectories from natural-language instructions to align multi-step agent behavior. Evaluated AI-generated outputs for reasoning quality, factual accuracy, safety compliance, and strict instruction adherence. Performed prompt evaluation, pairwise (SxS) response ranking, and automated hallucination detection across complex outputs. Investigated workflow and execution failures through systematic trace analysis and tool-call validation.",
      tech: ["CUA Trajectories", "SxS Ranking", "Hallucination Detection", "Trace Analysis", "Tool-Call Validation", "Model Alignment"],
      actionLink: "mailto:vinayaluguru@gmail.com",
      actionText: "CONTACT VIA EMAIL"
    },
    turing_agentic: {
      tag: "EXPERIENCE RETROSPECTIVE // MODEL TRAINING",
      title: "LLM Agentic Trainer (Turing)",
      desc: "Trained AI/LLM models using Python, SQL, Git, JSON, and TAU tools across consecutive AI engineering workflows. Designed and developed agentic workflows, JSON-based task structures, and tool-integration setups for multi-step execution. Applied prompt engineering (Zero-shot, Few-shot, Chain-of-Thought, ReAct) and RLHF-based evaluation methodologies to improve model reasoning, trajectory accuracy, and output quality.",
      tech: ["Python", "SQL", "Git", "JSON", "TAU Tools", "Chain-of-Thought", "ReAct Paradigm", "RLHF Evaluation"],
      actionLink: "mailto:vinayaluguru@gmail.com",
      actionText: "CONTACT VIA EMAIL"
    }
  };

  const skillsData = {
    llm_stack: {
      tag: "INTELLIGENCE MATRIX // CORE STACK",
      title: "Core LLM Stack & Backend",
      desc: "Deep hands-on proficiency in building backend microservices with Python and FastAPI. Expert in LangChain pipelines, SQL database design, REST API integrations, and async workflow execution.",
      tech: ["Python", "FastAPI", "LangChain", "SQL", "REST APIs", "Microservices"]
    },
    genai: {
      tag: "INTELLIGENCE MATRIX // GENERATIVE AI",
      title: "Generative AI & Vector Engines",
      desc: "Architecting context-aware AI systems leveraging LLM internals, prompt tuning, embeddings generation, and vector index architectures (ChromaDB, FAISS, Pinecone) for high-performance semantic retrieval.",
      tech: ["LLM Internals", "Prompt Tuning", "Embeddings", "ChromaDB", "FAISS", "Pinecone"]
    },
    agents_rag: {
      tag: "INTELLIGENCE MATRIX // AGENTS & RAG",
      title: "Agent Workflows & RAG",
      desc: "Building production RAG pipelines and multi-agent orchestrations with CrewAI and MCP (Model Context Protocol). Implementing semantic search, tool calling, and automated hallucination detection.",
      tech: ["CrewAI", "MCP Protocol", "RAG", "Semantic Search", "Tool Calling", "Hallucination Detection"]
    },
    frameworks: {
      tag: "DEVELOPMENT MATRIX // FRAMEWORKS & TOOLS",
      title: "AI Frameworks & Ecosystem",
      desc: "Extensive experience across modern AI developer tooling: LangChain, Hugging Face Transformers, CrewAI, MCP, n8n visual flow automation, Cursor AI IDE, Claude Code CLI, and GitHub Copilot.",
      tech: ["LangChain", "Hugging Face", "CrewAI", "MCP", "n8n", "Cursor", "Claude Code", "GitHub Copilot"]
    },
    cloud_devops: {
      tag: "DEVELOPMENT MATRIX // CLOUD & DEVOPS",
      title: "AWS Cloud, Docker & DevOps",
      desc: "Deploying production AI services to AWS EC2 and Docker containers with automated CI/CD pipelines via GitHub Actions. Expertise in containerization, environment isolation, REST API microservices scaling, and Git workflows.",
      tech: ["AWS EC2", "Docker", "Containerization", "Git", "GitHub Actions", "CI/CD Pipelines", "Docker Compose"]
    },
    eval_collab: {
      tag: "DEVELOPMENT MATRIX // EVALUATION",
      title: "Evaluation & Engineering Practices",
      desc: "Rigorously measuring AI quality: retrieval relevance, accuracy, groundedness, latency, and hallucination rate to guide iterative development. Strong technical documentation and cross-functional leadership.",
      tech: ["Retrieval Accuracy", "Groundedness", "Latency Optimization", "SxS Ranking", "Technical Writing"]
    }
  };

  const certsData = {
    microsoft: {
      tag: "VERIFIED CREDENTIAL // MICROSOFT",
      title: "Applied Agentic AI: Systems Design and Impact",
      desc: "Professional certification from Microsoft covering agentic AI systems design, multi-agent orchestration patterns, system safety evaluation, and real-world deployment impact.",
      tech: ["Microsoft Certified", "Agentic AI", "Systems Design", "Safety & Impact"]
    },
    claude: {
      tag: "VERIFIED CREDENTIAL // ANTHROPIC",
      title: "Claude Code in Action",
      desc: "Professional certification from Anthropic demonstrating mastery of Claude Code CLI for autonomous terminal-based coding, test generation, and codebase refactoring.",
      tech: ["Anthropic Certified", "Claude Code CLI", "Autonomous Coding", "Refactoring"]
    },
    internals: {
      tag: "VERIFIED CREDENTIAL // MSAGI",
      title: "MSAGI – LLM Internals and Planning Systems",
      desc: "Advanced certification covering LLM architecture internals, self-attention mechanics, multi-step planning algorithms, and trajectory optimization.",
      tech: ["MSAGI Certified", "LLM Internals", "Planning Systems", "Attention Mechanics"]
    },
    prompt_tech: {
      tag: "VERIFIED CREDENTIAL // MSAGI",
      title: "MSAGI – Generative AI Tech Stack and Prompt Engineering",
      desc: "Certification focusing on production Generative AI stacks, prompt tuning techniques (Zero-shot, Few-shot, CoT, ReAct), and vector database integrations.",
      tech: ["MSAGI Certified", "Prompt Engineering", "GenAI Tech Stack", "Vector Databases"]
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

  // 9. Real Form Handshake Dispatch Handler
  const handshakeForm = document.getElementById('handshake-form');
  const handshakeBtn = document.getElementById('handshake-btn');
  const handshakeStatus = document.getElementById('handshake-status');

  if (handshakeForm && handshakeBtn && handshakeStatus) {
    handshakeForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('client-id').value.trim();
      const email = document.getElementById('client-vector').value.trim();
      const message = document.getElementById('payload').value.trim();

      if (!name || !email || !message) return;

      handshakeBtn.disabled = true;
      handshakeBtn.innerText = 'DISPATCHING PACKET...';
      handshakeStatus.style.display = 'block';
      handshakeStatus.style.borderColor = 'rgba(212,175,55,0.4)';
      handshakeStatus.style.color = 'var(--primary-gold)';
      handshakeStatus.innerHTML = '⚡ [SYSTEM] Transmitting payload to vinayaluguru@gmail.com...';

      try {
        const response = await fetch('https://formsubmit.co/ajax/vinayaluguru@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            _subject: `🤝 Portfolio Handshake Received from ${name}`
          })
        });

        const result = await response.json();

        if (response.ok || result.success === "true") {
          handshakeStatus.style.borderColor = 'rgba(57,255,20,0.4)';
          handshakeStatus.style.color = '#39FF14';
          handshakeStatus.innerHTML = `✅ <strong>HANDSHAKE DISPATCHED SUCCESSFULLY!</strong><br><span style="font-size:0.75rem; color:var(--text-grey-muted);">Your message has been sent to vinayaluguru@gmail.com. We will respond to ${email} shortly.</span>`;
          handshakeForm.reset();
        } else {
          throw new Error('Server returned non-ok status');
        }
      } catch (err) {
        console.warn('Direct API submission error:', err);
        const mailtoUrl = `mailto:vinayaluguru@gmail.com?subject=${encodeURIComponent('Portfolio Handshake from ' + name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;
        window.location.href = mailtoUrl;

        handshakeStatus.style.borderColor = 'rgba(57,255,20,0.4)';
        handshakeStatus.style.color = '#39FF14';
        handshakeStatus.innerHTML = `✅ <strong>EMAIL CLIENT DISPATCHED!</strong><br><span style="font-size:0.75rem; color:var(--text-grey-muted);">Opened email client to send directly to vinayaluguru@gmail.com.</span>`;
      } finally {
        handshakeBtn.disabled = false;
        handshakeBtn.innerText = 'DISPATCH HANDSHAKE';
      }
    });
  }
});
