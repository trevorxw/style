from firebase_admin import firestore
from flask import jsonify

db = firestore.client()

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

def get_item(item_id):
    """
    Retrieves a clothing item document from Firestore based on the item_id.
    Returns the document as a dictionary if found, otherwise returns None.
    """
    try:
        doc_ref = db.collection('items').document(item_id)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            return None
    except Exception as e:
        raise Exception(f"Failed to retrieve item: {str(e)}")

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
