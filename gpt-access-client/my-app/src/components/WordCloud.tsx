import React, { useState } from 'react'
import wordsData from '../data/words.json'
import styles from '../styles/WordCloud.module.css'

interface WordCloudProps {
	selectedWords: { text: string; tag?: string }[]
	setSelectedWords: React.Dispatch<
		React.SetStateAction<{ text: string; tag?: string }[]>
	>
	playTTS: (text: string) => void
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const WordCloud: React.FC<WordCloudProps> = ({
	selectedWords,
	setSelectedWords,
	playTTS,
	handleSubmit,
}) => {
	const [selectedLetters, setSelectedLetters] = useState<string[]>([])
	const [clearLettersOnWordSelect, setClearLettersOnWordSelect] = useState(true)
	const [currentTag, setCurrentTag] = useState<string | undefined>(undefined)
	const [clearTagOnApply, setClearTagOnApply] = useState(true)

  const handleRemoveWord = (val: string) => {
    handleAddWord(val)
		let newWords = selectedWords.filter((wordObj) => wordObj.text !== val)

		if (currentTag) {
			let newVal = `${currentTag}: ${val}`
			newWords = newWords.filter((wordObj) => wordObj.text !== newVal)
		}
    	if (clearTagOnApply) {
				setCurrentTag('')
			}

		// setSelectedWords(newWords)
	}

	const handleAddWord = (val: string) => {
	if (selectedWords.find((wordObj) => wordObj.text === val)) {
    const wordObj = selectedWords.find((wordObj) => wordObj.text === val)
    // if the word object has a tag value that is not undefined and not the current tag, then do not remove it but update the tag
    if (wordObj && wordObj.tag !== currentTag) {
      wordObj.tag = currentTag 
      console.log(wordObj)
      setSelectedWords([
				...selectedWords.filter((wordObj) => wordObj.text !== val), wordObj])
    
    } else {
		setSelectedWords(
			selectedWords.filter((wordObj) => wordObj.text !== val)
		)}
	} else {
		setSelectedWords([...selectedWords, { text: val, tag: currentTag }])
		setSelectedWords([...selectedWords, { text: val, tag: currentTag }])
		if (clearLettersOnWordSelect) {
			setSelectedLetters([])
		}
	

	if (clearTagOnApply) {
		setCurrentTag('')
	}
}
	}

	const handleAddSelectedLetters = () => {
		const selectedWord = selectedLetters.join('').toLowerCase()
		handleAddWord(selectedWord)
		setSelectedLetters([])
	}

	const handleTagClick = (tag: string) => {
    if (currentTag === tag) {
      setCurrentTag('')
		} else {
      setCurrentTag(tag)
		}
	}

// const checkPrefixes = (word: string) => {
// 	for (const tag of tags) {
// 		if (word.startsWith(`${tag}:`)) {
// 			const newWord = word.replace(`${tag}:`, ``)
// 			setSelectedWords(selectedWords.filter((wordObj) => wordObj.text !== word))
// 			console.log(word)
// 			console.log(newWord)
// 			return newWord
// 		}
// 	}
// 	return word
// }

	const handleLetterClick = (letter: string) => {
		setSelectedLetters([...selectedLetters, letter])
	}

	// const handleAddSelectedLetters = () => {
	// 	const selectedWord = selectedLetters.join('').toLowerCase()
	// 	if (!selectedWords.includes(selectedWord)) {
	// 		setSelectedWords([...selectedWords, selectedWord])
	// 	}
	// 	setSelectedLetters([])
	// }

	const visibleWords = wordsData
		.filter(
			(word) =>
				selectedLetters.length === 0 ||
				word.text.startsWith(selectedLetters.join('').toLowerCase())
		)
		.sort((a, b) => b.frequency - a.frequency) // Sort by frequency in descending order
		.slice(0, 100) // Keep only the top 20 words

	const minFrequency = Math.min(...visibleWords.map((word) => word.frequency))
	const maxFrequency = Math.max(...visibleWords.map((word) => word.frequency))

	const computeFontSize = (frequency: number): number => {
		const minFontSize = 20
		const maxFontSize = 70
		return (
			minFontSize +
			((frequency - minFrequency) / (maxFrequency - minFrequency)) *
				(maxFontSize - minFontSize)
		)
	}

	const tags = ['subject', 'object', 'adverb']

	//   const color = () => {
	//     return '#' + Math.floor(Math.random()*16777215).toString(16);
	//   };

	const alphabet = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('')
	const numbers = '12345676890'.split('')

	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<div style={{ flex: 1, overflow: '', height: '100%' }}>
				<div>
					<label>
						<input
							type='checkbox'
							checked={clearLettersOnWordSelect}
							style={{ marginBottom: '1rem' }}
							onChange={() =>
								setClearLettersOnWordSelect(!clearLettersOnWordSelect)
							}
						/>
						Clear letters when a word is chosen
					</label>
					<label>
						<input
							type='checkbox'
							checked={clearTagOnApply}
							onChange={() => setClearTagOnApply(!clearTagOnApply)}
						/>
						Clear tag when applied
					</label>
				</div>
				<div
					style={{ marginTop: 'auto', marginBottom: 'auto', height: '3rem' }}>
					{selectedWords.map((wordObj, i) => (
						<button
							key={i}
							value={wordObj.text}
							onClick={() => handleRemoveWord(wordObj.text)}
							style={{
								fontSize: '1rem',
								alignSelf: 'center',
								marginTop: 'auto',
								marginBottom: 'auto',
								padding: '10px',
							}}>
							{wordObj.tag ? `${wordObj.tag}: ${wordObj.text}` : wordObj.text}
						</button>
					))}
				</div>

				<div>
					<button
						style={{
							backgroundColor: 'wheat',
							fontSize: 'calc(.7vw + 1vh)',
							padding: '10px',
							width: '30%',
							maxHeight: '5%',
						}}
						onClick={() => setSelectedWords([])}>
						Clear Words
					</button>
					<button
						style={{
							backgroundColor: 'green',
							color: 'white',
							fontSize: 'calc(.7vw + 1vh)',
							padding: '10px',
							fontWeight: 'bolder',
							width: '30%',
						}}
						onClick={() => playTTS(selectedWords.toString())}>
						Play Selected Words
					</button>
					<button
						style={{
							margin: '1px',
							padding: '10px',
							fontSize: 'calc(.7vw + 1vh)',
							backgroundColor: 'lightgrey',
							width: '30%',
						}}
						onClick={() => setSelectedLetters([])}>
						Clear Letters
					</button>
				</div>

				<div></div>
			</div>
			<div style={{ flex: 1.5, overflow: '', margin: '1vw' }}>
				<div>
					{tags.map((tag) => (
						<button
							key={tag}
							onClick={() => handleTagClick(tag)}
							style={{
								width: `calc(90vw/${tags.length + 2})`,
								paddingLeft: 'calc(.7vw)',
								paddingRight: 'calc(.7vw)',
								fontSize: 'auto',
								padding: 'calc(1vh)',
								borderRadius: '10%',
								color: currentTag === tag ? 'white' : 'darkred',
								fontWeight: 'bolder',
								backgroundColor: currentTag === tag ? 'grey' : 'white',
							}}>
							{tag}
						</button>
					))}
					<button
						style={{
							margin: '1px',
							width: `calc(90vw/(calc(${tags.length + 2})))`,
							paddingLeft: 'calc(.7vw)',
							padding: 'calc(1vh)',
							borderRadius: '10%',
							fontWeight: 'bolder',
							paddingRight: 'calc(.7vw)',
							fontSize: 'auto',
							backgroundColor: 'indianred',
							color: 'whitesmoke',
						}}
						onClick={() => setSelectedLetters(selectedLetters.slice(0, -1))}>
						Backspace
					</button>
					<button
						style={{
							margin: '1px',
							width: `calc(90vw/(calc(${tags.length + 2})))`,
							padding: 'calc(1vh)',
							borderRadius: '10%',
							fontWeight: 'bolder',
							paddingLeft: 'calc(.7vw)',
							paddingRight: 'calc(.7vw)',
							fontSize: 'auto',
							backgroundColor: 'cornflowerblue',
							marginBottom: 'calc(2vh)',
							color: 'whitesmoke',
						}}
						onClick={handleAddSelectedLetters}>
						Add Word
					</button>
				</div>
				<div>
					{numbers.map((number) => (
						<>
							<button
								key={number}
								onClick={() => handleLetterClick(number)}
								style={{
									width: 'calc(8vw)',
									paddingLeft: 'calc(.7vw)',
									paddingRight: 'calc(.7vw)',
									fontSize: 'calc(1vw + 1vh)',
									padding: 'calc(1vh)',
									borderRadius: '20%',
									color: 'darkgreen',
									fontWeight: 'bolder',
									backgroundColor: 'lightgreen',
								}}>
								{number}
							</button>
							{number === '0' && <br></br>}
						</>
					))}
					{alphabet.map((letter) => (
						<>
							<button
								key={letter}
								onClick={() => handleLetterClick(letter)}
								style={{
									width: 'calc(9vw)',
									paddingLeft: 'calc(.7vw)',
									paddingRight: 'calc(.7vw)',
									fontSize: 'calc(1vw + 1vh)',
									padding: 'calc(1.5vh)',
									borderRadius: '20%',
									backgroundColor: 'lightblue',
									color: 'darkblue',
									height: '120%',
								}}>
								{letter}
							</button>
							{letter === 'P' && <br></br>}
							{letter === 'L' && <br></br>}
							{letter === 'M' && <br></br>}
						</>
					))}
				</div>
				<div></div>
			</div>
			<div style={{ flex: 2, overflow: 'auto', margin: '1vw' }}>
				<div
					onClick={() => handleAddWord(selectedLetters.join('').toLowerCase())}
					className={styles.word}
					style=
					{{
						fontSize: `calc(90vw/12)`,
						// border: `${(computeFontSize(word.frequency)/15)}px solid darkgrey`,
						backgroundColor: 'lightcoral',
						borderRadius: '20%',
						padding: '5px 10px',
						margin: '5px',
            marginTop: 'auto',
						alignContent: 'center',
						color: 'black',
						display: 'inline-block',
						paddingTop: '20px',
						paddingBottom: '20px',
						height: 'auto',
						filter: `drop-shadow(0 90px 90px grey)`,
					}}>
						{selectedLetters}
			
				</div>
				{visibleWords
					.sort((a, b) => a.text.localeCompare(b.text))
					.map((word) => (
						<div
							key={word.id}
							onClick={() => handleAddWord(word.text)}
							className={styles.word}
							style={{
								fontSize: `calc(${computeFontSize(word.frequency)}vw/12)`,
								// border: `${(computeFontSize(word.frequency)/15)}px solid darkgrey`,
								backgroundColor: 'lightgrey',
								borderRadius: '20%',
								padding: '5px 10px',
								margin: '5px',
								alignContent: 'center',
								color: 'black',
								display: 'inline-block',
								paddingTop: '20px',
								paddingBottom: '20px',
								height: 'auto',
								filter: `drop-shadow(0 ${
									computeFontSize(word.frequency) / 3
								}px ${computeFontSize(word.frequency) / 5}px grey)`,
							}}>
							{word.text}
						</div>
					))}
			</div>
		</div>
	)
}

export default WordCloud
