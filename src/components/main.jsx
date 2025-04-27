import Die from './die';
import { useState, useRef, useEffect } from "react"
import Header from '../components/header'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Logo from '../assets/logo.jpg'

export default function Main(){

    const [dice, setDice] = useState(() => generateAllNewDice())
    const buttonRef = useRef(null)

    const gameWon = dice.every(die => die.isHeld) &&
          dice.every(die => die.value === dice[0].value)

    useEffect(() => {
        if(gameWon){
            buttonRef.current.focus()
        }
    },[gameWon])

    function generateAllNewDice(){
        return new Array(10)
        .fill(0)
        .map(() => ({
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }))
    }

    function rollDice(){
        if(!gameWon){
         setDice(holdDice => holdDice.map(die =>
            die.isHeld ?
            die :
            {...die, value: Math.ceil(Math.random() * 6)}
        ))   
        }else{
            setDice(generateAllNewDice)
        }
        
    }

    function hold(id) {
        setDice(oldDice => oldDice.map(die =>
            die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        ))
    }

    const dieElements = dice.map(dieObj => (
        <Die 
            key={dieObj.id} 
            value={dieObj.value} 
            isHeld={dieObj.isHeld}
            hold={() => hold(dieObj.id)}
        />
    ))

    return (
        <main>
            {gameWon && <Confetti />}
            <div className='header'>
                <img className='logo-image' src={Logo} alt="dice-image" />
                <Header />
            </div>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className='dice-container'>
                {dieElements}
            </div>
            <button ref={buttonRef} className='roll-dice' onClick={rollDice}>
                {gameWon ? "NewGame" : "Role"}
            </button>
            <div aria-live="polite" className='sr-only'>
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
            </div>
        </main>
    )
}