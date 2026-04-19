import { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from './LazyImage';

import bitcoinGif from '../assets/images/bitcoin.gif';
import dashboardGif from '../assets/images/dashboard.gif';
import marketingGif from '../assets/images/marketing.gif';
import javaGif from '../assets/images/java.gif';
import portfolioGif from '../assets/images/portfoliogif.gif';
import sqlGif from '../assets/images/sql.gif';

const Projects = () => {
  useEffect(() => {
    ScrollReveal({ distance: '40px', duration: 900, easing: 'cubic-bezier(0.19,1,0.22,1)', viewFactor: 0.2 })
      .reveal('.project__header', { origin: 'bottom', delay: 100 });
  }, []);

  const [filter, setFilter] = useState('all');

  const projects = [
    {
      id: 1, category: 'data', imgUrl: bitcoinGif,
      title: 'Bitcoin Close Price Predictor',
      details: ['Aims to analyze and predict Bitcoin prices using historical data','Involves data preprocessing and exploratory analysis','Includes machine learning with Linear Regression to predict future Bitcoin prices','Provides actionable insights for investment decision-making'],
      githubUrl: 'https://github.com/Satish-970/Bitcoin-price',
      tag: 'ML / Python', btnText: 'View on GitHub'
    },
    {
      id: 2, category: 'viz', imgUrl: dashboardGif,
      title: 'Data Science Salary Analysis',
      details: ['Analyzes employment data using Tableau','Creates interactive visualizations for dynamic exploration','Explores relationships between salary, job titles, experience levels, company locations, and employment types','Provides insights into global salary trends and employment patterns'],
      githubUrl: 'https://github.com/Satish-970/DataSciencejobsAnalysis',
      tag: 'Tableau', btnText: 'View on GitHub'
    },
    {
      id: 3, category: 'data', imgUrl: sqlGif,
      title: 'Query Based HR Analysis — SQL',
      details: ['Showcases SQL skills through real-world HR data analysis','Focuses on employees, departments, salaries, and job roles','Uses a relational HR database for practical use cases','Demonstrates joins, subqueries, aggregations, and logic-based queries with actionable insights'],
      githubUrl: 'https://github.com/Satish-970/SQL',
      tag: 'SQL', btnText: 'View on GitHub'
    },
    {
      id: 4, category: 'web', imgUrl: javaGif,
      title: 'DevHub — Java Full Stack',
      details: ['Developed a secure backend using Spring Boot and Hibernate/JPA for efficient data persistence with MySQL','Implemented JWT-based Authentication & Authorization (Spring Security) for secure user sessions','Built a responsive React.js frontend with Redux for state management and Axios for API integration','Designed robust RESTful APIs to handle posts, comments, and real-time user interactions'],
      githubUrl: 'https://github.com/Satish-970/DevHub-JavaFullStack',
      tag: 'Java / React', btnText: 'View on GitHub'
    },
    {
      id: 5, category: 'web', imgUrl: portfolioGif,
      title: 'Personal Portfolio',
      details: ['Engineered a high-performance interactive UI using React and Framer Motion for complex animations','Implemented a physics-based Custom Cursor with trailing lag effect and magnetic hover interactions','Developed a smart active navigation system using IntersectionObserver for precise scroll tracking','Optimized performance with lazy-loaded assets and dynamic GIF previews for an engaging UX'],
      githubUrl: 'https://github.com/Satish-970/portfolio',
      tag: 'React / Three.js', btnText: 'View on GitHub'
    },
    {
      id: 6, category: 'marketing', imgUrl: marketingGif,
      title: 'Digital Marketing',
      details: ['Improved online presence through Google Analytics, SEO, and Google Ads','Tracked and optimized site performance using Google Analytics','Researched high-impact keywords via SEMrush and Google Keyword Planner','Conducted SEO audits and resolved issues to boost search rankings','Managed and optimized Google Ads campaigns for better ROI'],
      githubUrl: 'https://docs.google.com/document/d/1uYv0ruzVb0YY0XzTCK4ax1l2G-x90ENx/edit?usp=sharing&ouid=117247420458496169293&rtpof=true&sd=true',
      tag: 'Marketing', btnText: 'View Details'
    }
  ];

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'web', label: 'Web Dev' },
    { key: 'data', label: 'Data Analysis' },
    { key: 'viz', label: 'Data Viz' },
    { key: 'marketing', label: 'Marketing' },
  ];

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <section className="section__container project__container" id="project">
      <div className="project__header">
        <div>
          <div className="section__tag">Portfolio</div>
          <h2 className="section__header">Featured <span>Projects</span></h2>
        </div>
        <div className="project__nav">
          {filters.map(f => (
            <button
              key={f.key}
              className={`btn project__btn ${filter === f.key ? 'mixitup-control-active' : ''}`}
              onClick={() => setFilter(f.key)}
            >{f.label}</button>
          ))}
        </div>
      </div>

      <motion.div layout className="project__grid">
        <AnimatePresence>
          {filtered.map(project => (
            <motion.div
              layout key={project.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.35, ease: [0.19,1,0.22,1] }}
              className={`project__card mix ${project.category}`}
            >
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display:'block', overflow:'hidden' }}>
                <LazyImage src={project.imgUrl} alt={project.title} className="project__image" />
              </a>
              <div className="project__card-body">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.6rem' }}>
                  <h4 style={{ margin:0 }}>{project.title}</h4>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'var(--gold)', background:'rgba(232,184,75,0.1)', border:'1px solid var(--border)', padding:'3px 10px', borderRadius:'100px', whiteSpace:'nowrap', marginLeft:'0.5rem' }}>{project.tag}</span>
                </div>
                <ul>
                  {project.details.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project__link-wrapper">
                  <button className="project__link-btn">
                    <i className="ri-github-fill" style={{ marginRight:'6px' }}></i>{project.btnText}
                  </button>
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Projects;
