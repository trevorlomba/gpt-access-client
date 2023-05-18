import React, { useState, FormEvent, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import WordCloud from './components/WordCloud'

const App: React.FC = () => {
	const [animal, setAnimal] = useState('')
	const [selectedWords, setSelectedWords] = useState<{ text: string }[]>([])
	const [result, setResult] = useState<Array<string>>([])
	const [fetchCount, setFetchCount] = useState(0)

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setResult([]) // Clear the previous results
		for (let i = 0; i < fetchCount; i++) {
			try {
				const formData = new URLSearchParams()

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
			} catch (error) {
				console.error('Error fetching data:', error)
			}
		}
	}

	const playTTS = (text: string) => {
		const synth = window.speechSynthesis
		const utterance = new SpeechSynthesisUtterance(text)
		synth.speak(utterance)
	}

	useEffect(() => {
		if (selectedWords.length > 0) {
			handleSubmit(new Event('submit') as any)
		}
	}, [selectedWords])

	return (
		<div
			className='App'
			style={{
				display: 'flex',
				flexDirection: 'column',
				height: '100vh',
				margin: '',
			}}>
			<div style={{ position: 'absolute', top: '0', left: 0, margin: '1rem' }}>
				<div style={{ fontSize: '1rem' }}>
					generate <span style={{fontWeight: 
					"bold", fontSize: "150%", color:"forestGreen"}}>x</span> responses
				</div>
				{[0, 1, 2, 3].map((num) => (
					<button
						key={num}
						onClick={() => setFetchCount(num)}
						style={{
							width: '2rem',
							height: '2rem',
							backgroundColor: fetchCount === num ? 'forestGreen' : '',
							color: fetchCount === num ? 'white' : '',
						}}>
						{num}
					</button>
				))}
			</div>
			<div
				style={{
					flex: 1,
					overflow: 'auto',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-around',
					margin: 'auto',
				}}>
				<div style={{ backgroundColor: '' }}>
					{result &&
						result.map((item, index) => (
							<div
								key={index}
								style={{
									fontWeight: 'bold',
									color: 'darkolivegreen',
								}}>
								<button
									style={{
										fontSize: 'calc(1vw + 1vh)',
										backgroundColor: 'green',
										color: 'white',
										marginLeft: '10px',
										width: '80vw',
										height: 'calc(5vh)',
										justifyContent: 'space-between',
										fontWeight: 'bold',
									}}
									onClick={() => playTTS(item)}>
									{item}
								</button>
							</div>
						))}
				</div>
			</div>
			<div style={{ flex: 5, overflow: 'auto' }}>
				{
					<WordCloud
						selectedWords={selectedWords}
						setSelectedWords={setSelectedWords}
						handleSubmit={handleSubmit}
						playTTS={playTTS}
					/>
				}
			</div>
		</div>
	)
}

export default App
