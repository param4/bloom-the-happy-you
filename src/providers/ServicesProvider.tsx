import { createContext, useContext, type PropsWithChildren } from 'react';

import { getContainer, type AppServices } from '@/services/container';

const ServicesContext = createContext<AppServices | null>(null);

/**
 * Exposes the composition root to the component tree. Components/hooks call
 * useServices() so tests can wrap them with a fake container.
 */
export function ServicesProvider({
  services = getContainer(),
  children,
}: PropsWithChildren<{ services?: AppServices }>) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices(): AppServices {
  const services = useContext(ServicesContext);
  if (!services) throw new Error('useServices must be used inside <ServicesProvider>');
  return services;
}
