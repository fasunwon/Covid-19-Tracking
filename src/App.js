import React, {useState, useEffect} from 'react';
import './App.css';
import{MenuItem, FormControl, Select, Card,
CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {prettyPrintStat, sortData} from './utility';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';
function App() {

  // useState Hook for listing all countries
  const [countries, setCountries]=useState([]);
  //default value for drop down menu
  const [country, setCountry]=useState('worldwide');
  //useState Hook for listing country's covid info 
  const [countryInfo, setCountryInfo] = useState({});

  //Table Data
  const [tableData, setTableData] = useState([]);

  //Map Center
  const [mapCenter, setMapCenter]= useState({lat: 34.80746, lng:-40.4796});
  const [mapZoom, setMapZoom] = useState(3);

  const [mapCountries, setMapCountries]= useState([]);

  const [casesType, setCasesType]= useState('cases');
  //Loads the info of the present data(country or worldwide)
  //when website is reloaded.
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(res => res.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, []);

  useEffect(() => {
    // the code will run once when the component loads.
    //async-> send a request to server to fetch api JSON Data
    const getCountriesData = async ()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      //when it comes back with the response, just take JSON
      .then((response)=>response.json())
      .then((data)=>{
        //map returns the array to be transformed
        const countries = data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, [])


  const onCountryChange= async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    // for the dropdown menu. when clicking on a specific country
    // async function will fetch the data from the url below.
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(res => res.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
      const {
        countryInfo:{lat, long},
      } = data;
      setMapCenter({lat, lng:long});
      setMapZoom(5);
    });

  };
  return (
    <div className="app">
      <div className="app__left">
      {/* Header */}
      <div className="app__header">
        <h1>COVID-19 TRACK</h1> 
        {/* Select input dropdown field*/}
        <FormControl className="app__dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
          {/* Loop thorugh all the countries and show a drop down 
          list of the options. */}
          {countries.map(country =>(
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* look at infoBox.js for what data been passed is */}
      <div className="app__stats">
            <InfoBox 
            isYellow
            active={casesType === 'cases'}
            onClick={(e)=>setCasesType('cases')}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}/>
            <InfoBox 
            active={casesType === 'recovered'}
            onClick={(e)=>setCasesType('recovered')}
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}/>
            <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={(e)=>setCasesType('deaths')}
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths) }
            total={prettyPrintStat(countryInfo.deaths)}/>
      </div>
      {/* {Map} look at Map.js */}
      <Map casesType={casesType} countries={mapCountries} center={mapCenter}
        zoom={mapZoom}/>
    </div>
      <Card className="app__right">
      <CardContent>
      {/* {Table} */}
      <h3>Live Cases by Country</h3>
      <Table countries={tableData}/>
      {/* {Graph} */}
      <br></br>
      <h3>Worldwide New {casesType}</h3><br />
        <LineGraph casesType={casesType}/>
      </CardContent>

    </Card>
    </div>
  );
}

export default App;
