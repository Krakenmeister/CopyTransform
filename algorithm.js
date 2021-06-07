//test_space = set of objects to choose origin elements from (duplicates allowed)
//test_null = a placeholder object -- can be anything that is not an element of test_space
const test_space = ['1', 1, [22], -1, 22, 22]
const test_null = 'dog'

//test_length = length of the destination arrays to do tests on
//For large number of tests or long arrays, comment out array logging
const test_length = 20
const num_tests = 100


//The only function allowed to act on origin array
function copy(origin, copyFrom, copyTo) {
	origin[copyTo] = origin[copyFrom]
	return origin
}

//Helper function
function vectorSum(v) {
	var sum = 0
	for (var i=0; i<v.length; i++) {
		sum += v[i]
	}
	return sum
}

//Algorithm
//Origin array length is 1 greater than destination array length
//The 0th element of origin array is a placeholder for values -- its value at the end is unimportant
//Goal is to transform origin array so that last elements (all besides 0th element) exactly match destination array
//However, the only way to modify origin array is by copying value from one index to another
function transform (origin, destination) {
	//Parameter validation
	if (origin.length != (destination.length+1)) {
		console.log('Arrays have incorrect length')
		return false
	}
	if ((origin[0] !== test_null) || origin.includes(test_null, 1)) {
		console.log('Null value misused')
		return false
	}
	for (var i=0; i<destination.length; i++) {
		if (!origin.includes(destination[i], 1)) {
			console.log('Can\'t copy ' + destination[i] + ' because it doesn\'t exist in origin array')
			return false
		}
	}
	
	//Build an array of unique objects in origin array (rep_objs)
	//Build an array of indices for representative elements of each unique object (rep_elms)
	var rep_objs = []
	var rep_elems = []
	for (var i=1; i<origin.length; i++) {
		if (!rep_objs.includes(origin[i])) {
			rep_objs.push(origin[i])
			rep_elems.push(i)
		}
	}

	//If not a representative element, copy the value you want from the corresponding representative element
	for (var i=1; i<origin.length; i++) {
		if (!rep_elems.includes(i)) {
			origin = copy(origin, rep_elems[rep_objs.indexOf(destination[i-1])], i)
		}
	}

	//Dependencies counts which how many other elements desire to copy the element you represent
	var dependencies = []
  	for (var i=0; i<rep_objs.length; i++) {
  		dependencies.push(0)
  	}
	for (var i=0; i<rep_objs.length; i++) {
		for (var j=0; j<rep_objs.length; j++) {
			if ((i != j) && (destination[rep_elems[j]-1] === rep_objs[i])) {
				dependencies[i]++
			}
		}
	}

	var cycleStart = -1
	while (vectorSum(dependencies) > 0) {
		//Find the element with the least dependencies that hasn't yet reached its destination
		var minIndex = -1
		for (var i=0; i<rep_objs.length; i++) {
			if (destination[rep_elems[i]-1] !== origin[rep_elems[i]]) {
				if (minIndex == -1) {
					minIndex = i
				} else if (dependencies[i] < dependencies[minIndex]) {
					minIndex = i
				}
			}
		}
		if (dependencies[minIndex] == 0) {
			if (origin[0] === destination[rep_elems[minIndex]-1]) {
				//If completing a dependency cycle, copy information from temporary slot
				origin = copy(origin, 0, rep_elems[minIndex])
				dependencies[cycleStart]--
				cycleStart = -1
			} else {
				//No other elements require this elements' information, so just copy the value you want
				origin = copy(origin, rep_elems[rep_objs.indexOf(destination[rep_elems[minIndex]-1])], rep_elems[minIndex])
				dependencies[rep_objs.indexOf(destination[rep_elems[minIndex]-1])]--
			}
		} else {
			//If the minimum number of dependencies is 1, this means that only dependency cycles remain
			//Pick one to begin with, and store its information in the temporary slot
			origin = copy(origin, rep_elems[minIndex], 0)
			origin = copy(origin, rep_elems[rep_objs.indexOf(destination[rep_elems[minIndex]-1])], rep_elems[minIndex])
			dependencies[rep_objs.indexOf(destination[rep_elems[minIndex]-1])]--
			cycleStart = minIndex
		}
	}

	//Check if origin array successfully transformed to match destination
	var verified = true
	for (var i=0; i<destination.length; i++) {
		if (origin[i+1] !== destination[i]) {
			verified = false
		}
	}
	console.log("Origin Result: " + origin.join())
	return verified
}

//Conduct tests
var alltestsverified = true
for (var n=0; n<num_tests; n++) {
	//Create origin and destination arrays randomly
	//Destination array can only have elements that are included in origin array (since only action is copying)
	var origin = [test_null]
	for (var i=0; i<test_length; i++) {
		origin.push(test_space[Math.floor(Math.random()*test_space.length)])
	}
	var destination = []
	for (var i=0; i<test_length; i++) {
		destination.push(origin[Math.floor(Math.random()*(test_length))+1])
	}
	console.log("Origin: " + origin.join())
	console.log("Destination: " + destination.join())

	//Perform algorithm on arrays
	if (!transform(origin, destination)) {
		alltestsverified = false
	}
}
if (alltestsverified) {
	console.log("All tests passed!")
} else {
	console.log("A test failed.")
}
