import { ReactNode } from 'react';
import ga from './ga-init';

interface GAInitializerProps {
    children: ReactNode;
}

const GAInitializer = ({ children }: GAInitializerProps) => {
    ga.initGoogleAnalytics();

    return <>{children}</>
}

export default GAInitializer;
