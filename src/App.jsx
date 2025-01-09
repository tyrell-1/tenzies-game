import { useEffect, useState } from 'react'
// import './tailwind.css'
import { motion } from "motion/react"
import { animate, delay } from 'motion'
import { use } from 'react'

function randomDieNumber() {
  return Math.ceil(Math.random() * 6)
}

function randomList() {
  let returns = []
  for (let i = 0; i < 10; i++) {
    returns.push(randomDieNumber())
  }
  return returns
}

function App() {

  const [dieList, setDieList] = useState(randomList())
  const [selectionList, setSelectionList] = useState(Array(10).fill(false))
  const [goalNumber, setGoalNumber] = useState(0)
  const [rolls, setRolls] = useState(0)
  const [done, setDone] = useState(false)
  const [btnDelay, setBtnDelay] = useState(0.75)

  function rollClick(event) {
    if (!done) {
      setRolls(rolls + 1)
      let currentList = dieList
      for (let i = 0; i < dieList.length; i++) {
        if (!selectionList[i]) {
          currentList[i] = randomDieNumber()
        }
      }
      setDieList([].concat(currentList))
    }
  }

  function reset(event) {
    setRolls(0)
    setDieList(randomList())
    setSelectionList(Array(10).fill(false))
    setDone(false)
    setGoalNumber(0)
  }

  useEffect(() => {
    if (selectionList.every(el => el === true)) {
      console.log("winner!");
      setDone(true)
    }
  }, [selectionList])

  let segments = dieList.map((die, index) =>
  (<Segment
    value={die}
    key={index}
    index={index}
    goalNumber={goalNumber}
    setGoalNumber={setGoalNumber}
    dieList={dieList}
    selectionList={selectionList}
    setSelectionList={setSelectionList} />))

  const buttonAnimationVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { delay: btnDelay } },
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.9 },
  }

  return (
    <main>
      <header>
        <h1>Tenzies</h1>
        {done ? <p className="win">You Won!</p> : <p>Roll until all dice are the same. Click <br /> each die to freeze it at its current value <br /> between rolls.</p>}
      </header>
      <div className="dice" >
        {segments}
      </div>
      <div className="input-section">
        <motion.button
          variants={buttonAnimationVariants}
          whileHover={"whileHover"}
          whileTap={"whileTap"}
          initial={"initial"}
          animate={"animate"}
          onAnimationComplete={() => setBtnDelay(0)}
          className="btn-secondary"
          onClick={reset} > Reset <span class="material-symbols-outlined">replay</span> </motion.button>

        <motion.button
          variants={buttonAnimationVariants}
          whileHover={"whileHover"}
          whileTap={"whileTap"}
          initial={"initial"}
          animate={"animate"}
          onAnimationComplete={() => setBtnDelay(0)}
          className="btn-primary"
          onClick={rollClick}> Roll {rolls ? `(${rolls})` : <span class="material-symbols-outlined">help_center</span>} </motion.button>
      </div>
    </main>
  )
}

function Segment(props) {

  const [delay, setDelay] = useState((Math.floor(Math.random() * 10)) / 20)
  const animationVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: {
      scale: 1, opacity: 1,
      transition: { delay: delay }
    },
    whileTap: { scale: 0.9 },
    whileHover: { scale: 1.1 }
  }

  function selectSelf() {
    props.setSelectionList(prev => {
      const currentList = prev
      currentList[props.index] = true
      return [].concat(currentList)
    })
  }

  function handleClick(event) {
    if (props.goalNumber === 0) {
      props.setGoalNumber(props.value)
      selectSelf()
    } else if (props.goalNumber === props.value) {
      selectSelf()
    }
  }
  return (
    <motion.button
      whileHover={"whileHover"}
      whileTap={"whileTap"}
      initial={"initial"}
      animate={"animate"}
      variants={animationVariants}
      onAnimationComplete={() => setDelay(0)}
      className={props.selectionList[props.index] ? "segment selected" : "segment"}
      onClick={handleClick}> {props.value} </motion.button>
  )
}

export default App
