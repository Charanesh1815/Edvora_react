import React from 'react'
import {findClosest, getDistance} from '../utils/distanceUtil.js'

function RideItem(props) {

  return (
	<div className='rideItem'>
		<img src={props.Data.map_url} alt="" />
		<div className="info">
			Ride Id : <span className="coloredspan">{props.Data.id}</span> <br></br>
			Origin Station : <span className="coloredspan">{props.Data.origin_station_code}</span> <br></br>
			station_path : <span className="coloredspan">{"["}{props.Data.station_path.join(', ')}{"]"}</span> <br></br>
			Date : <span className="coloredspan">{props.Data.date}</span> <br></br>
			Distance : <span className="coloredspan">{ getDistance(props.Data.station_path, props.CurrentStationCode) }</span>
		</div>
		<div className="location">
			<span>{props.Data.city}</span>
			<span>{props.Data.state}</span>
		</div>
	</div>
  )
}

export default RideItem