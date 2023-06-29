/////SAVI CAlculation for year 2006 in the ROI////////////

var collection = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
  .filterBounds(roi)
  .filterDate('2006-05-01', '2006-12-31')
  .sort('CLOUD_COVER')
  .first();
print(collection)
// Select the bands for false color composite
var bands = ['B4', 'B3', 'B2'];

// Apply visualization parameters
var visParams = { 
  bands: bands,
  min: 0,
  max: 3000
};

// Create the false color composite image
var fccImage_06 = collection.select(bands).clip(roi);

// Display the false color composite image
Map.addLayer(fccImage_06,imageVisParam, 'False Color Composite_06');

// Export the false color composite image
Export.image.toDrive({
  image: fccImage_06,
  description: 'FCC_Image_Landsat5_SR_2006',
  folder: 'GEE_Images',
  region: roi,
  scale: 30,
  crs: 'EPSG:4326'
});

//SAVI Calculation
var savi_2006 = collection.expression (
  
'1.5*((NIR-RED)/(NIR+RED+0.5))', {
  'NIR':collection.select ('B4'),
  'RED':collection.select ('B3'),
   
}).rename('savi');
// var saviVis = {'min':0.0, 'max':1, 'palette':['yellow', 'green']};

// Reduce the image to the ROI and get the SAVI values
var stats = savi_2006.reduceRegion({
  reducer: ee.Reducer.toList(),
  geometry: roi,
  scale: 30  // Adjust the scale as per your requirements
});
//Binarizing SAVI
var thr_1 = 0.55
var binary_00 = savi_2006.gt(thr_1).rename('binary_SAVI');
var  savi_B2006 = binary_00.clip(roi);
Map.addLayer(savi_B2006, { min:0,max:1,palette:['green','blue']},'SAVI_B_2002')

// Get the SAVI values as a list
var saviValues = ee.List(stats.get(savi_2006.bandNames().get(0)));

// Print the SAVI values
print('SAVI values:', saviValues);

// Generate a histogram of SAVI values
var histogram = ui.Chart.image.histogram({
  image: savi_2006,
  region: roi,
  scale: 30,  // Adjust the scale as per your requirements
  maxBuckets: 30
}).setOptions({
  title: 'SAVI Histogram for 2006'  // Add the desired title for the histogram
});

print(histogram);

// Export the SAVI values as a CSV file
Export.table.toDrive({
  collection: ee.FeatureCollection([ee.Feature(null, {'SAVI': saviValues})]),
  description: 'SAVI_values_2002',
  fileFormat: 'CSV'
});


//////////////SAVI Calculation for year 2002 for the ROI//////////////

var collection_1 = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
  .filterBounds(roi)
  .filterDate('2003-05-01', '2003-12-31')
  .sort('CLOUD_COVER')
  .first();
print(collection_1)
// Select the bands for false color composite
var bands = ['B4', 'B3', 'B2'];

// Apply visualization parameters
var visParams = { 
  bands: bands,
  min: 0,
  max: 3000
};

// Create the false color composite image
var fccImage_02 = collection_1.select(bands).clip(roi);

// Display the false color composite image
Map.addLayer(fccImage_02,imageVisParam, 'False Color Composite_02');

//SAVI

var savi_2002 = collection_1.expression (
  
'1.5*((NIR-RED)/(NIR+RED+0.5))', {
  'NIR':collection_1.select ('B4'),
  'RED':collection_1.select ('B3'),
   
}).rename('savi');
// var saviVis = {'min':0.0, 'max':1, 'palette':['yellow', 'green']};
// Reduce the image to the ROI and get the SAVI values
var stats = savi_2002.reduceRegion({
  reducer: ee.Reducer.toList(),
  geometry: roi,
  scale: 30  
});
//Binarizing SAVI
var thr_1 = 0.55
var binary_00 = savi_2002.gt(thr_1).rename('binary_SAVI');
var  savi_B2002 = binary_00.clip(roi);
Map.addLayer(savi_B2002, { min:0,max:1,palette:['green','blue']},'SAVI_B_2002')

// Get the SAVI values as a list
var saviValues = ee.List(stats.get(savi_2002.bandNames().get(0)));

print('SAVI values:', saviValues);

// Generate a histogram of SAVI values
var histogram = ui.Chart.image.histogram({
  image: savi_2002,
  region: roi,
  scale: 30,  
  maxBuckets: 30
}).setOptions({
  title: 'SAVI Histogram for 2002'  
});

print(histogram);
