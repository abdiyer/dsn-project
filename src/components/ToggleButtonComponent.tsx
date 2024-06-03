import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  padding: 10px 15px;
  margin: 5px;
  border: none;
  background-color: ${props => (props.active ? '#007bff' : '#ccc')};
  color: white;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: ${props => (props.active ? '#0056b3' : '#999')};
  }
`;

const ToggleButtonComponent = ({ label, value, onChange }) => {
  return (
    <div className="toggle-button-container">
      <label className="toggle-button-label">{label}: {value ? 'Yes' : 'No'}</label>
      <Button active={value === 1} onClick={() => onChange(value === 1 ? 0 : 1)}>
        {value ? 'Yes' : 'No'}
      </Button>
    </div>
  );
};

export default ToggleButtonComponent;