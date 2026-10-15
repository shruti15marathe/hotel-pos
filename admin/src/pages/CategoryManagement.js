import { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryManagement.css";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu/categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/menu/categories", {
        category_name: categoryName
      });

      setCategoryName("");
      loadCategories();

      alert("Category added successfully!");
    } catch (err) {
      console.log(err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to add category.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory.category_name.trim()) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/menu/categories/${editingCategory.category_id}`,
        {
          category_name: editingCategory.category_name
        }
      );

      setEditingCategory(null);
      loadCategories();

      alert("Category updated successfully!");
    } catch (err) {
      console.log(err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to update category.");
      }
    }
  };

  const handleCategoryStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/menu/categories/${id}/status`,
        {
          status: status
        }
      );

      loadCategories();

      alert(
        status === "inactive"
          ? "Category deactivated successfully!"
          : "Category activated successfully!"
      );
    } catch (err) {
      console.log(err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to update category status.");
      }
    }
  };

  return (
    <div className="category-management">
      <div className="category-page-header">
        <div>
          <h2>Category Management</h2>
          <p>Manage restaurant menu categories.</p>
        </div>
      </div>

      <div className="category-content">
        <div className="settings-card">
          <div className="settings-header">
            <div>
              <h2>Add Category</h2>
              <p>Create a new menu category.</p>
            </div>
          </div>

          <form onSubmit={handleAddCategory}>
            <div className="form-group">
              <label>Category Name</label>

              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Example: North Indian"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Category"}
              </button>
            </div>
          </form>
        </div>

        {editingCategory && (
          <div className="settings-card">
            <div className="settings-header">
              <div>
                <h2>Edit Category</h2>
                <p>Update the category name.</p>
              </div>
            </div>

            <div className="form-group">
              <label>Category Name</label>

              <input
                type="text"
                value={editingCategory.category_name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    category_name: e.target.value
                  })
                }
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateCategory}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        <div className="category-table-card">
          <div className="category-table-header">
            <div>
              <h2>Categories</h2>
              <p>{categories.length} categories available</p>
            </div>
          </div>

          <table className="category-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4">No categories found.</td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.category_id}>
                    <td>#{category.category_id}</td>

                    <td className="category-name">
                      {category.category_name}
                    </td>

                    <td>
                      <span
                        className={
                          category.status === "inactive"
                            ? "status-badge inactive"
                            : "status-badge"
                        }
                      >
                        {category.status || "active"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => setEditingCategory(category)}
                      >
                        Edit
                      </button>

                      <button
                        className={
                          category.status === "inactive"
                            ? "activate-btn"
                            : "deactivate-btn"
                        }
                        onClick={() =>
                          handleCategoryStatus(
                            category.category_id,
                            category.status === "inactive"
                              ? "active"
                              : "inactive"
                          )
                        }
                      >
                        {category.status === "inactive"
                          ? "Activate"
                          : "Deactivate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CategoryManagement;