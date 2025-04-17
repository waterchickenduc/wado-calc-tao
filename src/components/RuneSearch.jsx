import { useState } from 'react';
import axios from 'axios';

export default function RuneSearch() {
  const [query, setQuery] = useState({ name: '', effect: '', stones: [] });
  const [results, setResults] = useState([]);

  const search = async () => {
    const response = await axios.get('http://localhost:5000/api/runes/search', { params: query });
    setResults(response.data);
  };

  return (
    <div className="p-4">
      <input placeholder="Rune name" onChange={e => setQuery({ ...query, name: e.target.value })} />
      <input placeholder="Effect" onChange={e => setQuery({ ...query, effect: e.target.value })} />
      <button onClick={search}>Search</button>

      <ul>
        {results.map((rune, idx) => (
          <li key={idx}>{rune.name} - {rune.effect}</li>
        ))}
      </ul>
    </div>
  );
}
