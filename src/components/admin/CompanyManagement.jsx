import { useState, useEffect } from 'react'
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertCircle,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Calendar
} from 'lucide-react'
import { companyAPI } from '../../services/api'
import { toast } from 'react-toastify'

const CompanyManagement = () => {
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    panNumber: '',
    website: '',
    description: '',
    logo: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchCompany()
  }, [])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      const response = await companyAPI.getCompany()
      if (response.success) {
        setCompany(response.data.company)
        setFormData(response.data.company)
      } else {
        // Company doesn't exist yet
        setCompany(null)
      }
    } catch (error) {
      console.error('Error fetching company:', error)
      toast.error('Failed to fetch company details')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Company name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Phone validation
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    // Pincode validation
    const pincodeRegex = /^\d{6}$/
    if (formData.pincode && !pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits'
    }
    
    // GST validation (optional but if provided, should be valid)
    if (formData.gstNumber) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
      if (!gstRegex.test(formData.gstNumber)) {
        newErrors.gstNumber = 'Please enter a valid GST number'
      }
    }
    
    // PAN validation (optional but if provided, should be valid)
    if (formData.panNumber) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
      if (!panRegex.test(formData.panNumber)) {
        newErrors.panNumber = 'Please enter a valid PAN number'
      }
    }
    
    // Website validation (optional but if provided, should be valid)
    if (formData.website) {
      const websiteRegex = /^https?:\/\/.+/
      if (!websiteRegex.test(formData.website)) {
        newErrors.website = 'Please enter a valid website URL'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
      return
    }
    
    try {
      setLoading(true)
      let response
      
      if (company) {
        // Update existing company
        response = await companyAPI.updateCompany(formData)
      } else {
        // Create new company
        response = await companyAPI.createCompany(formData)
      }
      
      if (response.success) {
        setCompany(response.data.company)
        setEditing(false)
        toast.success(company ? 'Company updated successfully!' : 'Company created successfully!')
      } else {
        toast.error(response.message || 'Failed to save company')
      }
    } catch (error) {
      console.error('Error saving company:', error)
      toast.error('Failed to save company')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your company? This action cannot be undone.')) {
      return
    }
    
    try {
      setLoading(true)
      const response = await companyAPI.deleteCompany()
      
      if (response.success) {
        setCompany(null)
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          gstNumber: '',
          panNumber: '',
          website: '',
          description: '',
          logo: ''
        })
        toast.success('Company deleted successfully!')
      } else {
        toast.error(response.message || 'Failed to delete company')
      }
    } catch (error) {
      console.error('Error deleting company:', error)
      toast.error('Failed to delete company')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setFormData(company || {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      gstNumber: '',
      panNumber: '',
      website: '',
      description: '',
      logo: ''
    })
    setErrors({})
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hover-light">
      {/* Header */}
      <div className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-heading-1">Company Management</h1>
              <p className="text-body-small mt-2">Manage your company information and settings</p>
            </div>
            <div className="flex space-x-3">
              {company && !editing && (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Company</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn-danger flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Company</span>
                  </button>
                </>
              )}
              {!company && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Company</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!company && !editing ? (
          /* No Company State */
          <div className="dashboard-card text-center py-16">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 rounded-full p-6 mb-6">
                <Building2 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-heading-2 mb-4">No Company Found</h2>
              <p className="text-body-small text-secondary mb-8 max-w-md">
                You haven't created a company yet. Create your company profile to start managing your bus operations.
              </p>
              <button
                onClick={() => setEditing(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Company</span>
              </button>
            </div>
          </div>
        ) : editing ? (
          /* Edit Form */
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="text-heading-3">
                {company ? 'Edit Company' : 'Create Company'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-heading-4 text-primary">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Company Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`form-input ${errors.name ? 'border-error' : ''}`}
                      placeholder="Enter company name"
                    />
                    {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'border-error' : ''}`}
                      placeholder="Enter company email"
                    />
                    {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-input ${errors.phone ? 'border-error' : ''}`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label className="form-label">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`form-input ${errors.address ? 'border-error' : ''}`}
                    placeholder="Enter company address"
                    rows={3}
                  />
                  {errors.address && <p className="text-error text-sm mt-1">{errors.address}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`form-input ${errors.city ? 'border-error' : ''}`}
                      placeholder="Enter city"
                    />
                    {errors.city && <p className="text-error text-sm mt-1">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`form-input ${errors.state ? 'border-error' : ''}`}
                      placeholder="Enter state"
                    />
                    {errors.state && <p className="text-error text-sm mt-1">{errors.state}</p>}
                  </div>
                  
                  <div>
                    <label className="form-label">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`form-input ${errors.pincode ? 'border-error' : ''}`}
                      placeholder="Enter pincode"
                    />
                    {errors.pincode && <p className="text-error text-sm mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
              
              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-heading-4 text-primary">Business Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">GST Number</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className={`form-input ${errors.gstNumber ? 'border-error' : ''}`}
                      placeholder="Enter GST number"
                    />
                    {errors.gstNumber && <p className="text-error text-sm mt-1">{errors.gstNumber}</p>}
                  </div>
                  
                  <div>
                    <label className="form-label">PAN Number</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      className={`form-input ${errors.panNumber ? 'border-error' : ''}`}
                      placeholder="Enter PAN number"
                    />
                    {errors.panNumber && <p className="text-error text-sm mt-1">{errors.panNumber}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className={`form-input ${errors.website ? 'border-error' : ''}`}
                    placeholder="Enter website URL"
                  />
                  {errors.website && <p className="text-error text-sm mt-1">{errors.website}</p>}
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter company description"
                    rows={4}
                  />
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : (company ? 'Update Company' : 'Create Company')}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Company Details View */
          <div className="space-y-6">
            {/* Company Overview */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-heading-3">{company.name}</h2>
                    <p className="text-body-small text-secondary">Company Information</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-secondary mt-1" />
                    <div>
                      <p className="text-caption text-secondary">Email</p>
                      <p className="text-body-small font-medium">{company.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-secondary mt-1" />
                    <div>
                      <p className="text-caption text-secondary">Phone</p>
                      <p className="text-body-small font-medium">{company.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-secondary mt-1" />
                    <div>
                      <p className="text-caption text-secondary">Address</p>
                      <p className="text-body-small font-medium">{company.address}</p>
                      <p className="text-body-small text-secondary">{company.city}, {company.state} - {company.pincode}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {company.website && (
                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-secondary mt-1" />
                      <div>
                        <p className="text-caption text-secondary">Website</p>
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-body-small font-medium text-primary hover:underline"
                        >
                          {company.website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {company.gstNumber && (
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-secondary mt-1" />
                      <div>
                        <p className="text-caption text-secondary">GST Number</p>
                        <p className="text-body-small font-medium">{company.gstNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  {company.panNumber && (
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-secondary mt-1" />
                      <div>
                        <p className="text-caption text-secondary">PAN Number</p>
                        <p className="text-body-small font-medium">{company.panNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-secondary mt-1" />
                    <div>
                      <p className="text-caption text-secondary">Created</p>
                      <p className="text-body-small font-medium">
                        {new Date(company.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {company.description && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-heading-4 mb-3">Description</h3>
                  <p className="text-body-small text-secondary">{company.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyManagement
