import { useState } from "react";
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
} from "@expo-google-fonts/playfair-display";
import { MonsieurLaDoulaise_400Regular } from "@expo-google-fonts/monsieur-la-doulaise";
import Header from "./components/Header.js";
import JewelryForm from "./components/JewelryForm.js";
import JewelryList from "./components/JewelryList.js";
import { colors, fonts } from "./theme";

function JewelryApp() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  function addItem(data) {
    const cleanName = data.name.trim();
    const cleanDescription = data.description.trim();
    const cleanSize = data.size.trim();
    const price = Number(data.price.replace(",", "."));
    const weight = Number(data.weight.replace(",", "."));

    if (!cleanName) {
      Alert.alert("Помилка", "Будь ласка, введіть назву виробу.");
      return false;
    }
    if (!Number.isFinite(price) || price <= 0) {
      Alert.alert("Помилка", "Будь ласка, введіть коректну ціну.");
      return false;
    }
    if (!Number.isFinite(weight) || weight <= 0) {
      Alert.alert("Помилка", "Будь ласка, введіть коректну вагу.");
      return false;
    }
    const newItem = {
      id: Date.now().toString(),
      name: cleanName,
      description: cleanDescription,
      price,
      material: data.material,
      gemstone: data.gemstone,
      weight,
      size: cleanSize,
      sold: false,
    };
    setItems((currentItems) => [newItem, ...currentItems]);
    Alert.alert("Успіх", "Виріб успішно додано.");
    return true;
  }

  function toggleItem(id) {
    setItems((currentItems) =>
        currentItems.map((item) =>
            item.id === id ? { ...item, sold: !item.sold } : item
        )
    );
  }

  function deleteItem(id) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    Alert.alert("Видалення", "Виріб видалено зі списку.");
  }

  const soldCount = items.filter((item) => item.sold).length;

  const query = search.trim().toLowerCase();
  const filteredItems = items.filter(
      (item) =>
          item.name.toLowerCase().includes(query) ||
          item.material.toLowerCase().includes(query) ||
          item.gemstone.toLowerCase().includes(query)
  );

  const emptyText = query
      ? "Нічого не знайдено за вашим запитом."
      : "Виробів поки немає. Додайте перший!";

  const topPadding = Math.max(insets.top, Platform.OS === "ios" ? 50 : 0);

  return (
      <ScrollView
          style={{ flex: 1, backgroundColor: colors.sand }}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.screen, { paddingTop: topPadding }]}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.container}>
            <Header total={items.length} sold={soldCount} />
            <JewelryForm onAdd={addItem} />
            <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Пошук за назвою, матеріалом чи каменем..."
                placeholderTextColor={colors.sky}
            />
            <JewelryList
                items={filteredItems}
                emptyText={emptyText}
                onToggle={toggleItem}
                onDelete={deleteItem}
            />
          </View>
        </View>
      </ScrollView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_700Bold_Italic,
    MonsieurLaDoulaise_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
      <SafeAreaProvider>
        <JewelryApp />
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.sand,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.sand,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.sky,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.brand,
    marginBottom: 16,
  },
});
