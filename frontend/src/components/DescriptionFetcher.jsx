import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const DescriptionFetcher = () => {
   const { t } = useLanguage();
   const [town, setTown] = useState('');
   const [lang, setLang] = useState('en');
   const [description, setDescription] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');

   const fetchDescription = async () => {
      setLoading(true);
      setError('');
      try {
         const res = await fetch(
            `/api/location?name=${encodeURIComponent(town)}&lang=${lang}`
         );
         if (!res.ok) throw new Error(`Server responded with ${res.status}`);
         const data = await res.json();
         setDescription(data.description);
      } catch (err) {
         setError('Failed to fetch description.');
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="description-fetcher" style={{ padding: '2rem' }}>
         <h2>Explore a French Town</h2>
         <input
            type="text"
            value={town}
            onChange={(e) => setTown(e.target.value)}
            placeholder={t('searchPlaceholder')}
            style={{ padding: '0.5rem', width: '250px', marginRight: '1rem' }}
         />
         <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="fr">Français</option>
         </select>
         <button onClick={fetchDescription} style={{ marginLeft: '1rem' }}>
            {t('searchButton')}
         </button>
         {loading && <p>Loading...</p>}
         {error && <p style={{ color: 'red' }}>{t('errorFetch')}</p>}
         {description && (
            <div style={{ marginTop: '1rem', background: '#f4f4f4', padding: '1rem' }}>
               <strong>Description:</strong>
               <p>{description}</p>
            </div>
         )}
      </div>
   );
};

export default DescriptionFetcher;
