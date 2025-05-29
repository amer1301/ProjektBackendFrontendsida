document.addEventListener('DOMContentLoaded', () => {
  const imgElements = document.querySelectorAll('img');

  imgElements.forEach(img => {
    const src = img.getAttribute('src');

    // Endast bilder från images/-mappen ersätts
    if (src && src.startsWith('images/')) {
      const fileName = src.split('/').pop();
      const fallbackSrc = `http://localhost:5000/images/${fileName}`;

      // Skapa <picture>-elementet
      const picture = document.createElement('picture');

      const source = document.createElement('source');
      source.setAttribute('srcset', fallbackSrc);
      source.setAttribute('type', 'image/webp');

      const newImg = document.createElement('img');
      newImg.setAttribute('src', fallbackSrc);
      newImg.setAttribute('alt', img.getAttribute('alt') || '');
      newImg.className = img.className;

      // Lägg till elementen
      picture.appendChild(source);
      picture.appendChild(newImg);

      img.parentNode.replaceChild(picture, img);
    }
  });
});