import React from 'react';
import { useLanguage } from './context/LanguageContext';
import Map from './components/Map';
import DescriptionFetcher from './components/DescriptionFetcher';

function App() {
  const { t } = useLanguage();

  return (
    <div>
      <DescriptionFetcher />
      <Map />
    </div>
  );
}

export default App;
