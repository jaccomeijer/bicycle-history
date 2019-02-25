const fs = require('fs')

let input = {}
let output = {}

const json = fs.readFileSync('./facilities.json', 'utf8')
const facilities = JSON.parse(json.toString())

// Read files into input object
facilities.forEach(facility => {
  console.log('Reading from', facility.dataFile)

  const json = fs.readFileSync(facility.dataFile, 'utf8')
  input[facility.name] = {
    data: JSON.parse(json.toString()),
    coordinates: facility.coordinates,
  }
})

// Cut specific date range and adapt for deck.gl data layer

const getSum = (facilityName, key) => {
  let sum = 0
  input[facilityName].data.forEach(record => {
    sum += record[key]
  })
  return sum
}

const getMin = (facilityName, key) => {
  let min = null
  input[facilityName].data.forEach(record => {
    if (min === null) min = record[key]
    if (record[key] < min) min = record[key]
  })
  return min
}

const getMax = (facilityName, key) => {
  let max = null
  input[facilityName].data.forEach(record => {
    if (max === null) max = record[key]
    if (record[key] > max) max = record[key]
  })
  return max
}

for (facilityName in input) {
  const inFlow = getSum(facilityName, 'inFlow')
  const outFlow = getSum(facilityName, 'outFlow')

  const minInFlow = getMin(facilityName, 'inFlow')
  const minOutFlow = getMin(facilityName, 'outFlow')
  const maxInFlow = getMax(facilityName, 'inFlow')
  const maxOutFlow = getMax(facilityName, 'outFlow')

  console.log(
    facilityName,
    '/',
    'in',
    inFlow,
    '/',
    'out',
    outFlow,
    '/',
    'diff',
    inFlow - outFlow,
    'minInFlow',
    minInFlow,
    '/',
    'minOutFlow',
    minOutFlow,
    '/',
    'maxInFlow',
    maxInFlow,
    '/',
    'maxOutFlow',
    maxOutFlow,
    '/'
  )
}

// fs.writeFileSync('result.json', JSON.stringify(input.ubPlein, null, 2))
