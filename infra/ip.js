// greate function for fetch api IP https://api64.ipify.org/?format=json

const fetchIP = async () => {
  try {
      const response = await fetch('https://api64.ipify.org/?format=json');
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error:', error);
      return null;
  }
};

module.exports = fetchIP