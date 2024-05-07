from firebase_admin import firestore

db = firestore.client()

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
