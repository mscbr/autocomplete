import { useEffect, useState } from 'react'
import { Character } from '../custom_fetch_types/Character'
import { Service } from '../custom_fetch_types/Service'

// interface for array of fetched items
export interface Characters {
    results: Character[];
}

const useRMCharService = (val: string) => {
    // initial state
    const [result, setResult] = useState<Service<Characters>>({
        status: 'init'
    });

    // fetching when text input value changed
    useEffect(() => {
        if (val) {
            // reseting status before fetch start
            setResult({ status: 'loading' });
            // fetch method is only use for presentational purposes
            fetch(`https://rickandmortyapi.com/api/character/?name=${val}`)
                .then(res => res.json())
                .then(res => setResult({ status: 'loaded', payload: res}))
                .catch(error => setResult({ status: 'error', error }));
        }
    }, [val]);

    return result;
};

export default useRMCharService