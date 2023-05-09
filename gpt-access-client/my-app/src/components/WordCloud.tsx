import React, { useState } from "react";
import wordsData from "../data/words.json";
import styles from "../styles/WordCloud.module.css";

interface WordCloudProps {
  selectedWords: string[];
  setSelectedWords: React.Dispatch<React.SetStateAction<string[]>>;
  playTTS: (text: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const WordCloud: React.FC<WordCloudProps> = ({ selectedWords, setSelectedWords, playTTS, handleSubmit }) => {
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
    const minFontSize = 20;
    const maxFontSize = 70;
    return minFontSize + (((frequency - minFrequency) / (maxFrequency - minFrequency)) * (maxFontSize - minFontSize));
  };

//   const color = () => {
//     return '#' + Math.floor(Math.random()*16777215).toString(16);
//   };

  const alphabet = "QWERTYUIOPOASDFGHJKLZXCVBNM".split("");
  const numbers = "12345676890".split("");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: .9, overflow: 'auto', height: "100%"}}>
        {selectedWords.map((val, i) => (
          <button key={i} value={val} onClick={() => handleAddWord(val)} style={{fontSize: "110%", margin: "5px", marginBottom: "10px"}}>
            {val}
          </button>
        ))}
        
          <div>
            <button style = {{backgroundColor: "lightgrey", fontSize: "calc(1vw + 1vh)",  padding: "10px", width: "40vw"}} onClick={() => setSelectedWords([])}>Clear Selected Words</button>
        <button style={{backgroundColor: "green", color:"white", fontSize: "calc(1vw + 1vh)",  padding: "10px", fontWeight:"bolder", width: "40vw"}}onClick={() => playTTS(selectedWords.toString())}>Play Selected Words</button>

          </div>

        <div>
          <button style={{ margin: "1px", padding: "10px", fontSize: "calc(1vw + 1vh)", backgroundColor: "lightgrey", width: "40vw"}} onClick={() => setSelectedLetters([]) }>Clear Selected Letters</button>
          <button style={{ margin: "1px", padding: "10px", fontSize: "calc(1vw + 1vh)", backgroundColor: "firebrick", color: "whitesmoke", width: "20vw"}} onClick={() => setSelectedLetters(selectedLetters.slice(0, -1))}>Backspace</button>
          <button style={{ margin: "1px", padding: "10px", fontSize: "calc(1vw + 1vh)", backgroundColor: "lightskyblue", marginBottom: "calc(2vh)", width: "20vw"}}onClick={handleAddSelectedLetters}>Add Word</button>
         
        </div>
      </div>
      <div style={{ flex: 3, overflow: 'auto' , margin:"1vw"}}>
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
      </div><div>
         {numbers.map((letter) => (
          <>
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            style={{ width: "calc(8vw)", paddingLeft: "calc(.7vw)", paddingRight: "calc(.7vw)", fontSize:"calc(calc(1vw + 1vh)", padding: "calc(.5vh)", borderRadius: "50%", color: "darkred"}}
          >
            {letter}

          </button>
          {letter === "0" && <br></br>}
          </>
        ))}
        {alphabet.map((letter) => (<>
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            style={{ width: "calc(9vw)" ,paddingLeft: "calc(.7vw)", paddingRight: "calc(.7vw)", fontSize: "calc(1vw + 1vh)", padding: "calc(.5vh)", borderRadius: "50%", backgroundColor: "lightyellow"}}
            >
            {letter}
          </button>
          {letter === "P" && <br></br>}
          {letter === "L" && <br></br>}
          {letter === "M" && <br></br>}
            </>
        ))}</div>
        <div></div>
        
         <span style={{ fontSize: "50px", color: "blueviolet"}}>{selectedLetters}</span>
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
             
      </div>
    </div>
  ); }

export default WordCloud;
