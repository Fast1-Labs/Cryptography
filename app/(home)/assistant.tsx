import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  SafeAreaView,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { colors } from '~/constants/colors';
import { useCryptoAdvisor } from '~/utils/aiAdvisor';

export default function Assistant() {
  const [input, setInput] = useState('');
  const { messages, loading, error, askToCryptoAdvisor } = useCryptoAdvisor();

  const handleAssistant = () => {
    if (input.trim()) {
      askToCryptoAdvisor(input);
      setInput('');
    }
  };
  return (
    <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, padding: 16, margin: 10 }}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
            {messages.map((msg, index) => (
              <View
                key={index}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.role === 'user' ? '#007AFF' : '#E0E0E0',
                  padding: 10,
                  borderRadius: 8,
                  marginVertical: 4,
                  maxWidth: '80%',
                }}>
                <Text style={{ color: msg.role === 'user' ? '#FFF' : '#000' }}>{msg.content}</Text>
              </View>
            ))}
          </ScrollView>

          {loading && (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginBottom: 10 }} />
          )}

          {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              backgroundColor: colors.primary.light,
              borderRadius: 10,
            }}>
            <TextInput
              style={{
                flex: 1,
                borderBottomWidth: 1,
                borderBottomColor: '#CCC',
                marginRight: 10,
                padding: 8,
              }}
              value={input}
              onChangeText={setInput}
              placeholder="Ask about crypto..."
            />
            <Button title="Send" onPress={handleAssistant} disabled={loading} />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    padding: 20,
  },
  header: {
    color: colors.primary.dark,
    fontWeight: 'bold',
    fontSize: 25,
  },
  messageContainer: {
    padding: 10,
  },
  inputContainer: {
    marginBottom: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});
