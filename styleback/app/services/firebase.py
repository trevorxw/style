from firebase_admin import firestore, storage, auth
from flask import jsonify
from datetime import datetime, timedelta
import pytz


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
        query_snapshot = db.collection('all_posts').order_by('created_at', direction=firestore.Query.DESCENDING).stream()
        cards = [
            {'post_id': doc.id, **doc.to_dict()} 
            for doc in query_snapshot 
            if 'ootd' not in doc.to_dict().get('category', {})
        ]
        return jsonify(cards), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def get_all_ootd(user_id):
    """
    Retrieves all 'OOTD' posts from Firestore where there is mutual following.
    """
    try:
        # Timezone and time range setup
        tz = pytz.timezone('America/Los_Angeles')
        today_start = datetime.now(tz).replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)

        # Query for users that user_id follows
        follows_snapshot = db.collection('users').document(user_id).collection('userFollows').stream()
        follows = [doc.id for doc in follows_snapshot]

        mutual_follows = []
        for user in follows:
            # Check if each user also follows user_id
            if db.collection('users').document(user).collection('userFollows').document(user_id).get().exists:
                mutual_follows.append(user)

        cards = []
        # Fetch 'OOTD' posts from users who have mutual follow relationships
        query_snapshot = db.collection('all_posts')\
                           .where('category', '==', 'ootd')\
                           .where('created_at', '>=', today_start)\
                           .where('created_at', '<', today_end)\
                           .order_by('created_at', direction=firestore.Query.DESCENDING)\
                           .stream()

        for doc in query_snapshot:
            doc_dict = doc.to_dict()
            if doc_dict.get('user_id', '') in mutual_follows:
                cards.append({'post_id': doc.id, **doc_dict})

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

def get_ootd_by_user(user_id):
    """
    Retrieves all ootd IDs from Firestore based on the user_id.
    """
    try:
        # Ensure to reference the posts subcollection for the specific user
        posts = db.collection('posts').document(user_id).collection('ootd').stream()
        
        # Create a list of post IDs from the posts subcollection
        post_ids = [{'post_id': post.id} for post in posts if post.id != 'initial_ootd']
        return sorted(post_ids, key=lambda x: x['post_id'], reverse=True)
    except Exception as e:
        return {"error": str(e)}

def get_liked_posts_by_user(user_id):
    try:
        # Ensure to reference the posts subcollection for the specific user
        posts = db.collection('users').document(user_id).collection('swipeHistory').where("liked", "==", 1).order_by('time', direction=firestore.Query.DESCENDING).stream()
        
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

def upload_profile_picture(file_path, filename):
    # Specify the path within the bucket
    blob = bucket.blob(f'profilePictures/{filename}')
    print(f"Uploading to: {blob.path}")  # Check the path
    blob.upload_from_filename(file_path)
    blob.make_public()
    print(f"File URL: {blob.public_url}")  # Verify the URL
    return blob.public_url  # Ensure the file is publicly accessible

def upload_file_to_collections(file_path, filename):
    # Specify the path within the bucket
    blob = bucket.blob(f'collections/{filename}')
    print(f"Uploading to: {blob.path}")  # Check the path
    blob.upload_from_filename(file_path)
    blob.make_public()
    print(f"File URL: {blob.public_url}")  # Verify the URL
    return blob.public_url  # Ensure the file is publicly accessible

def add_data_to_firestore(filename, userId, file_metadata):
    doc_ref = db.collection('posts').document(userId).collection('userPosts').document(filename).set({})
    doc_ref = db.collection('all_posts').document(filename)
    doc_ref.set(file_metadata)

def add_ootd_to_firestore(filename, userId, file_metadata):
    doc_ref = db.collection('posts').document(userId).collection('ootd').document(filename).set({})
    doc_ref = db.collection('all_posts').document(filename)
    doc_ref.set(file_metadata)

