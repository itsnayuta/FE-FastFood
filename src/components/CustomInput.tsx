import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, KeyboardTypeOptions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomInputProps {
  placeholder: string;
  iconName?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  countryCode?: string;
  value: string;  
  onChangeText: (text: string) => void; 
}

const CustomInput: React.FC<CustomInputProps> = ({
  placeholder,
  iconName,
  secureTextEntry = false,
  keyboardType = 'default',
  countryCode,
  value,
  onChangeText,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  
  return (
    <View style={[styles.container, isFocused && styles.focusedContainer]}>
      {iconName && (
        <Ionicons name={iconName} size={20} color="#666" style={styles.icon} />
      )}
      
      {countryCode && (
        <View style={styles.countryCodeContainer}>
          <Text style={styles.countryCode}>{countryCode}</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </View>
      )}
      
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        keyboardType={keyboardType}
        value={value}  
        onChangeText={onChangeText}  
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
  },
  focusedContainer: {
    borderColor: '#a51c30',
    borderWidth: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  countryCode: {
    marginRight: 4,
    color: '#333',
  },
});

export default CustomInput;
