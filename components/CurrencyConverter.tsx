import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const currencyRates = {
  USD: 1418.57,
  EUR: 1495.29,
  KES: 9.3,
  JPY: 8.97,
  INR: 16.01,
  NGN: 0.7984,
  RWF: 1,
};

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [showInput, setShowInput] = useState(false); // hidden by default
  const { colors } = useTheme();

  useEffect(() => {
    if (amount) {
      const rate = currencyRates[fromCurrency];
      const result = (parseFloat(amount) * rate).toFixed(2);
      setConvertedAmount(result);
    } else {
      setConvertedAmount('');
    }
  }, [amount, fromCurrency]);

  const toggleInputVisibility = () => {
    setShowInput(!showInput);
  };

  const renderCurrencyTab = ({ item: currency }) => {
    const isActive = fromCurrency === currency;
    return (
      <TouchableOpacity
        style={styles.tab}
        onPress={() => setFromCurrency(currency)}
      >
        <View
          style={[
            isActive && {
              backgroundColor: colors.primary,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
            },
          ]}
        >
          <Text
            style={{
              color: isActive ? '#fff' : colors.textSecondary,
              fontWeight: isActive ? 'bold' : 'normal',
            }}
          >
            {currency}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={{ paddingTop: 40 }}>
        <Text style={[styles.header, { color: colors.text }]}>
          Currency Converter to RWF
        </Text>

        <FlatList
          horizontal
          data={Object.keys(currencyRates)}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
          renderItem={renderCurrencyTab}
        />

        <TouchableOpacity
          onPress={toggleInputVisibility}
          style={styles.toggleButton}
        >
          <Text style={[styles.toggleButtonText, { color: colors.text }]}>
            {showInput ? 'Hide Input' : 'Show Input'}
          </Text>
        </TouchableOpacity>

        {showInput && (
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder={`Enter amount in ${fromCurrency}`}
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        )}

        {convertedAmount ? (
          <Text style={[styles.result, { color: colors.text }]}>
            {amount} {fromCurrency} = {convertedAmount} RWF
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  tabContainer: {
    paddingBottom: 20,
    flexDirection: 'row',
  },
  tab: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  toggleButtonText: {
    fontSize: 18,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CurrencyConverter;
