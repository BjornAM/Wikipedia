import { useState } from "react";
import "./App.css";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dictionaryResult, setDictionaryResult] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setErrorMessage("Search field must not be empty.");
      setDictionaryResult(null);
    } else {
      setErrorMessage("");
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`)
        .then((response) => {
          if (!response.ok) {
            setErrorMessage("Word not found in dictionary.");
            setDictionaryResult(null);
          }
          return response.json();
        })
        .then((data) => {
          setDictionaryResult(data);
        })
        .catch((error) => {
          setErrorMessage("Error occured during API request.");
        });
    }
  };

  return (
    <div>
      <h1>Dictionary App</h1>
      <input
        type="text"
        placeholder="Search for..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {dictionaryResult && (
        <div>
          {dictionaryResult.map &&
            dictionaryResult.map((item, i) => (
              <div className="result" key={i}>
                <h2>{item.word}</h2>
                <h4>Phonetics</h4>
                {item.phonetics.map((phonetic, x) => (
                  <div className="phonetic" key={x}>
                    {phonetic.text}
                    {phonetic.audio && (
                      <audio data-testid="audio" controls>
                        <source
                          data-testid="audio-source"
                          src={phonetic.audio}
                        />
                      </audio>
                    )}
                  </div>
                ))}

                {item.meanings.map((meaning, x) => (
                  <div className="meaning" key={x}>
                    <h4>Part of speech</h4>
                    <div className="partOfSpeech">{meaning.partOfSpeech}</div>

                    <h4>Definition</h4>
                    {meaning.definitions.map((definition, z) => (
                      <div className="definition" key={z}>
                        {definition.definition}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
