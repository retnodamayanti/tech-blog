const formatDate = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    return date.toLocaleDateString('en-AU', options);
  };
  
  module.exports = { formatDate };
  