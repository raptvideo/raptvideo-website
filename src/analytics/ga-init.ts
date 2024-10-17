import ReactGA from 'react-ga4';
import generateClientIdGa from './generate-client-id-ga';

export const gaEnvKey = 'REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID';

enum HitTypes {
    PageView = 'pageview',
    Event = 'event',
    Timing = 'timing',
    Exception = 'exception',
}

interface GaEventOptions {
    action: string;
    category: string;
    label?: string;
    value?: number;
    nonInteraction?: boolean;
    transport?: 'beacon' | 'xhr' | 'image';
  }
  
const ga = {
    initGoogleAnalytics() {
        const trackingId = process.env[gaEnvKey];
        if (!trackingId) console.warn("No tracking id is found for Google Analytics")

        ReactGA.initialize([
            {
                trackingId: trackingId || 'G-LJ0PJ80ZT8',
                gaOptions: {
                    anonymizeIp: true,
                    clientId: generateClientIdGa()
                }
            }
        ]);
    },
    setOption(key: string, value: unknown) {
        ReactGA.set({ [key]: value });
    },
    setUserId(userId: string | number) {
        this.setOption('userId', userId);
    },
    sendData(type: HitTypes, data: Object) {
        ReactGA.send({ hitType: type, ...data });
    },
    trackPageView(pageTitle?: string, pagePath?: string) {
        if (!pageTitle) {
            pageTitle = document.title;
        }

        if (!pagePath) {
            pagePath = window.location.href;
        }

        this.sendData(HitTypes.PageView, { page: pagePath, title: pageTitle });
    },
    trackEventBuilder(categoryName: string) {
        return (options: Omit<GaEventOptions, 'category'>) => {
            ReactGA.event({
                category: categoryName,
                action: options.action,
                label: options.label,
                value: options.value,
                nonInteraction: options.nonInteraction,
                transport: options.transport
            });
        };
    }
};

export default ga;
