import { UrlEntry } from './urlEntry';
// Returns new code for us to use. Perform empty find() so every doc is matched, and then order them so highest shortode is first, and limit so we only get that one shortCode
export function getShortCode() {
  return UrlEntry
    .find() // Search without criteria
    .sort({ shortCode: -1 }) // Sort by shortCode descending
    .limit(1) // Return only the first
    .select({ _id: 0, shortCode: 1 }) // Return only shortCode field
    .then(docs => {
        // If a doc is found, return its shortCode plus 1. If not, return 0, meaning there are no docs and this is the first
      return docs.length === 1 ? docs[0].shortCode + 1 : 0;
    });
}

// Check for duplicate entries. Takes in expanded URL and returns 'false' if the URL does not exist yet in the DB, or if the minimized URL already exists
export function isDuplicate(url) {
  return UrlEntry
    .findOne({ original: url})
    .then(doc => doc ? doc.shortCode : false );
}

export function insertNew(url) {
    // Get new code from getShortCode first, and it returns a Promise because it's an async action
  return getShortCode().then(newCode => {
    // Create new UrlEntry
    let newUrl = new UrlEntry({ original: url, shortCode: newCode });
    // Return Promise generated by save()
    return newUrl.save();
  });
}