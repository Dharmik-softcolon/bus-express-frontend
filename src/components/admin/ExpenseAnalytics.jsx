import { useState, useEffect } from 'react'
import { TrendingDown, Bus, Calendar, Filter, Download, Fuel, CreditCard, Wrench, Car } from 'lucide-react'
import { expenseAPI } from '../../services/api'

const ExpenseAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedBus, setSelectedBus] = useState('all')
  const [selectedExpenseType, setSelectedExpenseType] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expenseData, setExpenseData] = useState(null)

  // Load expense analytics on component mount
  useEffect(() => {
    loadExpenseAnalytics()
  }, [selectedPeriod])

  const loadExpenseAnalytics = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await expenseAPI.getExpenseStatistics({
        period: selectedPeriod,
        bus: selectedBus === 'all' ? undefined : selectedBus,
        type: selectedExpenseType === 'all' ? undefined : selectedExpenseType
      })
      
      if (response.success) {
        setExpenseData(response.data)
          } else {
            setError('Failed to load expense analytics')
            setExpenseData(null)
          }
    } catch (error) {
      console.error('Error loading expense analytics:', error)
      setError('Failed to load expense analytics')
      setExpenseData(null)
    } finally {
      setLoading(false)
    }
  }

  const buses = ['MH-01-AB-1234', 'MH-02-CD-5678', 'MH-03-EF-9012', 'MH-04-GH-3456']
  const periods = ['daily', 'weekly', 'monthly', 'yearly']
  const expenseTypes = [
    { value: 'fuel', label: 'Fuel', icon: Fuel, color: 'text-blue-600' },
    { value: 'fastag', label: 'FastTag', icon: CreditCard, color: 'text-green-600' },
    { value: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'text-orange-600' },
    { value: 'tyres', label: 'Tyres', icon: Car, color: 'text-purple-600' },
    { value: 'parking', label: 'Parking', icon: Car, color: 'text-gray-600' },
    { value: 'other', label: 'Other', icon: Wrench, color: 'text-red-600' }
  ]

  // Handle loading and error states
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading expense analytics...</span>
        </div>
      </div>
    )
  }

  if (error || !expenseData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-600">
            <p className="text-lg font-medium mb-2">Error loading analytics</p>
            <p className="text-sm">{error || 'No data available'}</p>
          </div>
        </div>
      </div>
    )
  }

  const filteredData = expenseData[selectedPeriod]?.filter(item => {
    const busMatch = selectedBus === 'all' || item.bus === selectedBus
    const typeMatch = selectedExpenseType === 'all' || item.type === selectedExpenseType
    return busMatch && typeMatch
  }) || []

  const totalExpenses = filteredData.reduce((sum, item) => sum + item.amount, 0)

  // Bus-wise expense breakdown
  const busWiseExpenses = buses.map(bus => {
    const busData = expenseData[selectedPeriod].filter(item => item.bus === bus)
    const total = busData.reduce((sum, item) => sum + item.amount, 0)
    const fuel = busData.filter(item => item.type === 'fuel').reduce((sum, item) => sum + item.amount, 0)
    const fastag = busData.filter(item => item.type === 'fastag').reduce((sum, item) => sum + item.amount, 0)
    const maintenance = busData.filter(item => item.type === 'maintenance').reduce((sum, item) => sum + item.amount, 0)
    const tyres = busData.filter(item => item.type === 'tyres').reduce((sum, item) => sum + item.amount, 0)
    const parking = busData.filter(item => item.type === 'parking').reduce((sum, item) => sum + item.amount, 0)
    
    return {
      bus,
      total,
      fuel,
      fastag,
      maintenance,
      tyres,
      parking,
      other: total - (fuel + fastag + maintenance + tyres + parking)
    }
  }).sort((a, b) => b.total - a.total)

  // Expense type breakdown
  const expenseTypeBreakdown = expenseTypes.map(type => {
    const typeData = expenseData[selectedPeriod].filter(item => item.type === type.value)
    const total = typeData.reduce((sum, item) => sum + item.amount, 0)
    const count = typeData.length
    
    return {
      ...type,
      total,
      count,
      percentage: totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0
    }
  }).filter(item => item.total > 0).sort((a, b) => b.total - a.total)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Analytics</h1>
          <p className="text-gray-600">Detailed expense analysis by bus and expense type</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field"
            >
              {periods.map(period => (
                <option key={period} value={period}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bus</label>
            <select
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Buses</option>
              {buses.map(bus => (
                <option key={bus} value={bus}>{bus}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expense Type</label>
            <select
              value={selectedExpenseType}
              onChange={(e) => setSelectedExpenseType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              {expenseTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
          </div>
          <TrendingDown className="h-8 w-8 text-red-600" />
        </div>
      </div>

      {/* Expense Type Breakdown */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Expense Type Breakdown</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenseTypeBreakdown.map((type, index) => {
              const IconComponent = type.icon
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <IconComponent className={`h-5 w-5 ${type.color} mr-2`} />
                      <span className="font-medium text-gray-900">{type.label}</span>
                    </div>
                    <span className="text-sm text-gray-500">{type.percentage}%</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">₹{type.total.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{type.count} transactions</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bus-wise Expense Analysis */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Bus-wise Expense Analysis</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FastTag</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tyres</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parking</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Other</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {busWiseExpenses.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Bus className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{item.bus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-red-600">₹{item.total.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.fuel.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.fastag.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.maintenance.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.tyres.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.parking.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.other.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Expense Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Detailed Expense Data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {selectedPeriod === 'daily' ? 'Date' : selectedPeriod === 'weekly' ? 'Week' : selectedPeriod === 'monthly' ? 'Month' : 'Year'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => {
                const expenseType = expenseTypes.find(type => type.value === item.type)
                const IconComponent = expenseType?.icon || Wrench
                const color = expenseType?.color || 'text-gray-600'
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {selectedPeriod === 'daily' ? item.date : 
                       selectedPeriod === 'weekly' ? item.week : 
                       selectedPeriod === 'monthly' ? item.month : item.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Bus className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{item.bus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <IconComponent className={`h-4 w-4 ${color} mr-2`} />
                        <span className="text-sm font-medium text-gray-900">{expenseType?.label || item.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-red-600">₹{item.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ExpenseAnalytics

