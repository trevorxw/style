from firebase_admin import firestore, storage
from flask import jsonify

db = firestore.client()
bucket = storage.bucket()

#Post

def get_post(post_id):
    """
    Retrieves a post from Firestore based on the post_id.
    """
    try:
        # Directly reference the document with the provided post_id
        doc_ref = db.collection('all_posts').document(post_id)
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
    Retrieves all posts from Firestore.
    """
    try:
        query_snapshot = db.collection('all_posts').stream()
        cards = [{'id': doc.id, **doc.to_dict()} for doc in query_snapshot]
        return jsonify(cards), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_posts_by_user(user_id):
    """
    Retrieves all post IDs from Firestore based on the user_id.
    """
    try:
        # Ensure to reference the posts subcollection for the specific user
        posts = db.collection('posts').document(user_id).collection('userPosts').stream()
        
        # Create a list of post IDs from the posts subcollection
        post_ids = [{'post_id': post.id} for post in posts if post.id != 'initial_post']
        return sorted(post_ids, key=lambda x: x['post_id'], reverse=True)
    except Exception as e:
        return {"error": str(e)}

def get_liked_posts_by_user(user_id):
    try:
        # Ensure to reference the posts subcollection for the specific user
        posts = db.collection('users').document(user_id).collection('swipeHistory').where("liked", "==", 1).stream()
        
        # Create a list of post IDs from the posts subcollection

        post_ids = [
            {'post_id': post.id} for post in posts
            if not post.id.startswith(user_id)
        ]
        return sorted(post_ids, key=lambda x: x['post_id'], reverse=True)
    except Exception as e:
        return {"error": str(e)}

def upload_file_to_storage(file_path, filename):
    # Specify the path within the bucket
    blob = bucket.blob(f'postImages/{filename}')
    print(f"Uploading to: {blob.path}")  # Check the path
    blob.upload_from_filename(file_path)
    blob.make_public()
    print(f"File URL: {blob.public_url}")  # Verify the URL
    return blob.public_url  # Ensure the file is publicly accessible

def add_data_to_firestore(filename, userId, file_metadata):
    doc_ref = db.collection('posts').document(userId).collection('userPosts').document(filename).set({})
    doc_ref = db.collection('all_posts').document(filename)
    doc_ref.set(file_metadata)

#User

def create_new_user(user_id):
    """
    Creates new user if user does not exist, else do nothing.
    """
    user_ref = db.collection('users').document(user_id)
    user_doc = user_ref.get()
    if user_doc.exists:
        return jsonify({'message': 'User already exists'}), 200
    

    #add user_id to users collection
    user_ref.set({
        'bio': 'This is a default bio',
        'created_at': firestore.SERVER_TIMESTAMP
    })

    # Initialize empty collections with a dummy document to make the collection exist
    # Posts
    db.collection('posts').document(user_id).collection('userPosts').document('initial_post').set({
        'title': 'First Post',
        'content': 'Welcome to your new social media!'
    })

    # Following
    user_ref.collection('userFollowing').document('dummy_user').set({
        'following_since': firestore.SERVER_TIMESTAMP
    })

    # Followers
    user_ref.collection('userFollows').document('dummy_user').set({
        'followed_since': firestore.SERVER_TIMESTAMP
    })
    # SwipeHistory
    user_ref.collection('swipeHistory').document('dummy_history').set({
        'followed_since': firestore.SERVER_TIMESTAMP
    })
    # Collections
    user_ref.collection('collections').document('dummy_collection').set({
        'followed_since': firestore.SERVER_TIMESTAMP
    })

    return jsonify({'message': 'New user created with initial settings'}), 201
    

def get_user_details(user_id):
    """
    Retrieves all user data from Firestore based on the user_id.
    """
    try:
        # Fetch the user document to get bio
        user_doc = db.collection('users').document(user_id).get()
        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        user_data = user_doc.to_dict()
        bio = user_data.get('bio', 'No bio available')

        # Fetch following
        following_refs = db.collection('users').document(user_id).collection('userFollowing').stream()
        following = [doc.id for doc in following_refs]  # Assumes you store user IDs or use document IDs as user IDs

        # Fetch followers
        followers_refs = db.collection('users').document(user_id).collection('userFollows').stream()
        followers = [doc.id for doc in followers_refs]  # Similarly, assumes user IDs are document IDs

        # Compile and return all data
        return {
            "bio": bio,
            "following": following,
            "followers": followers
        }

    except Exception as e:
        return jsonify({"error": str(e)})

def add_swipe_history(user_id, post_id, metrics):
    """
    Saves user interaction data to Firestore. Data should include user_id and details
    of the interaction (like swipe right, swipe left, time spent, etc.).
    Returns a dictionary with the new document ID upon success.
    """
    try:
        # Add additional data validation or processing here if necessary
        doc_ref = db.collection('users').document(user_id).collection('swipeHistory').document(post_id).set(metrics)
    except Exception as e:
        raise Exception(f"Failed to save user interaction: {str(e)}")
