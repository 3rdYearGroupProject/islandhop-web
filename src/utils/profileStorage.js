// Profile completion status management
export const PROFILE_COMPLETION_KEY = 'islandhop_profile_completion';

export const saveProfileCompletionStatus = (isCompleted) => {
  try {
    localStorage.setItem(PROFILE_COMPLETION_KEY, JSON.stringify({
      isCompleted,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Failed to save profile completion status:', error);
  }
};

export const getProfileCompletionStatus = () => {
  try {
    const stored = localStorage.getItem(PROFILE_COMPLETION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.isCompleted || false;
    }
    return false;
  } catch (error) {
    console.error('Failed to get profile completion status:', error);
    return false;
  }
};

export const clearProfileCompletionStatus = () => {
  try {
    localStorage.removeItem(PROFILE_COMPLETION_KEY);
  } catch (error) {
    console.error('Failed to clear profile completion status:', error);
  }
};

// Check if profile is completed based on required fields
export const checkProfileCompletion = (userProfile) => {
  const requiredFields = ['firstName', 'lastName', 'dob', 'nationality'];
  const isCompleted = requiredFields.every(field => 
    userProfile[field] && userProfile[field].trim() !== ''
  );
  
  // Save the status
  saveProfileCompletionStatus(isCompleted);
  
  return isCompleted;
};