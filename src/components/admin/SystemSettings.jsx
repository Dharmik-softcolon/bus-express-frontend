import { useState } from 'react'
import { Settings, Save, Bell, Mail, Shield, Globe, CreditCard, Database } from 'lucide-react'
import { showToast } from '../../utils/toast'

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'SafeRun',
    siteDescription: 'Your trusted partner for comfortable and reliable bus travel',
    contactEmail: 'info@saferun.com',
    contactPhone: '+1 (555) 123-4567',
    
    // Booking Settings
    maxAdvanceBooking: 30,
    minAdvanceBooking: 2,
    cancellationWindow: 2,
    refundPercentage: 80,
    
    // Payment Settings
    currency: 'USD',
    taxRate: 7.5,
    serviceFee: 2.00,
    paymentMethods: ['credit_card', 'debit_card', 'paypal'],
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmation: true,
    paymentConfirmation: true,
    cancellationNotification: true,
    
    // Security Settings
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    twoFactorAuth: false,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info',
    backupFrequency: 'daily'
  })

  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckboxChange = (field, checked) => {
    setSettings(prev => ({
      ...prev,
      [field]: checked
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    showToast.success('Settings saved successfully!')
  }

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'booking', name: 'Booking', icon: Settings },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: Database }
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Site Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleInputChange('siteName', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Description
          </label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => handleInputChange('siteDescription', e.target.value)}
            className="input-field"
            rows={3}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            value={settings.contactPhone}
            onChange={(e) => handleInputChange('contactPhone', e.target.value)}
            className="input-field"
          />
        </div>
      </div>
    </div>
  )

  const renderBookingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Advance Booking (days)
            </label>
            <input
              type="number"
              value={settings.maxAdvanceBooking}
              onChange={(e) => handleInputChange('maxAdvanceBooking', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Advance Booking (hours)
            </label>
            <input
              type="number"
              value={settings.minAdvanceBooking}
              onChange={(e) => handleInputChange('minAdvanceBooking', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Window (hours)
            </label>
            <input
              type="number"
              value={settings.cancellationWindow}
              onChange={(e) => handleInputChange('cancellationWindow', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Percentage
            </label>
            <input
              type="number"
              value={settings.refundPercentage}
              onChange={(e) => handleInputChange('refundPercentage', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="input-field"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.taxRate}
              onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Fee ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={settings.serviceFee}
            onChange={(e) => handleInputChange('serviceFee', parseFloat(e.target.value))}
            className="input-field"
          />
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <p className="text-sm text-gray-500">Send notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleCheckboxChange('emailNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
              <p className="text-sm text-gray-500">Send notifications via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => handleCheckboxChange('smsNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Booking Confirmation</label>
              <p className="text-sm text-gray-500">Send booking confirmation emails</p>
            </div>
            <input
              type="checkbox"
              checked={settings.bookingConfirmation}
              onChange={(e) => handleCheckboxChange('bookingConfirmation', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Payment Confirmation</label>
              <p className="text-sm text-gray-500">Send payment confirmation emails</p>
            </div>
            <input
              type="checkbox"
              checked={settings.paymentConfirmation}
              onChange={(e) => handleCheckboxChange('paymentConfirmation', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Login Attempts
            </label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Min Length
            </label>
            <input
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Enable 2FA for admin accounts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleCheckboxChange('twoFactorAuth', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
              <p className="text-sm text-gray-500">Put the system in maintenance mode</p>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleCheckboxChange('maintenanceMode', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Debug Mode</label>
              <p className="text-sm text-gray-500">Enable debug logging</p>
            </div>
            <input
              type="checkbox"
              checked={settings.debugMode}
              onChange={(e) => handleCheckboxChange('debugMode', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Log Level
            </label>
            <select
              value={settings.logLevel}
              onChange={(e) => handleInputChange('logLevel', e.target.value)}
              className="input-field"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
              className="input-field"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings()
      case 'booking': return renderBookingSettings()
      case 'payment': return renderPaymentSettings()
      case 'notifications': return renderNotificationSettings()
      case 'security': return renderSecuritySettings()
      case 'system': return renderSystemSettings()
      default: return renderGeneralSettings()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            System Settings
          </h1>
          <p className="text-gray-600">
            Configure system-wide settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card">
              {renderTabContent()}
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemSettings

