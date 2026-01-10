import { useState, useEffect } from 'react';
import { userAuthService } from '../services/user/userAuthApiService';

interface ValidationState {
  isValid: boolean;
  isChecking: boolean;
  message: string;
}

export const useUsernameValidation = (username: string, initialCheck = false) => {
  const [state, setState] = useState<ValidationState>({
    isValid: false,
    isChecking: false,
    message: '',
  });

  useEffect(() => {
    if (!username || username.length < 3) {
      setState({ isValid: false, isChecking: false, message: '' });
      return;
    }

    const checkUsername = async () => {
      setState(prev => ({ ...prev, isChecking: true }));
      
      try {
        const response = await userAuthService.checkUsername(username);
        setState({
          isValid: response.isAvailable,
          isChecking: false,
          message: response.isAvailable ? 'Username is available' : 'Username is already taken',
        });
      } catch (error) {
        setState({
          isValid: false,
          isChecking: false,
          message: 'Error checking username availability',
        });
      }
    };

    const timeoutId = setTimeout(checkUsername, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [username]);

  return state;
};

export const useEmailValidation = (email: string) => {
  const [state, setState] = useState<ValidationState>({
    isValid: false,
    isChecking: false,
    message: '',
  });

  useEffect(() => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ isValid: false, isChecking: false, message: '' });
      return;
    }

    const checkEmail = async () => {
      setState(prev => ({ ...prev, isChecking: true }));
      
      try {
        const response = await userAuthService.checkEmail(email);
        setState({
          isValid: response.isAvailable,
          isChecking: false,
          message: response.isAvailable ? 'Email is available' : 'Email is already registered',
        });
      } catch (error) {
        setState({
          isValid: false,
          isChecking: false,
          message: 'Error checking email availability',
        });
      }
    };

    const timeoutId = setTimeout(checkEmail, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [email]);

  return state;
};