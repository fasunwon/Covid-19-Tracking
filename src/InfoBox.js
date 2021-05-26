import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css';
const InfoBox = ({title, cases, isRed, isYellow, active, total, ...props}) => {
    return (
        <Card onClick = {props.onClick}
        className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red' } ${isYellow && 'infoBox--yellow' }`}>
            <CardContent>
                {/* title */}
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
                {/* number of cases */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"} ${isYellow && "infoBox__cases--yellow"}`}>{cases}</h2>
                {/* total cases */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
