import React, { useState, useRef, useEffect } from 'react';
import { Form, InputGroup, ListGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { useTheme } from '../../Context/TheamContext/ThemeContext';
import { SearchRouteData } from './SearchRouteData';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);
  const { darkMode } = useTheme();

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleIconClick = () => {
    setExpanded(!expanded);
  };

  const filteredRoutes = searchTerm
    ? SearchRouteData.filter((route) =>
      route.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSearchTerm('');
        setExpanded(false);
      }
    };

    document.body.addEventListener('click', handleClickOutside);

    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ width: expanded ? '210px' : '40px', transition: '1s ease' }} className="searchComponent bg-white" ref={inputRef}>
      <InputGroup style={{ position: 'relative' }}>
        <Form.Control
          className="rounded-5"
          placeholder="Search any page"
          value={searchTerm}
          onChange={handleSearch}
          style={{ display: expanded ? 'block' : 'none', transition: '1s ease' }}
        />
        <span
          style={{
            position: 'absolute',
            top: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            right: '0',
            transform: 'translate(-5px, -50%)',
            zIndex: '2001',
            color: darkMode ? "var(--primaryDashMenuColor)" : "var(--primaryDashColorDark)",
            backgroundColor: darkMode ? "var(--primaryDashColorDark)" : "var(--primaryDashMenuColor)",
            cursor: 'pointer',
          }}
          onClick={handleIconClick}
        >
          <FaSearch />
        </span>
      </InputGroup>

      {filteredRoutes.length > 0 && expanded ? (
        <ListGroup className="bg-white p-2 shadow" style={{ position: 'absolute', width: '210px' }}>
          {filteredRoutes.map((route, index) => (
            <Link style={{ textDecorationLine: 'none' }} to={route.path} key={index}>
              <span style={{ textDecorationLine: 'none' }} className="text-muted search-hoverable-text">
                {route.name}
              </span>
            </Link>
          ))}
        </ListGroup>
      ) : (
        <div>
          {searchTerm && expanded && (
            <span style={{ position: 'absolute', width: '210px', textAlign: 'start' }} className='bg-white shadow-sm border rounded-2 py-1  px-3 text-muted'>No result found</span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
