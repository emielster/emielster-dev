import { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';
import './Navigation.css';

interface SubMenuItem {
  label: string;
  href: string;
  description?: string;
}

interface NavLink {
  label: string;
  href: string;
  subMenu?: SubMenuItem[];
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '#hero' },
  { 
    label: 'Projects', 
    href: '#projects',
    subMenu: [
      { label: 'Pulsar', href: '/pulsar', description: 'Roblox Language inspired by C++' },
      { label: 'Neutron', href: '/neutron', description: 'Roblox Terminal' },
      { label: 'All Projects', href: '#projects', description: 'View everything' },
    ]
  },
  { label: 'Games', href: '#games' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState('hero');
  const [activePath, setActivePath] = useState<string[]>(['_em']);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ left: 0 });
  const submenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const projectsButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Determine active section
      const sections = navLinks.flatMap(link => 
        link.subMenu 
          ? link.subMenu.map(sub => sub.href.slice(1))
          : [link.href.slice(1)]
      );
      
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
            updateBreadcrumb(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setOpenSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateBreadcrumb = (section: string) => {
    // Update breadcrumb based on current section
    if (section === 'hero') {
      setActivePath(['_em']);
    } else if (section.startsWith('projects-')) {
      const subcategory = section.replace('projects-', '');
      setActivePath(['_em', subcategory]);
    } else {
      setActivePath(['_em', section]);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    
    if (label === 'Projects' && projectsButtonRef.current) {
      const rect = projectsButtonRef.current.getBoundingClientRect();
      setSubmenuPosition({ left: rect.left + rect.width / 2 });
    }
    
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-pill glass" ref={navRef}>
          <a 
            href="#hero" 
            className="nav-logo" 
            onClick={(e) => handleClick(e, '#hero')}
          >
            <span className="logo-breadcrumb">
              {activePath.map((crumb, index) => (
                <span key={index} className="breadcrumb-item">
                  {index > 0 && <span className="breadcrumb-separator">›</span>}
                  <span className={index === activePath.length - 1 ? 'breadcrumb-active' : ''}>
                    {crumb}
                  </span>
                </span>
              ))}
            </span>
          </a>
          
          <div className="nav-divider" />
          
          <ul className="nav-links">
            {navLinks.map(link => (
              <li 
                key={link.href}
                className={`nav-item ${link.subMenu ? 'has-submenu' : ''}`}
              >
                {link.subMenu ? (
                  <button
                    ref={link.label === 'Projects' ? projectsButtonRef : null}
                    className={`nav-link ${
                      activeSection === link.href.slice(1) || 
                      activeSection.startsWith(link.href.slice(1) + '-') 
                        ? 'active' 
                        : ''
                    } ${openSubmenu === link.label ? 'submenu-open' : ''}`}
                    onClick={(e) => toggleSubmenu(e, link.label)}
                  >
                    {link.label}
                    <svg 
                      className="submenu-arrow" 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none"
                    >
                      <path 
                        d="M3 4.5L6 7.5L9 4.5" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <a
                    href={link.href}
                    className={`nav-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
                    onClick={(e) => handleClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
          
          <div className="nav-divider" />
          
          <ThemeToggle />
        </div>

        {openSubmenu && (
          <div className="submenu-wrapper" style={{ left: `${submenuPosition.left}px` }}>
            <div className="submenu glass" ref={submenuRef}>
              {navLinks.find(link => link.label === openSubmenu)?.subMenu?.map(subItem => (
                <a
                  key={subItem.href}
                  href={subItem.href}
                  className={`submenu-item ${activeSection === subItem.href.slice(1) ? 'active' : ''}`}
                  onClick={(e) => handleClick(e, subItem.href)}
                >
                  <span className="submenu-label">{subItem.label}</span>
                  {subItem.description && (
                    <span className="submenu-description">{subItem.description}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}