def del_post(user_id, post_id):
    bucket = storage.bucket()
    file_path = f'postImages/{post_id}.jpg'
    blob = bucket.blob(file_path)
    
    try:
        all_posts_ref = db.collection('all_posts').document(post_id)
        all_posts = all_posts_ref.get()
        post_ref = db.collection('posts').document(user_id).collection('userPosts').document(post_id)
        post = post_ref.get()
        if post.exists and all_posts.exists:
            post_ref.delete()
            all_posts_ref.delete()
            # Check if the blob exists before attempting to delete
            if blob.exists():
                blob.delete()
                print(f"Collection {post_id} deleted from Firestore and Storage.")
            else:
                print(f"No such object in storage: {file_path}")
            
            return True
        else:
            print(f"No such collection {post_id} to delete.")
            return False
    except Exception as e:
        print(f"An error occurred: {e}")

#User

def get_user_by_uid(uid):
    try:
        user = auth.get_user(uid)
        print('Successfully fetched user data: {}'.format(user))
        return user
    except auth.AuthError as e:
        print('Error fetching user data:', e)
        return None
    
def get_usernames():
    """
    Retrieves all usernames along with their user IDs from the 'usernames' collection.
    """
    try:
        # Reference the 'usernames' collection and stream the documents
        usernames_query = db.collection('users').stream()

        # Initialize an empty dictionary to store the usernames and user IDs
        usernames = {}

        # Iterate through the streamed documents
        for doc in usernames_query:
            # Assume each document ID is the user ID, and each document contains a 'username' field
            user_data = doc.to_dict()
            usernames[user_data['username']] = doc.id

        return usernames
    except Exception as e:
        return {"error": str(e)}
    
def get_usernames_id():
    """
    Retrieves all usernames along with their user IDs from the 'usernames' collection.
    """
    try:
        # Reference the 'usernames' collection and stream the documents
        usernames_query = db.collection('users').stream()

        # Initialize an empty dictionary to store the usernames and user IDs
        usernames = {}

        # Iterate through the streamed documents
        for doc in usernames_query:
            # Assume each document ID is the user ID, and each document contains a 'username' field
            user_data = doc.to_dict()
            usernames[doc.id] = user_data['username']

        return usernames
    except Exception as e:
        return {"error": str(e)}
    
def get_usernames_data():
    """
    Retrieves all usernames along with their user IDs, display names, and photo URLs.
    Retrieves from the 'users' collection in Firestore and also fetches additional
    information from Firebase Authentication where available.
    """
    try:
        # Reference the 'users' collection and stream the documents
        usernames_query = db.collection('users').stream()

        # Initialize an empty dictionary to store the usernames and user IDs along with additional info
        usernames = {}

        # Iterate through the streamed documents
        for doc in usernames_query:
            user_data = doc.to_dict()
            user_id = doc.id

            # Default fields from Firestore
            username = user_data.get('username', 'No Username')
            display_name = user_data.get('display_name', 'No Display Name')
            photo_url = user_data.get('photo_url', '')

            # Try to fetch additional data from Firebase Auth if needed
            # This is pseudocode; actual implementation might vary based on your Firebase setup
            auth_user = auth.get_user(user_id)
            photo_url = auth_user.photo_url if auth_user.photo_url else photo_url
            display_name = auth_user.display_name if auth_user.display_name else display_name

            # Store in dictionary
            usernames[username] = {
                'uid': user_id,
                'display_name': display_name,
                'photo_url': photo_url
            }

        return usernames
    except Exception as e:
        return {"error": str(e)}

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
        'username': '',
        'bio': 'This is a default bio',
        'created_at': firestore.SERVER_TIMESTAMP
    })

    # Initialize empty collections with a dummy document to make the collection exist
    # Posts
    db.collection('posts').document(user_id).collection('userPosts').document('initial_post').set({
        'title': 'First Post',
        'content': 'Welcome to your new social media!'
    })
    db.collection('posts').document(user_id).collection('ootd').document('initial_ootd').set({
        'title': 'First Ootd',
        'content': 'Welcome to your new social media!'
    })
    
    # Following
    user_ref.collection('userFollowing').document('dummy_user').set({
        'created_at': firestore.SERVER_TIMESTAMP
    })

    # Followers
    user_ref.collection('userFollows').document('dummy_user').set({
        'created_at': firestore.SERVER_TIMESTAMP
    })
    # SwipeHistory
    user_ref.collection('swipeHistory').document('dummy_history').set({
        'created_at': firestore.SERVER_TIMESTAMP
    })
    # Collections
    user_ref.collection('collections').document('dummy_collection').set({
        'created_at': firestore.SERVER_TIMESTAMP
    })

    # Likes
    user_ref.collection('likes').document('dummy_like').set({
        'created_at': firestore.SERVER_TIMESTAMP
    })

    return jsonify({'message': 'New user created with initial settings'}), 201
    

