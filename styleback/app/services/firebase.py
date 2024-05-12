from firebase_admin import firestore, storage
from flask import jsonify

db = firestore.client()
bucket = storage.bucket("postImages")

def get_post(post_id):
    """
    Retrieves a post from Firestore based on the post_id.
    """
    try:
        # Directly reference the document with the provided post_id
        doc_ref = db.collection('UserPost').document(post_id)
        doc = doc_ref.get()
        if doc.exists:
            # Convert the document to dictionary format and return it as JSON
            return jsonify(doc.to_dict()), 200
        else:
            # Return a JSON response indicating that no document was found
            return jsonify({"message": "No post found with the given ID"}), 404
    except Exception as e:
        # Return a JSON response indicating failure with the exception message
        return jsonify({"failed to retrieve post": str(e)}), 500
    
def get_all_posts():
    """
    Retrieves all posts from Firestore based on the post_id.
    """
    try:
        query_snapshot = db.collection('UserPost').stream()
        cards = [{'id': doc.id, **doc.to_dict()} for doc in query_snapshot]
        return jsonify(cards), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def upload_file_to_storage(file_path, filename):
    blob = bucket.blob(filename)
    blob.upload_from_filename(file_path)
    return blob.public_url  # Assuming you have set public access on the files

def add_tags_to_firestore(filename, tags):
    doc_ref = db.collection('posts').document(filename)
    doc_ref.set({
        'filename': filename,
        'tags': tags,
    })

def save_user_interaction(data):
    """
    Saves user interaction data to Firestore. Data should include user_id and details
    of the interaction (like swipe right, swipe left, time spent, etc.).
    Returns a dictionary with the new document ID upon success.
    """
    try:
        # Add additional data validation or processing here if necessary
        collection_ref = db.collection('interactions')
        doc_ref = collection_ref.add(data)
        return {'id': doc_ref[1].id}  # doc_ref is a tuple (WriteResult, DocumentReference)
    except Exception as e:
        raise Exception(f"Failed to save user interaction: {str(e)}")
