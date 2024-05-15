FROM python:3.9

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

# Expose the port that the Flask app will run on
EXPOSE 5000

CMD ["python", "app.py"]
