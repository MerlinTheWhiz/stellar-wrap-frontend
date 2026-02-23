import { StrKey } from 'stellar-sdk';
import { Network } from '../config';

export type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid' | 'not-found' | 'indexing' | 'error';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  state: ValidationState;
}

/**
 * Validates a Stellar public key (address) format
 * @param address The string to validate
 * @param network The current network context (mainnet/testnet)
 * @returns ValidationResult containing status and optional error message
 */
export const validateStellarAddress = (address: string, _network: Network): ValidationResult => {
  if (!address || address.trim() === '') {
    return {
      isValid: false,
      state: 'idle'
    };
  }

  const trimmedAddress = address.trim();

  // Basic check: must start with G (Ed25519) or M (Muxed)
  if (!trimmedAddress.startsWith('G') && !trimmedAddress.startsWith('M')) {
    return {
      isValid: false,
      error: 'Address must start with G or M',
      state: 'invalid'
    };
  }

  try {
    // Check Ed25519 Public Key
    if (trimmedAddress.startsWith('G')) {
      if (!StrKey.isValidEd25519PublicKey(trimmedAddress)) {
         return {
          isValid: false,
          error: 'Invalid Stellar Ed25519 address format',
          state: 'invalid'
        };
      }
    } 
    // Check Muxed Account
    else if (trimmedAddress.startsWith('M')) {
      if (!StrKey.isValidMed25519PublicKey(trimmedAddress)) {
        return {
          isValid: false,
          error: 'Invalid Stellar Muxed address format',
          state: 'invalid'
        };
      }
    }
    
    // Format is valid at this point
    return {
      isValid: true,
      state: 'validating' // We transition to validating format -> network check
    };
    
  } catch {
    return {
      isValid: false,
      error: 'Invalid Stellar address format',
      state: 'invalid'
    };
  }
};
