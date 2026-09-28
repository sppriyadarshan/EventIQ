import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { EventIQProvider } from './context/EventIQContext';
import AppRoutes from './routes/AppRoutes';

export const App = () => {
  return (
    <BrowserRouter>
      <EventIQProvider>
        <AppRoutes />
      </EventIQProvider>
    </BrowserRouter>
  );
};

export default App;
