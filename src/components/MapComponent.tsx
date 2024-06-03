
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import coordinatesData from '../data/coords.json';
import SliderComponent from './SliderComponent.tsx';
import ToggleButtonComponent from './ToggleButtonComponent.tsx';
import exportToCSV from './exportToCSV.ts';
import styled from 'styled-components';

const AppContainer = styled.div`
  font-family: 'Arial', sans-serif;
  padding: 20px;
  background-color: #f4f4f9;
`;

const ControlPanel = styled.div`
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FilterNameInput = styled.input`
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FilterButton = styled.button`
  padding: 10px 15px;
  margin: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ExportButton = styled(FilterButton)`
  background-color: #28a745;
  &:hover {
    background-color: #218838;
  }
`;

const FilterList = styled.div`
  margin-top: 20px;
`;

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const FilterActions = styled.div`
  display: flex;
  gap: 10px;
`;

const mapContainerStyle = {
  height: "400px",
  width: "100%",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
};

const center = [36.262003, -115.154217];

const MapComponent = () => {
  const defaultFilters = {
    n_of_donuts: 100,
    n_of_coffee: 5000,
    spent_in_amazon: 10000,
    attend_a_zoo: 1,
    can_cook_pizza: 1
  };

  const [polygons, setPolygons] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(defaultFilters);
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('filters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        return Array.isArray(parsedFilters) ? parsedFilters : [];
      } catch (e) {
        console.error('Error parsing filters from localStorage', e);
        return [];
      }
    }
    return [];
  });
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const filteredPolygons = coordinatesData.filter((polygonData) => {
      return (
        polygonData.n_of_donuts <= currentFilter.n_of_donuts &&
        polygonData.n_of_coffee <= currentFilter.n_of_coffee &&
        polygonData.spent_in_amazon <= currentFilter.spent_in_amazon &&
        (currentFilter.attend_a_zoo === 1 ? polygonData.attend_a_zoo : !polygonData.attend_a_zoo) &&
        (currentFilter.can_cook_pizza === 1 ? polygonData.can_cook_pizza : !polygonData.can_cook_pizza)
      );
    }).map((polygonData) => {
      const paths = polygonData.boundaries.coordinates[0][0].map(coord => [coord[1], coord[0]]);
      return {
        id: polygonData.id,
        paths: paths,
        ...polygonData
      };
    });
    setPolygons(filteredPolygons);
  }, [currentFilter]);

  const handleSliderChange = (param, value) => {
    setCurrentFilter({
      ...currentFilter,
      [param]: value
    });
  };

  const saveFilter = () => {
    if (!filterName.trim()) {
      alert('Please enter a filter name');
      return;
    }
    const newFilter = { id: Date.now(), name: filterName, values: currentFilter };
    const updatedFilters = [...filters, newFilter];
    setFilters(updatedFilters);
    localStorage.setItem('filters', JSON.stringify(updatedFilters));
    setFilterName('');
    console.log('Saved filters:', updatedFilters);
  };

  const loadFilter = (filter) => {
    setCurrentFilter(filter.values);
    console.log('Loaded filter:', filter);
  };

  const deleteFilter = (filterId) => {
    const updatedFilters = filters.filter(filter => filter.id !== filterId);
    setFilters(updatedFilters);
    localStorage.setItem('filters', JSON.stringify(updatedFilters));
    console.log('Deleted filter:', filterId, 'Updated filters:', updatedFilters);
  };

  const exportCurrentFilteredAreas = () => {
    exportToCSV(polygons, 'filtered_areas');
  };

  return (
    <AppContainer>
      <ControlPanel>
        <SliderComponent
          label="Number of Donuts"
          max={100}
          value={currentFilter.n_of_donuts}
          onChange={(value) => handleSliderChange('n_of_donuts', value)}
        />
        <SliderComponent
          label="Number of Coffee"
          max={5000}
          value={currentFilter.n_of_coffee}
          onChange={(value) => handleSliderChange('n_of_coffee', value)}
        />
        <SliderComponent
          label="Spent in Amazon"
          max={10000}
          value={currentFilter.spent_in_amazon}
          onChange={(value) => handleSliderChange('spent_in_amazon', value)}
        />
        <ToggleButtonComponent
          label="Attend a Zoo"
          value={currentFilter.attend_a_zoo}
          onChange={(value) => handleSliderChange('attend_a_zoo', value)}
        />
        <ToggleButtonComponent
          label="Can Cook Pizza"
          value={currentFilter.can_cook_pizza}
          onChange={(value) => handleSliderChange('can_cook_pizza', value)}
        />

        <div>
          <FilterNameInput
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Filter name"
          />
          <FilterButton onClick={saveFilter}>Save Filter</FilterButton>
        </div>
        <div>
          <ExportButton onClick={exportCurrentFilteredAreas}>Export Current Filtered Areas to CSV</ExportButton>
        </div>

        <FilterList>
          {filters.map(filter => (
            <FilterItem key={filter.id}>
              <span>{filter.name}</span>
              <FilterActions>
                <FilterButton onClick={() => loadFilter(filter)}>Load</FilterButton>
                <FilterButton onClick={() => deleteFilter(filter.id)}>Delete</FilterButton>
              </FilterActions>
            </FilterItem>
          ))}
        </FilterList>
      </ControlPanel>
      <MapContainer style={mapContainerStyle} center={center} zoom={14}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {polygons.map((polygon) => (
          <Polygon
            key={polygon.id}
            positions={polygon.paths}
            pathOptions={{ color: 'red' }}
          />
        ))}
      </MapContainer>
    </AppContainer>
  );
};

export default MapComponent;