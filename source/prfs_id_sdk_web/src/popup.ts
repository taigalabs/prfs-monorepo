export function openPopup(endpoint: string) {
  const popup = window.open(endpoint, "_blank", "toolbar=0,location=0,menubar=0");

  if (!popup) {
    console.error("Failed to open window");
    return null;
  }

  return popup;
}
