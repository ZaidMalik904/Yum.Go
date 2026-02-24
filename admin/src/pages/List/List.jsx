import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Trash2, ShoppingBasket, Filter, Search } from 'lucide-react'

const CATEGORIES = ['All', 'Salad', 'Rolls', 'Desserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles', 'Pizza', 'Burger', 'Ice Cream', 'Drinks']

const List = ({ url }) => {
  const [list, setList] = useState([])
  const [currCategory, setCurrCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024)

  const listFood = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${url}/api/food/list`)
      if (res.data.success) setList(res.data.foods)
      else toast.error('Error fetching food list')
    } catch { toast.error('Error connecting to server') }
    finally { setLoading(false) }
  }, [url])

  const removeFood = async (id) => {
    try {
      const res = await axios.post(`${url}/api/food/remove`, { id })
      if (res.data.success) {
        toast.success(res.data.message)
        await listFood()
      }
      else toast.error('Error removing food')
    } catch { toast.error('Error connecting to server') }
  }

  useEffect(() => {
    listFood()
    const handleResize = () => setIsMobileView(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [listFood])

  const filtered = list.filter(i => {
    const matchesCategory = currCategory === 'All' || i.category === currCategory;
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  })

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fadeIn">

      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="page-header-icon">
            <ShoppingBasket size={26} />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Menu Catalog</h1>
            <p className="text-[13px] text-slate-400 font-semibold mt-1">
              {isMobileView ? "Manage your dishes." : "Manage all dishes available across restaurants."}
            </p>
          </div>
        </div>

        <div className="flex gap-3 w-full lg:max-w-lg">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              placeholder="Search dishes..."
              className="admin-input"
              style={{ paddingLeft: '2.75rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`h-full flex items-center gap-2 px-5 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer whitespace-nowrap ${currCategory !== 'All'
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-primary/30'
                }`}
            >
              <Filter size={15} />
              <span>{currCategory === 'All' ? 'Category' : currCategory}</span>
            </button>

            {showFilter && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-[24px] shadow-2xl border border-slate-100 min-w-[190px] z-50 p-2 animate-fadeInDown overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto">
                  {CATEGORIES.map(c => (
                    <div
                      key={c}
                      onClick={() => { setCurrCategory(c); setShowFilter(false); }}
                      className={`px-5 py-2.5 rounded-xl text-[12px] font-black cursor-pointer transition-all ${currCategory === c ? 'bg-primary-light text-primary' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="spinner" />
        </div>
      ) : (
        <div className="bg-white rounded-[40px] shadow-premium border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {['Preview', 'Item Identity', 'Category Tag', 'Price Point', 'Action'].map((h, i) => (
                    <th key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8 py-5 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <p className="text-slate-300 font-black italic">No culinary masterpieces found in this category.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/40 transition-colors group">
                      {/* Image */}
                      <td className="px-8 py-5">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={`${url}/images/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      {/* Name */}
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-base font-black text-slate-900 leading-tight">{item.name}</span>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">ID: {item._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest border border-slate-200">
                          {item.category}
                        </span>
                      </td>
                      {/* Price */}
                      <td className="px-8 py-5">
                        <span className="text-lg font-black text-slate-900 tracking-tighter">${item.price}</span>
                      </td>
                      {/* Delete */}
                      <td className="px-8 py-5">
                        <div className="flex justify-center lg:justify-start">
                          <button
                            onClick={() => removeFood(item._id)}
                            className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center transition-all duration-300 hover:bg-red-500 hover:text-white hover:scale-110 active:scale-90 shadow-sm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Stat */}
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Displaying <span className="text-slate-900">{filtered.length}</span> Active Menu Entities
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default List