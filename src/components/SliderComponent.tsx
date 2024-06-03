import React from 'react';
import Slider from 'react-slider';
import './SliderComponent.css';

const SliderComponent = ({ label, max, value, onChange }) => {
    return (
      <div className="slider-container">
        <label className="slider-label">{label}: {value}</label>
        <Slider
          className="slider"
          thumbClassName="slider-thumb"
          trackClassName="slider-track"
          min={0}
          max={max}
          value={[0, value]}
          onChange={([, newValue]) => onChange(newValue)}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />
      </div>
    );
  };
  
  export default SliderComponent;