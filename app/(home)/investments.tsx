import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';

import { colors } from '~/constants/colors';
import { Coin, useCoinStore } from '~/store/store';

export default function InvestmentsScreen() {
  const { coins, loading, error, fetchCoins } = useCoinStore();
  const [search, setSearch] = useState('');
  const [coin, setCoin] = useState<Coin | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [wallet, setWallet] = useState<Coin[] | []>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [removeQuantity, setRemoveQuantity] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchCoins();
    fetchInvestments();
  }, []);

  useEffect(() => {
    calculateTotalBalance();
  }, [wallet]);

  const handleSearch = (search: string) => {
    const searchedCoin = coins.find(
      (coin) =>
        coin.name.toLowerCase() === search.toLowerCase() ||
        coin.symbol.toLowerCase() === search.toLowerCase()
    );
    setCoin(searchedCoin || null);
  };

  const fetchInvestments = async () => {
    try {
      const data = await AsyncStorage.getItem('investments');
      const investments = data ? JSON.parse(data) : [];

      const updatedInvestments = investments.map((investment: any) => {
        const realTimeCoin = coins.find((coin) => coin.id === investment.coin_id);
        return {
          ...investment,
          price_usd: realTimeCoin ? realTimeCoin.price_usd : investment.price_usd,
        };
      });

      setWallet(updatedInvestments);
    } catch (err) {
      console.error(err);
    }
  };

  const addToWallet = async () => {
    if (coin) {
      const parsedQuantity = parseFloat(quantity) || 0;
      if (parsedQuantity > 0) {
        try {
          const existingData = await AsyncStorage.getItem('investments');
          const investments = existingData ? JSON.parse(existingData) : [];
          const existingCoin = investments.find((item: any) => item.coin_id === coin.id);

          if (existingCoin) {
            existingCoin.quantity += parsedQuantity;
          } else {
            investments.push({
              coin_id: coin.id,
              coin_name: coin.name,
              quantity: parsedQuantity,
              price_usd: coin.price_usd,
            });
          }

          await AsyncStorage.setItem('investments', JSON.stringify(investments));
          setWallet(investments);
          Alert.alert(`${parsedQuantity} ${coin.name} added.`);
          setQuantity('');
        } catch (error) {
          console.error(error);
        }
      } else {
        console.warn('Invalid quantity');
      }
    } else {
      console.warn('No coins selected');
    }
  };

  const removeFromWallet = async () => {
    if (!selectedCoin || !removeQuantity) return;

    const quantityToRemove = parseFloat(removeQuantity);
    if (isNaN(quantityToRemove) || quantityToRemove <= 0) {
      Alert.alert('Invalid quantity');
      return;
    }

    try {
      const data = await AsyncStorage.getItem('investments');
      const investments = data ? JSON.parse(data) : [];

      const updatedInvestments = investments
        .map((item: any) => {
          if (item.coin_id === selectedCoin.coin_id) {
            const newQuantity = item.quantity - quantityToRemove;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item: any) => item !== null);

      await AsyncStorage.setItem('investments', JSON.stringify(updatedInvestments));
      setWallet(updatedInvestments);
      setIsModalVisible(false);
      Alert.alert(`${quantityToRemove} of ${selectedCoin.coin_name} removed!`);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateTotalBalance = () => {
    return wallet
      .reduce((total, item) => total + parseFloat(item.quantity) * item.price_usd, 0)
      .toFixed(2);
  };

  if (loading) return <ActivityIndicator size="large" color={colors.primary.light} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
        <SafeAreaView>
          {/* Header Title */}
          <Text style={styles.headerTitle}>My Investments</Text>
          {/* Coin add search */}
          <View style={styles.coinSearchContainer}>
            <TextInput
              placeholder="Search for coins..."
              value={search}
              onChangeText={setSearch}
              style={styles.input}
              placeholderTextColor="gray"
            />
            <Pressable style={styles.searchButton} onPress={() => handleSearch(search)}>
              <Text style={styles.buttonText}>Search</Text>
            </Pressable>
          </View>
          {/* Searched coin result */}
          {coin && (
            <View style={styles.coinContainer}>
              <Text style={styles.coinText}>{coin.symbol}</Text>
              <Text style={styles.coinText}>{coin.name}</Text>
              <Text style={styles.coinText}>$ {coin.price_usd.toFixed(4)}</Text>
              <Text
                style={{
                  color: coin.change_24h > 0 ? colors.secondary.main : colors.secondary.accent,
                }}>
                % {coin.change_24h.toFixed(4)}
              </Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                placeholder="0"
                placeholderTextColor="white"
                keyboardType="numeric"
                style={styles.quantityInput}
              />
              <Pressable style={styles.addButton} onPress={addToWallet}>
                <Text style={styles.buttonText}>Add</Text>
              </Pressable>
            </View>
          )}
          {/* Total Balance of User */}
          <View style={styles.balanceContainer}>
            <Text style={styles.title}>
              <Text style={{ color: colors.primary.light }}>Crypto</Text>graphy
              <Text style={{ color: colors.primary.light }}> Wallet</Text>
            </Text>
            <Text style={styles.balanceText}>Total Balance: $ {calculateTotalBalance()} </Text>
          </View>
          {/* Wallet items */}
          <FlatList
            data={wallet}
            keyExtractor={(item) => `${item.coin_id}`}
            renderItem={({ item }) => (
              <View style={styles.walletContainer}>
                <View style={styles.walletItem}>
                  <Text style={[styles.walletText, { width: 100 }]}>{item.coin_name}</Text>
                  <Text style={[styles.walletText, { width: 50 }]}>{item.quantity}</Text>
                  <Text style={[styles.walletText, { flex: 1 }]}>
                    $ {item.price_usd.toFixed(4)}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setSelectedCoin(item);
                      setIsModalVisible(true);
                    }}
                    style={styles.deleteButton}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
          {isModalVisible && (
            <Modal
              animationType="slide"
              transparent
              visible={isModalVisible}
              onRequestClose={() => setIsModalVisible(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text>Remove {selectedCoin?.coin_name}</Text>
                  <TextInput
                    value={removeQuantity}
                    onChangeText={setRemoveQuantity}
                    placeholder="Enter quantity"
                    keyboardType="numeric"
                    style={styles.quantityDeleteInput}
                  />
                  <View style={styles.modalButtons}>
                    <Pressable onPress={removeFromWallet} style={styles.confirmButton}>
                      <Text>Confirm</Text>
                    </Pressable>
                    <Pressable onPress={() => setIsModalVisible(false)} style={styles.cancelButton}>
                      <Text>Cancel</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary.dark,
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  coinSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderColor: colors.primary.light,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    color: colors.primary.light,
  },
  searchButton: {
    backgroundColor: colors.secondary.main,
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: colors.primary.light,
    fontWeight: 'bold',
  },
  coinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderColor: colors.primary.dark,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  coinText: {
    color: colors.primary.light,
    fontSize: 16,
  },
  quantityInput: {
    borderColor: colors.primary.light,
    borderWidth: 1,
    padding: 5,
    color: 'white',
    marginVertical: 5,
  },
  quantityDeleteInput: {
    borderColor: colors.primary.light,
    borderWidth: 1,
    padding: 5,
    color: colors.primary.dark,
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: colors.secondary.main,
    padding: 10,
    borderRadius: 5,
  },
  balanceContainer: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gainsboro',
    margin: 10,
    height: Dimensions.get('window').height / 10,
    gap: 20,
    alignItems: 'center',
  },
  title: {
    color: colors.primary.main,
    fontSize: 20,
    fontWeight: 'bold',
  },
  balanceText: {
    color: colors.primary.light,
    fontSize: 20,
  },
  walletContainer: {
    backgroundColor: colors.primary.main,
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  walletItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
    paddingVertical: 5,
  },
  walletText: {
    color: colors.primary.light,
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
