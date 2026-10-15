import {useEffect,useState} from "react";
import axios from "axios";

function CategoryBar({selectedCategory,setSelectedCategory}){
  const [categories,setCategories]=useState([]);

  useEffect(()=>{
    axios.get("http://localhost:5000/api/menu/categories")
      .then(res=>setCategories(res.data.filter(c=>c.status==="active")))
      .catch(err=>console.log(err));
  },[]);

  return <div className="category-wrapper">
    <div className="category-bar">
      <button className={selectedCategory==="All"?"active":""} onClick={()=>setSelectedCategory("All")}>All</button>
      {categories.map(c=><button key={c.category_id} className={selectedCategory===c.category_name?"active":""} onClick={()=>setSelectedCategory(c.category_name)}>{c.category_name}</button>)}
    </div>
  </div>;
}

export default CategoryBar;