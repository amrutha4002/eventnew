import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OrganizerRequest() {
    const { user, requestOrganizerVerification } = useAuth();
    const navigate = useNavigate();

    const [organizationName, setOrganizationName] = useState('');
    const [registrationTaxId, setRegistrationTaxId] = useState('');
    const [website, setWebsite] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!user) {
        return <p>Please log in to apply for organizer status.</p>;
    }

    if (user.role === 'organizer') {
        return <p>Your account is already registered as an organizer.</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await requestOrganizerVerification(
            organizationName,
            registrationTaxId,
            website,
            contactEmail,
            contactPhone
        );
        if (result.success) {
            setSuccess(true);
            // after a short delay redirect to organizer dashboard which will show pending message
            setTimeout(() => navigate('/organizer'), 1500);
        } else {
            setError(result.error || 'Request failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Organizer Verification Request
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Submit your organization details for admin approval.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    {error && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
                            Request submitted! Awaiting admin approval.
                        </div>
                    )}

                    {!success && (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Organization Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        required
                                        type="text"
                                        value={organizationName}
                                        onChange={(e) => setOrganizationName(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Registration / Tax ID
                                </label>
                                <div className="mt-1">
                                    <input
                                        required
                                        type="text"
                                        value={registrationTaxId}
                                        onChange={(e) => setRegistrationTaxId(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Official Website
                                </label>
                                <div className="mt-1">
                                    <input
                                        required
                                        type="url"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Contact Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        required
                                        type="email"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Contact Phone
                                </label>
                                <div className="mt-1">
                                    <input
                                        required
                                        type="tel"
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrganizerRequest;