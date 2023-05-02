function changeBackgroundColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  document.body.style.backgroundColor = `#${randomColor}`;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'changeBackgroundColor') {
    changeBackgroundColor();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'addMarker') {
    document.addEventListener('click', handleClick, { once: true });
  }
});

function handleClick(event) {
  try {
    const marker = document.createElement('div');
    marker.style.position = 'absolute';
    marker.style.width = '10px';
    marker.style.height = '10px';
    marker.style.backgroundColor = 'red';
    marker.style.borderRadius = '50%';
    marker.style.top = `${event.pageY - 5}px`;
    marker.style.left = `${event.pageX - 5}px`;
    document.body.appendChild(marker);
    console.log('event:', event);
    console.log('marker:', marker);
  } catch (error) {
    console.error('Error in handleClick:', error);
  }
}