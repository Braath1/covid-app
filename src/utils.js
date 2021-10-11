import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
    cases: {
        hex: '#CC1034',
        multiplier: 250,
    },
    recovered: {
        hex: '#7dd71d',
        multiplier: 600,
    },
    deaths: {
        hex: '#fb4443',
        multiplier: 250,
    },
};

export const sortData = (data) => {
    // Copy the data into an array 
    const sortedData = [...data]; 

    // Loop through all country and all cases, compare them and sort them from highest to lowest
    return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1);
    
    // Same as:
    /*sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    });

    return sortedData;
    */
}

export const prettyPrintStat = (stat) => 
    stat ? `+${numeral(stat).format('0,0')}` : '+0,0';

export const regularPrintStat = (stat) => 
    stat ? `${numeral(stat).format('0,0')}` : '0,0';

// Draw circles on the map with interactive tooltip
export const showDataOnMap = (data, casesType='cases') => (
    data.map((country) => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
            >

            <Popup>
                
                <h1>Oversikt</h1>
                <div className="info-container">
                    <div className="info-flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})`}}
                    />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Totalt smittet: {numeral(country.cases).format('0,0')}</div>
                    <div className="info-deaths">Testet: {numeral(country.tests).format('0,0')}</div>
                    <div className="info-recovered">Friske: {numeral(country.recovered).format('0.0')}</div>
                    <div className="info-deaths">Døde: {numeral(country.deaths).format('0,0')}</div>
                    <div className="info-deaths">Avvik: {numeral(country.cases - country.recovered - country.deaths).format('0,0')}</div>
                </div>
            </Popup>
        </Circle>
    ))
);