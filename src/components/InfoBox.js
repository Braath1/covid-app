import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import '../css/InfoBox.css';

function InfoBox({ title, cases, isRed, active, total, ...props }) {
    return (
        <div className="infoBox">
            <Card 
            onClick={props.onClick}
            className={`infoBox ${active && 'infoBox--selected'}
            ${isRed && 'infoBox--red'}`}
            > 
                <CardContent>
                    <Typography className="infoBox__title" color="textSecondary">
                        {title}
                    </Typography>

                    <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>{cases}</h2>

                    <Typography className="infoBox__total" color="textSecondary">
                        {total} totalt
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default InfoBox;
