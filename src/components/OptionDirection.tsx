import * as React from 'react'

import Up from "../assets/up.png";
import Down from "../assets/down.png";



const OptionDirection = (props: any) => {
    const {optionType} = props;
    
    console.log(`option type ${optionType}, typ ${typeof(optionType)}`);

    if (optionType) {
        return ( 
        <div style={{display: 'flex', flexDirection: 'row'}}>

            Call
                <div style={{
                    height: '15px',
                    width: '15px',
                    background: `url(${Up}) no-repeat`,
                    backgroundSize: `cover`,
                    backgroundPosition: 'center',
                    margin: '4px'
                    }}/>
            </div>
        )
    } else {
        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
            Put
                <div style={{
                    height: '15px',
                    width: '15px',
                    background: `url(${Down}) no-repeat`,
                    backgroundSize: `cover`,
                    backgroundPosition: 'center',
                    margin: '4px'
                    }}/>
            </div>
        )
    }
}





export default OptionDirection
