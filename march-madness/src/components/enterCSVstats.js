import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

const CsvUploader = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Handle File Selection and Parsing
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true, // Uses the first row of your CSV as object keys
      skipEmptyLines: true,
      complete: (results) => {
        console.log("Parsed Data:", results.data);
        setData(results.data);
      },
      error: (error) => {
        console.error("Parsing Error:", error.message);
      }
    });
  };

  // 2. Post Data to your Endpoint
  const uploadData = () => {
    if (data.length === 0) {
      alert("Please select a valid CSV file first.");
      return;
    }

    setLoading(true);
    console.log('This data ', {data})
    axios.post('http://localhost:4000/teams', data)
      .then((response) => {
        console.log('Upload Successful:', response.data);
        alert('File uploaded successfully!');
      })
      .catch((error) => {
        console.error('Upload Error:', error);
        alert('Failed to upload data.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Upload CSV Data</h3>
      
      {/* Simple HTML File Input */}
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileChange} 
        style={{ marginBottom: '10px' }}
      />

      <br />

      <button 
        onClick={uploadData} 
        disabled={loading || data.length === 0}
        style={{ padding: '8px 16px', cursor: 'pointer' }}
      >
        {loading ? 'Uploading...' : 'Submit to Server'}
      </button>

      {data.length > 0 && (
        <p style={{ fontSize: '12px', color: '#666' }}>
          {data.length} rows ready for upload.
        </p>
      )}
    </div>
  );
};

export default CsvUploader;