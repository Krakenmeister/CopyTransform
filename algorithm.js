//test_space = set of elements to work from; numbers 1 through test_space
//test_length = length of arrays to work on, should be >= test_space
	//test_space could be abstracted a level further to any set of objects,
	//but test() function requires using the set {1, 2, ..., test_space-1, test_space}
const test_space = 10
const test_length = 20

//For large number of tests, comment out array logging
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
function test(origin, destination, set_space) {
	origin[0] = -1

	//Build an array of indices for representative elements
	var rep_elems = []
	for (var i=0; i<set_space; i++) {
  		rep_elems.push(origin.indexOf(i+1))
  	}

	//If not a representative element, copy the value you want from the corresponding representative element
	for (var i=0; i<destination.length; i++) {
		if (!rep_elems.includes(i+1)) {
			origin = copy(origin, rep_elems[destination[i]-1], (i+1))
	  	}
	}

	//Dependencies counts which how many other elements desire to copy the element you represent
	var dependencies = []
  	for (var i=0; i<set_space; i++) {
  		dependencies.push(0)
  	}

	for (var i=0; i<set_space; i++) {
		for (var j=0; j<set_space; j++) {
			if ((i != j) && (destination[rep_elems[j]-1] == (i+1))) {
				dependencies[i]++
			}
		}
	}

	var cycleStart = -1
	while (vectorSum(dependencies) > 0) {
		//Find the element with the least dependencies that hasn't yet reached its destination
		var minIndex = -1
		for (var i=0; i<set_space; i++) {
			if (destination[rep_elems[i]-1] != origin[rep_elems[i]]) {
				if (minIndex == -1) {
					minIndex = i
				} else if (dependencies[i] < dependencies[minIndex]) {
					minIndex = i
				}
			}
		}
		if (dependencies[minIndex] == 0) {
			if (origin[0] == destination[rep_elems[minIndex]-1]) {
				//If completing a dependency cycle, reset temporary slot so that other dependency cycles can be started
				origin = copy(origin, 0, rep_elems[minIndex])
				dependencies[cycleStart]--
				cycleStart = -1
				origin[0] = -1
			} else {
				//No other elements require this elements' information, so just copy the value you want
				origin = copy(origin, rep_elems[destination[rep_elems[minIndex]-1]-1], rep_elems[minIndex])
				dependencies[destination[rep_elems[minIndex]-1]-1]--
			}
		} else {
			//If the minimum number of dependencies is 1, this means that only dependency cycles remain
			//Pick one to begin with, and store its information in the temporary slot
			origin = copy(origin, rep_elems[minIndex], 0)
			origin = copy(origin, rep_elems[destination[rep_elems[minIndex]-1]-1], rep_elems[minIndex])
			dependencies[destination[rep_elems[minIndex]-1]-1]--
			cycleStart = minIndex
		}
	}

	//Check if origin array successfully transformed to match destination
	var verified = true
	for (var i=0; i<destination.length; i++) {
		if (origin[i+1] != destination[i]) {
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
	//If strict array bounds checking is required, make sure that origin includes all of the numbers 1 through test_space
	//Destination array can only have elements that are included in origin array (since only action is copying)
	var origin = [-1]
	while (origin.length < (test_length+1)) {
		origin.push(Math.floor(Math.random()*test_space)+1)
	}
	var destination = []
	for (var i=0; i<test_length; i++) {
		destination.push(origin[Math.floor(Math.random()*(test_length))+1])
	}
	console.log("Origin: " + origin.join())
	console.log("Destination: " + destination.join())
  
	//Perform algorithm on arrays
	if (!test(origin, destination, test_space)) {
		alltestsverified = false
	}
}
if (alltestsverified) {
	console.log("All tests passed!")
} else {
	console.log("A test failed.")
}
