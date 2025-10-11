import { useState } from 'react'
import { CheckCircle, Calendar, DollarSign, Users, MapPin, Phone, MessageSquare, User } from 'lucide-react'

const BusEmployeeWelcome = ({ employeeData, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  
  const steps = [
    {
      title: "Welcome to Bus Employee Dashboard",
      content: "Let's get you started with your new employee portal",
      icon: <User className="h-8 w-8" />
    },
    {
      title: "Trip Management",
      content: "Track passengers, manage pickups, and update trip status in real-time",
      icon: <MapPin className="h-8 w-8" />
    },
    {
      title: "Expense Tracking",
      content: "Submit receipts and track your trip-related expenses for reimbursement",
      icon: <DollarSign className="h-8 w-8" />
    },
    {
      title: "Communication Tools",
      content: "Call or SMS passengers directly for better coordination",
      icon: <Phone className="h-8 w-8" />
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          {steps[currentStep - 1].icon && (
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <div className="text-primary">
                {steps[currentStep - 1].icon}
              </div>
            </div>
          )}
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {steps[currentStep - 1].title}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {steps[currentStep - 1].content}
          </p>
          
          {/* Employee Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-gray-900 mb-2">Your Details:</h4>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Name:</span> {employeeData?.name}</div>
              <div><span className="font-medium">Role:</span> {employeeData?.role}</div>
              <div><span className="font-medium">Phone:</span> {employeeData?.phone}</div>
              {employeeData?.salary && (
                <div><span className="font-medium">Salary:</span> ${employeeData.salary.toLocaleString()}/month</div>
              )}
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            
            <div className="flex-1"></div>
            
            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Start Using Dashboard
              </button>
            )}
          </div>
          
          {/* Quick tips */}
          {currentStep === steps.length && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Quick Tips:</h4>
              <ul className="text-sm text-blue-800 text-left space-y-1">
                <li>• Use the "Trips" tab to manage your current trip</li>
                <li>• Submit expenses with receipts for quick approval</li>
                <li>• Mark passengers as picked up when you collect them</li>
                <li>• Use call/SMS buttons to contact passengers</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BusEmployeeWelcome
