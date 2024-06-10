import { useState, useEffect } from 'react';
import axios from 'axios';
import './Catalogo.css';
import CardModal from '../../components/cards/CardModal/CardModal';
import Cards from '../../components/cards/Cards';

const Catalogo = () => {
  const [items, setItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleItemsCount, setVisibleItemsCount] = useState(6);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cat, setCat] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  
  useEffect(() => {
    fetchData(selectedCategories);
    getCat();
  }, [selectedCategories]);

  useEffect(() => {
    filterItemsBySearchTerm();
  }, [searchTerm, items]);

  const fetchData = async (selectedCategories) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/products/cat`, {
        params: { category: selectedCategories.join(',') } // Pass multiple categories as comma-separated string
      });
      const { data } = response;
      console.log(data)
      setItems(data);
      setDisplayedItems(data.slice(0, 6));
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};
const getCat = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/products/categorias");
    const { data } = response;
    setCat(data);
  } catch (error) {
    console.error("Hubo un error al traer categorias", error);
  }
};

const handleFilterChange = (e) => {
  const { name } = e.target;
  if (e.target.checked) {
    setSelectedCategories([...selectedCategories, name]);
  } else {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== name));
  }
};


const handleLoadMore = () => {
    const nextItems = items.slice(visibleItemsCount, visibleItemsCount + 6);
    setDisplayedItems(prevItems => [...prevItems, ...nextItems]);
    setVisibleItemsCount(prevCount => prevCount + 6);
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const filterItemsBySearchTerm = () => {
    const filteredItems = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedItems(filteredItems.slice(0, visibleItemsCount));
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedCategories([]); // Desmarcar todos los filtros
  };

  return (
    <div className="catalogo-container">
      <div className="filters-column">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          className='search-cat'
        />
        {cat && cat.map((cat, index) => {
          return (
            <div key={index} className="filt-box">
              <label className="label-filt">
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  name={cat}
                  value={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={handleFilterChange}
                />

              </label>
              <div className='name-check'>{cat}</div>

            </div>
          )
        })}
      </div>
            <div className="items-column">
                <div className="items-grid">
                    {displayedItems.map((item, index) => (
                        <div key={index} className="item-card" onClick={() => handleCardClick(item)}>
                            <Cards images={item.images} name={item.name} price={item.price} />
                        </div>
                    ))}
                </div>
                {visibleItemsCount < items.length && (
                    <div className='cont-more-btn'>
                        <button onClick={handleLoadMore} className='more-btn'>Ver más</button>
                    </div>
                )}
            </div>
            {selectedItem && (
                <CardModal
                    onClose={handleCloseModal}
                    images={selectedItem.images}
                    name={selectedItem.name}
                    price={selectedItem.price}
                    descripcion={selectedItem.descripcion}
                />
            )}
        </div>
    );
};

export default Catalogo;
