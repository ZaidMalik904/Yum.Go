import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Upload, PlusCircle, LayoutGrid, DollarSign, Store } from 'lucide-react'

const Add = ({ url }) => {
  const [image, setImage] = useState(false)
  const [restaurants, setRestaurants] = useState([])
  const [data, setData] = useState({ name: '', description: '', price: '', restaurantId: '' })
  const [loading, setLoading] = useState(false)

  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/api/restaurant/list`)
      if (res.data.success) {
        setRestaurants(res.data.data)
        if (res.data.data.length > 0)
          setData(p => ({ ...p, restaurantId: res.data.data[0]._id }))
      }
    } catch { toast.error('Error fetching restaurants') }
  }, [url])

  useEffect(() => { fetchRestaurants() }, [fetchRestaurants])

  const onChange = e => setData(p => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    if (!image) { toast.error('Please upload an image'); return }
    setLoading(true)
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
    finally { setLoading(false) }
  }

  return (
    <div className="p-4 md:p-8 max-w-[1000px] mx-auto animate-fadeIn">

      {/* ── Page Header ── */}
      <div className="flex items-center gap-4 mb-10">
        <div className="page-header-icon">
          <PlusCircle size={26} />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Add New Product</h1>
          <p className="text-[13px] text-slate-400 font-semibold mt-1">Create a new dish entry and assign it to a restaurant.</p>
        </div>
      </div>

      {/* ── Form Card ── */}
      <div className="bg-white rounded-[40px] shadow-premium border border-slate-100 p-8 md:p-12">
        <form onSubmit={onSubmit} className="flex flex-col gap-10">

          {/* Image Upload */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
              <Upload size={14} className="text-primary" /> Upload Dish Visual
            </p>
            <label htmlFor="image" className="cursor-pointer inline-block group">
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 bg-slate-50/50 group-hover:border-primary group-hover:bg-primary-light/30">
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                      <Upload size={24} strokeWidth={2.5} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-primary tracking-widest uppercase">Select Asset</span>
                  </div>
                )}
              </div>
            </label>
            <input onChange={e => setImage(e.target.files[0])} type="file" id="image" hidden />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                <LayoutGrid size={14} className="text-primary" /> Recipe Name
              </p>
              <input
                className="admin-input" name="name" type="text" value={data.name}
                placeholder="Ex: Grilled Chicken Salad" required onChange={onChange}
              />
            </div>
            {/* Restaurant */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
                <Store size={14} className="text-primary" /> Assigment Vendor
              </p>
              <div className="relative">
                <select
                  className="admin-input appearance-none bg-no-repeat bg-[right_1.5rem_center] cursor-pointer"
                  name="restaurantId" value={data.restaurantId} required onChange={onChange}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}
                >
                  {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                  {restaurants.length === 0 && <option value="">No Restaurants Found</option>}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1">Taste Description</p>
            <textarea
              className="admin-input min-h-[140px] py-5 resize-none"
              name="description" value={data.description} rows={4} required onChange={onChange}
              placeholder="Describe the aromatic ingredients and flavor profile..."
            />
          </div>

          {/* Price */}
          <div className="max-w-sm space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] ml-1 flex items-center gap-2">
              <DollarSign size={14} className="text-primary" /> Premium Valuaton ($)
            </p>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold">$</div>
              <input
                className="admin-input pl-10" name="price" type="number" value={data.price}
                placeholder="25.00" required onChange={onChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full md:w-auto min-w-[240px] justify-center py-5 shadow-button disabled:opacity-50"
            >
              {loading ? "Publishing Transaction..." : "Save Product Entry"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Add