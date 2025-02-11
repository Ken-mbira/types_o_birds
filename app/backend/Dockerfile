FROM python:3.12

WORKDIR /usr/local/app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "--workers", "8", "--bind", "0.0.0.0:8000", "app:app", "--access-logfile", "-", "--error-logfile", "-"]