def get_user_details(user_id):
    """
    Retrieves all user data from Firestore based on the user_id.
    """
    try:
        # Fetch the user document to get bio
        user_doc_ref = db.collection('users').document(user_id)
        user_doc = user_doc_ref.get()
        
        if not user_doc.exists:
            return {"error": "User not found"}, 404  # Return as a dictionary with an error code

        user_data = user_doc.to_dict()
        bio = user_data.get('bio', 'No bio available')
        username = user_data.get('username', 'No username provided')

        # Initialize dictionaries for followers and following
        following = {}
        followers = {}

        # Fetch following details
        following_refs = user_doc_ref.collection('userFollows').stream()
        for doc in following_refs:
            followee_doc = db.collection('users').document(doc.id).get()
            if followee_doc.exists:
                followee_data = followee_doc.to_dict()
                following_username = followee_data.get('username', 'Username not found')
                following[following_username] = {
                    'uid': doc.id,
                    'createdAt': doc.to_dict().get('createdAt', None)  # Fetch createdAt if available
                }

        # Fetch followers details
        followers_refs = user_doc_ref.collection('userFollowing').stream()
        for doc in followers_refs:
            follower_doc = db.collection('users').document(doc.id).get()
            if follower_doc.exists:
                follower_data = follower_doc.to_dict()
                follower_username = follower_data.get('username', 'Username not found')
                followers[follower_username] = {
                    'uid': doc.id,
                    'createdAt': doc.to_dict().get('createdAt', None)  # Fetch createdAt if available
                }

        # Compile and return all data
        return {
            "username": username,
            "bio": bio,
            "following": following,
            "followers": followers
        }

    except Exception as e:
        return jsonify({"error": str(e)})

def update_user_details(user_id, data):
    try:
        user_ref = db.collection('users').document(user_id) 
        user_ref.update(data)
        print(data)
    except Exception as e:
        return jsonify({"error": str(e)})
    
def toggle_follower(uidFollower, uid):
    try:
        following_ref = db.collection('users').document(uid).collection('userFollowing').document(uidFollower)
        if following_ref.get().exists:
            following_ref.delete()
            return "DELETED"
        else:
            following_ref.set({'createdAt': firestore.SERVER_TIMESTAMP})
            return "CREATED"
    except Exception as e:
        return jsonify({"error": str(e)})

def toggle_following(uidFollower, uid):
    try:
        following_ref = db.collection('users').document(uidFollower).collection('userFollows').document(uid)
        if following_ref.get().exists:
            following_ref.delete()
            return "DELETED"
        else:
            following_ref.set({'createdAt': firestore.SERVER_TIMESTAMP})
            return "CREATED"
    except Exception as e:
        return jsonify({"error": str(e)})

def get_user_collections(user_id):
    """
    Retrieves collection data from Firestore based on the user_id.
    """
    try:
        #Fetch collections
        collections_ref = db.collection('users').document(user_id).collection('collections').get()

        collections_list = []

        # Iterate over each document in the collections
        for doc in collections_ref:
            # Each doc is a DocumentSnapshot
            doc_data = doc.to_dict()
            uri = doc_data.get('uri', '')
            description = doc_data.get('description', '')
            posts = doc_data.get('posts', [])
            title = doc_data.get('title', '')

            # Append each collection's data to the list
            if doc.id != 'dummy_collection':
                collections_list.insert(0, {
                    "id": doc.id,
                    "uri": uri,
                    "description": description,
                    "posts": posts,
                    'title': title
                })

        # Return a JSON response containing the collections
        return jsonify({"collections": collections_list})

    except Exception as e:
        return jsonify({"error": str(e)})

