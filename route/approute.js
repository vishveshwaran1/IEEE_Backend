const express = require('express');
const multer = require('multer');
const Application = require('../models/Application'); // Ensure this path is correct
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this path is correct

const router = express.Router();

// Configure Multer to handle file uploads. 'dest' specifies where to temporarily store them.
const upload = multer({ dest: 'uploads/' });

// A SINGLE route to handle both JSON and multipart/form-data submissions
router.post('/submit', authMiddleware, upload.any(), async (req, res) => {
    
    // --- Step 1: Log what the server receives. This is key for debugging! ---
    console.log('Received request body:', req.body);
    console.log('Received request files:', req.files);

    try {
        let applicationData;

        // --- Step 2: Smartly determine where the application data is ---
        if (req.is('multipart/form-data')) {
            // If it's a multipart request (with files), the JSON data is in a text field.
            if (!req.body.application) {
                return res.status(400).json({ success: false, message: 'Multipart form is missing the "application" data field.' });
            }
            applicationData = JSON.parse(req.body.application);
        } else {
            // If it's a regular JSON request (no files), the data is the entire body.
            applicationData = req.body;
        }

        // --- Step 3: Perform validation on the final data object ---
        if (!applicationData.studentId || !applicationData.email || !applicationData.projectTitle) {
            return res.status(400).json({ success: false, message: 'Missing required fields: studentId, email, or projectTitle.' });
        }

        // Check for duplicate studentId
        const existingApplication = await Application.findOne({ studentId: applicationData.studentId });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'An application with this Student ID has already been submitted.' });
        }

        // Ensure the email in the token matches the email in the form
        if (req.user?.email !== applicationData.email) {
            return res.status(403).json({ success: false, message: 'Forbidden: You cannot submit a form for another user.' });
        }

        // You can process and save file metadata if needed
        const uploadedFilePaths = (req.files || []).map(file => ({
            fieldName: file.fieldname,
            path: file.path
        }));
        // For now, we are just saving the main application data.
        // You could add a 'documents' array to your Mongoose schema to store these paths.
        console.log('Uploaded file metadata:', uploadedFilePaths);

        // --- Step 4: Save the application ---
        const newApplication = new Application(applicationData);
        await newApplication.save();

        return res.status(201).json({ success: true, message: 'Application submitted successfully!', data: newApplication });

    } catch (error) {
        // --- Step 5: Robust error handling ---
        if (error instanceof SyntaxError) {
             return res.status(400).json({ success: false, message: 'Invalid JSON format in the application data.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'An application with this Student ID already exists.' });
        }
        console.error('Application submission error:', error);
        return res.status(500).json({ success: false, message: 'Server error during application submission.' });
    }
});

module.exports = router;