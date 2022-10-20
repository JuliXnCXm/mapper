import React from 'react'

const Menu = ({changeStyle}) => {
    return (
        <div id="menu">
        <input
            id={process.env.REACT_APP_MAP_STYLE_ID_REAL_COV}
            type="radio"
            name="rtoggle"
            value="Real Coverage"
            onClick={(e) => {
            changeStyle(e);
            }}
        />
        <label for={process.env.REACT_APP_MAP_STYLE_ID_REAL_COV}>
            Real Coverage
        </label>
        <input
            id={process.env.REACT_APP_MAP_STYLE_ID_AMPL}
            type="radio"
            name="rtoggle"
            value="Ampliaciones"
            onClick={(e) => {
            changeStyle(e);
            }}
        />
        <label for={process.env.REACT_APP_MAP_STYLE_ID_AMPL}>Ampliaciones</label>
        <input
            id={process.env.REACT_APP_MAP_STYLE_ID_BASE}
            type="radio"
            name="rtoggle"
            value="Base"
            onClick={(e) => {
            changeStyle(e);
            }}
        />
        <label for={process.env.REACT_APP_MAP_STYLE_ID_BASE}>Base</label>
        <input
            id={process.env.REACT_APP_MAP_STYLE_ID_CO}
            type="radio"
            name="rtoggle"
            value="Colombia"
            onClick={(e) => {
            changeStyle(e);
            }}
        />
        <label for={process.env.REACT_APP_MAP_STYLE_ID_CO}>Colombia</label>
        <input
            id={process.env.REACT_APP_MAP_STYLE_ID_STREETS}
            type="radio"
            name="rtoggle"
            value="Streets"
            onClick={(e) => {
            changeStyle(e);
            }}
        />
        <label for={process.env.REACT_APP_MAP_STYLE_ID_STREETS}>Streets</label>
        </div>
    );
}

export default Menu