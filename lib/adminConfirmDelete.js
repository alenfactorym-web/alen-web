export function confirmDelete(message) {
  return window.confirm(
    message || "Are you sure you want to delete this item?"
  );
}

