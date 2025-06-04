import React, { useState } from 'react';
import './TrimiteFeedback.css';

const TrimiteFeedback = ({ onBack }) => {
    // State to hold form data, including message and rating
    const [formData, setFormData] = useState({
        message: '',
        rating: '' // Added rating field to formData, initialized as empty
    });
    // State to manage the status of the submission (success/error messages)
    const [status, setStatus] = useState(null);
    // State to indicate if the form is currently being submitted
    const [loading, setLoading] = useState(false);

    // Handles changes in form input fields (textarea and select dropdown)
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Update the formData state, preserving existing values
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handles the form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)

        // Destructure message and rating from formData
        const trimmedMessage = formData.message.trim(); // Trim whitespace from the message
        const { rating } = formData;

        // Client-side validation for the message field
        if (!trimmedMessage) {
            setStatus({ type: 'error', message: 'Mesajul nu poate fi gol.' });
            return; // Stop submission if message is empty
        }

        // Client-side validation for the rating dropdown
        if (!rating) {
            setStatus({ type: 'error', message: 'Vă rugăm să selectați o notă.' });
            return; // Stop submission if no rating is selected
        }

        setLoading(true); // Set loading state to true to disable button and show loading text
        setStatus(null); // Clear any previous status messages

        try {
            // Send the form data to the backend API
            const res = await fetch('/api/feedback', {
                method: 'POST', // HTTP POST method
                headers: { 'Content-Type': 'application/json' }, // Specify content type as JSON
                // Convert formData to JSON string, parsing rating to an integer
                body: JSON.stringify({ message: trimmedMessage, rating: parseInt(rating, 10) })
            });

            // Check if the response was successful (HTTP status 2xx)
            if (!res.ok) {
                // Attempt to parse backend error message if available
                const errorData = await res.json().catch(() => ({})); // Catch JSON parsing errors
                const errorMessage = errorData.message || 'Eroare la trimiterea feedback-ului. Vă rugăm să încercați din nou.';
                throw new Error(errorMessage); // Throw an error with a specific message
            }

            // Set success status if the submission was successful
            setStatus({ type: 'success', message: 'Feedback-ul a fost trimis cu succes!' });
            // Reset form fields after successful submission
            setFormData({ message: '', rating: '' });
        } catch (err) {
            // Set error status if an error occurred during submission
            setStatus({ type: 'error', message: err.message || 'A apărut o eroare neașteptată.' });
        } finally {
            setLoading(false); // Always set loading to false after the request completes
        }
    };

    return (
        <div className="trimite-feedback-container">
            {/* Button to go back to course details */}
            <button className="trimite-feedback-buton-inapoi" onClick={onBack}>
                ← Înapoi la detaliile cursului
            </button>

            <div className="trimite-feedback-header">
                <h1>Trimite Feedback</h1>
            </div>

            <form onSubmit={handleSubmit} className="trimite-feedback-form">
                {/* Textarea for the feedback message */}
                <label htmlFor="message" className="sr-only">Mesajul tău:</label> {/* Accessible label for screen readers */}
                <textarea
                    id="message" // ID for label association
                    name="message"
                    placeholder="Scrie aici mesajul tău..."
                    rows="6"
                    className="trimite-feedback-textarea"
                    value={formData.message}
                    onChange={handleChange}
                />

                {/* Dropdown for rating from 1 to 10 */}
                <label htmlFor="rating" className="sr-only">Selectează o notă:</label> {/* Accessible label */}
                <select
                    id="rating" // ID for label association
                    name="rating"
                    className="trimite-feedback-select" // Apply custom styling via CSS
                    value={formData.rating}
                    onChange={handleChange}
                    required // HTML5 required attribute for basic validation
                >
                    <option value="">Selectează o notă</option> {/* Default option */}
                    {/* Dynamically generate options from 1 to 10 */}
                    {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>

                {/* Submit button */}
                <button
                    type="submit"
                    className="trimite-feedback-btn-primary trimite-feedback-submit"
                    disabled={loading} // Disable button when loading
                >
                    {loading ? 'Se trimite...' : 'Trimite'} {/* Change text based on loading state */}
                </button>

                {/* Display status messages (success or error) */}
                {status && (
                    <div className={`trimite-feedback-status ${status.type}`}>
                        {status.message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default TrimiteFeedback;
