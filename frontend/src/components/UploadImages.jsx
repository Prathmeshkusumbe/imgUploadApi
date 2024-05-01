import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';


function UploadImages() {

  const [selectedFIle, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [filters, setFilters] = useState([]);
  //const [fileDetails, setFileDetails] = useState([]);

  function fileInput(e) {
    const files = Array.from(e.target.files);
    const maxFiles = 5;
    if (files.length > maxFiles) {
      alert('maximum 5 files are allowed');
      fileInputRef.current.value = '';
      setSelectedFile(null);
      return;
    }
    const allowedTypes = ['image/jped', 'image/gif', 'image/png'];
    const allFilesValid = files.every(file => allowedTypes.includes(file.type));
    if (!allFilesValid) {
      alert('only png, jpeg, gif files are allowed');
      fileInputRef.current.value = '';
      setSelectedFile(null);
      return;
    }
    //const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(files.map(file => URL.createObjectURL(file)));
    const defaultDetails = files.map((file, index) => ({
      fileName: file.name,
      //filters: filters[index] // Default filters value
    }));
    //setFileDetails(defaultDetails);
    setSelectedFile(files);
  }

  async function upload(e) {
    e.preventDefault();
    alert('uploading');
    const formData = new FormData();
    selectedFIle.forEach((file, index) => {
      formData.append('img', file);
      //formData.append('fileDetails', JSON.stringify({ ...fileDetails[index], uploadDate: new Date().toISOString() }));
    });
    const res = await fetch('http://localhost:4000/upload', {
      method: 'POST',
      body: formData
    })
    const resJson = await res.json();
    console.log('done', resJson);
    fileInputRef.current.value = '';
    setSelectedFile(null);
    setPreviews([]);
    setFilters([]);
    alert('uploaded successfully');
  }

  const applyFilter = (index, filterType) => {
    const newFilters = [...filters];
    newFilters[index] = filterType;
    setFilters(newFilters);
  };

  return (
    <div className="App">
      {/* <form onSubmit={upload}> */}
      <input ref={fileInputRef} accept='image/*' multiple onChange={(e) => fileInput(e)} type='file' />
      <button onClick={upload} type='submit' disabled={!selectedFIle}>upload</button>
      {previews.length > 0 &&
        <div className='previews flex justify-center'>
          {previews.map((preview, index) =>
            <div className='prevBox' key={index}>
              <img src={preview} alt='preview' style={{ filter: filters[index] }} />
              <div>
                <button onClick={() => applyFilter(index, 'grayscale(100%)')}>Grayscale</button>
                <button onClick={() => applyFilter(index, 'sepia(100%)')}>Sepia</button>
                <button onClick={() => applyFilter(index, '')}>Clear Filter</button>
              </div>
            </div>
          )}
        </div>
      }
      {/* </form> */}
      <div className='pt-20'>See the uploaded images <Link to='/images-display'>Here</Link></div>
    </div>
  );
}

export default UploadImages;
