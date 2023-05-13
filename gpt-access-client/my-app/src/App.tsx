import React, { useState, FormEvent, useEffect } from "react";
import "./App.css";
import axios from "axios";
import WordCloud from "./components/WordCloud";

const App: React.FC = () => {
  const [animal, setAnimal] = useState("");
  const [selectedWords, setSelectedWords] = useState<{ text: string }[]>([])


  const [result, setResult] = useState<Array<string>>([]);

  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setResult([]) // Clear the previous results
		for (let i = 0; i < 3; i++) {
			try {
				const formData = new URLSearchParams()

				// Map selectedWords to an array of strings, then join them
				const selectedWordsString = selectedWords
					.map((wordObj) => wordObj.text)
					.join(' ')
				formData.append('animal', animal + ' ' + selectedWordsString)

				const response = await axios.post(
					'https://gpt-access-server.herokuapp.com/generate-response',
					formData,
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
					}
				)
				setResult((prevResult) => [...prevResult, response.data])
				console.log(response)
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
	}

  const playTTS = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  useEffect(() => {
    if(selectedWords.length > 0) {
    handleSubmit(new Event("submit") as any)}}, [selectedWords])

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h1>Sentence Generator</h1>
      <div style={{ flex: .6, overflow: 'auto' }}>
        {result && (
          <div>
            <p style={{height: ""}}>
              {result.map((item, index) => (
                <div key={index} style={{fontWeight:"bold", fontSize: "calc(1vw + 1vh)", color: "darkolivegreen", marginBottom: ".5vh"}}>
                  {item}
                  <button style={{backgroundColor: "green", color:"white", marginLeft: "10px", width: "20vw", height:
                  "4vh", justifyContent: "center", fontWeight:"bolder"}} onClick={() => playTTS(item)}>Play</button>
                </div>
              ))}
            </p>
          </div>
        )}
        <div>
     </div>
      </div>
      <div style={{ flex: 2, overflow: 'auto' }}>
        {<WordCloud 
          selectedWords = {selectedWords}
          setSelectedWords = {setSelectedWords}
          handleSubmit = {handleSubmit}
          playTTS = {playTTS}
        />}
      </div>
    </div>
    );
  };
export default App;