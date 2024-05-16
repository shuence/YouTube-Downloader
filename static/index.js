const url = document.querySelector('#url');
const format = document.querySelector('#format');
const title = document.querySelector('#title');
const form = document.querySelector('#download_form');
const progressBar = document.querySelector('.progress-bar');

const loader = document.getElementById('load');
const container = document.querySelector('.container');

function showLoadingSpinner() {
    container.style.display = 'none';
    loader.classList.add('loader');
}

function removeLoadingSpinner() {
    container.style.display = 'block';
    loader.classList.remove('loader');
}

function validateYouTubeUrl(url) {
    const YOUTUBE_URL_PATTERN = /^(https?:\/\/)?(www\.)?(youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    return YOUTUBE_URL_PATTERN.test(url);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (url.value === '' || format.value === '' || title.value === '') {
        location.href = '/error';
        return;
    }

    showLoadingSpinner();

    try {
        const response = await fetch(`/download?url=${url.value}&format=${format.value}`);
        const contentLength = parseInt(response.headers.get('content-length'));
        const reader = response.body.getReader();

        let receivedLength = 0; // Track received bytes
        let chunks = [];

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }

            chunks.push(value);
            receivedLength += value.length;

            const progress = (receivedLength / contentLength) * 100;
            progressBar.style.width = `${progress}%`;
        }

        const blob = new Blob(chunks);
        const downloadUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${title.value}.${format.value}`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(downloadUrl);

        // Clear input fields after successful download
        url.value = '';
        format.value = '';
        title.value = '';
    } catch (error) {
        console.error('Error downloading video:', error);
    }

    removeLoadingSpinner();
});