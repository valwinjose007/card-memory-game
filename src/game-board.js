import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Card from "./card";
import { delayedResolve } from "./helper";

export default function GameBoard() {
  const [CARD_PAIRS_VALUE, setCardPairsValue] = useState([]);
  const [flippedCount, setFlippedCount] = useState(0);
  const [delayTransition, setDelayTransition] = useState(true);
  const CARD_FLIPPED_HISTORY = useRef([]);

  useEffect(() => {
    prepareNewGame();
  }, []);

  //preparing new game
  const prepareNewGame = () => {
    let cardPairs = [];
    generateCardNumbers(6, 100).forEach((cardNum, index) => {
      cardPairs.push({
        cardNumber: cardNum,
        isFlipped: false,
        isLocked: false,
        position: index,
      });
    });
    setCardPairsValue(cardPairs);
  };

  //generating random card numbers to play.
  const generateCardNumbers = (n, max) => {
    const numbers = Array(max)
      .fill()
      .map((_, index) => index + 1);
    numbers.sort(() => Math.random() - 0.5);
    let slicedNumbers = numbers.slice(0, n);
    let pairdNumbers = [...slicedNumbers, ...slicedNumbers];
    return pairdNumbers.sort(() => Math.random() - 0.5);
  };

  //flip action handling.
  const onFlipped = (card) => {
    let cardPairsValue = [...CARD_PAIRS_VALUE];
    let cardFlippedHistory = CARD_FLIPPED_HISTORY.current;
    setDelayTransition(1000); //set transiton delay timeing to default to see animation.

    if (!card.isFlipped) {
      setFlippedCount(flippedCount + 1);
      cardFlippedHistory.push(card);
    }

    cardPairsValue[card.position].isFlipped =
      !cardPairsValue[card.position].isFlipped;
    let previousFlipCard = cardFlippedHistory[cardFlippedHistory.length - 1];
    let lastFlipCard = cardFlippedHistory[cardFlippedHistory.length - 2];

    if (cardFlippedHistory.length > 1) {
      if (
        previousFlipCard.cardNumber === lastFlipCard.cardNumber &&
        previousFlipCard.position != lastFlipCard.position
      ) {
        //if cards matched
        CARD_FLIPPED_HISTORY.current = [];
        cardPairsValue[previousFlipCard.position].isLocked = true;
        cardPairsValue[lastFlipCard.position].isLocked = true;
        let flippedCardsCount = cardPairsValue.filter(
          (card) => card.isFlipped
        ).length;
        if (flippedCardsCount === cardPairsValue.length) onGameCompleted(); //check game completion
      } else {
        //cards not matched.
        cardPairsValue[previousFlipCard.position].isFlipped = false;
        cardPairsValue[lastFlipCard.position].isFlipped = false;
        CARD_FLIPPED_HISTORY.current = [];
      }
    }
    setCardPairsValue(cardPairsValue);
  };

  //restart game
  const onRestartGame = async () => {
    setDelayTransition(false);
    setFlippedCount(0);
    CARD_FLIPPED_HISTORY.current = [];
    let cardPairsValue = [...CARD_PAIRS_VALUE];
    cardPairsValue.map((card) => (card.isFlipped = false));
    setCardPairsValue(cardPairsValue);
    await delayedResolve(500); //to ensure not showing new card value.
    prepareNewGame();
  };

  //game completion
  const onGameCompleted = () => {
    Alert.alert(
      "Congratulations",
      `You win this game by ${flippedCount + 1} steps!`,
      [{ text: "Try another round", onPress: () => onRestartGame() }],
      { cancelable: false }
    );
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: "#DC143C" }} />
      <View style={[styles.header]}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, marginLeft: "-18%" }}>
            <Button title="Restart" onPress={onRestartGame} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>Count: {flippedCount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        {CARD_PAIRS_VALUE.length > 0 ? (
          CARD_PAIRS_VALUE.map((cardnum, i) => {
            return (
              <Card
                key={i}
                card={cardnum}
                delayTransition={delayTransition}
                onFlipped={onFlipped}
              />
            );
          })
        ) : (
          <Text style={{ padding: 10 }}>Loading Game...</Text>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "48%",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
  },
  header: {
    width: "100%",
    height: "5%",
    backgroundColor: "#DC143C",
    flexWrap: "wrap",
  },
  text: {
    textAlign: "right",
    color: "#fff",
    paddingRight: "10%",
    paddingTop: "3%",
    fontSize: 18,
  },
});
