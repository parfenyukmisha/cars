
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
  
      // Create a gallery container
      const galleryContainer = document.createElement("div");
      galleryContainer.style.position = "relative";
      galleryContainer.style.width = "600px"; // Fixed gallery width
      galleryContainer.style.height = "400px"; // Fixed gallery height
      galleryContainer.style.margin = "0 auto";
      galleryContainer.style.textAlign = "center";
      galleryContainer.style.overflow = "hidden"; // Hide overflow
      galleryContainer.style.background = "#f0f0f0"; // Background for the gallery
  
      // Create an image element for the gallery
      const galleryImage = document.createElement("img");
      galleryImage.style.width = "100%";
      galleryImage.style.height = "100%";
      galleryImage.style.objectFit = "cover"; // Maintain proportions
      galleryImage.style.borderRadius = "10px";
      galleryImage.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      galleryContainer.appendChild(galleryImage);
  
      // Create left and right navigation buttons
      const leftArrow = document.createElement("button");
      leftArrow.textContent = "←";
      leftArrow.style.position = "absolute";
      leftArrow.style.top = "50%";
      leftArrow.style.left = "10px";
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
      rightArrow.style.right = "10px";
      rightArrow.style.transform = "translateY(-50%)";
      rightArrow.style.background = "rgba(0, 0, 0, 0.5)";
      rightArrow.style.color = "white";
      rightArrow.style.border = "none";
      rightArrow.style.borderRadius = "50%";
      rightArrow.style.padding = "10px";
      rightArrow.style.cursor = "pointer";
      rightArrow.style.zIndex = "10";
      galleryContainer.appendChild(rightArrow);
  
      // Add gallery container to the bottom section
      bottomSection.appendChild(galleryContainer);
  
      // Variables to track the current image index
      let currentIndex = 0;
  
      // Function to update the gallery image
      function updateGalleryImage() {
        const currentImage = images[currentIndex];
        galleryImage.src = currentImage;
        galleryImage.alt = `${brand} ${model} ${year} - ${currentIndex + 1}`;
  
        // Check if the image has a size of 1x1 and hide it if true
        galleryImage.onload = () => {
          if (
            galleryImage.naturalWidth === 1 &&
            galleryImage.naturalHeight === 1
          ) {
            console.warn(
              `Image with size 1x1 detected and skipped: ${currentImage}`
            );
            skipImage();
          } else {
            galleryImage.style.display = "block";
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
        // Move to the previous image
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateGalleryImage();
      });
  
      rightArrow.addEventListener("click", () => {
        // Move to the next image
        currentIndex = (currentIndex + 1) % images.length;
        updateGalleryImage();
      });
  
      // Initialize the gallery with the first image
      updateGalleryImage();
    }
  });