module.exports = function titleize(input) {
  if (input === null || input === undefined) {
    return '';
  }

  let string = typeof input === 'string' ? input : `${input}`;

  // Replace underscores with spaces
  string = string.replace(/_/g, ' ');

  // Replace dashes with spaces, if surrounded with characters
  // so, 'refund-date' => 'refund date'
  // but, 'refund-date - something' => 'refund date - something'
  string = string.replace(/\b-\b/g, ' ');

  // Squish whitespace
  string = string.replace(/\s+/g, ' ');
  string = string.trim();

  // Capatalize the first letter
  string = string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);

  return string;
};
