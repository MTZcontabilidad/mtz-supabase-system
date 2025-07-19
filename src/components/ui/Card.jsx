import { cn } from '../../utils/helpers.js';

const Card = ({ children, className, padding = 'p-6', ...props }) => {
  return (
    <div className={cn('card', padding, className)} {...props}>
      {children}
    </div>
  );
};

export default Card;