const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
    },
    category: {
      type: String,
      required: [true, 'Please select a complaint category'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    department: {
      type: String,
      default: 'Maintenance',
    },
    location: {
      type: String,
      required: [true, 'Please specify the campus location'],
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    photo: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    aiSummary: {
      type: String,
      default: '',
    },
    aiKeywords: [
      {
        type: String,
      },
    ],
    priorityReason: {
      type: String,
      default: '',
    },
    aiAnalyzed: {
      type: Boolean,
      default: true,
    },
    duplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null,
    },
    duplicateSimilarity: {
      type: Number,
      default: 0,
    },
    resolutionNote: {
      type: String,
      default: '',
    },
    resolutionPhoto: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    assignedAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    history: [
      {
        oldStatus: {
          type: String,
          default: '',
        },
        newStatus: {
          type: String,
          required: true,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        message: {
          type: String,
          default: '',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

complaintSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Complaint', complaintSchema);
