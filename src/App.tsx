import React, { useState, useEffect } from 'react';
import Autocomplete from './autocomplete/Autocomplete'
import useRMCharService from './custom_hooks/useRMCharService'
import './App.css';


const App: React.FC = () => {
  // initial state declarations
  const [suggestions, setSuggestions] = useState(['']);
  const [value, setValue] = useState('');
  
  // custom hook for fetching Rick&Morty API
  // request is re-triggerd when value parameter changes
  const service = useRMCharService(value);

  // handling API request status change
  useEffect(() => {
    if (service.status === 'loading') {
      setSuggestions(['']);
    }
    if(service.status === 'loaded' && service.payload.results) {
      setSuggestions(service.payload.results.map(item => item.name));
    }
    if(service.status === 'error') {
      setSuggestions([]);
    }
  }, [service.status])
  
  return (
    <div className="App">
        <Autocomplete
          value={value}
          label="Autocomplete"
          placeholder=""
          onChange={setValue}
          suggestions={suggestions}
          isLoading={service.status === 'loading'}
          sort={false}
        />
    </div>
  );
}

export default App