def get_user_collection(user_id, collection_id):
    """
    Retrieves collection data from Firestore based on the user_id and collection_id.
    """
    try:
        collection = db.collection('users').document(user_id).collection('collections').document(collection_id).get()
        if collection.exists:
            # Convert the document to dictionary format and return it as JSON
            return jsonify(collection.to_dict()), 200
        else:
            # Return a JSON response indicating that no document was found
            return jsonify({"message": "No post found with the given ID"}), 404
    except Exception as e:
            return jsonify({"error": str(e)})

def add_new_collection(user_id, data):
    collection_ref = db.collection('users').document(user_id).collection('collections').document() 
    collection_ref.set(data)
    return collection_ref.id
    
def edit_collection_user(user_id, collection_id, data):
    try:
        collection_ref = db.collection('users').document(user_id).collection('collections').document(collection_id) 
        collection_ref.update(data)
    except Exception as e:
        return jsonify({"error": str(e)})
    
def del_collection(user_id, collection_id):
    bucket = storage.bucket()
    file_path = f'collections/{user_id}/{collection_id}'
    blob = bucket.blob(file_path)
    
    try:
        collection_ref = db.collection('users').document(user_id).collection('collections').document(collection_id)
        collection = collection_ref.get()
        if collection.exists:
            collection_ref.delete()
            # Check if the blob exists before attempting to delete
            if blob.exists():
                blob.delete()
                print(f"Collection {collection_id} deleted from Firestore and Storage.")
            else:
                print(f"No such object in storage: {file_path}")
            
            return True
        else:
            print(f"No such collection {collection_id} to delete.")
            return False
    except Exception as e:
        print(f"An error occurred: {e}")

def add_swipe_history(user_id, post_id, metrics):
    """
    Saves user interaction data to Firestore. Data should include user_id and details
    of the interaction (like swipe right, swipe left, time spent, etc.).
    Returns a dictionary with the new document ID upon success.
    """
    try:
        # Add additional data validation or processing here if necessary
        doc_ref = db.collection('users').document(user_id).collection('swipeHistory').document(post_id)

        # Check if the document exists
        doc = doc_ref.get()
        if doc.exists:
            return {"message": "No update performed because the document already exists."}
        else:
            # Set the document with the given metrics if it does not exist
            doc_ref.set(metrics)
            return {"document_id": doc_ref.id, "message": "Document created successfully."}
    except Exception as e:
        raise Exception(f"Failed to save user interaction: {str(e)}")
    
def increment_likes(post_id):
    likesRef = db.collection('all_posts').document(post_id)
    likesRef.update({"likes": firestore.Increment(1)})
    
def update_notifications(user_id_liked, user_id_post, post_id):
    # Let Firestore generate a unique document ID automatically
    like_ref = db.collection('users').document(user_id_post).collection('likes').document()
    like_ref.set({
        'created_at': firestore.SERVER_TIMESTAMP,  # Set the timestamp correctly here
        'post_id': post_id,
        'user_id': user_id_liked
    })

def get_like_notifications(user_id_post):
    """
    Retrieves all like notifications for a post, ordered by creation time from most recent to least recent.
    """
    # Fetch the likes from Firestore, ordered by 'created_at' field in descending order
    like_snapshot = db.collection('users')\
                      .document(user_id_post)\
                      .collection('likes')\
                      .order_by('created_at', direction=firestore.Query.DESCENDING)\
                      .stream()

    # Construct a list of likes from the documents
    likes = [{**doc.to_dict()} for doc in like_snapshot]
    return likes


