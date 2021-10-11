import React, { useEffect, useState } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { sortData, prettyPrintStat, regularPrintStat } from './utils';
import LineGraph from './components/LineGraph';
import 'leaflet/dist/leaflet.css';
// import { Popup, popup } from 'leaflet';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80743, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  // Covid-19 API data is collected from: https://disease.sh/docs/

  // State is how to write variables in react
  // useEffect runs a piece of code based on given condition
  // Code will run once when component loads and not again
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, []);


  useEffect(() => {
    // async -> send a request, wait for it, do something
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
        }));

         const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
          
      });
    };

    getCountriesData();
  }, []); // <-- If we put variable like cities inside the empty [] like [cities], it will update whenever the variable cities changes.

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      // All of the data from the country response
      setCountryInfo(data);

    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    setMapZoom(4);
    }).catch((err => {
        console.log("error",err);
  })
  );
};
 console.log('Country info: ' + countryInfo);
 

  return (
    <div className="app">
    <div className="app__left">

    <div className="app__header">
        <h1>Covid-19 Oversikt</h1><a href="https://disease.sh/docs"><h6 className="data__link">Datagrunnlag</h6></a>
        
        <FormControl className="app__dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country}>
        <MenuItem value="worldwide">Verden</MenuItem>
        {/* Loop through and show drop down list of the options */}
        {countries.map((country) => (
           <MenuItem value={country.value}>{country.name}</MenuItem> 
          ))}
        
        </Select>
      </FormControl>
    </div>
    
    <div className="app__stats">
          <InfoBox
          isRed 
          active={casesType === 'cases'}
          onClick={e => setCasesType('cases')}
          title="Koronavirus tilfeller idag" cases={prettyPrintStat(countryInfo.todayCases)} 
          total={regularPrintStat(countryInfo.cases)}/>
          <InfoBox 
          active={casesType === 'recovered'}
          onClick={e => setCasesType('recovered')}
          title="Friskemeldte idag" cases={prettyPrintStat(countryInfo.todayRecovered)} 
          total={regularPrintStat(countryInfo.recovered)}/>
          <InfoBox
          isRed 
          active={casesType === 'deaths'}
          onClick={e => setCasesType('deaths')}
          title="Dødsfall idag" cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={regularPrintStat(countryInfo.deaths)}/>
    </div>
          
          <Map 
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter} zoom={mapZoom} />
          
          </div> {/* End app__left */}

          <Card className="app__right">
          <CardContent>
            <h3>Antall smittede per land</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">Totalt antall {casesType} i verden </h3>
            <p>(De siste 120 dagene)</p>
            <LineGraph className="app__graph" casesType={casesType}/>
          </CardContent>
          </Card> {/* End app__right */}
          
    </div>
  );
}

export default App;

