import mongoose from 'mongoose';
 
var urlEntrySchema = mongoose.Schema({
  original: String,
  shortCode: { type: Number, index: true }
});

// Create index so searching is faster
urlEntrySchema.index({ shortCode: 1 });
urlEntrySchema.set('autoIndex', false);

// Create model
export var UrlEntry = mongoose.model('UrlEntry', urlEntrySchema);