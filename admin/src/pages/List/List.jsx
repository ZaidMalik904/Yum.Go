import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Trash2, ShoppingBasket, Filter } from 'lucide-react'

const CATEGORIES = ['All', 'Salad', 'Rolls', 'Desserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles', 'Pizza', 'Burger', 'Ice Cream', 'Drinks']

const List = ({ url }) => {
  const [list, setList] = useState([])
  const [currCategory, setCurrCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 640)

  const listFood = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${url}/api/food/list`)
      if (res.data.success) setList(res.data.foods)
      else toast.error('Error fetching food list')
    } catch { toast.error('Error connecting to server') }
    finally { setLoading(false) }
  }

  const removeFood = async (id) => {
    try {
      const res = await axios.post(`${url}/api/food/remove`, { id })
      if (res.data.success) { toast.success(res.data.message); await listFood() }
      else toast.error('Error removing food')
    } catch { toast.error('Error connecting to server') }
  }

  useEffect(() => {
    listFood()
    const handleResize = () => setIsMobileView(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filtered = list.filter(i => currCategory === 'All' || i.category === currCategory)

  return (
    <div className="page-container" style={{ overflow: 'hidden' }}>

      {/* ── Page Header ── */}
      <div className="page-header" style={{ justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="page-header-icon">
            <ShoppingBasket size={26} />
          </div>
          <div>
            <h1>Menu Catalog</h1>
            <p>{isMobileView ? "Manage your dishes." : "Manage all dishes available across restaurants."}</p>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div style={{ position: 'relative', width: isMobileView ? '100%' : 'auto' }}>
          <button
            onClick={() => setShowFilter(!showFilter)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: currCategory !== 'All' ? '#fff0ed' : '#fff',
              border: currCategory !== 'All' ? '1.5px solid #ff6347' : '1.5px solid #e2e8f0',
              borderRadius: 16, padding: isMobileView ? '10px 16px' : '12px 20px',
              cursor: 'pointer', transition: '0.2s',
              width: isMobileView ? '100%' : 'auto',
              justifyContent: isMobileView ? 'center' : 'flex-start'
            }}
          >
            <Filter size={isMobileView ? 16 : 18} color={currCategory !== 'All' ? '#ff6347' : '#94a3b8'} />
            <span style={{ fontSize: isMobileView ? 12 : 13, fontWeight: 700, color: currCategory !== 'All' ? '#ff6347' : '#64748b' }}>
              {currCategory === 'All' ? 'Filter Category' : currCategory}
            </span>
          </button>

          {showFilter && (
            <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 10, background: '#fff', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', width: isMobileView ? '100%' : 220, zIndex: 100, padding: 8, maxHeight: 300, overflowY: 'auto' }}>
              {CATEGORIES.map(c => (
                <div
                  key={c}
                  onClick={() => { setCurrCategory(c); setShowFilter(false); }}
                  style={{ padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, color: currCategory === c ? '#ff6347' : '#64748b', cursor: 'pointer', background: currCategory === c ? '#fff0ed' : 'transparent', transition: '0.2s' }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0' }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="card shadow-premium" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-responsive">
            <div style={{ minWidth: isMobileView ? 600 : 750 }}>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobileView ? '70px 1fr 120px 80px 50px' : '80px 1fr 140px 100px 60px',
                alignItems: 'center', padding: isMobileView ? '14px 20px' : '14px 28px',
                background: '#f8fafc', borderBottom: '1px solid #f1f5f9', gap: isMobileView ? 12 : 16
              }}>
                {['Img', 'Dish Name', 'Category', 'Price', 'Act'].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', textAlign: h === 'Act' ? 'center' : 'left' }}>{h}</span>
                ))}
              </div>

              {/* Table Rows */}
              {filtered.length === 0 ? (
                <div style={{ padding: '64px 28px', textAlign: 'center' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#94a3b8' }}>No items found.</p>
                </div>
              ) : (
                filtered.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobileView ? '70px 1fr 120px 80px 50px' : '80px 1fr 140px 100px 60px',
                      alignItems: 'center', padding: isMobileView ? '16px 20px' : '16px 28px',
                      borderBottom: i < filtered.length - 1 ? '1px solid #f8fafc' : 'none',
                      gap: isMobileView ? 12 : 16, transition: '0.2s'
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', width: isMobileView ? 48 : 56, height: isMobileView ? 48 : 56 }}>
                      <img
                        src={`${url}/images/${item.image}`}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', borderRadius: 14, objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                      />
                    </div>
                    {/* Name */}
                    <p style={{ fontSize: isMobileView ? 13 : 14, fontWeight: 700, color: '#0f172a' }}>{item.name}</p>
                    {/* Category */}
                    <div>
                      <span style={{ display: 'inline-block', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                        {item.category}
                      </span>
                    </div>
                    {/* Price */}
                    <p style={{ fontSize: isMobileView ? 14 : 15, fontWeight: 800, color: '#0f172a' }}>${item.price}</p>
                    {/* Delete */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        onClick={() => removeFood(item._id)}
                        style={{ width: 34, height: 34, background: '#fef2f2', border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default List