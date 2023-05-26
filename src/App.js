import { useEffect, useRef, useState } from 'react';
import { generate } from './utils/words';
import './App.css';

function App() {
  const [words, setWords] = useState([]);
  const [seconds, setSeconds] = useState(60);
  const [timer, setTimer] = useState(seconds);
  const [currInput, setCurrInput] = useState('');
  const [currWordIdx, setCurrWordIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState('waiting');
  const inputText = useRef(null);
  const [currCharIdx, setCurrCharIdx] = useState(-1);
  const [currChar, setCurrChar] = useState('');
  const [keyCount, setKeyCount] = useState(0);

  useEffect(() => {
    setWords(generate());
    // if (words) console.log(words);
  }, []);

  // This hook is used to focus the input field whenever state changes.
  useEffect(() => {
    if (status === 'started') inputText.current.focus();
  }, [status]);

  useEffect(() => {
    setTimer(seconds);
  }, [seconds]);

  const start = () => {
    if (status !== 'started') {
      setStatus('started');
      let interval = setInterval(() => {
        setTimer((countDown) => {
          if (countDown === 0) {
            clearInterval(interval);
            setStatus('finished');
            return seconds;
          } else {
            return countDown - 1;
          }
        });
      }, 1000);
    }

    if (status === 'finished') {
      setWords(generate());
      setCurrWordIdx(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrInput('');
      setCurrCharIdx(-1);
      setCurrChar('');
      setKeyCount(0);
    }
  };

  const handleKeyDown = ({ keyCode, key }) => {
    // When Space bar hit, we'll check for the word.
    if (keyCode === 32) {
      isWordMatches();
      setCurrInput('');
      setCurrWordIdx(currWordIdx + 1);
      setCurrCharIdx(-1);
    } else if (keyCode === 8) {
      setCurrCharIdx(currCharIdx - 1);
      setCurrChar('');
    } else {
      setKeyCount((prevCount) => prevCount + 1);
      setCurrCharIdx(currCharIdx + 1);
      setCurrChar(key);
    }
  };

  const isWordMatches = () => {
    const wordTobeMatched = words[currWordIdx];
    // console.log(wordTobeMatched, currInput);
    const isEqual = wordTobeMatched === currInput.trim();
    // console.log(isEqual);
    if (isEqual) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  };

  const getChar = (wordIdx, charIdx, char) => {
    if (
      wordIdx === currWordIdx &&
      charIdx === currCharIdx &&
      currChar &&
      status !== 'finished'
    ) {
      if (char === currChar) {
        return 'has-background-success';
      } else {
        return 'has-background-danger';
      }
    } else if (
      wordIdx === currWordIdx &&
      currCharIdx >= words[currWordIdx].length
    ) {
      return 'has-background-danger';
    } else {
      return '';
    }
  };

  const switchTimer = () => {
    setCorrect(0);
    if (seconds === 60) setSeconds(120);
    else if (seconds === 120) setSeconds(30);
    else setSeconds(60);
  };

  return (
    <div className="App">
      <div className="wrapper">
        <button className="button is-dark" onClick={switchTimer}>
          TOGGLE TIME -- {seconds}
        </button>
      </div>
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{timer}</h2>
        </div>
      </div>
      <div className="control section is-expanded">
        <input
          ref={inputText}
          disabled={status !== 'started'}
          type="text"
          className="input"
          onKeyDown={handleKeyDown}
          value={currInput}
          onChange={(e) => setCurrInput(e.target.value)}
        />
      </div>
      <div className="section">
        <div className="button is-primary is-fullwidth" onClick={start}>
          Start
        </div>
      </div>
      {status === 'started' && (
        <div className="section">
          <div className="card">
            <div className="card-content">
              <div className="content">
                {words &&
                  words.map((word, i) => (
                    <span key={i}>
                      <span>
                        {word.split('').map((character, j) => (
                          <span className={getChar(i, j, character)} key={j}>
                            {character}
                          </span>
                        ))}
                      </span>
                      <span> </span>
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {status === 'finished' && (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">Words per minute</p>
              <p className="has-text-primary is-size-1">
                {(() => {
                  if (seconds === 120) return <p>{correct / 2}</p>;
                  else if (seconds === 30) return <p>{correct * 2}</p>;
                  else return <p>{correct}</p>;
                })()}
              </p>
            </div>
            <div className="column has-text-centered">
              <p className="is-size-5">Accuracy</p>
              <p className="has-text-primary is-size-1">
                {Math.round((correct / (correct + incorrect)) * 100)}%
              </p>
            </div>
            <div className="column has-text-centered">
              <p className="is-size-5">Key Pressed</p>
              <p className="has-text-primary is-size-1">{keyCount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
