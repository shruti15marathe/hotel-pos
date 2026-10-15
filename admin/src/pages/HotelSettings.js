import { useEffect, useState } from "react";
import axios from "axios";
import "./HotelSettings.css";

function HotelSettings() {
  const [form, setForm] = useState({
    hotel_name: "",
    address: "",
    gst: "",
    email: "",
    phone: "",
    logo: null
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hotel")
      .then((res) => {
        setForm({
          hotel_name: res.data.hotel_name || "",
          address: res.data.address || "",
          gst: res.data.gst || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          logo: res.data.logo || null
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:5000/api/hotel",
        form
      );

      setMessage("Hotel information updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.log(err);
      setMessage("Failed to update hotel information.");
    }
  };

  return (
    <div className="hotel-settings">

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <div className="settings-card">

        <div className="settings-header">
          <div>
            <h2>Hotel Information</h2>
            <p>
              Manage the information displayed on invoices.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Hotel Name</label>
              <input
                type="text"
                name="hotel_name"
                value={form.hotel_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>GST Number</label>
              <input
                type="text"
                name="gst"
                value={form.gst}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="form-actions">
            <button type="submit">
              Save Changes
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}

export default HotelSettings;
