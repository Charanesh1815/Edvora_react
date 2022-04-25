import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import RideItem from './components/RideItem';
import {findClosest, getDistance, getFutureRides, getPastRides} from './utils/distanceUtil.js'

function App() {
  const [userDetails, setUserDetails] = useState(null)
  const [rideDetails, setRideDetails] = useState(null)
  const [rawData, setRawData] = useState(null)
  const [cities, setCities] = useState(null)
  const [states, setStates] = useState(null)
  const [futureRides, setFutureRides] = useState(0)
  const [pastRides, setPastRides] = useState(0)
  const [filter, setFilter] = useState({
    state: 'Select State',
    city: 'Select City'
  })
  const [filteredresults, setFilteredresults] = useState([])
  const [currentTab, setCurrentTab] = useState(0)

  useEffect(() => {
    fetch('https://assessment.api.vweb.app/user')
    .then(response => response.json())
    .then((data) => {
      console.log(data)
      setUserDetails(data)
    });
  }, []);

  useEffect(() => {
    fetch('https://assessment.api.vweb.app/rides')
      .then(response => response.json())
      .then((data) => {
        // console.log("fetched rides")
        // setRideDetails(data)
        setRawData(data)

        setRideDetails(data.sort(distanceCompare()))

        setFutureRides(getFutureRides(data).length)

        setPastRides(getPastRides(data).length)



        // setRideDetails(data.sort((a,b) => Math.abs(findClosest(a.station_path, userDetails.station_code) - userDetails.station_code) < Math.abs(findClosest(b.station_path, userDetails.station_code) - userDetails.station_code)))
      });
  
    return () => {
      
    }
  }, [userDetails])
  

  useEffect(() => {
    // console.log(rideDetails)


    if(rideDetails !== null){
      setCities([...new Set(rideDetails.map(ride => ride.city))].sort())
      setStates([...new Set(rawData.map(ride => ride.state))].sort())
    }

      // setRideDetails(rideDetails.slice().sort((a,b) => Math.abs(findClosest(a) - userDetails.station_code) < Math.abs(findClosest(b) - userDetails.station_code)))
  
    // return () => {
    //   second
    // }
  }, [rideDetails])

  useEffect(() => {
    if(rideDetails !== null && filter.state === 'Select State' && filter.city === 'Select City'){
      switch (currentTab) {
        case 0:
          setRideDetails(rawData.sort(distanceCompare()))
          break;
        case 1:
          setRideDetails(getFutureRides(rawData).sort(distanceCompare()))
          break;
        case 2:
          setRideDetails(getPastRides(rawData).sort(distanceCompare()))
          break;
      
        default:
          break;
      }
    }
    else{
      if(rideDetails !== null){
        setRideDetails(rawData.filter((item)=>{
          if(filter.state === 'Select State')
            return item.city === filter.city
          else if(filter.city === 'Select City')
            return item.state === filter.state
          else
            return (item.city === filter.city) && (item.state === filter.state)
        }))
      }
    }
    
  
    return () => {
      
    }
  }, [filter])
  

  const distanceCompare = ()=>{
    return (a,b) => {
      if(userDetails !== null){
        if(getDistance(a.station_path, userDetails.station_code) < getDistance(b.station_path, userDetails.station_code)){
          return -1
        }
        else if(getDistance(a.station_path, userDetails.station_code) < getDistance(b.station_path, userDetails.station_code)){
          return 1
        }
      }
      return 0
    }
  }
  
  const setActive = (target, filter_num) => {
    document.getElementsByClassName('active')[0].classList.remove('active')
    target.classList.add('active')
    setCurrentTab(filter_num)
  
    switch (filter_num) {
      case 0:
        setRideDetails(rawData.sort(distanceCompare()))
        break;
      case 1:
        setRideDetails(getFutureRides(rawData).sort(distanceCompare()))
        break;
      case 2:
        setRideDetails(getPastRides(rawData).sort(distanceCompare()))
        break;
    
      default:
        break;
    }

    if(rideDetails !== null){
      setCities([...new Set(rideDetails.map(ride => ride.city))].sort())
      setStates([...new Set(rideDetails.map(ride => ride.state))].sort())
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Edvora</h2>
        <div className="userDetails">
          {userDetails? userDetails.name : ""}
          <img src={userDetails? userDetails.url : ""} alt={userDetails? userDetails.name : ""} />
        </div>
      </header>
      <main>
        <div className="nav">
          <a className="navitem active" onClick={(e)=>{setActive(e.target, 0)}} >
            Nearest rides
          </a>
          <a className="navitem" onClick={(e)=>{setActive(e.target, 1)}} >
            Upcoming rides ({futureRides})
          </a>
          <a className="navitem" onClick={(e)=>{setActive(e.target, 2)}} >
            Past rides ({pastRides})
          </a>

          <button className="filter" onClick={()=>{
            document.getElementsByClassName('filterDialog')[0].classList.toggle('open')
          }}>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-6.10352e-05 12.0001H5.99994V10.0001H-6.10352e-05V12.0001ZM-6.10352e-05 0.00012207V2.00012H17.9999V0.00012207H-6.10352e-05ZM-6.10352e-05 7.00012H11.9999V5.00012H-6.10352e-05V7.00012Z" fill="white" fillOpacity="0.8"/>
            </svg>

            Filter
          </button>

          <div className="filterDialog">
              <input id='filterText' type="text" placeholder='Filter' />
              <select onChange={(e)=>{
                setFilter( {state: e.target.value, city: filter.city })
              }}>
                <option value={null} selected>Select State</option>
                {
                  states? states.map((item)=>{
                    return <option key={item} value={item}>{item}</option>
                  }) : ""
                }
              </select>
              <select onChange={(e)=>{
                setFilter( {city: e.target.value, state: filter.state })
              }}>
                <option value={null} selected>Select City</option>
                {
                  cities? cities.map((item)=>{
                    return <option key={item} value={item}>{item}</option>
                  }): ""
                }
              </select>

            </div>
        </div>
        <div className="items">
          {
            rideDetails ? rideDetails.map((item)=>{
              return <RideItem key={item.id + item.date} Data={item} CurrentStationCode={userDetails ? userDetails.station_code : 0} />
            }) : ""
          }
          {/* {
            filteredresults !== [] && (filter.state !== null || filter.city !== null)? filteredresults.map((item)=>{
              return <RideItem key={item.id + item.date} Data={item} CurrentStationCode={userDetails ? userDetails.station_code : 0} />
            }) : ""
          } */}

        </div>
      </main>
    </div>
  );
}

export default App;
