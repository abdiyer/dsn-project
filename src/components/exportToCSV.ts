const exportToCSV = (dataArray, fileName) => {
    if (dataArray.length === 0) {
      alert('No data to export');
      return;
    }
  
    const csvRows = [];
    const headers = ["id", "n_of_donuts", "attend_a_zoo", "can_cook_pizza", "n_of_coffee", "spent_in_amazon"];
    csvRows.push(headers.join(','));
  
    dataArray.forEach(data => {
      const values = headers.map(header => data[header]);
      csvRows.push(values.join(','));
    });
  
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
  
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  export default exportToCSV;