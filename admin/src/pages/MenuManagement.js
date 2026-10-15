import {useEffect,useState} from "react";
import axios from "axios";
import "./MenuManagement.css";

function MenuManagement(){
  const [menu,setMenu]=useState([]);
  const [categories,setCategories]=useState([]);
  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("All");
  const [showAddForm,setShowAddForm]=useState(false);
  const [editingItem,setEditingItem]=useState(null);
  const [form,setForm]=useState({item_name:"",price:"",category_id:"",image:null});

  const loadMenu=async()=>{
    try{
      const res=await axios.get("http://localhost:5000/api/menu");
      setMenu(res.data);
    }catch(err){console.log(err);}
  };

  const loadCategories=async()=>{
    try{
      const res=await axios.get("http://localhost:5000/api/menu/categories");
      setCategories(res.data);
    }catch(err){console.log(err);}
  };

  useEffect(()=>{
    loadMenu();
    loadCategories();
  },[]);

  const handleChange=e=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleAddItem=async e=>{
    e.preventDefault();

    try{
      const data=new FormData();
      data.append("item_name",form.item_name);
      data.append("price",Number(form.price));
      data.append("category_id",Number(form.category_id));
      if(form.image)data.append("image",form.image);

      await axios.post("http://localhost:5000/api/menu",data);

      setForm({item_name:"",price:"",category_id:"",image:null});
      setShowAddForm(false);
      loadMenu();
      alert("Menu item added successfully!");
    }catch(err){
      console.log(err);
      alert(err.response?.data?.message||"Failed to add menu item.");
    }
  };

  const handleUpdateItem=async()=>{
    try{
      const selectedCategory=categories.find(
        item=>item.category_name===editingItem.category_name
      );

      const data=new FormData();
      data.append("item_name",editingItem.item_name);
      data.append("price",Number(editingItem.price));
      data.append("category_id",selectedCategory.category_id);

      if(editingItem.image)data.append("image",editingItem.image);

      await axios.put(
        `http://localhost:5000/api/menu/${editingItem.item_id}`,
        data
      );

      setEditingItem(null);
      loadMenu();
      alert("Menu item updated successfully!");
    }catch(err){
      console.log(err);
      alert(err.response?.data?.message||"Failed to update item.");
    }
  };

  const handleDeleteItem=async item=>{
    if(!window.confirm(`Are you sure you want to remove "${item.item_name}"?`))return;

    try{
      await axios.delete(`http://localhost:5000/api/menu/${item.item_id}`);
      loadMenu();
      alert("Menu item removed successfully!");
    }catch(err){
      console.log(err);
      alert("Failed to remove menu item.");
    }
  };

  const filteredMenu=menu.filter(item=>{
    const matchesSearch=item.item_name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory=category==="All"||item.category_name===category;
    return matchesSearch&&matchesCategory;
  });

  return(
    <div className="menu-management">
      <div className="menu-page-header">
        <div>
          <h2>Menu Management</h2>
          <p>Manage restaurant menu items and prices.</p>
        </div>
        <button className="add-menu-btn" onClick={()=>setShowAddForm(true)}>
          + Add Menu Item
        </button>
      </div>

      {showAddForm&&(
        <div className="settings-card">
          <div className="settings-header">
            <div>
              <h2>Add Menu Item</h2>
              <p>Add a new item to the restaurant menu.</p>
            </div>
          </div>

          <form onSubmit={handleAddItem}>
            <div className="form-grid">
              <div className="form-group">
                <label>Item Name</label>
                <input
                  type="text"
                  name="item_name"
                  value={form.item_name}
                  onChange={handleChange}
                  placeholder="Example: Paneer Tikka"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Example: 250"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(item=>(
                    <option key={item.category_id} value={item.category_id}>
                      {item.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Food Image <span>(Optional)</span></label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={e=>setForm({...form,image:e.target.files[0]})}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={()=>setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit">Add Item</button>
            </div>
          </form>
        </div>
      )}

      {editingItem&&(
        <div className="settings-card">
          <div className="settings-header">
            <div>
              <h2>Edit Menu Item</h2>
              <p>Update menu item details.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                value={editingItem.item_name}
                onChange={e=>setEditingItem({...editingItem,item_name:e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={editingItem.price}
                onChange={e=>setEditingItem({...editingItem,price:e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={editingItem.category_name}
                onChange={e=>setEditingItem({...editingItem,category_name:e.target.value})}
              >
                {categories.map(item=>(
                  <option key={item.category_id} value={item.category_name}>
                    {item.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Food Image <span>(Optional)</span></label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={e=>setEditingItem({
                  ...editingItem,
                  image:e.target.files[0]
                })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={()=>setEditingItem(null)}>
              Cancel
            </button>
            <button type="button" onClick={handleUpdateItem}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="menu-toolbar">
        <input
          className="menu-search"
          type="text"
          placeholder="Search menu items..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />

        <select
          className="category-filter"
          value={category}
          onChange={e=>setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(item=>(
            <option key={item.category_id} value={item.category_name}>
              {item.category_name}
            </option>
          ))}
        </select>
      </div>

      <div className="menu-table-card">
        <table className="menu-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMenu.length===0?(
              <tr>
                <td colSpan="4">No menu items found.</td>
              </tr>
            ):(
              filteredMenu.map(item=>(
                <tr key={item.item_id}>
                  <td className="menu-item-name">{item.item_name}</td>
                  <td>
                    <span className="category-badge">{item.category_name}</span>
                  </td>
                  <td className="menu-price">₹{item.price}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={()=>setEditingItem(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={()=>handleDeleteItem(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuManagement;