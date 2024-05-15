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

form.addEventListener('submit', (e) => {
    e.preventDefault();
    downloadVideo();
});

async function downloadVideo() {
    if (url.value == '' || format.value == '' || title.value == '') {
        location.href = '/error';
        return;
    }
    showLoadingSpinner();
    await fetch(`/download?url=${url.value}&format=${format.value}`)
        .then(response => response.blob())
        .then(file => {
        const a = document.createElement('a');

        let tempUrl = URL.createObjectURL(file);
        a.href = tempUrl;
        a.download = `${title.value}.${format.value}`;

        document.body.appendChild(a);

        a.click();

        URL.revokeObjectURL(tempUrl);
        a.remove()
        url.value = '';
        title.value = '';
        format.value = '';
    });
    removeLoadingSpinner();
}

