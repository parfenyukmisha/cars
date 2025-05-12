
document.addEventListener("DOMContentLoaded", function () {
    const output = document.getElementById("outputField");
    const topSection = document.createElement("div"); // Верхня секція для вибору марки
    const middleSection = document.createElement("div"); // Середня секція для вибору моделей
    const yearSection = document.createElement("div"); // Секція для вибору років
    const bottomSection = document.createElement("div"); // Нижня секція для відображення фото
    output.appendChild(topSection);
    output.appendChild(middleSection);
    output.appendChild(yearSection);
    output.appendChild(bottomSection);
  
    // Fetch data from sample.json on page load
    fetch("js/image_sources.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Process the data and display brands
        const parsedData = parseData(data);
        showBrands(parsedData);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        bottomSection.innerHTML = `<p style="color: red;">Не вдалося завантажити дані. Перевірте файл sample.json.</p>`;
      });
  
    // Parse the JSON data into a structured format
    function parseData(data) {
      const structuredData = {};
  
      Object.keys(data).forEach((key) => {
        const [brand, model, year, photo] = key.split("/");
        if (!structuredData[brand]) {
          structuredData[brand] = {};
        }
        if (!structuredData[brand][model]) {
          structuredData[brand][model] = {};
        }
        if (!structuredData[brand][model][year]) {
          structuredData[brand][model][year] = [];
        }
        structuredData[brand][model][year].push(data[key]);
      });
  
      return structuredData;
    }
  
    function showBrands(data) {
      // Clear the top section
      topSection.innerHTML = "<h2>Марки авто:</h2>";
  
      // Sort brands alphabetically
      const sortedBrands = Object.keys(data).sort();
  
      // Create a button for each brand
      sortedBrands.forEach((brand) => {
        const brandButton = document.createElement("button");
        brandButton.textContent = brand;
        brandButton.addEventListener("click", function () {
          showModels(data[brand], brand);
        });
        topSection.appendChild(brandButton);
      });
  
      // Clear the middle, year, and bottom sections
      middleSection.innerHTML = "";
      yearSection.innerHTML = "";
      bottomSection.innerHTML = "";
    }
  
    function showModels(brandData, brand) {
      // Clear the middle section
      middleSection.innerHTML = `<h2>Моделі для марки: ${brand}</h2>`;
  
      // Sort models alphabetically
      const sortedModels = Object.keys(brandData).sort();
  
      // Create a button for each model
      sortedModels.forEach((model) => {
        const modelButton = document.createElement("button");
        modelButton.textContent = model;
        modelButton.addEventListener("click", function () {
          showYears(brandData[model], brand, model);
        });
        middleSection.appendChild(modelButton);
      });
  
      // Clear the year and bottom sections
      yearSection.innerHTML = "";
      bottomSection.innerHTML = "";
    }
  
    function showYears(modelData, brand, model) {
      // Clear the year section
      yearSection.innerHTML = `<h2>Роки для моделі: ${model} (${brand})</h2>`;
  
      // Create a button for each year
      Object.keys(modelData).forEach((year) => {
        const yearButton = document.createElement("button");
        yearButton.textContent = year;
        yearButton.addEventListener("click", function () {
          showImages(modelData[year], brand, model, year);
        });
        yearSection.appendChild(yearButton);
      });
  
      // Clear the bottom section
      bottomSection.innerHTML = "";
    }
  
    function showImages(images, brand, model, year) {
        // Clear the bottom section
        bottomSection.innerHTML = `<h2>Фото для ${brand} ${model} (${year}):</h2>`;

        // Display all valid images as thumbnails
        const imageContainer = document.createElement("div");
        imageContainer.style.display = "flex";
        imageContainer.style.flexWrap = "wrap";
        imageContainer.style.justifyContent = "center";
        imageContainer.style.gap = "10px";

        images.forEach((imageUrl, index) => {
            const img = new Image();
            img.src = imageUrl;

            // Check if the image has the desired dimensions
            img.onload = () => {
                if (img.naturalWidth === 1 && img.naturalHeight === 1) {
                    console.warn(`Image skipped due to size: ${imageUrl}`);
                    return;
                }

                const thumbnail = document.createElement("img");
                thumbnail.src = imageUrl;
                thumbnail.alt = `${brand} ${model} (${year})`;
                thumbnail.style.width = "200px";
                thumbnail.style.height = "150px";
                thumbnail.style.objectFit = "cover";
                thumbnail.style.borderRadius = "10px";
                thumbnail.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                thumbnail.style.cursor = "pointer";

                // Open gallery on click
                thumbnail.addEventListener("click", () => {
                    openGallery(images.filter(isValidImage), index, brand, model, year);
                });

                imageContainer.appendChild(thumbnail);
            };

            img.onerror = () => {
                console.warn(`Image failed to load and was skipped: ${imageUrl}`);
            };
        });

        bottomSection.appendChild(imageContainer);
    }

    function isValidImage(imageUrl) {
        const img = new Image();
        img.src = imageUrl;
        return img.naturalWidth !== 1 || img.naturalHeight !== 1;
    }

    function openGallery(images, startIndex, brand, model, year) {
        // Create gallery container
        const galleryContainer = document.createElement("div");
        galleryContainer.style.position = "fixed";
        galleryContainer.style.top = "0";
        galleryContainer.style.left = "0";
        galleryContainer.style.width = "100%";
        galleryContainer.style.height = "100%";
        galleryContainer.style.background = "rgba(0, 0, 0, 0.8)";
        galleryContainer.style.display = "flex";
        galleryContainer.style.justifyContent = "center";
        galleryContainer.style.alignItems = "center";
        galleryContainer.style.zIndex = "1000";
    
        // Create image element for the gallery
        const galleryImage = document.createElement("img");
        galleryImage.style.width = "800px"; // Fixed width
        galleryImage.style.height = "600px"; // Fixed height
        galleryImage.style.objectFit = "cover"; // Maintain proportions
        galleryImage.style.borderRadius = "10px";
        galleryImage.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        galleryContainer.appendChild(galleryImage);
    
        // Create left and right navigation buttons
        const leftArrow = document.createElement("button");
        leftArrow.textContent = "←";
        leftArrow.style.position = "absolute";
        leftArrow.style.top = "50%";
        leftArrow.style.left = "5%";
        leftArrow.style.transform = "translateY(-50%)";
        leftArrow.style.background = "rgba(0, 0, 0, 0.5)";
        leftArrow.style.color = "white";
        leftArrow.style.border = "none";
        leftArrow.style.borderRadius = "50%";
        leftArrow.style.padding = "10px";
        leftArrow.style.cursor = "pointer";
        leftArrow.style.zIndex = "10";
        galleryContainer.appendChild(leftArrow);
    
        const rightArrow = document.createElement("button");
        rightArrow.textContent = "→";
        rightArrow.style.position = "absolute";
        rightArrow.style.top = "50%";
        rightArrow.style.right = "5%";
        rightArrow.style.transform = "translateY(-50%)";
        rightArrow.style.background = "rgba(0, 0, 0, 0.5)";
        rightArrow.style.color = "white";
        rightArrow.style.border = "none";
        rightArrow.style.borderRadius = "50%";
        rightArrow.style.padding = "10px";
        rightArrow.style.cursor = "pointer";
        rightArrow.style.zIndex = "10";
        galleryContainer.appendChild(rightArrow);
    
        // Add close button
        const closeButton = document.createElement("button");
        closeButton.textContent = "×";
        closeButton.style.position = "absolute";
        closeButton.style.top = "20px";
        closeButton.style.right = "20px";
        closeButton.style.background = "rgba(0, 0, 0, 0.5)";
        closeButton.style.color = "white";
        closeButton.style.border = "none";
        closeButton.style.borderRadius = "50%";
        closeButton.style.padding = "10px";
        closeButton.style.cursor = "pointer";
        closeButton.style.zIndex = "10";
        galleryContainer.appendChild(closeButton);
    
        // Variables to track the current image index
        let currentIndex = startIndex;
    
        // Function to update the gallery image
        function updateGalleryImage() {
            const currentImage = images[currentIndex];
            galleryImage.src = currentImage;
            galleryImage.alt = `${brand} ${model} ${year} - ${currentIndex + 1}`;
    
            // Remove the image if it has a size of 1x1
            galleryImage.onload = () => {
                if (galleryImage.naturalWidth === 1 && galleryImage.naturalHeight === 1) {
                    console.warn(`Image with size 1x1 detected and skipped: ${currentImage}`);
                    skipImage();
                }
            };
    
            galleryImage.onerror = () => {
                console.warn(`Image failed to load and was skipped: ${currentImage}`);
                skipImage();
            };
        }
    
        // Function to skip the current image and move to the next one
        function skipImage() {
            currentIndex = (currentIndex + 1) % images.length;
            updateGalleryImage();
        }
    
        // Event listeners for navigation buttons
        leftArrow.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateGalleryImage();
        });
    
        rightArrow.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateGalleryImage();
        });
    
        // Close the gallery
        closeButton.addEventListener("click", () => {
            document.body.removeChild(galleryContainer);
        });
    
        // Append the gallery container to the body
        document.body.appendChild(galleryContainer);
    
        // Initialize the gallery with the selected image
        updateGalleryImage();
    }
  });