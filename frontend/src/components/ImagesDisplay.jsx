import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function ImagesDisplay() {

  const [images, setImages] = useState({status:false, data:[]});
  useEffect(()=>{
    fetchImages();
  },[])

  async function fetchImages(){
    console.log('fetch')
    let res = await fetch('http://localhost:4000/images');
    res = await res.json();
    setImages({status:true, data:res})
    console.log(res);
  }

  if(images.data.length == 0){

    return <div className='images-gal'>Please uload some images to see here. <Link to='/upload-images'>Upload</Link></div>
  }
  return (
    <div className='images-gal'>
      {images.status ?
        <div className='flex'>
        {images.data.map((img,index)=>
          <div className='prevBox' key={index}><img src={img.url}/></div>
        )}
        </div>
      :
      <div>fetching images</div>
      }
    </div>
  )
}

export default ImagesDisplay