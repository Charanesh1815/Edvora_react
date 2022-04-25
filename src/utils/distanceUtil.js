export const findClosest = (counts, goal) => {
	if(counts.length > 0) {
		return counts.reduce(function(prev, curr) {
			return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
		  })
	}
	else{
		return 0
	}
};

export const getDistance = (arr, station)=>{
	return Math.abs(findClosest(arr, station) - station)
}

export const getFutureRides = (arr) => {
	var out = []
	arr.forEach(element => {
		const date_obj = Date.parse(element.date)
		const now = Date.now()
		// console.log(now)
		if(date_obj - now <0 ){
			// console.log(now)
			out.push(element)
		}
	});
	// console.log(out)
	return out
}

export const getPastRides = (arr) => {
	var out = []
	arr.forEach(element => {
		const date_obj = Date.parse(element.date)
		const now = Date.now()
		// console.log(now)
		if(date_obj - now > 0 ){
			// console.log(now)
			out.push(element)
		}
	});
	// console.log(out)
	return out
}