import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for using localStorage with React state synchronization
 * Features:
 * - Persistent storage across browser sessions
 * - Sync between tabs/windows
 * - Error handling for localStorage operations
 * - Type safety with JSON serialization
 * - Debug mode for development
 */
function useLocalStorage(key, initialValue, options = {}) {
  const { debug = false, syncTabs = true } = options;
  
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      if (debug) console.log(`🚫 useLocalStorage: Window undefined, returning initial value for "${key}"`);
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      if (debug) console.log(`📖 useLocalStorage: Reading "${key}" from localStorage:`, item);
      
      if (item === null || item === 'null') {
        if (debug) console.log(`💾 useLocalStorage: No existing value for "${key}", using initial value`);
        return initialValue;
      }
      
      const parsedValue = JSON.parse(item);
      if (debug) console.log(`✅ useLocalStorage: Successfully parsed "${key}":`, parsedValue);
      return parsedValue;
    } catch (error) {
      console.error(`❌ useLocalStorage: Error reading localStorage key "${key}":`, error);
      if (debug) console.log(`🔄 useLocalStorage: Returning initial value due to error for "${key}"`);
      return initialValue;
    }
  });

  // Ref to track initial render and prevent unnecessary saves
  const isFirstRender = useRef(true);
  const isSettingValue = useRef(false);

  // Function to set value with enhanced error handling
  const setValue = useCallback((value) => {
    if (typeof window === "undefined") {
      if (debug) console.log(`🚫 useLocalStorage: Window undefined, cannot set "${key}"`);
      return;
    }

    try {
      isSettingValue.current = true;
      
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      if (debug) console.log(`💾 useLocalStorage: Setting "${key}" to:`, valueToStore);
      
      // Save to React state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      if (debug) console.log(`✅ useLocalStorage: Successfully saved "${key}" to localStorage`);
      
    } catch (error) {
      console.error(`❌ useLocalStorage: Error setting localStorage key "${key}":`, error);
    } finally {
      isSettingValue.current = false;
    }
  }, [key, storedValue, debug]);

  // Sync between tabs/windows
  useEffect(() => {
    if (!syncTabs || typeof window === "undefined") return;

    const handleStorageChange = (event) => {
      if (event.key === key && !isSettingValue.current) {
        try {
          if (event.newValue === null) {
            if (debug) console.log(`🔄 useLocalStorage: "${key}" was removed from another tab`);
            setStoredValue(initialValue);
          } else {
            const newValue = JSON.parse(event.newValue);
            if (debug) console.log(`🔄 useLocalStorage: "${key}" updated from another tab:`, newValue);
            setStoredValue(newValue);
          }
        } catch (error) {
          console.error(`❌ useLocalStorage: Error parsing storage change for "${key}":`, error);
        }
      }
    };

    const handleStorageChangeCustom = (event) => {
      if (event.detail && event.detail.key === key && !isSettingValue.current) {
        try {
          const newValue = event.detail.value;
          if (debug) console.log(`🔄 useLocalStorage: "${key}" updated via custom event:`, newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error(`❌ useLocalStorage: Error handling custom storage event for "${key}":`, error);
        }
      }
    };

    // Listen to storage events from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Listen to custom storage events (for same-tab sync)
    window.addEventListener('localStorageChange', handleStorageChangeCustom);
    
    if (debug) console.log(`👂 useLocalStorage: Started listening for storage changes for "${key}"`);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChangeCustom);
      if (debug) console.log(`👋 useLocalStorage: Stopped listening for storage changes for "${key}"`);
    };
  }, [key, initialValue, syncTabs, debug]);

  // Save to localStorage when storedValue changes (but not on first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (debug) console.log(`🎯 useLocalStorage: First render for "${key}", skipping save`);
      return;
    }

    if (isSettingValue.current) {
      if (debug) console.log(`⏩ useLocalStorage: Skipping save for "${key}" (already being set)`);
      return;
    }

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
        if (debug) console.log(`💾 useLocalStorage: Auto-saved "${key}" to localStorage:`, storedValue);
        
        // Dispatch custom event for same-tab sync
        const event = new CustomEvent('localStorageChange', {
          detail: { key, value: storedValue }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error(`❌ useLocalStorage: Error auto-saving "${key}" to localStorage:`, error);
    }
  }, [storedValue, key, debug]);

  // Debug effect to log changes
  useEffect(() => {
    if (debug) {
      console.log(`🔍 useLocalStorage: "${key}" value updated:`, storedValue);
    }
  }, [storedValue, key, debug]);

  // Method to manually force a refresh from localStorage
  const refreshFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsedValue = JSON.parse(item);
        setStoredValue(parsedValue);
        if (debug) console.log(`🔄 useLocalStorage: Manually refreshed "${key}" from storage:`, parsedValue);
      }
    } catch (error) {
      console.error(`❌ useLocalStorage: Error refreshing "${key}" from storage:`, error);
    }
  }, [key, debug]);

  // Method to clear this specific key
  const clearValue = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      if (debug) console.log(`🧹 useLocalStorage: Cleared "${key}" from storage`);
    } catch (error) {
      console.error(`❌ useLocalStorage: Error clearing "${key}" from storage:`, error);
    }
  }, [key, initialValue, debug]);

  return [storedValue, setValue, { refreshFromStorage, clearValue }];
}

export default useLocalStorage;