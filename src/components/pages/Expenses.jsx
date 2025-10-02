import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Fuel,
  Wrench,
  Users,
  AlertTriangle,
  CreditCard
} from 'lucide-react'

const Expenses = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('expenses')
  const [loading, setLoading] = useState(true)
  const [expenseData] = useState({
    totalExpenses: 845000,
    monthlyExpenses: 142000,
    budgetAllocated: 180000,
    budgetUtilized: 78.9,
    expenseCategories: [
      { category: 'Fuel', amount: 320000, percentage: 37.9 },
      { category: 'Maintenance', amount: 165000, percentage: 19.5 },
      { category: 'Staff Salaries', amount: 240000, percentage: 28.4 },
      { category: 'Insurance', amount: 85000, percentage: 10.1 },
      { category: 'Other', amount: 35000, percentage: 4.1 }
    ],
    monthlyExpenses: [
      { month: 'Jan', expenses: 125000, budget: 150000 },
      { month: 'Feb', expenses: 142000, budget: 180000 },
      { month: 'Mar', expenses: 138000, budget: 185000 },
      { month: 'Apr', expenses: 152000, budget: 190000 },
      { month: 'May', expenses: 135000, budget: 175000 },
      { month: 'Jun', expenses: 142000, budget: 180000 }
    ],
    recentExpenses: [
      { description: 'Fuel Refill - Mumbai Hub', amount: 18500, category: 'Fuel', date: '2024-01-15', status: 'approved' },
      { description: 'Vehicle Maintenance - Bus A001', amount: 8500, category: 'Maintenance', date: '2024-01-14', status: 'pending' },
      { description: 'Driver Salary - January', amount: 28000, category: 'Staff', date: '2024-01-05', status: 'approved' },
      { description: 'Insurance Premium', amount: 12500, category: 'Insurance', date: '2024-01-01', status: 'approved' },
      { description: 'Office Supplies', amount: 3200, category: 'Other', date: '2024-01-12', status: 'pending' },
      { description: 'GPS Service Fee', amount: 4500, category: 'Other', date: '2024-01-10', status: 'approved' }
    ],
    alerts: [
      { type: 'warning', message: 'Fuel expenses exceeded budget by 15%' },
      { type: 'info', message: '3 maintenance requests pending approval' },
      { type: 'success', message: 'Staff salaries processed on time' }
    ]
  })

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading expense data...</p>
        </div>
      </div>
    )
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Fuel': return <Fuel className="h-5 w-5 text-red-600" />
      case 'Maintenance': return <Wrench className="h-5 w-5 text-blue-600" />
      case 'Staff': return <Users className="h-5 w-5 text-green-600" />
      case 'Insurance': return <CreditCard className="h-5 w-5 text-yellow-600" />
      default: return <DollarSign className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'success': return 'bg-green-50 border-green-200 text-green-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expense Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Track expenses and budget utilization across all operations
              </p>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
              {navigationItems.map((item) => {
                const tabId = item.path.split('/').pop() || 'dashboard'
                return (
                  <button
                    key={item.path}
                    onClick={() => setActiveTab(tabId)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      activeTab === tabId
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">₹{expenseData.totalExpenses.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-4">
              <span className="text-red-600 text-sm font-medium">This month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Utilized</p>
                <p className="text-2xl font-bold text-gray-900">{expenseData.budgetUtilized}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-4">
              <span className="text-yellow-600 text-sm font-medium">
                ₹{expenseData.monthlyExpenses.toLocaleString()} used
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Remaining</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{(expenseData.budgetAllocated - expenseData.monthlyExpenses).toLocaleString()}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">Available</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Daily</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{Math.round(expenseData.monthlyExpenses / 30).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <span className="text-blue-600 text-sm font-medium">Expense rate</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {expenseData.alerts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Alerts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {expenseData.alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">{alert.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Categories</h3>
            <div className="space-y-4">
              {expenseData.expenseCategories.map((category, index) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(category.category)}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{category.category}</div>
                      <div className="text-sm text-gray-600">{category.percentage}% of total</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{category.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Expense Trend</h3>
            <div className="space-y-4">
              {expenseData.monthlyExpenses.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-600">{month.month}</div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${(month.expenses / month.budget) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-900 w-20 text-right">
                      ₹{(month.expenses / 1000).toFixed(0)}k
                    </div>
                    <div className="text-sm text-gray-500 w-16 text-right">
                      of ₹{(month.budget / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Expenses</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenseData.recentExpenses.map((expense, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getCategoryIcon(expense.category)}
                        <span className="ml-2 text-sm text-gray-900">{expense.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Expenses
