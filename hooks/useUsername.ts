import { useEffect, useState } from "react";
import { STORAGE_KEYS, UI_CONFIG } from "@/constants/chat";

/**
 * Custom hook to manage username for the chat
 * 
 * Priority:
 * 1. URL parameter (?user=...)
 * 2. Session storage (persists per tab)
 * 3. Generate new username
 * 
 * @returns Current username string
 */
export const useUsername = (): string => {
  const [username, setUsername] = useState("You");

  useEffect(() => {
    // Skip on server-side
    if (typeof window === "undefined") return;

    // Priority 1: Check URL parameter (for sharing links with specific user)
    const urlParams = new URLSearchParams(window.location.search);
    const urlUser = urlParams.get("user");
    if (urlUser) {
      setUsername(urlUser);
      return;
    }

    // Priority 2: Check session storage (unique per browser tab)
    const existingUsername = window.sessionStorage.getItem(STORAGE_KEYS.USERNAME);
    if (existingUsername) {
      setUsername(existingUsername);
      return;
    }

    // Priority 3: Generate new username for this tab
    const randomNumber = Math.floor(
      UI_CONFIG.USERNAME_MIN + Math.random() * (UI_CONFIG.USERNAME_MAX - UI_CONFIG.USERNAME_MIN + 1)
    );
    const generatedUsername = `${UI_CONFIG.USERNAME_PREFIX}${randomNumber}`;
    
    window.sessionStorage.setItem(STORAGE_KEYS.USERNAME, generatedUsername);
    setUsername(generatedUsername);
  }, []);

  return username;
};
