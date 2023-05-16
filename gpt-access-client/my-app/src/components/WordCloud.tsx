import React, { useState } from 'react'
import wordsData from '../data/words2.json'
import namesData from '../data/names.json'
import styles from '../styles/WordCloud.module.css'
import { FaExchangeAlt } from 'react-icons/fa'

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
	const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
	const [selectedSwapPosition, setSelectedSwapPosition] = useState<
		number | null
	>(null)
	const [category, setCategory] = React.useState(true)

	const handleRemoveWord = (val: string) => {
		//  if selected position is null,
		handleAddWord(val)
		// let newWords = selectedWords.filter((wordObj) => wordObj.text !== val)

		// if (currentTag) {
		// 	let newVal = `${currentTag}: ${val}`
		// 	newWords = newWords.filter((wordObj) => wordObj.text !== newVal)
		// }
		// if (clearTagOnApply) {
		// 		setCurrentTag('')
		// 	}

		// // setSelectedWords(newWords)
	}

	const handleSwap = (val: string) => {
		console.log('swapping')
		if (selectedSwapPosition !== null) {
			let newWords = [...selectedWords]
			const currentIndex = newWords.findIndex((wordObj) => wordObj.text === val)
			if (currentIndex !== -1) {
				let temp = newWords[currentIndex]
				newWords[currentIndex] = newWords[selectedSwapPosition]
				newWords[selectedSwapPosition] = temp
				setSelectedWords(newWords)
				setSelectedPosition(null)
				setSelectedSwapPosition(null)
			} else {
				console.log('else')
				newWords[selectedSwapPosition] = { text: val, tag: currentTag }
				setSelectedWords(newWords)
				setSelectedPosition(null)
				setSelectedSwapPosition(null)
			}
		}
	}

	const handleAddWord = (val: string) => {
		// Find the index of the wordObj in selectedWords
		const index = selectedWords.findIndex((wordObj) => wordObj.text === val)

		// If a position is selected for swapping
		if (selectedSwapPosition !== null) {
			handleSwap(val)

			if (clearLettersOnWordSelect) {
				setSelectedLetters([])
			}

			if (clearTagOnApply) {
				console.log('clearTag')
				setCurrentTag('')
			}

			// Reset selected position after word is added
			setSelectedPosition(null)
			return
		}

		// If the wordObj is found in selectedWords
		if (index !== -1) {
			const wordObj = selectedWords[index]

			// If the word object has a tag value that is not undefined and not the current tag, then do not remove it but update the tag
			if (wordObj.tag !== currentTag) {
				wordObj.tag = currentTag
				console.log(wordObj)

				// Map over the selectedWords and replace the wordObj at the specific index
				setSelectedWords(
					selectedWords.map((word, i) => (i === index ? wordObj : word))
				)
			} else if (wordObj.tag !== '') {
				wordObj.tag = ''
				console.log(wordObj)
				setSelectedWords(
					selectedWords.map((word, i) => (i === index ? wordObj : word))
				)
			} else if (selectedPosition !== null) {
				// Find current position of word
				const currentPosition = selectedWords.findIndex(
					(word) => word.text === val
				)

				// Copy the words array
				const newWords = [...selectedWords]

				// Remove word at current position
				if (currentPosition !== -1) {
					newWords.splice(currentPosition, 1)
				}

				// Insert word at selected position
				newWords.splice(selectedPosition, 0, { text: val, tag: currentTag })

				setSelectedWords(newWords)
			} else {
				setSelectedWords(
					selectedWords.filter((wordObj) => wordObj.text !== val)
				)
			}
		} else {
			// If no selected position, append word at the end
			if (selectedPosition === null) {
				setSelectedWords([...selectedWords, { text: val, tag: currentTag }])
			} else {
				// Insert word at selected position
				const newWords = [...selectedWords]
				newWords.splice(selectedPosition, 0, { text: val, tag: currentTag })
				setSelectedWords(newWords)
			}
		}

		if (clearLettersOnWordSelect) {
			setSelectedLetters([])
		}

		if (clearTagOnApply) {
			console.log('clearTag')
			setCurrentTag('')
		}

		// Reset selected position after word is added
		setSelectedPosition(null)
	}

	const handleAddSelectedLetters = () => {
		const selectedWord = selectedLetters.join('').toLowerCase()
		handleAddWord(selectedWord)
		setSelectedLetters([])
	}

	const handleCategoryToggle = () => {
		setCategory(!category)
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
	console.log('wordsData:', wordsData)

	const availableWords = category ? wordsData : namesData

	const visibleWords = availableWords
		.filter((word) => {
			const condition =
				selectedLetters.length === 0 ||
				word.text
					.toLowerCase()
					.startsWith(selectedLetters.join('').toLowerCase())
			return condition
		})
		.filter((word) => {
			const condition = !selectedWords.some(
				(selectedWord) => selectedWord.text === word.text
			)
			return condition
		}) // filter out already selected words
		.sort((a, b) => b.frequency - a.frequency) // Sort by frequency in descending order
		.slice(0, 30) // Keep only the top 30 words

	console.log('Visible words:', visibleWords)

	const minFrequency = Math.min(...visibleWords.map((word) => word.frequency))
	const maxFrequency = Math.max(...visibleWords.map((word) => word.frequency))

	console.log('Min frequency:', minFrequency)
	console.log('Max frequency:', maxFrequency)

	const computeFontSize = (frequency: number): number => {
		const minFontSize = 25
		const maxFontSize = 45
		return (
			minFontSize +
			((frequency - minFrequency) / (maxFrequency - minFrequency)) *
				(maxFontSize - minFontSize + 2)
		)
	}

	console.log(
		'Computed font size for each visible word:',
		visibleWords.map((word) => ({
			word: word.text,
			fontSize: computeFontSize(word.frequency),
		}))
	)

	const tags = ['subject', 'object', 'adverb']

	//   const color = () => {
	//     return '#' + Math.floor(Math.random()*16777215).toString(16);
	//   };

	const alphabet = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('')
	const numbers = '1234567890'.split('')
	const pronouns = [
		'I/me',
		'you',
		'he',
		'she',
		'we',
		'they',
		'it',
		'my',
		'your',
		'his',
		'her',
		'our',
		'their',
		'its',
	]

	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<div style={{ flex: 0.5, overflow: '', height: '100%' }}>
				<div>
					<div
						style={{
							marginTop: '.5rem',
							marginBottom: '1rem',
							height: '7vh',
							overflowX: 'auto',
						}}>
						{selectedWords.map((wordObj, i) => (
							<span
								style={{
									borderBottom:
										i === selectedPosition || i === selectedSwapPosition
											? '.5vw solid dodgerblue'
											: '',
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
								<button
									style={{
										alignSelf: 'center',
										marginTop: 'auto',
										marginBottom: 'auto',
										padding: '10px 10px 10px 10px',
										backgroundColor:
											selectedPosition === i ? 'dodgerblue' : 'white',
										color: selectedPosition === i ? 'white' : 'forestgreen',
										fontWeight: 'bold',
										fontSize: '2vh',
										opacity: selectedPosition === i ? '100%' : '750%',
										borderTop: '2px solid grey',
										borderBottom: '2px solid grey',
										borderLeft: '1px solid grey',
									}}
									onClick={() => {
										if (selectedPosition !== i) {
											setSelectedSwapPosition(null)
											setSelectedPosition(i)
										} else if (selectedLetters.length > 0) {
											handleAddWord(selectedLetters.join('').toLowerCase())
										} else {
											setSelectedPosition(null)
										}
									}}>
									...
								</button>
								<button
									onClick={() => {
										if (selectedSwapPosition !== i) {
											setSelectedPosition(null)
											setSelectedSwapPosition(i)
										} else if (selectedLetters.length > 0) {
											handleAddWord(selectedLetters.join('').toLowerCase())
										} else {
											setSelectedSwapPosition(null)
										}
									}}
									style={{
										// display: 'block',
										alignSelf: 'center',
										marginTop: 'auto',
										marginBottom: 'auto',
										padding: '10px 10px 10px 10px',
										fontSize: '2vh',
										color: 'white',
										fontWeight: 'bold',
										backgroundColor:
											selectedSwapPosition === i
												? 'dodgerblue'
												: 'darkslategray',
										opacity: selectedPosition === i ? '100%' : '75%',
										borderTop: '2px solid grey',
										borderBottom: '2px solid grey',
										borderLeft: '1px solid grey',
									}}>
									<FaExchangeAlt />
								</button>
								<button
									key={i}
									value={wordObj.text}
									onClick={() => handleAddWord(wordObj.text)}
									style={{
										fontSize: '2vh',
										alignSelf: 'center',
										marginTop: 'auto',
										marginBottom: 'auto',
										padding: '10px',
										backgroundColor: 'lightgray',
										color: 'darkgreen',
										fontWeight: 'bolder',
										borderTop: '2px solid grey',
										borderBottom: '2px solid black',
										borderRight: '1px solid grey',
									}}>
									{wordObj.tag
										? `${wordObj.tag}: ${wordObj.text}`
										: wordObj.text}
								</button>
							</span>
						))}
					</div>
				</div>

				<div>
					<button
						style={{
							margin: '1px',
							padding: '10px',
							fontSize: '1rem',
							backgroundColor: 'lightyellow',
							color: 'darkyellow',
							width: '30%',
							fontWeight: 'bolder',
						}}
						onClick={() => setSelectedLetters([])}>
						Clear Letters
					</button>
					<button
						style={{
							backgroundColor: 'wheat',
							fontSize: '1rem',
							padding: '10px',
							color: 'darkyellow',
							width: '30%',
							// maxHeight: '5%',
							fontWeight: 'bolder',
						}}
						onClick={() => setSelectedWords([])}>
						Clear Words
					</button>
					<button
						style={{
							backgroundColor: 'green',
							color: 'white',
							fontSize: '1rem',
							padding: '10px',
							fontWeight: 'bolder',
							width: '30%',
						}}
						onClick={() => {
							const words = selectedWords.map((word) => word.text).join(' ')
							playTTS(words)
						}}>
						Play Words
					</button>
				</div>

				<div></div>
			</div>
			<div style={{ flex: 1, overflow: '', margin: '' }}>
				<div></div>
				<div
					style={{
						backgroundColor: '',
						paddingTop: '1vh',
						paddingBottom: '1vh',
					}}>
					{numbers.map((number) => (
						<>
							<button
								key={number}
								onClick={() => handleLetterClick(number)}
								style={{
									width: 'calc(8.5vw)',
									// paddingLeft: 'calc(.7vw)',
									// paddingRight: 'calc(.7vw)',
									fontSize: 'calc(1.3rem)',
									padding: 'calc(1vh)',
									borderRadius: '20%',
									color: 'darkblue',
									// fontWeight: 'bolder',
									backgroundColor: 'lightpink',
								}}>
								{number}
							</button>
							{/* {number === '0' && <br></br>} */}
						</>
					))}
					<button
						style={{
							width: 'calc(8.5vw)',
							// paddingLeft: 'calc(0vw)',
							// // textAlign: "center",
							// paddingRight: 'calc(0vw)',
							fontSize: 'calc(1.3rem)',
							minHeight: 'calc(1vw + 1vh)',
							// lineHeight: "calc(1vw + 1vh)",
							padding: 'calc(1vh)',
							alignSelf: 'center',
							borderRadius: '20%',
							color: 'white',
							fontWeight: 'bolder',
							backgroundColor: 'firebrick',
						}}
						onClick={() => setSelectedLetters(selectedLetters.slice(0, -1))}>
						DEL
					</button>
					<br></br>
					{alphabet.map((letter) => (
						<>
							<button
								key={letter}
								onClick={() => handleLetterClick(letter)}
								style={{
									width: 'calc(9vw)',
									// paddingLeft: 'calc(.7vw)',
									// paddingRight: 'calc(.7vw)',
									fontSize: 'calc(1.3rem)',
									padding: 'calc(1.5vh)',
									borderRadius: '20%',
									backgroundColor: 'lightblue',
									color: 'darkblue',
									fontWeight: 'bolder',
								}}>
								{letter}
							</button>
							{letter === 'P' && (
								<>
									<br></br>
								</>
							)}
							{letter === 'L' && (
								<>
									<button
										onClick={() => handleAddWord('!')}
										style={{
											width: 'calc(9vw)',
											// paddingLeft: 'calc(.7vw)',
											// paddingRight: 'calc(.7vw)',
											fontSize: 'calc(1.3rem)',
											padding: 'calc(1.5vh)',
											borderRadius: '20%',
											backgroundColor: 'pink',
											color: 'darkblue',
											height: '120%',
											justifySelf: 'end',
										}}>
										{'!'}
									</button>
									<br></br>
								</>
							)}
						</>
					))}
					<button
						onClick={() => handleAddWord('?')}
						style={{
							width: 'calc(9vw)',
							paddingLeft: 'calc(.7vw)',
							paddingRight: 'calc(.7vw)',
							fontSize: 'calc(1.3rem)',
							padding: 'calc(1.5vh)',
							borderRadius: '20%',
							backgroundColor: 'pink',
							color: 'darkblue',
							height: '120%',
						}}>
						{'?'}
					</button>

					<br></br>
					<button
						onClick={handleCategoryToggle}
						style={{
							width: 'calc(12vw)',
							fontSize: 'calc(1rem)',
							padding: 'calc(1.5vh)',
							borderRadius: '20%',
							backgroundColor: category ? 'lightgrey' : 'lightgrey', // Changes color based on category state
							color: 'darkgreen',
							position: 'absolute',
							left: '1vw',
							transform: 'translateY(-1.3rem)',
							// bottom: "1vh",
							fontWeight: 'bolder',
						}}>
						{category ? 'Names' : 'Words'}
					</button>
					<button
						onClick={() =>
							selectedLetters.length > 0
								? handleAddWord(selectedLetters.join('').toLowerCase())
								: ''
						}
						style={{
							width: 'calc(12vw)',
							fontSize: 'calc(1rem)',
							padding: 'calc(1.5vh)',
							borderRadius: '20%',
							backgroundColor: 'green',
							// Changes color based on category state
							color: 'white',
							position: 'absolute',
							right: '1vw',
							transform: 'translateY(-1.3rem)',
							// bottom: "1vh",
							fontWeight: 'bolder',
						}}>
						Add Word
					</button>
					{/* <br></br>
					{tags.map((tag) => (
						<button
							key={tag}
							onClick={() => handleTagClick(tag)}
							style={{
								width: `calc(85vw/${tags.length + 1})`,
								paddingLeft: 'calc(.7vw)',
								paddingRight: 'calc(.7vw)',
								fontSize: '110%',
								padding: 'calc(1vh)',
								marginBottom: '.5rem',
								borderRadius: '10%',
								color: currentTag === tag ? 'darkred' : 'darkred',
								fontWeight: '',
								backgroundColor: currentTag === tag ? 'pink' : 'lightgrey',
							}}>
							{tag}
						</button>
					))}{' '}
					<button
						style={{
							margin: '1px',
							width: `calc(85vw/(calc(${tags.length + 1})))`,
							padding: 'calc(1vh)',
							borderRadius: '10%',
							fontWeight: 'bolder',
							paddingLeft: 'calc(.7vw)',
							paddingRight: 'calc(.7vw)',
							fontSize: '110%',
							backgroundColor: 'cornflowerblue',
							color: 'whitesmoke',
						}}
						onClick={handleAddSelectedLetters}>
						Add Word
					</button> */}
				</div>
				<div></div>
				<div style={{ margin: '.5rem' }}>
					<label style={{ margin: '1rem' }}>
						<input
							type='checkbox'
							checked={clearLettersOnWordSelect}
							onChange={() =>
								setClearLettersOnWordSelect(!clearLettersOnWordSelect)
							}
						/>
						Clear letters when a word is chosen
					</label>
					<label style={{ margin: '1rem' }}>
						<input
							type='checkbox'
							checked={clearTagOnApply}
							onChange={() => setClearTagOnApply(!clearTagOnApply)}
						/>
						Clear tag when applied
					</label>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-evenly',
					flex: 2,
					overflow: 'auto',
					margin: 'auto',
					background: 'lightgreen',
					borderRadius: '4%',
					borderTop: '3px solid darkgreen',
				}}>
				<div
					style={{
						filter: `drop-shadow(0 5px 3px forestgreen)`,
						justifyContent: 'flex-end',
					}}>
					{pronouns.map((letter, i) => (
						<>
							<button
								key={letter}
								onClick={() => handleAddWord(letter)}
								style={{
									width: `calc(95vw/${pronouns.length / 2})`,
									paddingLeft: 'calc(.7vw)',
									paddingRight: 'calc(.7vw)',

									fontSize: 'calc(.8vw + .8vh)',
									fontWeight: 'bold',
									padding: 'calc(.8vh)',
									marginTop: i < 6 ? '1rem' : '0rem',
									borderRadius: i < 6 ? '10% 10% 0% 0%' : '0 0 10% 10%',
									backgroundColor: i > 6 ? 'lightgrey' : 'white',
									color: 'black',
									// height: '100%',
								}}>
								{letter}
							</button>
						</>
					))}
				</div>
				<br></br>
				<div>
					<div style={{ marginBottom: '1vh' }}>
						<div
							onClick={() =>
								handleAddWord(selectedLetters.join('').toLowerCase())
							}
							className={styles.word}
							style={{
								fontSize: `2rem`,
								// border: `${(computeFontSize(word.frequency)/15)}px solid darkgrey`,
								backgroundColor: 'lightcoral',
								borderRadius: '20%',
								padding: '5px 10px',
								margin: '5px',
								marginTop: 'auto',
								alignContent: 'center',
								color: 'black',
								display: 'inline-block',
								// paddingBottom: '20px',
								height: 'auto',
								filter: `drop-shadow(0 10px 4px forestgreen)`,
								border: '1.5px solid firebrick',
							}}>
							{selectedLetters.join('').toLowerCase()}
						</div>
						{visibleWords
							.sort((a, b) => a.text.localeCompare(b.text))
							.map((word) => (
								<div
									key={word.id}
									onClick={() => handleAddWord(word.text)}
									className={styles.word}
									style={{
										fontSize: `calc(calc(${computeFontSize(
											word.frequency
										)}vh + (${computeFontSize(word.frequency)}vw))/30)`,
										// border: `${(computeFontSize(word.frequency)/15)}px solid darkgrey`,
										backgroundColor: 'lightgrey',
										borderRadius: '20%',
										padding: '1vh 1vw',
										margin: '.8vh',
										alignContent: 'center',
										color: 'black',
										display: 'inline-block',
										// paddingTop: '20px',
										// paddingBottom: '20px',
										height: 'auto',
										filter: `drop-shadow(0 ${
											computeFontSize(word.frequency) / 3
										}px ${computeFontSize(word.frequency) / 9}px forestgreen)`,
										// marginTop: `-${
										// 	computeFontSize(word.frequency)
										// /10}px`
										// , marginBottom: "10px"
										opacity: computeFontSize(word.frequency) / 18,
										border:
											computeFontSize(word.frequency) > 30
												? `${
														computeFontSize(word.frequency) / 25
												  }px groove darkgreen`
												: '',
									}}>
									{word.text}
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default WordCloud
