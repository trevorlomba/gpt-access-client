import React, { useState } from "react";
import wordsData from "../data/words.json";
import styles from "../styles/WordCloud.module.css";

interface WordCloudProps {
  selectedWords: string[];
  setSelectedWords: React.Dispatch<React.SetStateAction<string[]>>;
}

const WordCloud: React.FC<WordCloudProps> = ({ selectedWords, setSelectedWords }) => {
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [clearLettersOnWordSelect, setClearLettersOnWordSelect] = useState(true);

  const handleAddWord = (val: string) => {
    console.log(val);
    if (selectedWords.includes(val)) {
      setSelectedWords(selectedWords.filter((word) => word !== val));
    } else {
      setSelectedWords([...selectedWords, val]);
      if (clearLettersOnWordSelect) {
        setSelectedLetters([]);
      }
    }
  };

  const handleLetterClick = (letter: string) => {
    
      setSelectedLetters([...selectedLetters, letter]);
    
  };

    const handleAddSelectedLetters = () => {
    const selectedWord = selectedLetters.join('').toLowerCase();
    if (!selectedWords.includes(selectedWord)) {
      setSelectedWords([...selectedWords, selectedWord]);
    }
    setSelectedLetters([]);
  };

  const visibleWords = wordsData
  .filter((word) =>
    selectedLetters.length === 0 || word.text.startsWith(selectedLetters.join("").toLowerCase())
  )
  .sort((a, b) => b.frequency - a.frequency) // Sort by frequency in descending order
  .slice(0, 100); // Keep only the top 20 words


  const minFrequency = Math.min(...visibleWords.map((word) => word.frequency));
  const maxFrequency = Math.max(...visibleWords.map((word) => word.frequency));

  const computeFontSize = (frequency: number): number => {
    const minFontSize = 12;
    const maxFontSize = 50;
    return minFontSize + (((frequency - minFrequency) / (maxFrequency - minFrequency)) * (maxFontSize - minFontSize));
  };

//   const color = () => {
//     return '#' + Math.floor(Math.random()*16777215).toString(16);
//   };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const numbers = "12345676890".split("");

  return (
    <div>
      <div style={{minHeight: "100px", maxHeight: "100px"}}>
        {selectedWords.map((val, i) => (
          <button key={i} value={val} onClick={() => handleAddWord(val)}style={{fontSize: "20px",
          margin: "5px",
          marginBottom: "20px"}}>
            {val}
          </button>
        ))}
        {selectedWords.length > 0 && (
        <div>
        <button style = {{backgroundColor: "lightgrey", fontSize:"20px"}} onClick={() => setSelectedWords([])}>Clear Selected Words</button>
      </div>)}</div>

      <div>
          <div>
          <button style={{ margin: "1px", padding: "10px", fontSize: "20px", backgroundColor: "firebrick", color: "whitesmoke"}} onClick={() => setSelectedLetters(selectedLetters.slice(0, -1))}>Backspace</button>
          <button style={{ margin: "1px", padding: "10px", fontSize: "20px", backgroundColor: "lightgrey"}} onClick={() => setSelectedLetters([]) }>Clear Selected Letters</button>
          <button style={{ margin: "1px", padding: "10px", fontSize: "20px", backgroundColor: "lightskyblue", marginBottom: "20px"}}onClick={handleAddSelectedLetters}>Add Word</button>
          <div>
        <label>
          <input
            type="checkbox"
            checked={clearLettersOnWordSelect}
            style={{marginBottom: "20px"}}
            onChange={() => setClearLettersOnWordSelect(!clearLettersOnWordSelect)}
          />
          Clear selected letters when a new word is chosen
        </label>
      </div>
        </div></div>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            style={{ marginLeft: "calc(1vw)",paddingLeft: "calc(.7vw)", paddingRight: "calc(.7vw)", fontSize: "calc(3.5vw)", borderRadius: "50%",}}
          >
            {letter}
          </button>
        ))}
        {numbers.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            style={{ marginLeft: "calc(1vw)", paddingLeft: "calc(.7vw)", paddingRight: "calc(.7vw)", fontSize: "calc(3.5vw)", borderRadius: "50%", color: "darkred"}}
          >
            {letter}
          </button>
        ))}

  
        <div style={{margin: "20px", fontSize: "50px", color: "blueviolet", minHeight:"50px"}}>{selectedLetters}</div>

<div className={styles.wordCloud} style={{ margin: "auto", display: "flex", textAlign: "center" }}>
  {visibleWords
    .sort((a, b) => a.text.localeCompare(b.text))
    .map((word) => (
      <div
        key={word.id}
        onClick={() => handleAddWord(word.text)}
        className={styles.word}
        style={{
          fontSize: `${computeFontSize(word.frequency)}px`,
          backgroundColor: "lightgrey",
          borderRadius: "50%",
          padding: "5px 10px",
          margin: "5px",
          alignContent: "center",
          color: "black",
          display: "inline-block",
          paddingTop: "20px",
          paddingBottom: "20px"
        }}
      >
        {word.text}
      </div>
    ))}
</div>   </div>
  );
};

export default WordCloud;
