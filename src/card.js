import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { delayedResolve } from "./helper";

export default function Card({ card, delayTransition, onFlipped }) {
  const [cardFlipped, setCardFlipped] = useState(card.isFlipped);
  const animate = useRef(new Animated.Value(0));

  //----Animation block-----//
  const interpolateFront = animate.current.interpolate({
    inputRange: [0, 100],
    outputRange: ["0deg", "180deg"],
  });

  const interpolateBack = animate.current.interpolate({
    inputRange: [0, 100],
    outputRange: ["180deg", "360deg"],
  });

  const rotateFront = {
    transform: [
      {
        rotateY: interpolateFront,
      },
    ],
  };

  const rotateBack = {
    transform: [
      {
        rotateY: interpolateBack,
      },
    ],
  };
  //----Animation Ends-----//

  const handleFlip = () => {
    if (card.isFlipped && card.isLocked) return;
    setCardFlipped(!cardFlipped);
    onFlipped(card);
    //animate to back view
    Animated.timing(animate.current, {
      duration: 300,
      toValue: cardFlipped ? 0 : 100,
      useNativeDriver: true,
    }).start();
  };

  //function to monitor any card changes from parant.
  const checkCardStatus = async () => {
    if (card.isFlipped !== cardFlipped) {
      if (delayTransition) await delayedResolve(1000);
      setCardFlipped(!cardFlipped);
    } else {
      Animated.timing(animate.current, {
        duration: 300,
        toValue: cardFlipped ? 100 : 0,
        useNativeDriver: true,
      }).start();
    }
  };
  checkCardStatus();

  return (
    <TouchableOpacity onPress={() => handleFlip()} style={styles.touch}>
      <Animated.View style={[styles.box, styles.hidden, rotateFront]}>
        <View style={[styles.inner, styles.cover]}>
          <Text style={styles.text}>?</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[styles.box, styles.back, styles.hidden, rotateBack]}
      >
        <View style={styles.inner}>
          <Text style={styles.text}>{card.cardNumber}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touch: {
    width: "33.333333%", //split width by 3 equal
  },
  box: {
    height: "65%",
    width: "100%",
    padding: 5,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#389dff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#DC143C",
  },
  cover: {
    backgroundColor: "#1E90FF",
  },
  text: {
    color: "white",
    fontSize: 30,
  },
  hidden: {
    backfaceVisibility: "hidden",
  },
  back: {
    position: "absolute",
    top: 0,
  },
});
