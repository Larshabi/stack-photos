import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const fetchImages = async() =>{
    setLoading(true)
    let url;
    const urlPage = `&page=${page}`
    const urlQuery = `&query=${searchTerm}`
    if(searchTerm){
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    }else{
      url = `${mainUrl}${clientID}${urlPage}`
    }
    try{
      const resp = await fetch(url)
      const data = await resp.json()
      setPhotos((oldPhoto)=>{
        if(searchTerm){
          return [...oldPhoto, ...data.results]
        }else{
          return [...oldPhoto, ...data]
        }
      })
      // setPhotos(data)
      setLoading(false)
    }catch(err){
      setLoading(false)
      console.log(err)
    }
  }
  const handleSubmit = (e)=>{
    e.preventDefault()
    fetchImages()
  }

  useEffect(()=>{
    fetchImages()
  },[page])

  useEffect(()=>{
    const event = window.addEventListener('scroll', ()=>{
      if(!loading && window.innerHeight + window.scrollY >= document.body.scrollHeight - 2){
        setPage((oldPage)=>{
          return oldPage + 1
        })
      }
    })
    return ()=> window.removeEventListener('scroll', event)
  },[])
  return <main>
    <section className='search'>
      <form className='search-form'>
        <input type='text' placeholder='search' className='form-input' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
        <button className='submit-btn' type='submit' onClick={handleSubmit}><FaSearch /></button>
      </form>
    </section>
    <section className='photos'>
      <div className='photos-center'>
        {
          photos.map((image)=>{
            console.log('hello')
            return <Photo key={image.id} {...image}/>
          })
        }
      </div>
      {loading && <h2 className='loading'>Loading...</h2>}
    </section>
  </main>
}

export default App
