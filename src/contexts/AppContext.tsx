import React from 'react';
import { NotificationProps} from '../types';

interface ApplicationProps {
  notification: NotificationProps,
  setNotification: (not: NotificationProps) => void
}

export const AppContext = React.createContext<ApplicationProps>({} as ApplicationProps);
