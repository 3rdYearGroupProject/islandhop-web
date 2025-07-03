import React from 'react';

const Card = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  padding = 'default',
  ...props
}) => {
  const baseClasses = 'bg-white dark:bg-secondary-800 border border-gray-200 dark:border-secondary-700 overflow-hidden transition-all duration-200';

  const variantClasses = {
    default: 'rounded-lg shadow-sm',
    elevated: 'rounded-lg shadow-md',
    outlined: 'rounded-lg border-2',
    minimal: 'rounded-lg',
    glass: 'rounded-lg backdrop-blur-sm bg-white/80 dark:bg-secondary-800/80 border-white/20 dark:border-secondary-700/20',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';

  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${hoverClasses}
    ${className}
  `.trim();

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
export const CardHeader = ({
  children,
  className = '',
  divider = true,
  ...props
}) => {
  const dividerClasses = divider ? 'border-b border-gray-200 dark:border-secondary-700' : '';
  
  return (
    <div 
      className={`px-6 py-4 bg-gray-50 dark:bg-secondary-700 ${dividerClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Body Component
export const CardBody = ({
  children,
  className = '',
  padding = 'default',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${paddingClasses[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
export const CardFooter = ({
  children,
  className = '',
  divider = true,
  ...props
}) => {
  const dividerClasses = divider ? 'border-t border-gray-200 dark:border-secondary-700' : '';
  
  return (
    <div 
      className={`px-6 py-4 bg-gray-50 dark:bg-secondary-700 ${dividerClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Title Component
export const CardTitle = ({
  children,
  className = '',
  as: Component = 'h3',
  ...props
}) => {
  return (
    <Component 
      className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card Description Component
export const CardDescription = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p 
      className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

// Stats Card Component
export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  className = '',
  ...props
}) => {
  const trendClasses = {
    up: 'text-success-600',
    down: 'text-danger-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card className={`p-6 ${className}`} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trendClasses[trend]}`}>
              {trend === 'up' && (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              )}
              {trend === 'down' && (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
              )}
              {trendValue}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <div className="w-6 h-6 text-primary-600 dark:text-primary-400">
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Image Card Component
export const ImageCard = ({
  src,
  alt,
  title,
  description,
  actions,
  className = '',
  imageClassName = '',
  ...props
}) => {
  return (
    <Card className={`overflow-hidden ${className}`} {...props}>
      <div className="aspect-w-16 aspect-h-9">
        <img 
          src={src} 
          alt={alt}
          className={`w-full h-48 object-cover ${imageClassName}`}
        />
      </div>
      <CardBody>
        {title && (
          <CardTitle className="mb-2">
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription>
            {description}
          </CardDescription>
        )}
        {actions && (
          <div className="mt-4 flex items-center justify-between">
            {actions}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default Card;
