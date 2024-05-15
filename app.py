from flask import Flask, render_template, request, send_file
from pytube import YouTube
import io

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/download')
def download():
    url = request.args.get('url')
    format = request.args.get('format')

    if not url or not format:
        return render_template('error.html', message='Please provide a valid YouTube URL and format.')

    try:
        yt = YouTube(url)

        if format == 'mp4':
            video = yt.streams.get_highest_resolution()
        elif format == 'mp3':
            video = yt.streams.filter(only_audio=True).first()
        else:
            return render_template('error.html', message='Invalid format. Supported formats: mp4, mp3.')

        if not video:
            return render_template('error.html', message='No suitable streams found for the selected format.')

        file_stream = io.BytesIO()
        video.stream_to_buffer(file_stream)
        file_stream.seek(0)

        return send_file(file_stream, as_attachment=True, download_name=f'{yt.title}.{format}')
    
    except Exception as e:
        error_message = f'An error occurred: {str(e)}'
        return render_template('error.html', message=error_message)


@app.route('/error')
def error():
    return render_template('error.html', message='Please fill in all fields!')


if __name__ == '__main__':
    app.run()
