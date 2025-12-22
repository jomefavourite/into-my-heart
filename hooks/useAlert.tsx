import React, { createContext, useContext, useRef } from 'react';
import AlertDialog, {
  AlertDialogRef,
  AlertButton,
} from '@/components/AlertDialog';

interface AlertContextType {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const alertDialogRef = useRef<AlertDialogRef>(null);

  const alert = (title: string, message?: string, buttons?: AlertButton[]) => {
    alertDialogRef.current?.alert(title, message, buttons);
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      <AlertDialog ref={alertDialogRef} />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
