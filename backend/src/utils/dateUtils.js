// Helper function to format dates, including BCE handling
const formatDate = (date, isBCE) => {
    if (!date) return null;
    return isBCE ? `${date} BCE` : date;
  };

  module.exports = {
    formatDate
  };

  