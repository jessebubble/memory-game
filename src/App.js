import { useState, useEffect } from 'react';
import Card from './components/Card'
import Header from './components/Header';
import shuffle from './util/shuffle';

function App() {
  const [cards, setCards] = useState(shuffle); //cards array from assets
  const [pickOne, setPickOne] = useState(null); // first card selection
  const [pickTwo, setPickTwo] = useState(null); // second card selection
  const [disabled, setDisabled] = useState(null); // delay card selection so user doesn't click on all cards to reveal placement
  const [wins, setWins] = useState(0); //capture win streak

  const handleClick = (card) => { //card selection 
    if (!disabled) {
      pickOne ? setPickTwo(card) : setPickOne(card);
    }
  };

  const handleTurn = () => { //
    setPickOne(null);
    setPickTwo(null);
    setDisabled(false);
  };

  const handleNewGame = () => {
    setWins(0);
    handleTurn();
    setCards(shuffle);
  };

  useEffect(() => { //card selection and match handling
    let pickTimer;

    if (pickOne && pickTwo) { //two cards have been clicked
      if (pickOne.image === pickTwo.image) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.image === pickOne.image){
              return { ...card, matched: true }; //update card property to reflect match
            } else {
              return card; //no match
            }
          });
        });
        handleTurn();
      } else {
        setDisabled(true); //prevent new card selection until after disabled delay
        pickTimer = setTimeout(() => {
          handleTurn();
        }, 1000);
      }
    }

    return () => {
      clearTimeout(pickTimer);
    };
  }, [cards, pickOne, pickTwo]);

  useEffect(() => { // If player has found all matches, handle accordingly
    const checkWin = cards.filter((card) => !card.matched); // Check for any remaining card matches

    if (cards.length && checkWin.length < 1) { // All matches made, handle win/badge counters
      console.log('You win!');
      setWins(wins + 1);
      handleTurn();
      setCards(shuffle);
    }
  }, [cards, wins]);

  return (
    <>
      <Header handleNewGame={handleNewGame} wins={wins} />

      <div className='grid'>
        {cards.map((card) => {
          const { image, id, matched } = card;

          return (
            <Card
              key={id}
              image={image}
              selected={card === pickOne || card === pickTwo || matched}
              onClick={() => handleClick(card)}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;