import React, { useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Upload, PlusCircle, LayoutGrid, DollarSign, Store } from 'lucide-react'

const labelStyle = {
  fontSize: 11, fontWeight: 800, color: '#94a3b8',
  letterSpacing: 2, textTransform: 'uppercase',
  display: 'flex', alignItems: 'center', gap: 6,
  marginBottom: 10,
}
const inputStyle = {
  width: '100%', background: '#f8fafc',
  border: '1.5px solid #e2e8f0', borderRadius: 14,
  padding: '13px 18px', fontSize: 14, fontWeight: 600,
  color: '#0f172a', outline: 'none',
  fontFamily: 'inherit', transition: 'all 0.25s',
  boxSizing: 'border-box',
}

const Add = ({ url }) => {
  const [image, setImage] = useState(false)
  const [restaurants, setRestaurants] = useState([])
  const [data, setData] = useState({ name: '', description: '', price: '', restaurantId: '' })

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${url}/api/restaurant/list`)
      if (res.data.success) {
        setRestaurants(res.data.data)
        if (res.data.data.length > 0)
          setData(p => ({ ...p, restaurantId: res.data.data[0]._id }))
      }
    } catch { toast.error('Error fetching restaurants') }
  }

  useEffect(() => { fetchRestaurants() }, [])

  const onChange = e => setData(p => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    if (!image) { toast.error('Please upload an image'); return }
    const fd = new FormData()
    fd.append('name', data.name)
    fd.append('description', data.description)
    fd.append('price', Number(data.price))
    fd.append('restaurantId', data.restaurantId)
    fd.append('image', image)
    try {
      const res = await axios.post(`${url}/api/food/add`, fd)
      if (res.data.success) {
        setData({ name: '', description: '', price: '', restaurantId: restaurants[0]?._id || '' })
        setImage(false)
        toast.success(res.data.message)
      } else toast.error(res.data.message)
    } catch { toast.error('Error adding food') }
  }

  const focusStyle = { borderColor: '#ff6347', background: '#fff', boxShadow: '0 0 0 3px rgba(255,99,71,0.1)' }

  return (
    <div className="page-container" style={{ maxWidth: 860 }}>

      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header-icon">
          <PlusCircle size={26} />
        </div>
        <div>
          <h1>Add New Product</h1>
          <p>Create a new dish entry and assign it to a restaurant.</p>
        </div>
      </div>

      {/* ── Form Card ── */}
      <div className="card">
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Image Upload */}
          <div>
            <p style={labelStyle}><Upload size={14} style={{ color: '#ff6347' }} /> Upload Image</p>
            <label htmlFor="image" style={{ cursor: 'pointer', display: 'inline-block' }}>
              <div style={{
                width: 140, height: 140, borderRadius: 20,
                border: '2px dashed #e2e8f0',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', transition: 'all 0.25s', background: '#f8fafc',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff6347'; e.currentTarget.style.background = '#fff0ed' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc' }}
              >
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <Upload size={32} style={{ color: '#cbd5e1', marginBottom: 8, strokeWidth: 1.5 }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#cbd5e1', letterSpacing: 1 }}>BROWSE FILE</span>
                  </>
                )}
              </div>
            </label>
            <input onChange={e => setImage(e.target.files[0])} type="file" id="image" hidden />
          </div>

          {/* Name + Restaurant */}
          <div className="responsive-grid-2">
            <div>
              <p style={labelStyle}><LayoutGrid size={13} style={{ color: '#ff6347' }} />Product Name</p>
              <input
                className="admin-input" name="name" type="text" value={data.name}
                placeholder="Ex: Grilled Chicken Salad" required onChange={onChange}
              />
            </div>
            <div>
              <p style={labelStyle}><Store size={13} style={{ color: '#ff6347' }} />Select Restaurant</p>
              <select
                className="admin-input" style={{ cursor: 'pointer' }} name="restaurantId" value={data.restaurantId} required onChange={onChange}
              >
                {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                {restaurants.length === 0 && <option value="">No Restaurants Found</option>}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <p style={labelStyle}>Description</p>
            <textarea
              className="admin-input" style={{ minHeight: 110, resize: 'none' }}
              name="description" value={data.description} rows={4} required onChange={onChange}
              placeholder="Describe the ingredients and taste..."
            />
          </div>

          {/* Price */}
          <div>
            <p style={labelStyle}><DollarSign size={13} style={{ color: '#ff6347' }} />Product Price ($)</p>
            <input
              className="admin-input" name="price" type="number" value={data.price}
              placeholder="Ex: 25" required onChange={onChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', width: '100%', padding: 16 }}>
            Publish Product
          </button>

        </form>
      </div>
    </div>
  )
}

export default Add