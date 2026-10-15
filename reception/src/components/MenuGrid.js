import { useEffect, useState } from "react";
import axios from "axios";

function MenuGrid({ addToCart, selectedCategory }) {
const [menu, setMenu] = useState([]);
const [search, setSearch] = useState("");

useEffect(() => {
axios
.get("http://localhost:5000/api/menu")
.then((res) => setMenu(res.data))
.catch((err) => console.log("Failed to load menu:", err));
}, []);

const filteredMenu = menu.filter((item) => {
const categoryMatch =
selectedCategory === "All" ||
item.category_name === selectedCategory;


const searchMatch = item.item_name
  .toLowerCase()
  .includes(search.toLowerCase());

return categoryMatch && searchMatch;


});

const handleSearchKeyDown = (e) => {
if (e.key === "Enter" && filteredMenu.length > 0) {
addToCart(filteredMenu[0]);
setSearch("");
}
};

return ( <div className="menu-grid"> <div className="menu-search">
<input
type="text"
placeholder="Search menu items..."
value={search}
onChange={(e) => setSearch(e.target.value)}
onKeyDown={handleSearchKeyDown}
autoFocus
/> </div>

  {filteredMenu.length === 0 ? (
    <div className="no-menu-message">
      <h3>No menu items found</h3>
      <p>Try another food item or category.</p>
    </div>
  ) : (
    filteredMenu.map((item) => (
      <div className="food-card" key={item.item_id}>
        {item.image_url ? (
          <img
            className="food-img"
            src={`http://localhost:5000${item.image_url}`}
            alt={item.item_name}
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
          />
        ) : (
          <div className="food-img" aria-hidden="true" />
        )}

        <div className="food-info">
          <h4>{item.item_name}</h4>
          <p>{item.category_name}</p>

          <div className="food-bottom">
            <strong>₹{item.price}</strong>
            <button onClick={() => addToCart(item)}>Add</button>
          </div>
        </div>
      </div>
    ))
  )}
</div>


);
}

export default MenuGrid;
