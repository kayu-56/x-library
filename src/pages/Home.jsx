import { Link } from 'react-router-dom'
import { Code, GitPullRequest, Shield, BookOpen, Trophy } from 'lucide-react'

function HomePage() {
  const features = [
    {
      icon: <Code size={48} />,
      title: 'AI Enhanced Code Diff Viewer',
      description: 'Intelligent code comparison with AI-powered suggestions and multi-language syntax highlighting',
      link: '/code-diff',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <GitPullRequest size={48} />,
      title: 'PR & Commit Analytics',
      description: 'Comprehensive analysis dashboard with team collaboration metrics and trend visualization',
      link: '/pr-dashboard',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <Shield size={48} />,
      title: 'Code Quality Assessment',
      description: 'Real-time quality metrics, static analysis, and risk alerts for code health monitoring',
      link: '/code-quality',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      icon: <BookOpen size={48} />,
      title: 'Learning Resource Center',
      description: 'Context-aware learning recommendations with personalized paths and knowledge graphs',
      link: '/learning-center',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <Trophy size={48} />,
      title: 'Gamified Skill Development',
      description: 'Track progress, earn achievements, and visualize your coding growth with performance analytics',
      link: '/skill-development',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '2,500+' },
    { label: 'Code Reviews', value: '15,000+' },
    { label: 'Learning Resources', value: '1,200+' },
    { label: 'Achievements Unlocked', value: '8,500+' }
  ]

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Code Collaboration & Learning Platform
          </h1>
          <p className="hero-subtitle">
            Empowering developers with AI-enhanced tools for code review, quality assessment, 
            and continuous learning in a gamified environment
          </p>
          <div className="hero-actions">
            <Link to="/code-diff" className="cta-primary">
              Get Started
            </Link>
            <Link to="/learning-center" className="cta-secondary">
              Explore Resources
            </Link>
          </div>
        </div>
        
        <div className="stats-bar">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Core Platform Features</h2>
          <p>Comprehensive tools for modern development teams</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              to={feature.link}
              className="feature-card"
              style={{ '--hover-gradient': feature.gradient }}
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="feature-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="benefits-section">
        <div className="section-header">
          <h2>Why Choose Our Platform?</h2>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-number">01</div>
            <h3>AI-Powered Insights</h3>
            <p>Leverage artificial intelligence to get instant code improvement suggestions and identify potential issues before they become problems.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-number">02</div>
            <h3>Real-Time Analytics</h3>
            <p>Track team performance, code quality metrics, and development trends with comprehensive dashboards and visualizations.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-number">03</div>
            <h3>Personalized Learning</h3>
            <p>Access curated learning resources matched to your skill level and current projects, with intelligent recommendations.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-number">04</div>
            <h3>Gamification</h3>
            <p>Stay motivated with achievements, skill tracking, and visual progress indicators that make learning and improving fun.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Development Workflow?</h2>
          <p>Join thousands of developers improving their code quality and skills</p>
          <Link to="/code-diff" className="cta-button">
            Start Free Trial
          </Link>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem 3rem;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto 3rem;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 1.5rem 0;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          margin: 0 0 2.5rem 0;
          opacity: 0.95;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-primary {
          padding: 1rem 2.5rem;
          background: white;
          color: #667eea;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.125rem;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .cta-secondary {
          padding: 1rem 2.5rem;
          background: transparent;
          color: white;
          border: 2px solid white;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.125rem;
          text-decoration: none;
          transition: all 0.2s;
        }

        .cta-secondary:hover {
          background: white;
          color: #667eea;
          transform: translateY(-2px);
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          max-width: 1000px;
          margin: 0 auto;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9375rem;
          opacity: 0.9;
        }

        .features-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 5rem 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .section-header p {
          font-size: 1.25rem;
          color: #6b7280;
          margin: 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 2.5rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--hover-gradient);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .feature-card:hover::before {
          opacity: 0.05;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          border-color: transparent;
        }

        .feature-icon {
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          color: #1f2937;
          position: relative;
          z-index: 1;
        }

        .feature-card p {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.6;
          margin: 0 0 1.5rem 0;
          position: relative;
          z-index: 1;
        }

        .feature-arrow {
          font-size: 1.5rem;
          color: #667eea;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }

        .benefits-section {
          background: #f9fafb;
          padding: 5rem 2rem;
        }

        .benefits-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .benefit-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .benefit-number {
          font-size: 3rem;
          font-weight: 800;
          color: #667eea;
          opacity: 0.2;
          margin-bottom: 1rem;
        }

        .benefit-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .benefit-card p {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .cta-section {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: white;
          padding: 5rem 2rem;
          text-align: center;
        }

        .cta-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 0 0 1rem 0;
        }

        .cta-content p {
          font-size: 1.25rem;
          margin: 0 0 2.5rem 0;
          opacity: 0.9;
        }

        .cta-button {
          display: inline-block;
          padding: 1.25rem 3rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.25rem;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .cta-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .stats-bar {
            gap: 1.5rem;
          }

          .stat-value {
            font-size: 2rem;
          }

          .features-grid,
          .benefits-grid {
            grid-template-columns: 1fr;
          }

          .cta-content h2 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  )
}

export default HomePage
