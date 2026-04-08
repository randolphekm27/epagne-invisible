import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'phablet' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export type ResponsiveProp<T> = T | Partial<Record<DeviceType, T>>;

export function getResponsiveValue<T>(prop: ResponsiveProp<T> | undefined, deviceType: DeviceType): T | undefined {
  if (prop === undefined) return undefined;
  if (typeof prop === 'object' && prop !== null && !Array.isArray(prop)) {
    const responsiveProp = prop as Partial<Record<DeviceType, T>>;
    return responsiveProp[deviceType] || responsiveProp.mobile;
  }
  return prop as T;
}

export function useResponsive() {
  const [deviceType, setDeviceType] = useState<DeviceType>('mobile');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });

      if (width < 428) setDeviceType('mobile');
      else if (width < 768) setDeviceType('phablet');
      else if (width < 1024) setDeviceType('tablet');
      else setDeviceType('desktop');
      
      setOrientation(height > width ? 'portrait' : 'landscape');
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return { 
    deviceType, 
    orientation, 
    isMobile: deviceType === 'mobile',
    isPhablet: deviceType === 'phablet',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    width: windowSize.width,
    height: windowSize.height
  };
}
