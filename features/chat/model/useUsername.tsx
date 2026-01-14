import { useState } from "react";
import { STORAGE_KEYS, UI_CONFIG } from "./consts";

function initUsername(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const params = new URLSearchParams(window.location.search);
  const urlUser = params.get("user");
  if (urlUser) {
    sessionStorage.setItem(STORAGE_KEYS.USERNAME, urlUser);
    return urlUser;
  }

  const stored = sessionStorage.getItem(STORAGE_KEYS.USERNAME);
  if (stored) return stored;

  const num =
    UI_CONFIG.USERNAME_MIN +
    Math.floor(
      Math.random() * (UI_CONFIG.USERNAME_MAX - UI_CONFIG.USERNAME_MIN + 1)
    );

  const generated = `${UI_CONFIG.USERNAME_PREFIX}${num}`;
  sessionStorage.setItem(STORAGE_KEYS.USERNAME, generated);
  return generated;
}

export function useUsername() {
  const [username] = useState(initUsername);
  return username;
}
