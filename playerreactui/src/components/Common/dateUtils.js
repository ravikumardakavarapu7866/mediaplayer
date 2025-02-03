const monthAbbreviations = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return null;
  }
  const day = date.getDate().toString().padStart(2, '0');
  //const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const monthIndex = date.getMonth();
  const month = monthAbbreviations[monthIndex];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};


export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) {
    return null;
  }
  const day = date.getDate().toString().padStart(2, '0');
  //const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const monthIndex = date.getMonth();
  const month = monthAbbreviations[monthIndex];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};