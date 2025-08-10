const mongoose = require('mongoose');

const BudgetItemSchema = new mongoose.Schema({
    items: { type: String, required: true },
    components: { type: String },
    quantity: { type: String, required: true },
    justification: { type: String, required: true },
});

const ApplicationSchema = new mongoose.Schema({
    // --- Applicant Info ---
    studentId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true }, // The verified email
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    ieeeMembershipNo: { type: String },
    phoneNo: { type: String, required: true }, 
    year: { type: String, required: true },
    department: { type: String, required: true },

    // --- Project Info ---
    projectTitle: { type: String, required: true },
    primarySDGGoal: { type: String },
    teamSize: { type: String },
    mentorName: { type: String },
    projectIdeaDescription: { type: String, required: true },
    projectMethodology: { type: String, required: true },
    technicalStack: { type: String },
    
    // --- Funding & Timeline ---
    fundingAmount: { type: String, required: true },
    budgetItems: [BudgetItemSchema],
    projectStartDate: { type: Date, required: true },
    projectEndDate: { type: Date, required:true },
    keyMilestones: { type: String },

    // --- Impact ---
    targetBeneficiaries: { type: String },
    expectedOutcomes: { type: String },
    sustainabilityPlan: { type: String },

    // --- Metadata ---
    submissionDate: { type: Date, default: Date.now },
    status: { type: String, default: 'Submitted' }, // e.g., Submitted, Under Review, Approved
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Application', ApplicationSchema);