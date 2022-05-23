import { View, StyleSheet } from "react-native";
import GameBoard from "./src/game-board";

export default function App() {
  return (
    <View style={styles.container}>
      <GameBoard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
