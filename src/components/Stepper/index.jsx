import './index.css';
import { WIZARD_STEPS, STEP_DETECT } from '../../shared/constants/screen';

const isStepReachable = (step, completedSteps) => {
  if (step.id === STEP_DETECT) return true;
  if (step.id === 2) return completedSteps.includes(STEP_DETECT);
  if (step.id === 3) return completedSteps.includes(2);
  return false;
};

const getDisabledReason = (step) => {
  if (step.id === 2) return 'Detect your layout first';
  if (step.id === 3) return 'Pick a target layout first';
  return '';
};

const Stepper = ({ currentStep, completedSteps = [], onStepSelect }) => {
  const maxCompleted = completedSteps.length
    ? Math.max(...completedSteps)
    : 0;

  return (
    <ol className="stepper" aria-label="Wizard progress">
      {WIZARD_STEPS.map((step, index) => {
        const isCurrent = step.id === currentStep;
        const isCompleted =
          completedSteps.includes(step.id) && !isCurrent;
        const isReachable = isStepReachable(step, completedSteps);
        const isLast = index === WIZARD_STEPS.length - 1;
        const status = isCurrent
          ? 'current'
          : isCompleted
            ? 'completed'
            : 'upcoming';
        const tabIndex = isReachable ? 0 : -1;

        return (
          <li
            key={step.id}
            className={`stepper_item stepper_item--${status}${isReachable ? '' : ' stepper_item--disabled'}`}
          >
            <button
              type="button"
              className="stepper_button"
              onClick={() => isReachable && onStepSelect?.(step.id)}
              disabled={!isReachable}
              aria-current={isCurrent ? 'step' : undefined}
              aria-disabled={!isReachable}
              tabIndex={tabIndex}
              title={isReachable ? step.label : getDisabledReason(step)}
            >
              <span className="stepper_dot" aria-hidden>
                {isCompleted ? '✓' : step.id}
              </span>
              <span className="stepper_label">{step.label}</span>
            </button>
            {!isLast && (
              <span
                className={`stepper_connector${maxCompleted >= step.id + 1 ? ' stepper_connector--filled' : ''}`}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default Stepper;
