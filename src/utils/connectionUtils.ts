// Utility functions for handling wallet connection issues

export const isNetworkConnected = async (): Promise<boolean> => {
  try {
    // Try to make a simple request to check connectivity
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
    });
    return true;
  } catch {
    return navigator.onLine;
  }
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        await delay(baseDelay * Math.pow(2, attempt - 1));
      }
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      console.warn(`Attempt ${attempt} failed:`, lastError.message);
    }
  }
  
  throw lastError!;
};

export const isWalletConnectionError = (error: Error): boolean => {
  const connectionErrorMessages = [
    'user rejected',
    'user denied',
    'connection request reset',
    'already pending',
    'unauthorized',
    'network error',
    'fetch failed',
    'not found',
    'timeout'
  ];
  
  return connectionErrorMessages.some(msg => 
    error.message.toLowerCase().includes(msg)
  );
};

export const getConnectionErrorMessage = (error: Error): { title: string; description: string } => {
  const message = error.message.toLowerCase();
  
  if (message.includes('user rejected') || message.includes('user denied')) {
    return {
      title: "Connection Cancelled",
      description: "You cancelled the wallet connection. Please try again if you want to connect."
    };
  }
  
  if (message.includes('already pending')) {
    return {
      title: "Connection in Progress",
      description: "A connection request is already pending. Please check your MetaMask."
    };
  }
  
  if (message.includes('not found') || message.includes('404')) {
    return {
      title: "Connection Issue",
      description: "Unable to reach the server. Please check your internet connection and try again."
    };
  }
  
  if (message.includes('timeout')) {
    return {
      title: "Connection Timeout",
      description: "The connection timed out. Please try again."
    };
  }
  
  if (message.includes('network error') || message.includes('fetch failed')) {
    return {
      title: "Network Error",
      description: "Network connection failed. Please check your internet and try again."
    };
  }
  
  return {
    title: "Connection Failed",
    description: error.message || "An unexpected error occurred while connecting."
  };
};
