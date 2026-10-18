/**
 * Checkout Progress Stepper — Mishmash Minimalist Design
 * @param {{ currentStep: 1 | 2 | 3 | 4 }} props
 */
export default function CheckoutStepper({ currentStep }) {
  const steps = [
    { num: 1, label: 'Shopping Bag' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Shipping' },
    { num: 4, label: 'Review' },
  ]

  return (
    <nav className="checkout-stepper" aria-label="Checkout Progress">
      {steps.map((step, index) => {
        const isActive = currentStep === step.num
        const isCompleted = currentStep > step.num

        return (
          <div key={step.num} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div
              className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <span className="step-number">
                {isCompleted ? '✓' : step.num}
              </span>
              <span>{step.label}</span>
            </div>
            {index < steps.length - 1 && <span className="step-divider" aria-hidden="true" />}
          </div>
        )
      })}
    </nav>
  )
}

