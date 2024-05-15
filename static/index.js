const url = document.querySelector('#url');
const format = document.querySelector('#format');
const title = document.querySelector('#title');
const form = document.querySelector('#download_form');

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

    if (!validateYouTubeUrl(url.value)) {
        alert('Please enter a valid YouTube URL.');
        return;
    }

    showLoadingSpinner();

    try {
        const response = await fetch(`/download?url=${url.value}&format=${format.value}`);
        const file = await response.blob();

        const a = document.createElement('a');
        const tempUrl = URL.createObjectURL(file);
        a.href = tempUrl;
        a.download = `${title.value}.${format.value}`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(tempUrl);

        url.value = '';
        title.value = '';
        format.value = '';
    } catch (error) {
        console.error('Error downloading video:', error);
    }

    removeLoadingSpinner();
});
