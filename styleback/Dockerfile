# Use an official Python runtime as a parent image
FROM python:3.12.3-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt --verbose

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV NAME World

# Run the Flask application
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]