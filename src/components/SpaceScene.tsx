import { useEffect } from 'react';

export function SpaceScene() {

  useEffect(() => {

    // Parallax scroll effect
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const layers = document.querySelectorAll('.parallax-layer');
      
      layers.forEach((layer, index) => {
        const speed = (index + 1) * 0.1;
        const yPos = -(scrollY * speed);
        (layer as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="parallax-background">
      <div className="parallax-layer layer-1">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
      </div>
      <div className="parallax-layer layer-2">
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>
      <div className="parallax-layer layer-3">
        <div className="floating-shape shape-5"></div>
      </div>
    </div>
  );
}
