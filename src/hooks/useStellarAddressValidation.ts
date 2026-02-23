import { useState, useEffect, useRef, useCallback } from 'react';
import { Horizon } from 'stellar-sdk';
import { Network, RPC_ENDPOINTS } from '../config';
import { validateStellarAddress, ValidationState } from '../utils/validateStellarAddress';

interface UseStellarAddressValidationProps {
  initialAddress?: string;
  network?: Network;
  debounceMs?: number;
}

export const useStellarAddressValidation = ({
  initialAddress = '',
  network = 'mainnet' as Network,
  debounceMs = 300,
}: UseStellarAddressValidationProps = {}) => {
  const [address, setAddress] = useState(initialAddress);
  const [debouncedAddress, setDebouncedAddress] = useState(initialAddress);
  const [validationState, setValidationState] = useState<ValidationState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout>(null);

  // Auto-format address: remove spaces and uppercase
  const formatAddress = (rawAddress: string) => {
    return rawAddress.replace(/\s+/g, '').toUpperCase();
  };

  const handleAddressChange = useCallback((newAddress: string) => {
    const formatted = formatAddress(newAddress);
    setAddress(formatted);
    
    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (!formatted) {
      setValidationState('idle');
      setErrorMessage(null);
      setDebouncedAddress('');
      return;
    }

    // Set formatting validation state while typing
    setValidationState('validating');
    setErrorMessage(null);

    // Debounce the actual network validation
    timerRef.current = setTimeout(() => {
      setDebouncedAddress(formatted);
    }, debounceMs);
  }, [debounceMs]);

  // Network check effect
  useEffect(() => {
    if (!debouncedAddress) return;

    let isMounted = true;

    const validateAccountNetwork = async () => {
      // 1. Format validation first
      const formatResult = validateStellarAddress(debouncedAddress, network);
      
      if (!isMounted) return;

      if (!formatResult.isValid) {
        setValidationState(formatResult.state);
        if (formatResult.error) setErrorMessage(formatResult.error);
        return;
      }

      // 2. Network Check
      setValidationState('validating');
      setErrorMessage(null);

      try {
        const rpcUrl = RPC_ENDPOINTS[network];
        const server = new Horizon.Server(rpcUrl);
        
        // Use Horizon API call to check if account exists
        await server.loadAccount(debouncedAddress);
        
        if (!isMounted) return;
        
        // Optional: Check if account has 0 transactions (we will consider valid but could warn)
        // const operations = await server.operations().forAccount(debouncedAddress).call();
        // if (operations.records.length === 0) { ... }

        setValidationState('valid');
        setErrorMessage(null);
        
      } catch (error) {
        if (!isMounted) return;

        console.error("Account validation error:", error);
        
        const err = error as { response?: { status?: number } };
        if (err?.response?.status === 404) {
          setValidationState('not-found');
          setErrorMessage('Account not found on Stellar network');
        } else {
          setValidationState('error');
          setErrorMessage('Unable to connect to Stellar network');
        }
      }
    };

    validateAccountNetwork();

    return () => {
      isMounted = false;
    };
  }, [debouncedAddress, network]);

  const reset = useCallback(() => {
    setAddress('');
    setDebouncedAddress('');
    setValidationState('idle');
    setErrorMessage(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return {
    address,
    debouncedAddress,
    validationState,
    errorMessage,
    setValidationState, // Exposed for indexer to update state
    handleAddressChange,
    formatAddress,
    reset,
    isValid: validationState === 'valid'
  };
};
