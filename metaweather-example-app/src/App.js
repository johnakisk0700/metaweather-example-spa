import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import cityNames from './data/cityNames.js'
import useVisible from './hooks/useVisible'
import { weekDays } from './data/days.js'
import humidity from './svgs/humidity.svg'
import Loader from './components/Loader'
import Loader2 from './components/Loader2'
import { CSSTransition } from 'react-transition-group'

function App() {
  const [textQueryResults, setTextQueryResults] = useState([])
  const [showQueryResults, setShowQueryResults] = useState(false)
  const [textQuery, setTextQuery] = useState('')
  const [possibleCities, setPossibleCities] = useState([])
  const { ref, isVisible, setIsVisible } = useVisible(false)
  const [hasSelectedCity, setHasSelectedCity] = useState(false)
  const [selectedCity, setSelectedCity] = useState([])
  const [cityWeatherResults, setCityWeatherResults] = useState([])
  const [showLoader, setShowLoader] = useState(false)
  const [errorOccured, setErrorOccured] = useState(false)
  const [noResultsOccured, setNoResultsOccured] = useState(false)
  const [hasClickedFromList, setHasClickedFromList] = useState(false)


  const inputRef = useRef(null)
  const loaderRef = useRef(null)
  const selectedCityRef = useRef(null)
  const textResultsRef = useRef(null)



  async function searchByResult(e) {
    setHasClickedFromList(true)
    console.log(e.target.value)
    await axios(`http://localhost:5000/woeid/${e.target.value}`)
    .then(res => {
      let kairos = JSON.parse(res.data)
      console.log(kairos)
      setHasSelectedCity(true)
      setSelectedCity(kairos)
      
      kairos.consolidated_weather.forEach(day => {
        let d = new Date(day.applicable_date)
        let dn = new Date(Date.now())
        if(dn.getDay() === d.getDay()){
          day.applicable_date = 'Today'
        }else if(dn.getDay() === (d.getDay() - 1)){
          day.applicable_date = 'Tommorow'
        }else{
          day.applicable_date = weekDays[d.getDay()]
        }
        
      })
      setCityWeatherResults(kairos.consolidated_weather)

    })
    .catch(err => {
      console.log(err)
      setHasClickedFromList(false)
      setErrorOccured(true)
    })
  }

  async function searchByText(e) {
    e.preventDefault()
    cleanResults()

    const apiUrl = `http://localhost:5000/text/${textQuery}`
    await axios(apiUrl)
    .then(res => {
      let apotelesma = JSON.parse(res.data)
      if(apotelesma.length === 1){
        axios(`http://localhost:5000/woeid/${apotelesma[0].woeid}`)
        .then(res => {
          let kairos = JSON.parse(res.data)
          console.log(kairos)
          setHasSelectedCity(true)
          setSelectedCity(kairos)
          
          kairos.consolidated_weather.forEach(day => {
            let d = new Date(day.applicable_date)
            let dn = new Date(Date.now())
            if(dn.getDay() === d.getDay()){
              day.applicable_date = 'Today'
            }else if(dn.getDay() === (d.getDay() - 1)){
              day.applicable_date = 'Tommorow'
            }else{
              day.applicable_date = weekDays[d.getDay()]
            }
            
          })
          setCityWeatherResults(kairos.consolidated_weather)

        })
        .catch(err => {
          setShowLoader(false)
          
        })
      }else if(apotelesma.length === 0){
        setNoResultsOccured(true)
      }
      else{
        setTextQueryResults(apotelesma)
        setShowQueryResults(true)
      }
    })
    .catch(err => {
      console.log(err)
      setShowLoader(false)
      setErrorOccured(true)
    })
    setShowLoader(false)
  }

  async function searchByButton(e) {
    e.preventDefault()
    cleanResults()

    setTextQuery(e.currentTarget.value)

    const apiUrl = `http://localhost:5000/text/${e.currentTarget.value}`

    inputRef.current.value = e.currentTarget.value

    setIsVisible(!isVisible)

    await axios(apiUrl)
    .then(res => {
      let apotelesma = JSON.parse(res.data)
      if(apotelesma.length === 1){
        axios(`http://localhost:5000/woeid/${apotelesma[0].woeid}`)
        .then(res => {
          let kairos = JSON.parse(res.data)
          setHasSelectedCity(true)
          setSelectedCity(kairos)
          
          kairos.consolidated_weather.forEach(day => {
            let d = new Date(day.applicable_date)
            let dn = new Date(Date.now())
            if(dn.getDay() === d.getDay()){
              day.applicable_date = 'Today'
            }else if(dn.getDay() === (d.getDay() - 1)){
              day.applicable_date = 'Tommorow'
            }else{
              day.applicable_date = weekDays[d.getDay()]
            }
            
          })
          setCityWeatherResults(kairos.consolidated_weather)

        })
        .catch(err => {
          console.log(err)
          setShowLoader(false)
          setErrorOccured(true)
        })
      }else{
        setTextQueryResults(apotelesma)
        setShowQueryResults(true)
      }
      setShowLoader(false)
    })
    .catch(err => {
      console.log(err)
      setShowLoader(false)
      setErrorOccured(true)
    })
  }

  function cleanResults(){
    setSelectedCity([])
    setHasSelectedCity(false)
    setTextQueryResults([])
    setShowLoader(true)
    setShowQueryResults(false)
    setErrorOccured(false)
    setNoResultsOccured(false)
  }

  useEffect(()=> {
    setPossibleCities(cityNames.filter(city => (city.toLowerCase().indexOf(textQuery.toLowerCase()) !== -1)))
  }, [textQuery])


  return (
    <>
     
    <div className="content-wrapper">
      
      
      <h1 className='app-title'>MetaWeather</h1>
      
      
      
      <form className='form-control'>
        
        <div className='input-wrapper'>
          <input type="text" value={textQuery} onChange={(e) => {setTextQuery(e.target.value); setIsVisible(true)}} onClick={() => setIsVisible(!isVisible)} ref={inputRef}/>
          {(isVisible && possibleCities.length > 0) && 
            <ul className='suggestions-wrapper' ref={ref}>
              {possibleCities.map((city, i) => {
                return (<button type='button' onClick={e => searchByButton(e)} value={city} key={i} tabIndex={i}>{city}</button>)
              })}
            </ul>
          }
        </div>
        <button className='search-btn' type='submit' onClick={(e) => searchByText(e)}>Search</button>
        
        <CSSTransition
        in={showLoader}
        timeout={300}
        classNames="loading"
        nodeRef={loaderRef}
        unmountOnExit
        >
        <Loader ref={loaderRef}/>
        </CSSTransition>

      </form>
      
      {errorOccured && <h3>Sorry an error has occured. Please try again.</h3>}
      {noResultsOccured && <h3>The city you searched for doesn't exist. Try a different one.</h3>}

      <CSSTransition
      in={showQueryResults}
      timeout={300}
      classNames="loading"
      nodeRef={textResultsRef}
      unmountOnExit
      >
        <div className='text-results' ref={textResultsRef}>
            {textQueryResults.map((city, i) => {
              return(
              <button className='city-result' key={i} value={city.woeid} onClick={(e) => searchByResult(e)}>
                {city.title}, {city.latt_long}
              </button>)
            })}
        </div> 
      </CSSTransition>      


      
      
      
      <CSSTransition
      in={hasSelectedCity || hasClickedFromList}
      timeout={300}
      classNames="opacityOnly"
      
      unmountOnExit
      >
      <div className='modal-bg' onClick={() => {setHasClickedFromList(false); setHasSelectedCity(false)}}><Loader2 /></div>
      </CSSTransition>
      <CSSTransition
      in={hasSelectedCity}
      timeout={300}
      classNames="loading"
      nodeRef={selectedCityRef}
      unmountOnExit
      >
        <div className='selected-city' ref={selectedCityRef}>
          
         
          <button onClick={() => {setHasClickedFromList(false); setHasSelectedCity(false)}} type='button' className='modal-close-btn'>X</button>
          <h1>{selectedCity.title}</h1>
          <h4>{selectedCity.parent ? selectedCity.parent.title : ''}</h4>
          <div className='cards-wrapper'>
            {cityWeatherResults.map((day, i) => {
              return(
                <div className='day-card' key={i}>
                  <div className='card-title'>{day.applicable_date}</div>
                  <img src={`https://www.metaweather.com/static/img/weather/${day.weather_state_abbr}.svg`} alt='weather prediction' />
                  <div className='card-weather-text'>{day.weather_state_name}</div>
                  <div className='card-subtitle'><p>Max:</p> <p>{Math.ceil(day.max_temp)}°C</p></div>
                  <div className='card-subtitle'><p>Min:</p> <p>{Math.ceil(day.min_temp)}°C</p></div>
                  <div className='card-subtitle'><img src={humidity} alt='humidity' /> <p>{day.humidity}%</p></div>
                  <div className='card-subtitle'><img src='https://www.metaweather.com/static/img/windarrow.svg' alt='wind arrow' style={{transform: `rotate(${day.wind_direction}deg)`}}/> <p>{Math.ceil(day.wind_speed)} mph</p></div>
                </div>
                )
            })}
          </div>
          
        </div>
      </CSSTransition>
      
    </div>
    </>
  );
}

export default App;
