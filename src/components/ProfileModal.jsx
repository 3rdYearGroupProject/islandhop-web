import React, { useState } from 'react';
import logo from '../assets/islandHopIcon.png';
import logoText from '../assets/IslandHop.png';

const ProfileModal = ({ show, onClose, userProfile, setUserProfile }) => {
  const [editingFirstName, setEditingFirstName] = useState(false);
  const [editingLastName, setEditingLastName] = useState(false);
  const [editingDob, setEditingDob] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState(userProfile.firstName);
  const [lastNameInput, setLastNameInput] = useState(userProfile.lastName);
  const [dobInput, setDobInput] = useState(userProfile.dob);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg animate-navbar-dropdown overflow-hidden border border-gray-200"
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', margin: 0 }}
      >
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl transition-colors z-10" onClick={onClose} aria-label="Close profile">&times;</button>
        {/* Business Card Header with Company Branding */}
        <div className="bg-white h-20 w-full flex items-center justify-between px-6">
          <div className="flex items-center">
            <img src={logo} alt="IslandHop Icon" className="h-8 w-8 mr-3" />
            <img src={logoText} alt="IslandHop" className="h-6" />
          </div>
        </div>
        {/* Business Card Body */}
        <div className="p-6">
          {/* Profile Section - Centered */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-28 h-28 mb-4">
              <div className="w-28 h-28 bg-primary-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-4xl font-bold">{userProfile.avatar}</span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-primary-500 flex items-center justify-center text-primary-600 hover:text-primary-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">{userProfile.email}</p>
              <div className="flex items-center justify-center text-xs text-gray-500 mb-2">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                {userProfile.nationality}
                <button className="ml-2 text-primary-600 hover:text-primary-700 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Contact Information */}
          <div className="pt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center justify-center">
                  First Name
                  {editingFirstName ? (
                    <button className="ml-1 text-green-600 hover:text-green-700 transition-colors" onClick={() => {
                      setUserProfile(p => ({ ...p, firstName: firstNameInput }));
                      setEditingFirstName(false);
                    }} title="Save">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  ) : (
                    <button className="ml-1 text-primary-600 hover:text-primary-700 transition-colors" onClick={() => { setEditingFirstName(true); setFirstNameInput(userProfile.firstName); }} title="Edit">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="font-semibold text-gray-700 text-sm">
                  {editingFirstName ? (
                    <input
                      className="border rounded px-2 py-1 text-sm w-24 text-center focus:outline-none focus:ring-2 focus:ring-primary-300"
                      value={firstNameInput}
                      onChange={e => setFirstNameInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { setUserProfile(p => ({ ...p, firstName: firstNameInput })); setEditingFirstName(false); } }}
                      autoFocus
                    />
                  ) : (
                    userProfile.firstName
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center justify-center">
                  Last Name
                  {editingLastName ? (
                    <button className="ml-1 text-green-600 hover:text-green-700 transition-colors" onClick={() => {
                      setUserProfile(p => ({ ...p, lastName: lastNameInput }));
                      setEditingLastName(false);
                    }} title="Save">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  ) : (
                    <button className="ml-1 text-primary-600 hover:text-primary-700 transition-colors" onClick={() => { setEditingLastName(true); setLastNameInput(userProfile.lastName); }} title="Edit">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="font-semibold text-gray-700 text-sm">
                  {editingLastName ? (
                    <input
                      className="border rounded px-2 py-1 text-sm w-24 text-center focus:outline-none focus:ring-2 focus:ring-primary-300"
                      value={lastNameInput}
                      onChange={e => setLastNameInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { setUserProfile(p => ({ ...p, lastName: lastNameInput })); setEditingLastName(false); } }}
                      autoFocus
                    />
                  ) : (
                    userProfile.lastName
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center justify-center">
                  Date of Birth
                  {editingDob ? (
                    <button className="ml-1 text-green-600 hover:text-green-700 transition-colors" onClick={() => {
                      setUserProfile(p => ({ ...p, dob: dobInput }));
                      setEditingDob(false);
                    }} title="Save">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  ) : (
                    <button className="ml-1 text-primary-600 hover:text-primary-700 transition-colors" onClick={() => { setEditingDob(true); setDobInput(userProfile.dob); }} title="Edit">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="font-semibold text-gray-700 text-sm">
                  {editingDob ? (
                    <input
                      type="date"
                      className="border rounded px-2 py-1 text-sm w-32 text-center focus:outline-none focus:ring-2 focus:ring-primary-300"
                      value={dobInput}
                      onChange={e => setDobInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { setUserProfile(p => ({ ...p, dob: dobInput })); setEditingDob(false); } }}
                      autoFocus
                    />
                  ) : (
                    userProfile.dob
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1 flex items-center justify-center">
                  Languages
                  <button className="ml-1 text-primary-600 hover:text-primary-700 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div className="font-semibold text-gray-700 text-sm">{userProfile.languages.join(', ')}</div>
              </div>
            </div>
            {/* Travel Stats */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-primary-600">12</div>
                  <div className="text-xs text-gray-500">Trips</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary-600">8</div>
                  <div className="text-xs text-gray-500">Cities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
