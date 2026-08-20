import User from '../models/User.js';

function safeUser(user) {
  return {
    id: (user._id || user.id).toString(),
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    state: user.state,
    district: user.district,
    annualIncome: user.annualIncome,
    occupation: user.occupation,
    education: user.education,
    category: user.category,
    preferredLanguage: user.preferredLanguage,
  };
}

export async function getProfile(request, response) {
  const user = await User.findById(request.user._id);
  if (!user) {
    return response.status(404).json({ success: false, message: 'User not found' });
  }

  return response.json({
    success: true,
    data: {
      user: safeUser(user),
    },
  });
}

export async function updateProfile(request, response) {
  const user = await User.findById(request.user._id);
  if (!user) {
    return response.status(404).json({ success: false, message: 'User not found' });
  }

  const {
    name,
    age,
    gender,
    state,
    district,
    annualIncome,
    occupation,
    education,
    category,
    preferredLanguage,
  } = request.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return response.status(400).json({ success: false, message: 'Name must be between 2 and 100 characters' });
    }
    user.name = name.trim();
  }

  if (age !== undefined && age !== null) {
    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge < 0 || parsedAge > 120) {
      return response.status(400).json({ success: false, message: 'Age must be an integer between 0 and 120' });
    }
    user.age = parsedAge;
  }

  if (gender !== undefined && gender !== null) {
    const allowedGenders = ['male', 'female', 'other', 'prefer_not_to_say'];
    if (!allowedGenders.includes(gender)) {
      return response.status(400).json({ success: false, message: `Gender must be one of: ${allowedGenders.join(', ')}` });
    }
    user.gender = gender;
  }

  if (state !== undefined) {
    if (typeof state !== 'string') {
      return response.status(400).json({ success: false, message: 'State must be a string' });
    }
    user.state = state.trim();
  }

  if (district !== undefined) {
    if (typeof district !== 'string') {
      return response.status(400).json({ success: false, message: 'District must be a string' });
    }
    user.district = district.trim();
  }

  if (annualIncome !== undefined && annualIncome !== null) {
    const parsedIncome = Number(annualIncome);
    if (typeof annualIncome === 'boolean' || isNaN(parsedIncome) || parsedIncome < 0) {
      return response.status(400).json({ success: false, message: 'Annual income must be a non-negative number' });
    }
    user.annualIncome = parsedIncome;
  }

  if (occupation !== undefined) {
    if (typeof occupation !== 'string') {
      return response.status(400).json({ success: false, message: 'Occupation must be a string' });
    }
    user.occupation = occupation.trim();
  }

  if (education !== undefined) {
    if (typeof education !== 'string') {
      return response.status(400).json({ success: false, message: 'Education must be a string' });
    }
    user.education = education.trim();
  }

  if (category !== undefined && category !== null) {
    const allowedCategories = ['general', 'obc', 'sc', 'st', 'other'];
    if (!allowedCategories.includes(category)) {
      return response.status(400).json({ success: false, message: `Category must be one of: ${allowedCategories.join(', ')}` });
    }
    user.category = category;
  }

  if (preferredLanguage !== undefined && preferredLanguage !== null) {
    const allowedLanguages = ['en', 'hi'];
    if (!allowedLanguages.includes(preferredLanguage)) {
      return response.status(400).json({ success: false, message: 'Preferred language must be either en or hi' });
    }
    user.preferredLanguage = preferredLanguage;
  }

  const updatedUser = await user.save();

  return response.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: safeUser(updatedUser),
    },
  });
}