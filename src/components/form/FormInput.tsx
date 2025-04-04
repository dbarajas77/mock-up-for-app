import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';

export interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = 'none',
  leftIcon,
  rightIcon,
  onRightIconPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        error ? styles.inputContainerError : null,
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Feather name={leftIcon as any} size={18} color={theme.colors.neutral.dark} />
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            multiline && { height: numberOfLines * 40 },
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
        />
        {rightIcon && (
          <TouchableOpacity 
            style={styles.rightIconContainer} 
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Feather name={rightIcon as any} size={18} color={theme.colors.neutral.dark} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
    color: theme.colors.neutral.dark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral.main,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'white',
  },
  inputContainerError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    padding: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIconContainer: {
    paddingLeft: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    paddingRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default FormInput;
