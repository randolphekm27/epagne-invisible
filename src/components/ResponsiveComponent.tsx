import React from 'react';
import { useResponsive, DeviceType } from '../hooks/useResponsive';

interface ResponsiveComponentProps {
  mobile: React.ComponentType<any>;
  phablet?: React.ComponentType<any>;
  tablet?: React.ComponentType<any>;
  desktop?: React.ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

export const ResponsiveComponent: React.FC<ResponsiveComponentProps> = ({
  mobile: MobileComponent,
  phablet: PhabletComponent,
  tablet: TabletComponent,
  desktop: DesktopComponent,
  fallback = null,
  ...props
}) => {
  const { deviceType } = useResponsive();
  
  switch(deviceType) {
    case 'mobile':
      return <MobileComponent {...props} />;
    case 'phablet':
      return PhabletComponent 
        ? <PhabletComponent {...props} />
        : <MobileComponent {...props} layout="phablet" />;
    case 'tablet':
      return TabletComponent 
        ? <TabletComponent {...props} />
        : PhabletComponent
          ? <PhabletComponent {...props} layout="tablet" />
          : <MobileComponent {...props} layout="tablet" />;
    case 'desktop':
      return DesktopComponent
        ? <DesktopComponent {...props} />
        : TabletComponent 
          ? <TabletComponent {...props} layout="desktop" />
          : PhabletComponent
            ? <PhabletComponent {...props} layout="desktop" />
            : <MobileComponent {...props} layout="desktop" />;
    default:
      return <>{fallback}</>;
  }
};
